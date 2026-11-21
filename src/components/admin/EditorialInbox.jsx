import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ACADEMY_ADMIN = '/api/site-content/admin';
const NEWS_NEW = '/admin/news/new';
const FIELD = 'w-full rounded-xl border border-gray-300 px-3 py-2.5 text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20';
const BUTTON = 'inline-flex min-h-11 items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold';
function isSourceLink(value) {
  try {
    const link = new URL(value);
    return link.protocol === 'https:' && !link.username && !link.password;
  } catch {
    return false;
  }
}

const NEW_RESOURCE = { title: '', excerpt: '', url: '', source: '', category: 'Guidance', topics: [] };

function AcademyEditor({ original, onClose, onSave }) {
  const [form, setForm] = useState(() => ({ ...NEW_RESOURCE, ...original }));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function save(published) {
    const title = String(form.title ?? '').trim();
    const excerpt = String(form.excerpt ?? '').trim();
    const url = String(form.url ?? '').trim();
    const source = String(form.source ?? '').trim();
    if (!title || !excerpt || !isSourceLink(url) || !source) {
      setError('Add a title, short description, source name and a link starting with https://.');
      return;
    }

    setError('');
    setBusy(true);
    try {
      await onSave(original, { ...form, title, excerpt, url, source, published });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={event => event.preventDefault()} aria-label="Academy resource">
      <h3 className="font-semibold text-gray-900">{original ? 'Review Academy draft' : 'New Academy resource'}</h3>
      <label className="block space-y-1 text-sm font-medium">
        <span>Title</span>
        <input className={FIELD} disabled={busy} value={form.title ?? ''} maxLength={180} onChange={e => setForm({ ...form, title: e.target.value })} />
      </label>
      <label className="block space-y-1 text-sm font-medium">
        <span>Short description</span>
        <textarea className={FIELD} disabled={busy} rows={3} value={form.excerpt ?? ''} maxLength={500} onChange={e => setForm({ ...form, excerpt: e.target.value })} />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-1 text-sm font-medium">
          <span>Source name</span>
          <input className={FIELD} disabled={busy} value={form.source ?? ''} maxLength={100} onChange={e => setForm({ ...form, source: e.target.value })} />
        </label>
        <label className="block space-y-1 text-sm font-medium">
          <span>Source link</span>
          <input className={FIELD} disabled={busy} inputMode="url" value={form.url ?? ''} maxLength={1000} onChange={e => setForm({ ...form, url: e.target.value })} />
        </label>
      </div>
      {original && isSourceLink(original.url) && (
        <a className="inline-block text-sm font-semibold text-primary underline" href={original.url} target="_blank" rel="noopener noreferrer">Open original source</a>
      )}
      <details>
        <summary className="cursor-pointer text-sm font-semibold text-primary">Topics and resource type</summary>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <fieldset>
            <legend className="mb-2 text-sm font-medium">Topics</legend>
            <div className="flex flex-wrap gap-3">
              {['Hepatitis', 'HIV', 'Mental Health'].map(topic => (
                <label key={topic} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" disabled={busy} checked={(form.topics || []).includes(topic)} onChange={event => {
                    const topics = form.topics || [];
                    setForm({ ...form, topics: event.target.checked ? [...topics, topic] : topics.filter(item => item !== topic) });
                  }} />
                  {topic}
                </label>
              ))}
            </div>
          </fieldset>
          <label className="block space-y-1 text-sm font-medium">
            <span>Resource type</span>
            <select className={FIELD} disabled={busy} value={form.category || 'Guidance'} onChange={e => setForm({ ...form, category: e.target.value })}>
              {[...new Set(['Guidance', 'Training', 'Research', 'Policy', form.category].filter(Boolean))].map(category => (
                <option key={category}>{category}</option>
              ))}
            </select>
          </label>
        </div>
      </details>
      {error && <p className="text-sm text-red-700" role="alert">{error}</p>}
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => save(true)} disabled={busy} className={`${BUTTON} bg-primary text-white disabled:opacity-50`}>Publish to Academy</button>
        <button type="button" disabled={busy} onClick={() => save(false)} className={`${BUTTON} border border-gray-300 text-gray-800 disabled:opacity-50`}>Save draft</button>
        <button type="button" disabled={busy} onClick={onClose} className={`${BUTTON} text-gray-600`}>Cancel</button>
      </div>
    </form>
  );
}

export function EditorialInbox({ articles, newsLoading, newsError, academyRefresh }) {
  const { authFetch } = useAuth();
  const [resources, setResources] = useState([]);
  const [academyState, setAcademyState] = useState('loading');
  const [editor, setEditor] = useState(null);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    let active = true;
    setAcademyState('loading');
    authFetch(ACADEMY_ADMIN)
      .then(async response => {
        if (!response.ok) throw new Error();
        const { content } = await response.json();
        if (active) {
          setResources(content.academy?.resources || []);
          setAcademyState('ready');
        }
      })
      .catch(() => { if (active) setAcademyState('error'); });
    return () => { active = false; };
  }, [authFetch, academyRefresh]);

  const drafts = [
    ...articles.filter(article => !article.published).map(article => ({ ...article, kind: 'News' })),
    ...resources.filter(resource => resource.published === false).map(resource => ({ ...resource, kind: 'Academy' })),
  ];

  async function saveResource(original, values) {
    const latest = await authFetch(ACADEMY_ADMIN);
    if (!latest.ok) throw new Error('Could not open your latest resources. Please try again.');
    const { content, revision } = await latest.json();
    const existing = content.academy?.resources || [];
    if (original && JSON.stringify(existing.find(item => item.id === original.id)) !== JSON.stringify(original)) {
      setResources(existing);
      throw new Error('This draft changed while you had it open. Close it and open it again.');
    }
    const updated = original
      ? existing.map(item => item.id === original.id ? values : item)
      : [{ ...values, id: crypto.randomUUID() }, ...existing];

    const response = await authFetch('/api/site-content', {
      method: 'PUT',
      body: JSON.stringify({ revision, content: { academy: { resources: updated } } }),
    });
    if (response.status === 409) throw new Error('Someone saved changes just now. Please try again.');
    if (!response.ok) throw new Error('Could not save this resource. Please try again.');
    const result = await response.json();
    setResources(result.content.academy.resources);
    setAcademyState('ready');
    setNotice(values.published ? 'Published to Academy.' : 'Academy draft saved.');
    setEditor(null);
  }

  return (
    <section aria-labelledby="editorial-inbox-title" className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 id="editorial-inbox-title" className="text-2xl font-bold text-gray-900">Ready to review</h1>
          <p className="mt-1 text-sm text-gray-600">News and Academy drafts stay private until you publish them.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to={NEWS_NEW} className={`${BUTTON} bg-primary text-white`}>New post</Link>
          <button type="button" onClick={() => { setNotice(''); setEditor({ original: null }); }} className={`${BUTTON} border border-gray-300 text-gray-800`}>Add Academy resource</button>
        </div>
      </div>

      {notice && <p role="status" className="mt-4 text-sm font-medium text-green-800">{notice}</p>}
      {editor?.original === null && (
        <div className="mt-4 rounded-xl border border-gray-200 p-4">
          <AcademyEditor key="new" onSave={saveResource} onClose={() => setEditor(null)} />
        </div>
      )}
      {(newsError || academyState === 'error') && (
        <p role="alert" className="mt-4 text-sm text-red-700">Some drafts couldn’t load. Refresh this page to try again.</p>
      )}
      {(newsLoading || academyState === 'loading') && <p role="status" className="mt-4 text-sm text-gray-600">Loading drafts…</p>}
      {!newsLoading && !newsError && academyState === 'ready' && drafts.length === 0 && (
        <p className="mt-4 rounded-xl bg-gray-50 p-4 text-sm text-gray-600">You’re caught up. New drafts will appear here.</p>
      )}
      {drafts.length > 0 && (
        <ul className="mt-4 divide-y divide-gray-100">
          {drafts.map(item => (
            <li key={`${item.kind}-${item.id}`} className="py-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-gray-500">{item.kind}</p>
                  <p className="break-words font-semibold text-gray-900">{item.title}</p>
                </div>
                {item.kind === 'News' ? (
                  <Link to={`/admin/news/edit/${item.id}`} className={`${BUTTON} bg-primary/10 text-primary`}>Review</Link>
                ) : (
                  <button type="button" onClick={() => { setNotice(''); setEditor({ original: resources.find(resource => resource.id === item.id) }); }} className={`${BUTTON} bg-primary/10 text-primary`}>Review</button>
                )}
              </div>
              {item.kind === 'Academy' && editor?.original?.id === item.id && (
                <div className="mt-3 rounded-xl border border-gray-200 p-4">
                  <AcademyEditor key={item.id} original={editor.original} onSave={saveResource} onClose={() => setEditor(null)} />
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
