const crypto = require('crypto');

const SOURCES = [
  ['moh.go.tz', 'Tanzania Ministry of Health'],
  ['tacaids.go.tz', 'TACAIDS'],
  ['afro.who.int', 'WHO Regional Office for Africa'],
  ['academy.who.int', 'WHO Academy'],
  ['whoacademy.org', 'WHO Academy'],
  ['who.int', 'World Health Organization'],
  ['africacdc.org', 'Africa CDC'],
  ['worldhepatitisalliance.org', 'World Hepatitis Alliance'],
  ['unaids.org', 'UNAIDS'],
];
const TOPICS = ['Hepatitis', 'HIV', 'Mental Health'];
const SCOPES = ['Tanzania', 'Africa', 'Global'];
const ACADEMY_CATEGORIES = ['Guidance', 'Training', 'Research', 'Policy'];

function sourceUrl(value) {
  if (typeof value !== 'string' || value.length > 1000) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || url.username || url.password || url.port) return null;
    url.hash = '';
    for (const key of [...url.searchParams.keys()]) {
      if (/^(utm_|fbclid$|gclid$)/i.test(key)) url.searchParams.delete(key);
    }
    url.searchParams.sort();
    return url;
  } catch {
    return null;
  }
}

function sourceKey(value) {
  const url = sourceUrl(value);
  if (!url) return null;
  return url.hostname.replace(/^www\./, '') + url.pathname.replace(/\/+$/, '') + url.search;
}

function sourceLink(paragraph) {
  return paragraph.match(/^Read the original update: (https:\/\/[^\s]+)$/)?.[1];
}

function normalizeHealthDraft(raw, { academy = false } = {}) {
  if (!raw || typeof raw !== 'object') return null;
  const text = (key, max) => typeof raw[key] === 'string' ? raw[key].trim().slice(0, max) : '';
  const url = sourceUrl(raw.url);
  const host = url?.hostname.replace(/^www\./, '');
  const publisher = SOURCES.find(([domain]) => host === domain);
  const title = text('title', 180);
  const excerpt = text('excerpt', 500);
  const date = text('date', 20);
  const content = text('content', 12000);
  const scope = text('scope', 20);
  const topics = Array.isArray(raw.topics) ? TOPICS.filter(topic => raw.topics.includes(topic)) : [];
  const category = text('category', 20);

  if (!publisher || !title || !excerpt || !topics.length || !SCOPES.includes(scope)) return null;
  if (date) {
    const parsed = new Date(date);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(parsed.getTime())
      || parsed.toISOString().slice(0, 10) !== date || parsed.getTime() > Date.now()) return null;
  }
  if (academy ? !ACADEMY_CATEGORIES.includes(category) : (!content || !date)) return null;

  return {
    title, excerpt, date, topics, scope, url: url.href,
    source: publisher[1],
    ...(academy ? { category, audience: text('audience', 120), language: text('language', 80) } : { content }),
  };
}

function sourceId(value) {
  return crypto.createHash('sha256').update(sourceKey(value)).digest('hex').slice(0, 20);
}

module.exports = { normalizeHealthDraft, sourceId, sourceKey, sourceLink };
