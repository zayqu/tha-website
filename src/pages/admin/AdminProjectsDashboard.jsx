import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const STATUS_COLORS = {
  active:    'bg-green-100 text-green-700',
  planned:   'bg-blue-100 text-blue-700',
  completed: 'bg-purple-100 text-purple-700',
  archived:  'bg-gray-100 text-gray-500',
};

export default function AdminProjectsDashboard() {
  const { admin, logout, authFetch } = useAuth();
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [deleting, setDeleting] = useState(null);
  const [filter, setFilter]     = useState('all'); // 'all' | 'published' | 'drafts'

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const res = await authFetch('/api/projects/admin');
      if (!res.ok) throw new Error('Failed to fetch projects');
      const data = await res.json();
      setProjects(data.projects || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [authFetch]);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  async function handleDelete(id, name) {
    if (!window.confirm(`Delete "${name}"?\n\nThis cannot be undone.`)) return;
    setDeleting(id);
    try {
      const res = await authFetch(`/api/projects/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      alert(err.message);
    } finally {
      setDeleting(null);
    }
  }

  async function handleTogglePublish(project) {
    try {
      const updated = { ...project, published: !project.published };
      const res = await authFetch(`/api/projects/${project.id}`, {
        method: 'PUT',
        body: JSON.stringify(updated),
      });
      if (!res.ok) throw new Error('Update failed');
      const data = await res.json();
      setProjects(prev => prev.map(p => p.id === project.id ? data.project : p));
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleLogout() {
    await logout();
    navigate('/admin/login', { replace: true });
  }

  const filtered = projects.filter(p => {
    if (filter === 'published') return p.published;
    if (filter === 'drafts') return !p.published;
    return true;
  });

  const publishedCount = projects.filter(p => p.published).length;
  const draftCount     = projects.filter(p => !p.published).length;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Top Nav */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <svg viewBox="0 0 32 32" className="w-5 h-5 text-white fill-current">
                <path d="M16 3C9.37 3 4 8.37 4 15c0 4.49 2.36 8.43 5.89 10.67L16 29l6.11-3.33C25.64 23.43 28 19.49 28 15c0-6.63-5.37-12-12-12zm-1.5 17.5V15H11l5-8v5.5h3.5l-5 8z" />
              </svg>
            </div>
            <div>
              <span className="font-bold text-gray-800">THA Admin</span>
              <span className="hidden sm:inline text-gray-400 text-sm ml-2">/ Campaigns</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/admin" className="hidden sm:inline text-sm text-gray-500 hover:text-primary transition-colors">
              News
            </Link>
            <span className="hidden sm:block text-sm text-gray-500">
              {admin?.name || admin?.identifier}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Campaigns', value: projects.length, icon: '📋', color: 'bg-blue-50 text-blue-700' },
            { label: 'Published',      value: publishedCount,   icon: '✅', color: 'bg-green-50 text-green-700' },
            { label: 'Drafts',         value: draftCount,       icon: '📝', color: 'bg-amber-50 text-amber-700' },
          ].map(stat => (
            <div key={stat.label} className={`rounded-xl p-4 ${stat.color}`}>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-sm font-medium opacity-80">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 text-sm text-gray-500">
          These are the campaigns shown on the public Campaigns and Impact pages. The numbers you set under
          each campaign's <strong>metrics</strong> are summed automatically to power the site-wide impact counters.
        </div>

        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex gap-2">
            {['all', 'published', 'drafts'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${
                  filter === f ? 'bg-primary text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <Link
            to="/admin/projects/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white font-semibold text-sm rounded-xl hover:bg-primary-dark transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
            </svg>
            New Campaign
          </Link>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-6 text-sm">
            {error} —{' '}
            <button onClick={fetchProjects} className="underline font-medium">Retry</button>
          </div>
        )}

        {/* Campaign List */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-gray-100">
            <div className="text-5xl mb-4">📭</div>
            <p className="text-gray-500">No campaigns yet.</p>
            <Link to="/admin/projects/new" className="mt-4 inline-block text-primary font-semibold hover:underline">
              Create your first campaign →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(project => (
              <div
                key={project.id}
                className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4 p-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_COLORS[project.status] || 'bg-gray-100 text-gray-600'}`}>
                        {project.status}
                      </span>
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-secondary/10 text-secondary">
                        {project.category}
                      </span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${project.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {project.published ? 'Published' : 'Draft'}
                      </span>
                    </div>

                    <h3 className="font-semibold text-gray-800 text-sm line-clamp-1">{project.name}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {Object.keys(project.metrics || {}).length} metric{Object.keys(project.metrics || {}).length === 1 ? '' : 's'} tracked
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Link
                      to={`/campaigns/${project.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg text-gray-400 hover:text-secondary hover:bg-secondary/10 transition-colors"
                      title="View"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.25 12s3.75-6.75 9.75-6.75S21.75 12 21.75 12 18 18.75 12 18.75 2.25 12 2.25 12z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </Link>

                    <button
                      onClick={() => handleTogglePublish(project)}
                      title={project.published ? 'Unpublish' : 'Publish'}
                      className={`p-1.5 rounded-lg transition-colors text-sm ${
                        project.published
                          ? 'text-green-600 hover:bg-red-50 hover:text-red-600'
                          : 'text-gray-400 hover:bg-green-50 hover:text-green-600'
                      }`}
                    >
                      {project.published ? (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                      )}
                    </button>

                    <Link
                      to={`/admin/projects/edit/${project.id}`}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-primary hover:bg-primary/10 transition-colors"
                      title="Edit"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                      </svg>
                    </Link>

                    <button
                      onClick={() => handleDelete(project.id, project.name)}
                      disabled={deleting === project.id}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                      title="Delete"
                    >
                      {deleting === project.id ? (
                        <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <a
            href="/projects"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-primary transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
            </svg>
            View live campaigns page
          </a>
        </div>
      </main>
    </div>
  );
}
