// Keep browser requests on the public alias so Vercel preview protection cannot gate the API.
const PRODUCTION_API_URL = 'https://tha-webacdb.vercel.app';

function defaultApiBaseUrl() {
  if (typeof window === 'undefined') return '';
  const host = window.location.hostname;
  if (host === 'localhost' || host === '127.0.0.1') return '';
  if (host.endsWith('.vercel.app') || host === 'tzhealthalliance.or.tz' || host === 'www.tzhealthalliance.or.tz') {
    return PRODUCTION_API_URL;
  }
  return '';
}

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || defaultApiBaseUrl()).replace(/\/$/, '');

export function apiUrl(path) {
  if (/^https?:\/\//i.test(path)) return path;
  return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

export function normalizeArticle(article) {
  return {
    ...article,
    isFeatured: Boolean(article.is_featured ?? article.isFeatured),
    is_featured: Boolean(article.is_featured ?? article.isFeatured),
    published: article.published ?? true,
    tags: Array.isArray(article.tags) ? article.tags : [],
    views: Number(article.views || 0),
  };
}

export async function fetchPublishedNews(params = {}) {
  const search = new URLSearchParams(params);
  const query = search.toString();
  const res = await fetch(apiUrl(`/api/news${query ? `?${query}` : ''}`));
  if (!res.ok) throw new Error('Failed to load news');
  const data = await res.json();
  return (data.articles || []).map(normalizeArticle);
}

export async function fetchNewsArticle(slug) {
  const res = await fetch(apiUrl(`/api/news/${encodeURIComponent(slug)}`));
  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error('Failed to load article');
  }
  const data = await res.json();
  return data.article ? normalizeArticle(data.article) : null;
}
