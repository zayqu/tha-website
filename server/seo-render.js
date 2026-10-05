const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://tzhealthalliance.or.tz';
const SITE_NAME = 'Tanzania Health Alliance';
// Full-site semantic SEO release: entity, topic, search and AI discovery coverage.

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

function renderSitemap(articles = [], projects = []) {
  const staticUrls = [
    '/', '/about', '/impact', '/projects', '/academy', '/news', '/contact',
    '/health/hepatitis', '/health/hiv', '/health/mental-health',
    '/make-a-difference', '/privacy', '/cookies', '/terms',
    '/campaigns/kapime', '/campaigns/life-unlocked', '/campaigns/talk-to-heal',
  ];

  const rows = [
    ...staticUrls.map(url => ({ loc: SITE_URL + url })),
    ...projects
      .filter(project => project?.slug || project?.id)
      .map(project => ({
        loc: `${SITE_URL}/campaigns/${encodeURIComponent(project.slug || project.id)}`,
        lastmod: project.updated_at
          ? new Date(Number(project.updated_at) * 1000).toISOString().slice(0, 10)
          : undefined,
      })),
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


const PAGE_DEFINITIONS = {
  '/': {
    title: 'Tanzania Health Alliance | Together for a Healthier Tanzania',
    description: 'Tanzania Health Alliance advances public health through advocacy, capacity building, research and partnerships across viral hepatitis, HIV and mental health in Tanzania.',
    heading: 'Together for a Healthier Tanzania',
    paragraphs: [
      'Tanzania Health Alliance addresses critical public health challenges including viral hepatitis, HIV and mental health through awareness, advocacy, research, partnerships and improved access to care.',
      'Our work supports equitable access to quality healthcare and stronger, more resilient health systems across Tanzania.'
    ],
    links: ['/about', '/projects', '/impact', '/academy', '/news', '/contact']
  },
  '/about': {
    title: 'About Tanzania Health Alliance | Tanzania Health Alliance',
    description: 'Learn about Tanzania Health Alliance, our mission, vision, values, public health priorities and work across Tanzania.',
    heading: 'About Tanzania Health Alliance',
    paragraphs: [
      'Tanzania Health Alliance is a public health organization working to advance equitable access to quality healthcare in Tanzania.',
      'Our mission is to advance public health through advocacy, capacity building, research and partnerships, contributing to sustainable and resilient healthcare.'
    ],
    links: ['/projects', '/impact', '/news', '/contact']
  },
  '/impact': {
    title: 'Our Impact | Tanzania Health Alliance',
    description: 'Explore the public health impact, partnerships, community outreach and milestones of Tanzania Health Alliance.',
    heading: 'Our Impact',
    paragraphs: [
      'Tanzania Health Alliance delivers community awareness, advocacy, training, research and health-system strengthening across hepatitis, HIV and mental health.',
      'Our work connects communities, health professionals, institutions and partners around practical public health action.'
    ],
    links: ['/projects', '/news', '/about']
  },
  '/projects': {
    title: 'Projects and Campaigns | Tanzania Health Alliance',
    description: 'Explore Tanzania Health Alliance projects and campaigns across viral hepatitis, HIV, mental health and community health.',
    heading: 'Projects and Campaigns',
    paragraphs: [
      'Tanzania Health Alliance runs public health projects and campaigns that combine awareness, prevention, advocacy, research, partnerships and community engagement.'
    ],
    links: ['/campaigns/kapime', '/campaigns/life-unlocked', '/campaigns/talk-to-heal', '/impact']
  },
  '/academy': {
    title: 'Public Health Academy | Tanzania Health Alliance',
    description: 'Access trusted public health guidance and learning resources on hepatitis, HIV and mental health.',
    heading: 'THA Public Health Academy',
    paragraphs: [
      'The THA Academy brings together trusted guidance, policy and training resources on viral hepatitis, HIV and mental health from established health authorities including the World Health Organization.'
    ],
    links: ['/news', '/projects', '/about']
  },
  '/health/hepatitis': {
    title: 'Viral Hepatitis in Tanzania | Tanzania Health Alliance',
    description: 'Tanzania Health Alliance works on viral hepatitis awareness, hepatitis B prevention, testing education, vaccination advocacy and access to care in Tanzania.',
    heading: 'Viral Hepatitis in Tanzania',
    paragraphs: [
      'Tanzania Health Alliance works to improve awareness, prevention, early testing, vaccination advocacy and access to care for viral hepatitis, with particular attention to hepatitis B.',
      'Related topics include hepatitis Tanzania, hepatitis B Tanzania, hepatitis testing, hepatitis vaccination, liver health, viral hepatitis awareness and the KAPIME campaign.'
    ],
    links: ['/campaigns/kapime', '/news', '/academy', '/contact']
  },
  '/health/hiv': {
    title: 'HIV Awareness in Tanzania | Tanzania Health Alliance',
    description: 'Tanzania Health Alliance supports HIV awareness, stigma reduction, testing education, treatment access and community health engagement in Tanzania.',
    heading: 'HIV Awareness and Community Health in Tanzania',
    paragraphs: [
      'Tanzania Health Alliance supports HIV awareness, stigma reduction, testing education, treatment access and community-led health engagement in Tanzania.',
      'Related topics include HIV Tanzania, HIV testing Tanzania, HIV awareness, stigma reduction, treatment access and community public health.'
    ],
    links: ['/projects', '/news', '/academy', '/contact']
  },
  '/health/mental-health': {
    title: 'Mental Health in Tanzania | Tanzania Health Alliance',
    description: 'Tanzania Health Alliance supports mental health awareness, youth resilience, stigma reduction, peer support and community wellbeing in Tanzania.',
    heading: 'Mental Health Awareness in Tanzania',
    paragraphs: [
      'Tanzania Health Alliance supports mental health awareness, stigma reduction, youth resilience, peer support and healthier community conversations in Tanzania.',
      'Related topics include mental health Tanzania, youth mental health, mental health awareness, mental wellbeing, Life Unlocked and Talk To Heal.'
    ],
    links: ['/campaigns/life-unlocked', '/campaigns/talk-to-heal', '/news', '/academy']
  },
  '/make-a-difference': {
    title: 'Make a Difference | Tanzania Health Alliance',
    description: 'Support and participate in Tanzania Health Alliance public health programs and community action.',
    heading: 'Make a Difference',
    paragraphs: [
      'Support Tanzania Health Alliance as we strengthen awareness, advocacy, research, community engagement and access to care across Tanzania.'
    ],
    links: ['/projects', '/contact', '/impact']
  },
  '/contact': {
    title: 'Contact Tanzania Health Alliance',
    description: 'Contact Tanzania Health Alliance in Dar es Salaam for partnerships, public health programs, advocacy and community engagement.',
    heading: 'Contact Tanzania Health Alliance',
    paragraphs: [
      'Tanzania Health Alliance is based in Kinondoni, Dar es Salaam, Tanzania. Contact us for partnerships, programs, advocacy, research and community health collaboration.',
      'Email: info@tzhealthalliance.or.tz. Phone: +255 659 114 754.'
    ],
    links: ['/about', '/projects', '/news']
  },
  '/privacy': {
    title: 'Privacy Policy | Tanzania Health Alliance',
    description: 'Privacy policy for the Tanzania Health Alliance website.',
    heading: 'Privacy Policy',
    paragraphs: ['How Tanzania Health Alliance handles information submitted through this website.'],
    links: ['/contact']
  },
  '/cookies': {
    title: 'Cookie Policy | Tanzania Health Alliance',
    description: 'Cookie policy for the Tanzania Health Alliance website.',
    heading: 'Cookie Policy',
    paragraphs: ['Information about cookies and related technologies used by the Tanzania Health Alliance website.'],
    links: ['/privacy']
  },
  '/terms': {
    title: 'Terms of Use | Tanzania Health Alliance',
    description: 'Terms of use for the Tanzania Health Alliance website.',
    heading: 'Terms of Use',
    paragraphs: ['Terms governing use of the Tanzania Health Alliance website and its public information.'],
    links: ['/privacy', '/contact']
  },
};

const CAMPAIGNS = {
  kapime: {
    name: 'KAPIME',
    subtitle: 'Hepatitis Awareness & Prevention',
    description: "KAPIME means 'Get Tested' in Swahili. This Tanzania Health Alliance initiative raises awareness about hepatitis B, encourages vaccination, and connects communities to testing and care.",
  },
  'life-unlocked': {
    name: 'Life Unlocked',
    subtitle: 'Youth Mental Health',
    description: 'Life Unlocked supports young Tanzanians through mental health awareness, resilience-building and peer support during major life transitions.',
  },
  'talk-to-heal': {
    name: 'Talk To Heal',
    subtitle: 'Community Health Conversations',
    description: 'Talk To Heal creates safe spaces for community conversations on mental health, HIV testing awareness and hepatitis prevention.',
  },
};

function linksHtml(links = []) {
  return links.map(href => `<li><a href="${escapeHtml(href)}">${escapeHtml(href)}</a></li>`).join('');
}

function genericFallback(definition) {
  const paragraphs = (definition.paragraphs || []).map(p => `<p>${escapeHtml(p)}</p>`).join('\n');
  return `
    <main id="seo-page">
      <h1>${escapeHtml(definition.heading)}</h1>
      ${paragraphs}
      ${definition.links?.length ? `<nav aria-label="Related pages"><ul>${linksHtml(definition.links)}</ul></nav>` : ''}
    </main>`;
}

function campaignFallback(campaignId) {
  const campaign = CAMPAIGNS[campaignId];
  if (!campaign) return null;
  return genericFallback({
    heading: `${campaign.name}: ${campaign.subtitle}`,
    paragraphs: [campaign.description],
    links: ['/projects', '/impact', '/news', '/contact'],
  });
}

function projectFallback(project) {
  return genericFallback({
    heading: project.name || project.title || 'THA Project',
    paragraphs: [
      project.description || project.subtitle || 'A Tanzania Health Alliance public health project.',
      project.tagline || '',
    ].filter(Boolean),
    links: ['/projects', '/impact', '/news', '/contact'],
  });
}

function renderPublicPage(templatePath, pathname, { project } = {}) {
  let html = fs.readFileSync(templatePath, 'utf8');
  let definition = PAGE_DEFINITIONS[pathname];
  let fallback;

  if (pathname.startsWith('/campaigns/')) {
    const campaignId = decodeURIComponent(pathname.split('/').filter(Boolean)[1] || '');
    const campaign = CAMPAIGNS[campaignId];
    if (!campaign) return null;
    definition = {
      title: `${campaign.name} | Tanzania Health Alliance`,
      description: campaign.description,
      heading: `${campaign.name}: ${campaign.subtitle}`,
      paragraphs: [campaign.description],
    };
    fallback = campaignFallback(campaignId);
  } else if (project) {
    definition = {
      title: `${project.name || project.title} | Tanzania Health Alliance`,
      description: project.description || project.subtitle || 'Tanzania Health Alliance public health project.',
      heading: project.name || project.title,
      paragraphs: [project.description || project.subtitle || ''],
    };
    fallback = projectFallback(project);
  }

  if (!definition) return null;
  const canonical = SITE_URL + (pathname === '/' ? '/' : pathname);
  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: definition.heading || definition.title,
      description: definition.description,
      url: canonical,
      isPartOf: {
        '@type': 'WebSite',
        name: SITE_NAME,
        url: SITE_URL + '/',
      },
      about: {
        '@type': 'NGO',
        name: SITE_NAME,
        alternateName: ['THA', 'THA Tanzania', 'Tanzania Health Alliance (THA)'],
        url: SITE_URL + '/',
        knowsAbout: ['Viral Hepatitis', 'Hepatitis B', 'HIV', 'Mental Health', 'Public Health'],
      },
    },
    ...(pathname === '/' ? [{
      '@context': 'https://schema.org',
      '@type': 'NGO',
      name: SITE_NAME,
      alternateName: ['THA', 'THA Tanzania', 'Tanzania Health Alliance (THA)'],
      url: SITE_URL + '/',
      logo: SITE_URL + '/logo/tha-logo.svg',
      description: definition.description,
      areaServed: {
        '@type': 'Country',
        name: 'Tanzania',
      },
      knowsAbout: [
        'Viral Hepatitis',
        'Hepatitis B',
        'HIV',
        'Mental Health',
        'Public Health',
        'Health Advocacy',
        'Community Health',
        'Health Education',
        'Health Research',
      ],
      founder: {
        '@type': 'Person',
        name: 'Shaibu Issa',
        jobTitle: 'Founder and Executive Director',
      },
      sameAs: [
        'https://instagram.com/tanzania_healthalliance',
        'https://www.linkedin.com/company/tanzania-health-alliance',
        'https://www.facebook.com/tanzaniahealthalliance',
      ],
    }] : []),
  ];
  html = replaceMeta(html, {
    title: definition.title,
    description: definition.description,
    canonical,
    image: SITE_URL + '/images/og-image.jpg',
    structuredData,
  });
  return html.replace('<div id="root"></div>', `<div id="root">${fallback || genericFallback(definition)}</div>`);
}

function renderLlmsTxt({ articles = [], projects = [] } = {}) {
  const lines = [
    '# Tanzania Health Alliance',
    '',
    '> Tanzania Health Alliance (THA) is a Tanzania-based public health organization working across viral hepatitis, HIV, mental health, advocacy, research, capacity building and partnerships.',
    '',
    'Official website: https://tzhealthalliance.or.tz/',
    'Primary country: Tanzania',
    'Organization type: NGO / public health organization',
    '',
    '## Core pages',
    '- https://tzhealthalliance.or.tz/about',
    '- https://tzhealthalliance.or.tz/projects',
    '- https://tzhealthalliance.or.tz/impact',
    '- https://tzhealthalliance.or.tz/academy',
    '- https://tzhealthalliance.or.tz/news',
    '- https://tzhealthalliance.or.tz/contact',
    '',
    '## Health focus areas',
    '- https://tzhealthalliance.or.tz/health/hepatitis — viral hepatitis and hepatitis B awareness, testing, prevention and vaccination advocacy',
    '- https://tzhealthalliance.or.tz/health/hiv — HIV awareness, stigma reduction, testing education and access to care',
    '- https://tzhealthalliance.or.tz/health/mental-health — mental health awareness, youth resilience, peer support and stigma reduction',
    '',
    '## Campaigns',
    '- https://tzhealthalliance.or.tz/campaigns/kapime — hepatitis awareness and prevention',
    '- https://tzhealthalliance.or.tz/campaigns/life-unlocked — youth mental health',
    '- https://tzhealthalliance.or.tz/campaigns/talk-to-heal — community health conversations',
    '',
    '## Current projects',
    ...projects.map(p => `- https://tzhealthalliance.or.tz/campaigns/${encodeURIComponent(p.slug || p.id)} — ${stripText(p.name || p.title || 'THA project')}`),
    '',
    '## Published news',
    ...articles.slice(0, 50).map(a => `- https://tzhealthalliance.or.tz/news/${encodeURIComponent(a.slug)} — ${stripText(a.title)}`),
    '',
    '## Contact',
    '- Email: info@tzhealthalliance.or.tz',
    '- Location: Dar es Salaam, Tanzania',
    '',
    'For current facts, prefer the canonical pages and published news URLs above.',
    ''
  ];
  return lines.join('\n');
}

module.exports = { renderHtml, renderSitemap, renderPublicPage, renderLlmsTxt };
