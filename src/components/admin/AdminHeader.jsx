import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const NAV_ITEMS = [
  { label: 'News', path: '/admin' },
  { label: 'Campaigns', path: '/admin/projects' },
  { label: 'Journey', path: '/admin/journey' },
];

export function AdminHeader({ section, backTo }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/admin/login', { replace: true });
  }

  return (
    <header className="sticky top-0 z-40 border-b border-primary/10 bg-white shadow-sm">
      <div className="mx-auto flex min-h-16 max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-2 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          {backTo ? (
            <Link to={backTo} className="rounded-lg p-2 text-primary hover:bg-primary/10" aria-label="Back">
              <span className="material-symbols-outlined">arrow_back</span>
            </Link>
          ) : null}
          <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center" title={`Open public website from ${section} administration in a new tab`}>
            <img src="/logo/tha-logo.svg" alt="Tanzania Health Alliance" width="112" height="45" className="h-10 w-auto" />
          </a>
        </div>

        {!backTo ? (
          <nav className="order-3 flex w-full items-center justify-center gap-1 border-t border-gray-100 pt-2 sm:order-none sm:w-auto sm:border-0 sm:pt-0" aria-label="Admin sections">
            {NAV_ITEMS.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/admin'}
                className={({ isActive }) => `rounded-lg px-3 py-2 text-sm font-semibold transition ${
                  isActive ? 'bg-primary text-white' : 'text-gray-600 hover:bg-primary/10 hover:text-primary'
                }`}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        ) : null}

        <div className="flex items-center gap-2">
          <button type="button" onClick={handleLogout} className="rounded-lg px-3 py-2 text-sm font-semibold text-gray-500 transition hover:bg-red-50 hover:text-red-600">
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
