import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const STATUSES = ['active', 'planned', 'completed', 'archived'];

const EMPTY_FORM = {
  name: '',
  category: 'Community Health',
  status: 'active',
  published: false,
  description: '',
  metrics: [], // [{ key: 'peopleReached', value: '0' }]
};

export default function AdminProjectForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const { authFetch } = useAuth();

  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEditing) return;
    let isMounted = true;
    authFetch('/api/projects/admin')
      .then(res => res.json())
      .then(data => {
        if (!isMounted) return;
        const project = (data.projects || []).find(p => p.id === id);
        if (!project) {
          setErrors({ _global: 'Campaign not found.' });
          return;
        }
        setForm({
          name: project.name || '',
          category: project.category || 'Community Health',
          status: project.status || 'active',
          published: Boolean(project.published),
          description: project.description || '',
          metrics: Object.entries(project.metrics || {}).map(([key, value]) => ({ key, value: String(value) })),
        });
      })
      .catch(() => setErrors({ _global: 'Failed to load project.' }))
      .finally(() => { if (isMounted) setLoading(false); });
    return () => { isMounted = false; };
  }, [id, isEditing, authFetch]);

  function handleChange(e) {
    const { name, type, checked, value } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  }

  function updateMetric(index, field, value) {
    setForm(prev => ({
      ...prev,
      metrics: prev.metrics.map((m, i) => i === index ? { ...m, [field]: value } : m),
    }));
  }

  function addMetric() {
    setForm(prev => ({ ...prev, metrics: [...prev.metrics, { key: '', value: '0' }] }));
  }

  function removeMetric(index) {
    setForm(prev => ({ ...prev, metrics: prev.metrics.filter((_, i) => i !== index) }));
  }

  function validate() {
    const next = {};
    if (form.name.trim().length < 3) next.name = 'Name must be at least 3 characters.';
    for (const m of form.metrics) {
      if (m.key.trim() && !Number.isFinite(Number(m.value))) {
        next.metrics = 'Metric values must be numbers.';
      }
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    const metrics = {};
    for (const m of form.metrics) {
      if (m.key.trim()) metrics[m.key.trim()] = Number(m.value) || 0;
    }

    const payload = {
      name: form.name.trim(),
      category: form.category.trim(),
      status: form.status,
      published: form.published,
      description: form.description,
      metrics,
    };

    setSaving(true);
    try {
      const res = await authFetch(isEditing ? `/api/projects/${id}` : '/api/projects', {
        method: isEditing ? 'PUT' : 'POST',
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Save failed');
      navigate('/admin/projects');
    } catch (err) {
      setErrors({ _global: err.message });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center gap-4">
          <Link to="/admin/projects" className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
            </svg>
          </Link>
          <h1 className="font-bold text-gray-800">{isEditing ? 'Edit Campaign' : 'New Campaign'}</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} noValidate className="space-y-6">

          {errors._global && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
              {errors._global}
            </div>
          )}

          <Field label="Campaign Name *" error={errors.name}>
            <input
              type="text" name="name" value={form.name} onChange={handleChange}
              placeholder="e.g. KAPIME: Get Tested"
              className={inputCls(errors.name)}
            />
          </Field>

          <div className="grid sm:grid-cols-2 gap-6">
            <Field label="Category">
              <input
                type="text" name="category" value={form.category} onChange={handleChange}
                placeholder="e.g. Community Health"
                className={inputCls()}
              />
            </Field>
            <Field label="Status">
              <select name="status" value={form.status} onChange={handleChange} className={inputCls()}>
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
          </div>

          <Field label="Description">
            <textarea
              name="description" value={form.description} onChange={handleChange} rows={4}
              placeholder="Short description shown on the public project page…"
              className={inputCls()}
            />
          </Field>

          <Toggle
            name="published"
            checked={form.published}
            onChange={handleChange}
            label="Published"
            description="Visible on the public Campaigns and Impact pages."
          />

          {/* Metrics — these are what power the site-wide impact counters */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="mb-4">
              <h2 className="font-semibold text-gray-800">Impact metrics</h2>
              <p className="text-sm text-gray-500 mt-1">
                Numbers here are summed across every published project to drive the homepage and Impact-page counters
                (e.g. <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">peopleReached</code>,{' '}
                <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">studentsReached</code>,{' '}
                <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">institutionsEngaged</code>,{' '}
                <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">communityEvents</code>). Use the same metric
                name across projects so totals add up correctly.
              </p>
            </div>

            {errors.metrics && <p className="text-red-500 text-xs mb-3">{errors.metrics}</p>}

            <div className="space-y-3">
              {form.metrics.map((metric, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={metric.key}
                    onChange={e => updateMetric(i, 'key', e.target.value)}
                    placeholder="metric name, e.g. peopleReached"
                    className={`${inputCls()} flex-1`}
                  />
                  <input
                    type="number"
                    value={metric.value}
                    onChange={e => updateMetric(i, 'value', e.target.value)}
                    placeholder="0"
                    className={`${inputCls()} w-32`}
                  />
                  <button
                    type="button"
                    onClick={() => removeMetric(i)}
                    className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors flex-shrink-0"
                    title="Remove metric"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addMetric}
              className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-dark transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
              </svg>
              Add metric
            </button>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 sm:flex-none px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-60"
            >
              {saving ? 'Saving…' : isEditing ? 'Save changes' : 'Create project'}
            </button>
            <Link
              to="/admin/projects"
              className="px-6 py-3 border border-gray-300 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

function inputCls(error) {
  return `w-full border rounded-xl px-4 py-2.5 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition ${
    error ? 'border-red-300 bg-red-50' : 'border-gray-300'
  }`;
}

function Toggle({ name, checked, onChange, label, description }) {
  function handleClick() {
    onChange({ target: { name, type: 'checkbox', checked: !checked } });
  }
  return (
    <div className="flex items-start gap-3 cursor-pointer" onClick={handleClick} role="switch" aria-checked={checked} tabIndex={0} onKeyDown={e => e.key === ' ' && handleClick()}>
      <div className="relative mt-0.5 flex-shrink-0">
        <div className={`w-11 h-6 rounded-full transition-colors ${checked ? 'bg-primary' : 'bg-gray-200'}`}>
          <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform absolute top-0.5 ${checked ? 'left-5' : 'left-0.5'}`} />
        </div>
      </div>
      <div>
        <div className="text-sm font-semibold text-gray-700">{label}</div>
        <div className="text-xs text-gray-400">{description}</div>
      </div>
    </div>
  );
}
