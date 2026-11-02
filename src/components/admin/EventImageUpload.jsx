import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const MAX_INPUT_BYTES = 15 * 1024 * 1024;
const MAX_EDGE = 1600;
const TARGET_BYTES = 500000;

function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Unable to read image'));
    reader.readAsDataURL(file);
  });
}
function loadImage(dataUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Unable to decode image'));
    img.src = dataUrl;
  });
}
async function optimize(file) {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) throw new Error('Choose a JPG, PNG or WebP image.');
  if (file.size > MAX_INPUT_BYTES) throw new Error('Choose an image smaller than 15 MB.');
  const image = await loadImage(await readFile(file));
  const ratio = Math.min(1, MAX_EDGE / Math.max(image.width, image.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(image.width * ratio));
  canvas.height = Math.max(1, Math.round(image.height * ratio));
  canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
  let dataUrl = '';
  for (let quality = 0.84; quality >= 0.42; quality -= 0.07) {
    dataUrl = canvas.toDataURL('image/webp', quality);
    if (dataUrl.length * 0.75 <= TARGET_BYTES) break;
  }
  if (!dataUrl.startsWith('data:image/webp;') || dataUrl.length * 0.75 > 4 * 1024 * 1024) {
    throw new Error('Could not optimize this image for upload.');
  }
  return dataUrl;
}
export default function EventImageUpload({ value, onChange }) {
  const { authFetch } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [note, setNote] = useState('');
  async function upload(event) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setBusy(true); setError(''); setNote('');
    try {
      const dataUrl = await optimize(file);
      const response = await authFetch('/api/site-content/media/upload', {
        method: 'POST',
        body: JSON.stringify({ dataUrl, fileName: file.name.replace(/\.[^.]+$/, '') + '.webp' }),
      });
      const result = await response.json();
      if (!response.ok || !result.url) throw new Error(result.error || 'Image upload failed');
      onChange(result.url);
      setNote('Poster uploaded. Save the event to publish the change.');
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }
  return <div className="rounded-xl border border-gray-200 p-4 space-y-3">
    <div><h3 className="font-semibold text-near-black">Event poster</h3>
      <p className="text-sm text-gray-600">Upload JPG, PNG or WebP (up to 15 MB). Large images are resized and optimized to WebP before upload.</p></div>
    <label className="inline-flex cursor-pointer items-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark">
      {busy ? 'Processing image…' : 'Choose image'}
      <input type="file" accept="image/jpeg,image/png,image/webp" onChange={upload} disabled={busy} className="sr-only" />
    </label>
    {value && <div className="max-w-sm overflow-hidden rounded-lg border bg-gray-50">
      <img src={value} alt="Event poster preview" className="h-auto max-h-96 w-full object-contain" />
      <button type="button" onClick={() => onChange('')} className="px-3 py-2 text-sm font-semibold text-red-700">Remove poster</button>
    </div>}
    <details><summary className="cursor-pointer text-sm font-semibold text-primary">Or use an image URL</summary>
      <label className="mt-2 block text-sm">Image URL
        <input className="mt-1 w-full rounded-lg border p-3" value={value || ''} onChange={e=>onChange(e.target.value)} placeholder="https://example.com/poster.webp" />
      </label>
    </details>
    {note && <p role="status" className="text-sm text-green-700">{note}</p>}
    {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
  </div>;
}
