const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const TABLE_NAME = process.env.CONTENT_QUEUE_TABLE || 'Content Queue';

const DEFAULT_FEEDS = [
  {
    url: 'https://www.who.int/rss-feeds/news-english.xml',
    source: 'World Health Organization',
  },
];

const KEYWORDS = {
  HIV: ['hiv', 'aids', 'antiretroviral'],
  Hepatitis: ['hepatitis', 'liver disease', 'hbv', 'hcv'],
  'Mental Health': ['mental health', 'depression', 'anxiety', 'suicide', 'psychosocial'],
};

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

function parseFeed(xml, source) {
  const blocks = xml.match(/<item[\s\S]*?<\/item>|<entry[\s\S]*?<\/entry>/gi) || [];
  return blocks.map(block => {
    const linkText = tag(block, 'link');
    const href = block.match(/<link[^>]+href=["']([^"']+)/i)?.[1];
    const title = tag(block, 'title');
    const excerpt = tag(block, 'description') || tag(block, 'summary') || tag(block, 'content');
    const date = tag(block, 'pubDate') || tag(block, 'published') || tag(block, 'updated');
    const text = `${title} ${excerpt}`.toLowerCase();
    const topics = Object.entries(KEYWORDS)
      .filter(([, words]) => words.some(word => text.includes(word)))
      .map(([topic]) => topic);
    return {
      title,
      excerpt: excerpt.slice(0, 500),
      url: href || linkText,
      source,
      date: date ? new Date(date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
      topics,
    };
  }).filter(item => item.title && item.url && item.topics.length);
}

async function airtable(path = '', options = {}) {
  const table = encodeURIComponent(TABLE_NAME);
  const response = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${table}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${AIRTABLE_API_KEY}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  if (!response.ok) throw new Error(`Airtable request failed: ${response.status} ${await response.text()}`);
  return response.json();
}

async function existingUrls() {
  const urls = new Set();
  let offset = '';
  do {
    const query = new URLSearchParams({ pageSize: '100', ...(offset ? { offset } : {}) });
    const data = await airtable(`?${query}`);
    data.records?.forEach(record => record.fields?.URL && urls.add(record.fields.URL));
    offset = data.offset || '';
  } while (offset);
  return urls;
}

async function main() {
  if (!AIRTABLE_BASE_ID || !AIRTABLE_API_KEY) {
    throw new Error('AIRTABLE_BASE_ID and AIRTABLE_API_KEY are required');
  }

  const configured = process.env.HEALTH_SOURCE_FEEDS
    ? JSON.parse(process.env.HEALTH_SOURCE_FEEDS)
    : [];
  const feeds = [...DEFAULT_FEEDS, ...configured];
  const known = await existingUrls();
  const discoveries = [];

  for (const feed of feeds) {
    const response = await fetch(feed.url, { headers: { 'User-Agent': 'Tanzania Health Alliance content monitor' } });
    if (!response.ok) {
      console.warn(`Skipping ${feed.url}: HTTP ${response.status}`);
      continue;
    }
    const items = parseFeed(await response.text(), feed.source);
    for (const item of items) {
      if (!known.has(item.url)) {
        discoveries.push(item);
        known.add(item.url);
      }
    }
  }

  for (let i = 0; i < discoveries.length; i += 10) {
    const batch = discoveries.slice(i, i + 10).map(item => ({
      fields: {
        Title: item.title,
        Excerpt: item.excerpt,
        URL: item.url,
        Source: item.source,
        'Publish Date': item.date,
        Topics: item.topics.join(', '),
        Type: 'External update',
        Status: 'Draft',
      },
    }));
    await airtable('', { method: 'POST', body: JSON.stringify({ records: batch, typecast: true }) });
  }

  console.log(`Imported ${discoveries.length} relevant item(s) as drafts for editorial review.`);
}

main().catch(error => {
  console.error(error.message);
  process.exitCode = 1;
});
