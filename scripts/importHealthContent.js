const CONTENT_API_URL = (process.env.CONTENT_API_URL || 'https://tha-webacdb.vercel.app').replace(/\/$/, '');
const CONTENT_IMPORT_SECRET = process.env.CONTENT_IMPORT_SECRET;

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
  }).filter(item => item.title && item.excerpt && item.url && item.topics.length);
}

async function main() {
  if (!CONTENT_IMPORT_SECRET) throw new Error('CONTENT_IMPORT_SECRET is required');

  const configured = process.env.HEALTH_SOURCE_FEEDS
    ? JSON.parse(process.env.HEALTH_SOURCE_FEEDS)
    : [];
  const feeds = [...DEFAULT_FEEDS, ...configured];
  const discoveries = [];

  for (const feed of feeds) {
    const response = await fetch(feed.url, {
      headers: { 'User-Agent': 'Tanzania Health Alliance content monitor' },
    });
    if (!response.ok) {
      console.warn(`Skipping ${feed.url}: HTTP ${response.status}`);
      continue;
    }
    discoveries.push(...parseFeed(await response.text(), feed.source));
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

  console.log(`Draft import complete: ${imported} new, ${duplicates} duplicate, ${invalid} invalid.`);
}

main().catch(error => {
  console.error(error.message);
  process.exitCode = 1;
});
