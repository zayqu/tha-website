import { useCallback, useEffect, useState } from 'react';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { Icon } from '../../components/Icon';
import { useAuth } from '../../contexts/AuthContext';

const EMPTY_FORM = {
  month: '',
  milestone: '',
  description: '',
  icon: 'flag',
  color: 'primary',
  sortOrder: 0,
  published: true,
};

const ICONS = [
  ['flag', 'Milestone'],
  ['rocket_launch', 'Launch'],
  ['handshake', 'Partnership'],
  ['emoji_events', 'Achievement'],
  ['public', 'Recognition'],
  ['account_balance', 'Government'],
  ['groups', 'Community'],
  ['favorite', 'Health'],
];

const COLOR_OPTIONS = [
  ['primary', 'Blue'],
  ['secondary', 'Green'],
  ['accent', 'Orange'],
];

export default function AdminJourneyDashboard() {
  const { authFetch } = useAuth();
  const [milestones, setMilestones] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadMilestones = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await authFetch('/api/journey/admin');
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not load the Journey.');
      setMilestones(data.milestones || []);
      setForm(current => editingId ? current : ({ ...EMPTY_FORM, sortOrder: (data.milestones || []).length }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [authFetch, editingId]);

  useEffect(() => { loadMilestones(); }, [loadMilestones]);

  function updateField(event) {
    const { name, type, checked, value } = event.target;
    setForm(current => ({
      ...current,
      [name]: type === 'checkbox' ? checked : (name === 'sortOrder' ? Number(value) : value),
    }));
  }

  function startEdit(item) {
    setEditingId(item.id);
    setForm({
      month: item.month,
      milestone: item.milestone,
      description: item.description,
      icon: item.icon || 'flag',
      color: item.color || 'primary',
      sortOrder: item.sortOrder || 0,
      published: Boolean(item.published),
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function resetForm() {
    setEditingId(null);
    setForm({ ...EMPTY_FORM, sortOrder: milestones.length });
    setError('');
  }

  async function saveMilestone(event) {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      const response = await authFetch(editingId ? `/api/journey/${editingId}` : '/api/journey', {
        method: editingId ? 'PUT' : 'POST',
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not save the milestone.');
      setEditingId(null);
      setForm(EMPTY_FORM);
      await loadMilestones();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function togglePublished(item) {
    try {
      const response = await authFetch(`/api/journey/${item.id}`, {
        method: 'PUT',
        body: JSON.stringify({ ...item, published: !item.published }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not update visibility.');
      setMilestones(current => current.map(entry => entry.id === item.id ? data.milestone : entry));
    } catch (err) {
      setError(err.message);
    }
  }

  async function deleteMilestone(item) {
    if (!window.confirm(`Delete “${item.milestone}”? This cannot be undone.`)) return;
    try {
      const response = await authFetch(`/api/journey/${item.id}`, { method: 'DELETE' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not delete the milestone.');
      setMilestones(current => current.filter(entry => entry.id !== item.id));
      if (editingId === item.id) resetForm();
    } catch (err) {
      setError(err.message);
    }
  }

  const inputClass = 'w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-transparent focus:ring-2 focus:ring-primary';

  return (
    <div className="min-h-screen bg-cool-gray">
      <AdminHeader section="Journey" />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-7">
          <h1 className="text-3xl font-bold text-primary">Milestones</h1>
          <p className="mt-2 max-w-3xl text-gray-600">Add, edit, publish, order, or remove timeline entries. Published changes appear on Home and Impact.</p>
        </div>

        {error ? <div role="alert" className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

        <div className="grid gap-8 lg:grid-cols-[minmax(0,420px)_1fr]">
          <form onSubmit={saveMilestone} className="h-fit space-y-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-card lg:sticky lg:top-24">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-bold text-primary">{editingId ? 'Edit milestone' : 'Add milestone'}</h2>
              {editingId ? <button type="button" onClick={resetForm} className="text-sm font-semibold text-gray-500 hover:text-primary">Cancel</button> : null}
            </div>

            <label className="block text-sm font-semibold text-gray-700">
              Date or period
              <input name="month" value={form.month} onChange={updateField} required minLength={2} maxLength={80} placeholder="Example: March 2026" className={`${inputClass} mt-1.5`} />
            </label>

            <label className="block text-sm font-semibold text-gray-700">
              Milestone title
              <input name="milestone" value={form.milestone} onChange={updateField} required minLength={3} maxLength={160} placeholder="Example: National partnership signed" className={`${inputClass} mt-1.5`} />
            </label>

            <label className="block text-sm font-semibold text-gray-700">
              Description
              <textarea name="description" value={form.description} onChange={updateField} required minLength={3} maxLength={1200} rows={4} placeholder="Explain what happened and why it matters." className={`${inputClass} mt-1.5 resize-y`} />
            </label>

            <div className="grid grid-cols-2 gap-4">
              <label className="block text-sm font-semibold text-gray-700">
                Icon
                <select name="icon" value={form.icon} onChange={updateField} className={`${inputClass} mt-1.5`}>
                  {ICONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
              </label>
              <label className="block text-sm font-semibold text-gray-700">
                Brand color
                <select name="color" value={form.color} onChange={updateField} className={`${inputClass} mt-1.5`}>
                  {COLOR_OPTIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
              </label>
            </div>

            <label className="block text-sm font-semibold text-gray-700">
              Display order
              <input type="number" name="sortOrder" min="0" max="9999" value={form.sortOrder} onChange={updateField} className={`${inputClass} mt-1.5`} />
              <span className="mt-1 block text-xs font-normal text-gray-500">Lower numbers appear first.</span>
            </label>

            <label className="flex items-center justify-between gap-4 rounded-xl bg-primary/5 px-4 py-3">
              <span><span className="block text-sm font-bold text-primary">Published</span><span className="text-xs text-gray-500">Show this milestone on the public website.</span></span>
              <input type="checkbox" name="published" checked={form.published} onChange={updateField} className="h-5 w-5 accent-[#26B805]" />
            </label>

            <button type="submit" disabled={saving} className="w-full rounded-xl bg-secondary px-5 py-3 font-bold text-white transition hover:bg-secondary-dark disabled:opacity-60">
              {saving ? 'Saving…' : editingId ? 'Update milestone' : 'Add milestone'}
            </button>
          </form>

          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-primary">Timeline entries</h2>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">{milestones.length} total</span>
            </div>

            {loading ? (
              <div className="flex justify-center rounded-2xl bg-white py-20"><div className="h-9 w-9 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>
            ) : milestones.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center text-gray-500">No milestones yet. Add the first one using the form.</div>
            ) : (
              <ol className="space-y-3">
                {milestones.map(item => (
                  <li key={item.id} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                    <div className="flex items-start gap-4">
                      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white ${item.color === 'secondary' ? 'bg-secondary' : item.color === 'accent' ? 'bg-accent' : 'bg-primary'}`}>
                        <Icon name={item.icon || 'flag'} size={21} color="white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-xs font-bold uppercase tracking-wider text-accent">{item.month}</p>
                          <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${item.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{item.published ? 'Published' : 'Draft'}</span>
                          <span className="rounded-full bg-primary/5 px-2 py-0.5 text-xs text-primary">Order {item.sortOrder}</span>
                        </div>
                        <h3 className="mt-1 font-bold text-primary">{item.milestone}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-gray-600">{item.description}</p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          <button type="button" onClick={() => startEdit(item)} className="rounded-lg bg-primary/10 px-3 py-2 text-xs font-bold text-primary hover:bg-primary hover:text-white">Edit</button>
                          <button type="button" onClick={() => togglePublished(item)} className="rounded-lg bg-secondary/10 px-3 py-2 text-xs font-bold text-secondary-dark hover:bg-secondary hover:text-white">{item.published ? 'Move to draft' : 'Publish'}</button>
                          <button type="button" onClick={() => deleteMilestone(item)} className="rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-600 hover:text-white">Delete</button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
