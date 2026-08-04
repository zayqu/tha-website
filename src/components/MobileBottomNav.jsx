import { Link, useLocation } from 'react-router-dom';
import { Icon } from './Icon';

const tabs = [
  { label: 'Home', path: '/', icon: 'home' },
  { label: 'About', path: '/about', icon: 'info' },
  { label: 'Campaigns', path: '/projects', icon: 'campaign' },
  { label: 'Academy', path: '/academy', icon: 'school' },
  { label: 'Contact', path: '/contact', icon: 'mail' },
];

export const MobileBottomNav = () => {
  const { pathname } = useLocation();

  return (
    <nav
      className="mobile-fixed-chrome safe-bottom fixed bottom-0 left-0 right-0 z-[60] bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.06)] md:hidden"
      aria-label="Mobile navigation"
    >
      <div className="grid h-16 grid-cols-5 items-stretch px-1">
        {tabs.map((tab) => {
          const isActive = pathname === tab.path || (tab.path !== '/' && pathname.startsWith(tab.path));
          return (
            <Link
              key={tab.path}
              to={tab.path}
              aria-current={isActive ? 'page' : undefined}
              className={`flex h-full w-full flex-col items-center justify-center gap-0.5 rounded-lg text-center transition-colors ${
                isActive ? 'text-primary' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Icon name={tab.icon} size={22} color={isActive ? '#024d85' : '#9ca3af'} />
              <span className={`text-[10px] font-medium leading-none ${isActive ? 'text-primary' : 'text-gray-400'}`}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
