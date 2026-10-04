const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://tzhealthalliance.or.tz';
const SITE_NAME = 'Tanzania Health Alliance';

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function absoluteUrl(value = '') {
  if (!value) return SITE_URL + '/images/og-image.jpg';
  if (/^https?:\/\//i.test(value)) return value;
  return SITE_URL + (value.startsWith('/') ? value : '/' + value);
}

function stripText(value = '') {
  return String(value).replace(/\s+/g, ' ').trim();
}

function replaceMeta(html, { title, description, canonical, image, type = 'website', structuredData }) {
  const safeTitle = escapeHtml(title);
  const safeDescription = escapeHtml(description);
  const safeCanonical = escapeHtml(canonical);
  const safeImage = escapeHtml(image);

  html = html
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${safeTitle}</title>`)
    .replace(/<meta name="description"[^>]*>/i, `<meta name="description" content="${safeDescription}" />`)
    .replace(/<meta property="og:type"[^>]*>/i, `<meta property="og:type" content="${type}" />`)
    .replace(/<meta property="og:title"[^>]*>/i, `<meta property="og:title" content="${safeTitle}" />`)
    .replace(/<meta property="og:description"[^>]*>/i, `<meta property="og:description" content="${safeDescription}" />`)
    .replace(/<meta property="og:url"[^>]*>/i, `<meta property="og:url" content="${safeCanonical}" />`)
    .replace(/<meta property="og:image"[^>]*>/i, `<meta property="og:image" content="${safeImage}" />`)
    .replace(/<meta name="twitter:title"[^>]*>/i, `<meta name="twitter:title" content="${safeTitle}" />`)
    .replace(/<meta name="twitter:description"[^>]*>/i, `<meta name="twitter:description" content="${safeDescription}" />`)
    .replace(/<meta name="twitter:image"[^>]*>/i, `<meta name="twitter:image" content="${safeImage}" />`);

  const extra = [
    `<link rel="canonical" href="${safeCanonical}" />`,
    '<meta name="robots" content="index, follow" />',
    structuredData ? `<script type="application/ld+json">${JSON.stringify(structuredData).replace(/</g, '\\u003c')}</script>` : '',
  ].filter(Boolean).join('\n    ');

  return html.replace('</head>', `    ${extra}\n  </head>`);
}

function articleFallback(article) {
  const paragraphs = String(article.content || '')
    .split(/\n\n+/)
    .map(p => p.trim())
    .filter(Boolean)
    .map(p => `<p>${escapeHtml(p)}</p>`)
    .join('\n');

  return `
    <main id="seo-news-article">
      <article>
        <header>
          <p>${escapeHtml(article.category || 'News')}</p>
          <h1>${escapeHtml(article.title)}</h1>
          <p>${escapeHtml(article.date || '')}${article.author ? ' · ' + escapeHtml(article.author) : ''}</p>
        </header>
        ${article.image ? `<img src="${escapeHtml(article.image)}" alt="${escapeHtml(article.title)}" />` : ''}
        <p>${escapeHtml(article.excerpt || '')}</p>
        <section>${paragraphs}</section>
      </article>
    </main>`;
}

function newsListFallback(articles) {
  const items = articles.map(article => `
    <article>
      <h2><a href="/news/${encodeURIComponent(article.slug)}">${escapeHtml(article.title)}</a></h2>
      <p>${escapeHtml(article.excerpt || '')}</p>
      <p>${escapeHtml(article.date || '')}</p>
    </article>`).join('\n');

  return `
    <main id="seo-news-list">
      <h1>News &amp; Updates</h1>
      <p>Latest news and public health updates from Tanzania Health Alliance.</p>
      ${items}
    </main>`;
}

function renderHtml(templatePath, { article, articles }) {
  let html = fs.readFileSync(templatePath, 'utf8');

  if (article) {
    const canonical = `${SITE_URL}/news/${encodeURIComponent(article.slug)}`;
    const image = absoluteUrl(article.image);
    const description = stripText(article.excerpt || article.content || '').slice(0, 300);
    const title = `${article.title} | ${SITE_NAME}`;
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      headline: article.title,
      description,
      datePublished: article.date,
      dateModified: article.date,
      author: { '@type': 'Organization', name: article.author || SITE_NAME },
      publisher: {
        '@type': 'Organization',
        name: SITE_NAME,
        logo: { '@type': 'ImageObject', url: SITE_URL + '/logo/tha-logo.svg' },
      },
      image: [image],
      mainEntityOfPage: canonical,
    };
    html = replaceMeta(html, {
      title, description, canonical, image, type: 'article', structuredData,
    });
    return html.replace('<div id="root"></div>', `<div id="root">${articleFallback(article)}</div>`);
  }

  const description = 'Read Tanzania Health Alliance news, public health updates, campaign stories, and advocacy milestones across viral hepatitis, HIV, and mental health.';
  html = replaceMeta(html, {
    title: 'News and Updates | Tanzania Health Alliance',
    description,
    canonical: SITE_URL + '/news',
    image: SITE_URL + '/images/og-image.jpg',
  });
  return html.replace('<div id="root"></div>', `<div id="root">${newsListFallback(articles || [])}</div>`);
}

function renderSitemap(articles = []) {
  const staticUrls = [
    '/', '/about', '/impact', '/projects', '/academy', '/news', '/contact',
    '/make-a-difference', '/campaigns/kapime', '/campaigns/life-unlocked', '/campaigns/talk-to-heal',
  ];

  const rows = [
    ...staticUrls.map(url => ({ loc: SITE_URL + url })),
    ...articles.map(article => ({
      loc: `${SITE_URL}/news/${encodeURIComponent(article.slug)}`,
      lastmod: article.updated_at
        ? new Date(Number(article.updated_at) * 1000).toISOString().slice(0, 10)
        : article.date,
    })),
  ];

  const body = rows.map(row => [
    '  <url>',
    `    <loc>${escapeHtml(row.loc)}</loc>`,
    row.lastmod ? `    <lastmod>${escapeHtml(row.lastmod)}</lastmod>` : '',
    '  </url>',
  ].filter(Boolean).join('\n')).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

module.exports = { renderHtml, renderSitemap };
