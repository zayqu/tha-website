const CONTENT_API_URL = (process.env.CONTENT_API_URL || 'https://tha-webacdb.vercel.app').replace(/\/$/, '');
const CONTENT_IMPORT_SECRET = process.env.CONTENT_IMPORT_SECRET;

const DEFAULT_FEEDS = [
  {
    url: 'https://www.who.int/rss-feeds/news-english.xml',
    source: 'World Health Organization',
  },
];

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
  const combined = `${titleText} ${excerptText}`;

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
  if (!date) return true;
  const ageMs = Date.now() - date.getTime();
  if (ageMs < -2 * 24 * 60 * 60 * 1000) return false;
  return ageMs <= MAX_ITEM_AGE_DAYS * 24 * 60 * 60 * 1000;
}

function parseFeed(xml, source) {
  const blocks = xml.match(/<item[\s\S]*?<\/item>|<entry[\s\S]*?<\/entry>/gi) || [];
  const accepted = [];
  const rejected = [];

  for (const block of blocks) {
    const linkText = tag(block, 'link');
    const href = block.match(/<link[^>]+href=["']([^"']+)/i)?.[1];
    const title = tag(block, 'title');
    const excerpt = tag(block, 'description') || tag(block, 'summary') || tag(block, 'content');
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
      excerpt: excerpt.slice(0, 500),
      url,
      source,
      date: (parsedDate || new Date()).toISOString().slice(0, 10),
      topics,
    });
  }

  accepted.sort((a, b) => new Date(b.date) - new Date(a.date));
  return { accepted: accepted.slice(0, MAX_ITEMS_PER_FEED), rejected };
}

async function main() {
  if (!CONTENT_IMPORT_SECRET) throw new Error('CONTENT_IMPORT_SECRET is required');

  const configured = process.env.HEALTH_SOURCE_FEEDS
    ? JSON.parse(process.env.HEALTH_SOURCE_FEEDS)
    : [];
  const feeds = [...DEFAULT_FEEDS, ...configured];
  const discoveries = [];
  let rejectedCount = 0;

  for (const feed of feeds) {
    if (!feed?.url || !feed?.source || !/^https:\/\//i.test(feed.url)) {
      console.warn('Skipping invalid feed configuration.');
      continue;
    }

    const response = await fetch(feed.url, {
      headers: { 'User-Agent': 'Tanzania Health Alliance content monitor' },
    });
    if (!response.ok) {
      console.warn(`Skipping ${feed.url}: HTTP ${response.status}`);
      continue;
    }

    const { accepted, rejected } = parseFeed(await response.text(), feed.source);
    discoveries.push(...accepted);
    rejectedCount += rejected.length;

    console.log(
      `${feed.source}: ${accepted.length} relevant item(s), ${rejected.length} rejected as unrelated/invalid.`
    );
  }

  const unique = [...new Map(discoveries.map(item => [item.url, item])).values()];
  let imported = 0;
  let duplicates = 0;
  let invalid = 0;

  for (let i = 0; i < unique.length; i += 25) {
    const response = await fetch(`${CONTENT_API_URL}/api/news/import`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${CONTENT_IMPORT_SECRET}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ items: unique.slice(i, i + 25) }),
    });
    if (!response.ok) throw new Error(`Content API import failed: HTTP ${response.status}`);
    const result = await response.json();
    imported += result.imported || 0;
    duplicates += result.duplicates || 0;
    invalid += result.invalid || 0;
  }

  console.log(
    `Draft import complete: ${imported} new, ${duplicates} duplicate, ${invalid} invalid, ${rejectedCount} rejected before import.`
  );
}

main().catch(error => {
  console.error(error.message);
  process.exitCode = 1;
});
