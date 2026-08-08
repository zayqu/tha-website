// Keep every Vercel-hosted frontend on the healthy public Vercel API.
// The cPanel build explicitly supplies VITE_API_BASE_URL, so it can switch
// to the cPanel API only after that service is deployed and verified.
const VERCEL_API_URL = 'https://tha-webacdb.vercel.app';

function defaultApiBaseUrl() {
  if (typeof window === 'undefined') return '';
  const host = window.location.hostname;
  if (host === 'localhost' || host === '127.0.0.1') return '';
  if (host === 'tzhealthalliance.or.tz' || host === 'www.tzhealthalliance.or.tz') return VERCEL_API_URL;
  if (host.endsWith('.vercel.app')) return VERCEL_API_URL;
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

// Aggregated metric totals across all published projects/campaigns, computed
// server-side from each project's `metrics` (see server/routes/projects.js).
// Returns null on any failure so callers can fall back to static content
// instead of showing a broken/zeroed stat.
export async function fetchImpactTotals() {
  try {
    const res = await fetch(apiUrl('/api/projects/impact'));
    if (!res.ok) return null;
    const data = await res.json();
    return data && typeof data.totals === 'object' ? data.totals : null;
  } catch {
    return null;
  }
}

function metricLabel(key) {
  return String(key || '')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, letter => letter.toUpperCase());
}

export function normalizeProject(project) {
  const metrics = project?.metrics && typeof project.metrics === 'object' ? project.metrics : {};
  const metricHighlights = Object.entries(metrics).map(([key, value]) =>
    `${Number(value).toLocaleString()} ${metricLabel(key)}`
  );
  const description = project?.description || project?.subtitle || 'Learn more about this Tanzania Health Alliance campaign.';

  return {
    ...project,
    id: project?.id || project?.slug,
    slug: project?.slug || project?.id,
    name: project?.name || 'THA Campaign',
    category: project?.category || 'Community Health',
    tagline: project?.tagline || project?.category || 'THA Campaign',
    subtitle: project?.subtitle || project?.category || description,
    description,
    image: project?.image || '/images/hero-bg-lg.jpg',
    icon: project?.icon || 'campaign',
    activities2025: Array.isArray(project?.activities2025) ? project.activities2025 : [],
    impact2025: Array.isArray(project?.impact2025) && project.impact2025.length
      ? project.impact2025 : metricHighlights,
    howWorks: Array.isArray(project?.howWorks) ? project.howWorks : [],
    whereActive: Array.isArray(project?.whereActive) ? project.whereActive : [],
    metrics,
  };
}

export async function fetchProjects() {
  const res = await fetch(apiUrl('/api/projects'));
  if (!res.ok) throw new Error('Failed to load projects');
  const data = await res.json();
  return (data.projects || []).map(normalizeProject);
}

export async function fetchProject(slug) {
  const res = await fetch(apiUrl(`/api/projects/${encodeURIComponent(slug)}`));
  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error('Failed to load project');
  }
  const data = await res.json();
  return data.project ? normalizeProject(data.project) : null;
}

export async function fetchJourney() {
  const res = await fetch(apiUrl('/api/journey'));
  if (!res.ok) throw new Error('Failed to load journey');
  const data = await res.json();
  return data.milestones || [];
}
