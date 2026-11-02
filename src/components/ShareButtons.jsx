import { useState } from 'react';
import { Icon } from './Icon';

// Shared across THA news, campaigns, and events; no platform-specific SDK.
export function ShareButtons({ title, url, className = '' }) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title || '');
  const buttonStyle = 'inline-flex items-center gap-2 rounded-lg border border-primary/20 px-3 py-2 text-sm font-semibold text-primary transition hover:bg-primary/5';
  async function copyLink() {
    setError('');
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
    } catch {
      setError('Unable to copy automatically. Please copy the page address.');
    }
  }
  return (
    <div className={className}>
      <div className="flex flex-wrap items-center gap-2" aria-label="Share this page">
        <a className={buttonStyle} href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`} target="_blank" rel="noopener noreferrer" aria-label="Share on WhatsApp">
          <Icon name="chat" size={18} /> WhatsApp
        </a>
        <a className={buttonStyle} href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} target="_blank" rel="noopener noreferrer" aria-label="Share on Facebook">
          <Icon name="facebook" size={18} /> Facebook
        </a>
        <a className={buttonStyle} href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`} target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn">
          <Icon name="linkedin" size={18} /> LinkedIn
        </a>
        <button className={buttonStyle} onClick={copyLink} type="button">
          <Icon name={copied ? 'check_circle' : 'link'} size={18} /> {copied ? 'Copied' : 'Copy link'}
        </button>
      </div>
      {error && <p role="status" className="mt-2 text-sm text-red-700">{error}</p>}
    </div>
  );
}
