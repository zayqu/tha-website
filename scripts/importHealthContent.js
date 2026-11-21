const CONTENT_API_URL = new URL(process.env.CONTENT_API_URL || 'https://tzhealthalliance.or.tz').origin;
const FETCH_TIMEOUT = 12000;

const DEFAULT_FEEDS = [
  {
    url: 'https://www.who.int/rss-feeds/news-english.xml',
    source: 'World Health Organization',
    scope: 'Global',
  },
  {
    url: 'https://afro.who.int/rss/featured-news.xml',
    source: 'WHO Regional Office for Africa',
    scope: 'Africa',
  },
];

const PUBLICATIONS_URL = new URL('https://www.who.int/api/hubs/publications');
PUBLICATIONS_URL.search = new URLSearchParams({
  sf_site: '15210d59-ad60-47ff-a542-7ed76645f0c7',
  sf_provider: 'OpenAccessProvider',
  sf_culture: 'en',
  $orderby: 'PublicationDateAndTime desc',
  $select: 'Title,ItemDefaultUrl,FormatedDate,Tag',
  $top: '50',
}).toString();

const TOPIC_RULES = {
  HIV: {
    strong: ['hiv', 'aids', 'antiretroviral', 'art treatment', 'viral load'],
    supporting: ['people living with hiv', 'hiv prevention', 'hiv testing', 'pre-exposure prophylaxis', 'prep'],
  },
  Hepatitis: {
    strong: ['hepatitis', 'hepatitis b', 'hepatitis c', 'hbv', 'hcv'],
    supporting: ['liver disease', 'liver cancer', 'birth dose', 'viral hepatitis', 'hepatitis vaccination'],
  },
  'Mental Health': {
    strong: ['mental health', 'mental illness', 'psychosocial'],
    supporting: ['depression', 'anxiety', 'suicide', 'suicidal', 'wellbeing', 'well-being'],
  },
};

const MAX_ITEMS_PER_FEED = 12;
const MAX_ITEM_AGE_DAYS = 120;

function decodeXml(value = '') {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&').replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ').trim();
}

function tag(block, name) {
  const match = block.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${name}>`, 'i'));
  return decodeXml(match?.[1] || '');
}

function normalizeText(value = '') {
  return value.toLowerCase().replace(/[^a-z0-9\s-]/g, ' ').replace(/\s+/g, ' ').trim();
}

function hasPhrase(text, phrase) {
  const normalizedPhrase = normalizeText(phrase);
  if (!normalizedPhrase) return false;
  return ` ${text} `.includes(` ${normalizedPhrase} `);
}

function classifyRelevance(title, excerpt) {
  const titleText = normalizeText(title);
  const excerptText = normalizeText(excerpt);

  const matches = [];
  for (const [topic, rules] of Object.entries(TOPIC_RULES)) {
    const strongTitle = rules.strong.filter(term => hasPhrase(titleText, term));
    const strongBody = rules.strong.filter(term => hasPhrase(excerptText, term));
    const supportingTitle = rules.supporting.filter(term => hasPhrase(titleText, term));
    const supportingBody = rules.supporting.filter(term => hasPhrase(excerptText, term));

    const uniqueHits = new Set([
      ...strongTitle,
      ...strongBody,
      ...supportingTitle,
      ...supportingBody,
    ]);

    // A story is relevant only when the THA topic is central, not incidental:
    // 1) a strong topic phrase is in the title, OR
    // 2) a strong phrase is in the body plus another distinct supporting signal, OR
    // 3) two distinct strong phrases appear across title/body.
    const relevant =
      strongTitle.length > 0 ||
      (strongBody.length > 0 && uniqueHits.size >= 2) ||
      new Set([...strongTitle, ...strongBody]).size >= 2;

    if (relevant) matches.push(topic);
  }

  return matches;
}

function safeDate(rawDate) {
  if (!rawDate) return null;
  const parsed = new Date(rawDate);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
}

function isRecentEnough(date) {
  if (!date) return false;
  const ageMs = Date.now() - date.getTime();
  if (ageMs < 0) return false;
  return ageMs <= MAX_ITEM_AGE_DAYS * 24 * 60 * 60 * 1000;
}

function parseFeed(xml, feed) {
  const blocks = xml.match(/<item[\s\S]*?<\/item>|<entry[\s\S]*?<\/entry>/gi) || [];
  const accepted = [];
  const rejected = [];

  for (const block of blocks) {
    const linkText = tag(block, 'link');
    const href = block.match(/<link[^>]+href=["']([^"']+)/i)?.[1];
    const title = tag(block, 'title');
    const excerpt = (tag(block, 'description') || tag(block, 'summary') || tag(block, 'content')).replace(/<[^>]+>/g, ' ').trim();
    const rawDate = tag(block, 'pubDate') || tag(block, 'published') || tag(block, 'updated');
    const parsedDate = safeDate(rawDate);
    const url = href || linkText;
    const topics = classifyRelevance(title, excerpt);

    let reason = '';
    if (!title || !excerpt) reason = 'missing title or excerpt';
    else if (!/^https:\/\//i.test(url || '')) reason = 'invalid URL';
    else if (!isRecentEnough(parsedDate)) reason = 'outside recency window';
    else if (!topics.length) reason = 'topic not central enough';

    if (reason) {
      rejected.push({ title: title || 'Untitled', reason });
      continue;
    }

    accepted.push({
      title,
      url,
      scope: url.includes('/countries/united-republic-tanzania/') ? 'Tanzania' : (['Tanzania', 'Africa', 'Global'].includes(feed.scope) ? feed.scope : 'Global'),
      date: parsedDate.toISOString().slice(0, 10),
      topics,
    });
  }

  accepted.sort((a, b) => new Date(b.date) - new Date(a.date));
  return { accepted: accepted.slice(0, MAX_ITEMS_PER_FEED), rejected };
}

async function fetchSource(url) {
  const response = await fetch(url, {
    signal: AbortSignal.timeout(FETCH_TIMEOUT),
    headers: { 'User-Agent': 'Tanzania Health Alliance content monitor' },
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response;
}

function readAcademyPublications(data) {
  if (!Array.isArray(data?.value)) throw new Error('Unexpected WHO publications response');
  return data.value.flatMap(item => {
    const title = String(item.Title || '').trim();
    const topicMatches = classifyRelevance(title, '');
    const date = safeDate(item.FormatedDate);
    const path = String(item.ItemDefaultUrl || '');
    if (!topicMatches.length || !isRecentEnough(date) || !/^\/[a-z0-9-]+$/i.test(path)) return [];
    const kind = String(item.Tag || '').toLowerCase();
    const category = /policy/.test(kind) ? 'Policy' : /research/.test(kind) ? 'Research' : 'Guidance';
    return [{
      title,
      excerpt: `WHO publication on ${topicMatches.join(', ').toLowerCase()}.`,
      url: `https://www.who.int/publications/i/item${path}`,
      date: date.toISOString().slice(0, 10),
      topics: topicMatches,
      scope: /\btanzania\b/i.test(title) ? 'Tanzania' : /\bafrican?\b/i.test(title) ? 'Africa' : 'Global',
      category,
    }];
  });
}

function latest(items) {
  const priority = { Tanzania: 0, Africa: 1, Global: 2 };
  const unique = [...new Map(items.map(item => [item.url, item])).values()];
  return unique.sort((a, b) => priority[a.scope] - priority[b.scope] || b.date.localeCompare(a.date)).slice(0, 12);
}

async function submit(path, items, secret) {
  if (!items.length) return;
  const response = await fetch(new URL(path, CONTENT_API_URL), {
    method: 'POST',
    redirect: 'error',
    signal: AbortSignal.timeout(FETCH_TIMEOUT),
    headers: { Authorization: `Bearer ${secret}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ items }),
  });
  if (!response.ok) throw new Error(`Draft import at ${path} failed: HTTP ${response.status}`);
  const result = await response.json();
  console.log(`${path}: ${result.imported} new, ${result.duplicates} duplicate, ${result.invalid} invalid.`);
  if (result.invalid) process.exitCode = 1;
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const { default: { NEWS_REVIEW_NOTE, NEWS_REVIEW_EXCERPT } } = await import('../server/health-content.js');
  const extraFeeds = process.env.HEALTH_SOURCE_FEEDS ? JSON.parse(process.env.HEALTH_SOURCE_FEEDS) : [];
  if (!Array.isArray(extraFeeds) || extraFeeds.length > 5) throw new Error('Configure at most five additional feeds.');
  const feeds = [...DEFAULT_FEEDS, ...extraFeeds];
  const candidates = [];
  let sourcesSucceeded = 0;
  for (const feed of feeds) {
    try {
      if (!feed?.source || new URL(feed.url).protocol !== 'https:') throw new Error('Invalid feed configuration');
      const xml = await (await fetchSource(feed.url)).text();
      if (!/<(?:rss|feed)[\s>]/i.test(xml)) throw new Error('Expected an RSS or Atom feed');
      const { accepted } = parseFeed(xml, feed);
      candidates.push(...accepted);
      sourcesSucceeded++;
      console.log(`${feed.source}: ${accepted.length} News candidate(s).`);
    } catch (error) {
      console.warn(`${feed?.source || 'Feed'}: ${error.message}`);
    }
  }
  let academy = [];
  try {
    academy = latest(readAcademyPublications(await (await fetchSource(PUBLICATIONS_URL)).json()));
    sourcesSucceeded++;
    console.log(`WHO catalogue: ${academy.length} Academy candidate(s).`);
  } catch (error) {
    console.warn(`WHO catalogue: ${error.message}`);
  }
  if (!sourcesSucceeded) throw new Error('No trusted source could be read.');
  const news = latest(candidates).map(item => ({ ...item, excerpt: NEWS_REVIEW_EXCERPT, content: NEWS_REVIEW_NOTE }));
  if (dryRun) {
    console.log(JSON.stringify({ news, academy }, null, 2));
    return;
  }
  const secret = process.env.CONTENT_IMPORT_SECRET
    || (await import('../server/runtime-secrets.js')).default.contentImportSecret;
  if (!secret) throw new Error('CONTENT_IMPORT_SECRET is required');
  const api = new URL(CONTENT_API_URL);
  if (api.protocol !== 'https:' && !['127.0.0.1', 'localhost'].includes(api.hostname)) {
    throw new Error('The content API must use HTTPS or local loopback.');
  }
  const results = await Promise.allSettled([
    submit('/api/news/import/editorial', news, secret),
    submit('/api/site-content/academy/import', academy, secret),
  ]);
  for (const result of results) {
    if (result.status === 'rejected') {
      console.error(result.reason.message);
      process.exitCode = 1;
    }
  }
}

main().catch(error => {
  console.error(error.message);
  process.exitCode = 1;
});
