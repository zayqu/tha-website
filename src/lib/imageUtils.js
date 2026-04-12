const OPTIMIZED_IMAGE_RE = /\.(jpe?g|png|webp)$/i;

const isOptimizableLocalImage = (imagePath = '') =>
  imagePath.startsWith('/images/') && OPTIMIZED_IMAGE_RE.test(imagePath);

const compact = (props) =>
  Object.fromEntries(Object.entries(props).filter(([, value]) => value !== undefined && value !== null));

export function generateSrcSet(imagePath, widths) {
  if (!isOptimizableLocalImage(imagePath)) return undefined;

  const basePath = imagePath.replace(OPTIMIZED_IMAGE_RE, '');
  return widths.map(width => `${basePath}-${width}w.webp ${width}w`).join(', ');
}

export function getSizes(type) {
  const sizeMap = {
    hero: '100vw',
    team: '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 360px',
    avatar: '40px',
    card: '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw',
    news: '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw',
    newsHero: '100vw',
    story: '(max-width: 640px) 480px, (max-width: 1024px) 768px, 1024px',
    partner: '160px'
  };

  return sizeMap[type] || sizeMap.card;
}

export function getResponsiveImageProps(imagePath, {
  widths = [],
  sizes = getSizes('card'),
  loading = 'lazy',
  decoding = 'async',
  fetchPriority
} = {}) {
  return compact({
    srcSet: generateSrcSet(imagePath, widths),
    sizes: widths.length ? sizes : undefined,
    loading,
    decoding,
    fetchPriority
  });
}

export function getTeamImageProps(imagePath, { priority = false } = {}) {
  return getResponsiveImageProps(imagePath, {
    widths: [80, 160, 320],
    sizes: getSizes('team'),
    loading: priority ? 'eager' : 'lazy',
    fetchPriority: priority ? 'high' : undefined
  });
}

export function getNewsImageProps(imagePath, { priority = false, hero = false } = {}) {
  return getResponsiveImageProps(imagePath, {
    widths: hero ? [640, 1080] : [320, 640, 1080],
    sizes: getSizes(hero ? 'newsHero' : 'news'),
    loading: priority ? 'eager' : 'lazy',
    fetchPriority: priority ? 'high' : undefined
  });
}

export function getHeroImageProps(imagePath, { priority = true } = {}) {
  return getResponsiveImageProps(imagePath, {
    widths: [640, 1024, 1920],
    sizes: getSizes('hero'),
    loading: priority ? 'eager' : 'lazy',
    fetchPriority: priority ? 'high' : undefined
  });
}

export function getTestimonialImageProps(imagePath) {
  return getResponsiveImageProps(imagePath, {
    widths: [80, 160, 320],
    sizes: getSizes('avatar')
  });
}

export function getPartnerImageProps(imagePath) {
  return getResponsiveImageProps(imagePath, {
    widths: [120, 240],
    sizes: getSizes('partner')
  });
}

export function getStoryImageProps(imagePath, isFeatured = false) {
  return getResponsiveImageProps(imagePath, {
    widths: isFeatured ? [480, 768, 1024] : [150, 300],
    sizes: getSizes('story')
  });
}
