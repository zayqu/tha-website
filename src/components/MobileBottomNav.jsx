import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Icon } from './Icon';

const tabs = [
  { label: 'Home', path: '/', icon: 'home' },
  { label: 'Campaigns', path: '/projects', icon: 'campaign' },
  { label: 'Events', path: '/events', icon: 'event' },
  { label: 'News', path: '/news', icon: 'article' },
];
const morePages = [
  { label: 'About THA', path: '/about', icon: 'info' },
  { label: 'Our Impact', path: '/impact', icon: 'insights' },
  { label: 'Academy', path: '/academy', icon: 'school' },
  { label: 'Join the Alliance', path: '/make-a-difference', icon: 'volunteer_activism' },
  { label: 'Documents', path: '/documents', icon: 'description' },
  { label: 'Contact', path: '/contact', icon: 'mail' },
  { label: 'Privacy Policy', path: '/privacy', icon: 'shield' },
  { label: 'Terms of Use', path: '/terms', icon: 'gavel' },
];
const matches = (path, target) => path === target || (target !== '/' && path.startsWith(target + '/'));
export const MobileBottomNav = () => {
  const { pathname } = useLocation();
  const [expanded, setExpanded] = useState(false);
  useEffect(() => setExpanded(false), [pathname]);
  useEffect(() => {
    if (!expanded) return;
    const closeOnEscape = event => { if (event.key === 'Escape') setExpanded(false); };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [expanded]);
  const moreActive = morePages.some(page => matches(pathname, page.path));
  return <>
    {expanded && <div className="fixed inset-0 z-[58] bg-black/30 md:hidden" onClick={() => setExpanded(false)} aria-hidden="true" />}
    {expanded && <nav id="mobile-more-pages" aria-label="All THA pages" className="fixed inset-x-3 bottom-[calc(4.75rem+env(safe-area-inset-bottom,0px))] z-[59] max-h-[min(70vh,550px)] overflow-y-auto rounded-2xl bg-white p-4 shadow-xl md:hidden">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-bold text-primary">Explore THA</h2>
        <button type="button" onClick={() => setExpanded(false)} aria-label="Close menu" className="rounded-lg p-2 text-gray-600"><Icon name="close" size={22}/></button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {morePages.map(page => <Link key={page.path} to={page.path} aria-current={matches(pathname,page.path)?'page':undefined}
          className="flex min-h-12 items-center gap-2 rounded-xl border border-gray-100 bg-gray-50 px-3 py-3 text-sm font-semibold text-near-black">
          <Icon name={page.icon} size={20}/>{page.label}
        </Link>)}
      </div>
    </nav>}
    <nav className="mobile-fixed-chrome mobile-bottom-chrome safe-bottom w-full border-t border-gray-200 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.06)] md:hidden" aria-label="Mobile navigation" data-mobile-chrome="bottom-navigation">
      <div className="grid h-16 grid-cols-5 items-center px-1">
        {tabs.map(tab => {
          const active = matches(pathname,tab.path);
          return <Link key={tab.path} to={tab.path} aria-current={active?'page':undefined} className={`flex h-full min-h-11 flex-col items-center justify-center gap-0.5 rounded-lg text-center transition-colors ${active?'text-primary':'text-gray-400 hover:text-gray-600'}`}>
            <Icon name={tab.icon} size={22} color={active?'#024d85':'#9ca3af'}/><span className="text-[10px] font-medium leading-none">{tab.label}</span>
          </Link>;
        })}
        <button type="button" onClick={() => setExpanded(!expanded)} aria-expanded={expanded} aria-controls="mobile-more-pages"
          className={`flex h-full min-h-11 flex-col items-center justify-center gap-0.5 rounded-lg text-center ${expanded||moreActive?'text-primary':'text-gray-400'}`}>
          <Icon name={expanded?'close':'menu'} size={22} color={expanded||moreActive?'#024d85':'#9ca3af'}/><span className="text-[10px] font-medium leading-none">More</span>
        </button>
      </div>
    </nav>
  </>;
};
