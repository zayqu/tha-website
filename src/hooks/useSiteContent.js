import { useEffect, useState } from 'react';
import defaults from '../data/siteContentDefaults.json';
import { fetchSiteContent, getCachedSiteContent } from '../lib/api';

function mergeDeep(base, override) {
  if (Array.isArray(base)) return Array.isArray(override) ? override : base;
  if (!base || typeof base !== 'object') return override === undefined ? base : override;
  const out = { ...base };
  if (!override || typeof override !== 'object' || Array.isArray(override)) return out;
  for (const [key, value] of Object.entries(override)) {
    if (value && typeof value === 'object' && !Array.isArray(value) && base[key] && typeof base[key] === 'object' && !Array.isArray(base[key])) {
      out[key] = mergeDeep(base[key], value);
    } else {
      out[key] = value;
    }
  }
  return out;
}

export function useSiteContent() {
  const cached = getCachedSiteContent();
  const [content, setContent] = useState(() => mergeDeep(defaults, cached || {}));

  useEffect(() => {
    let active = true;
    fetchSiteContent()
      .then(live => {
        if (active) setContent(mergeDeep(defaults, live || {}));
      })
      .catch(() => {});
    return () => { active = false; };
  }, []);

  return content;
}
