const INDEXNOW_KEY = 'd3d6ea41668dbcb5c370ca72db414a03';
const HOST = 'tzhealthalliance.or.tz';
const KEY_LOCATION = `https://${HOST}/${INDEXNOW_KEY}.txt`;

function normalizeUrls(urls = []) {
  return [...new Set(urls)]
    .map(value => {
      if (!value) return null;
      try {
        const url = new URL(value, `https://${HOST}`);
        if (url.hostname !== HOST && url.hostname !== `www.${HOST}`) return null;
        url.protocol = 'https:';
        url.hostname = HOST;
        url.hash = '';
        return url.toString();
      } catch {
        return null;
      }
    })
    .filter(Boolean)
    .slice(0, 10000);
}

async function submitIndexNow(urls) {
  const urlList = normalizeUrls(urls);
  if (!urlList.length) return { submitted: 0 };

  try {
    const response = await fetch('https://api.indexnow.org/IndexNow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host: HOST,
        key: INDEXNOW_KEY,
        keyLocation: KEY_LOCATION,
        urlList,
      }),
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok && response.status !== 202) {
      console.warn(`IndexNow submission returned HTTP ${response.status}`);
    }
    return { submitted: urlList.length, status: response.status };
  } catch (error) {
    console.warn('IndexNow notification skipped:', error.message);
    return { submitted: 0, error: error.message };
  }
}

function notifyIndexNow(urls) {
  setImmediate(() => {
    submitIndexNow(urls).catch(() => {});
  });
}

module.exports = { INDEXNOW_KEY, submitIndexNow, notifyIndexNow };
