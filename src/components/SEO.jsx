import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

const SITE_NAME = 'Tanzania Health Alliance';
const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://tha-red.vercel.app').replace(/\/$/, '');
const DEFAULT_TITLE = 'Tanzania Health Alliance | Together for a Healthier Tanzania';
const DEFAULT_DESCRIPTION = 'Tanzania Health Alliance advances public health in Tanzania through viral hepatitis, HIV, and mental health advocacy, education, research, and partnerships.';
const DEFAULT_IMAGE = '/images/og-image.jpg';

function absoluteUrl(value) {
  if (!value) return undefined;
  if (/^https?:\/\//i.test(value)) return value;
  return `${SITE_URL}${value.startsWith('/') ? value : `/${value}`}`;
}

function buildCanonical(pathname) {
  if (!pathname || pathname === '/') return `${SITE_URL}/`;
  return `${SITE_URL}${pathname.startsWith('/') ? pathname : `/${pathname}`}`;
}

export function SEO({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  image = DEFAULT_IMAGE,
  type = 'website',
  canonicalPath,
  structuredData
}) {
  const { pathname } = useLocation();
  const canonicalUrl = buildCanonical(canonicalPath || pathname);
  const pageTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
  const imageUrl = absoluteUrl(image);

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={canonicalUrl} />

      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="en_US" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />

      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
}

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'NGO',
  name: SITE_NAME,
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}/logo/tha-logo.svg`,
  description: DEFAULT_DESCRIPTION,
  areaServed: 'Tanzania',
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'Public health programs',
    email: 'info@tzhealthalliance.or.tz',
    telephone: '+255 659 114 754'
  },
  sameAs: [
    'https://instagram.com/tanzania_healthalliance',
    'https://www.linkedin.com/company/tanzania-health-alliance',
    'https://www.facebook.com/tanzaniahealthalliance'
  ]
};
