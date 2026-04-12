import { Link, useLocation } from 'react-router-dom';
import { Icon } from './Icon';

const tabs = [
  { label: 'Home', path: '/', icon: 'home' },
  { label: 'About', path: '/about', icon: 'info' },
  { label: 'Programs', path: '/projects', icon: 'campaign' },
  { label: 'Academy', path: '/academy', icon: 'school' },
  { label: 'Contact', path: '/contact', icon: 'mail' },
];

export const MobileBottomNav = () => {
  const { pathname } = useLocation();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.06)] md:hidden safe-bottom">
      <div className="flex justify-around items-center py-1.5 px-1">
        {tabs.map((tab) => {
          const isActive = pathname === tab.path || (tab.path !== '/' && pathname.startsWith(tab.path));
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg transition-colors min-w-[56px] ${
                isActive ? 'text-primary' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Icon name={tab.icon} size={22} color={isActive ? '#024d85' : '#9ca3af'} />
              <span className={`text-[10px] font-medium ${isActive ? 'text-primary' : 'text-gray-400'}`}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
