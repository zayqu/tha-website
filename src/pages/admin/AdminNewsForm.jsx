import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const CATEGORIES = ['Events', 'Press Releases', 'Success Stories', 'Announcements'];

const EMPTY_FORM = {
  title: '',
  excerpt: '',
  content: '',
  image: '',
  category: 'Events',
  author: '',
  date: new Date().toISOString().split('T')[0],
  tags: '',
  is_featured: false,
  published: true,
};

const MAX_UPLOAD_BYTES = 1_500_000;

export default function AdminNewsForm() {
  const { id } = useParams();          // present only when editing
  const isEditing = Boolean(id);
  const { authFetch } = useAuth();
  const navigate = useNavigate();

  const [form, setForm]       = useState(EMPTY_FORM);
  const [errors, setErrors]   = useState({});
  const [saving, setSaving]   = useState(false);
  const [loadError, setLoadError] = useState('');
  const [imageMode, setImageMode] = useState('url');

  // ── Load existing article when editing ────────────────────────────────────
  useEffect(() => {
    if (!isEditing) return;
    authFetch(`/api/news/admin`)
      .then(r => r.json())
      .then(data => {
        const article = data.articles?.find(a => a.id === id);
        if (!article) { setLoadError('Article not found.'); return; }
        setForm({
          title:       article.title,
          excerpt:     article.excerpt,
          content:     article.content,
          image:       article.image,
          category:    article.category,
          author:      article.author,
          date:        article.date?.split('T')[0] || article.date,
          tags:        Array.isArray(article.tags) ? article.tags.join(', ') : '',
          is_featured: Boolean(article.is_featured),
          published:   Boolean(article.published),
        });
        setImageMode(article.image?.startsWith('data:') ? 'upload' : 'url');
      })
      .catch(() => setLoadError('Failed to load article.'));
  }, [id, isEditing, authFetch]);

  // ── Field change handler ──────────────────────────────────────────────────
  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  }

  function handleImageModeChange(mode) {
    setImageMode(mode);
    if (mode === 'url' && form.image?.startsWith('data:')) {
      setForm(prev => ({ ...prev, image: '' }));
    }
    setErrors(prev => ({ ...prev, image: '' }));
  }

  function handleImageFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, image: 'Please upload an image file.' }));
      return;
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      setErrors(prev => ({ ...prev, image: 'Image upload must be under 1.5 MB. Use an image URL for larger files.' }));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setForm(prev => ({ ...prev, image: reader.result }));
      setErrors(prev => ({ ...prev, image: '' }));
    };
    reader.onerror = () => setErrors(prev => ({ ...prev, image: 'Could not read the image file.' }));
    reader.readAsDataURL(file);
  }

  // ── Client-side validation ────────────────────────────────────────────────
  function validate() {
    const e = {};
    if (!form.title.trim())   e.title   = 'Title is required.';
    if (!form.excerpt.trim()) e.excerpt = 'Excerpt is required.';
    if (!form.content.trim()) e.content = 'Content is required.';
    if (!form.image.trim())   e.image   = 'Image URL is required.';
    if (!form.author.trim())  e.author  = 'Author is required.';
    if (!form.date)           e.date    = 'Date is required.';
    if (form.excerpt.length > 500) e.excerpt = 'Excerpt must be ≤ 500 characters.';
    return e;
  }

  // ── Submit ────────────────────────────────────────────────────────────────
  async function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...form,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      };

      const res = await authFetch(
        isEditing ? `/api/news/${id}` : '/api/news',
        { method: isEditing ? 'PUT' : 'POST', body: JSON.stringify(payload) }
      );

      if (!res.ok) {
        const data = await res.json();
        const serverMsg = data.errors?.[0]?.msg || data.error || 'Save failed.';
        throw new Error(serverMsg);
      }

      navigate('/admin', { replace: true, state: { saved: true } });
    } catch (err) {
      setErrors({ _global: err.message });
    } finally {
      setSaving(false);
    }
  }

  if (loadError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{loadError}</p>
          <Link to="/admin" className="text-primary hover:underline">← Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center gap-4">
          <Link to="/admin" className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
            </svg>
          </Link>
          <h1 className="font-bold text-gray-800">{isEditing ? 'Edit Article' : 'New Article'}</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} noValidate className="space-y-6">

          {/* Global error */}
          {errors._global && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
              {errors._global}
            </div>
          )}

          {/* Title */}
          <Field label="Title *" error={errors.title}>
            <input
              type="text" name="title" value={form.title} onChange={handleChange}
              placeholder="Article title"
              className={inputCls(errors.title)}
            />
          </Field>

          {/* Excerpt */}
          <Field label={`Excerpt * (${form.excerpt.length}/500)`} error={errors.excerpt}>
            <textarea
              name="excerpt" value={form.excerpt} onChange={handleChange} rows={3}
              placeholder="A short summary that appears in the news list…"
              className={inputCls(errors.excerpt)}
            />
          </Field>

          {/* Content */}
          <Field label="Full Article Content *" error={errors.content}>
            <textarea
              name="content" value={form.content} onChange={handleChange} rows={14}
              placeholder="Write the full article. Separate paragraphs with a blank line."
              className={`font-mono text-sm ${inputCls(errors.content)}`}
            />
            <p className="text-xs text-gray-400 mt-1">Separate paragraphs with a blank line (double Enter).</p>
          </Field>

          {/* Image */}
          <Field label="Article Image *" error={errors.image}>
            <div className="flex flex-wrap gap-2 mb-3">
              <button
                type="button"
                onClick={() => handleImageModeChange('url')}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition-colors ${
                  imageMode === 'url' ? 'bg-primary text-white border-primary' : 'bg-white text-gray-600 border-gray-200'
                }`}
              >
                Add Image URL
              </button>
              <button
                type="button"
                onClick={() => handleImageModeChange('upload')}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition-colors ${
                  imageMode === 'upload' ? 'bg-primary text-white border-primary' : 'bg-white text-gray-600 border-gray-200'
                }`}
              >
                Upload Image
              </button>
            </div>

            {imageMode === 'url' ? (
              <input
                type="url" name="image" value={form.image?.startsWith('data:') ? '' : form.image} onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className={inputCls(errors.image)}
              />
            ) : (
              <input
                type="file"
                accept="image/*"
                onChange={handleImageFileChange}
                className="block w-full text-sm text-gray-600 file:mr-4 file:rounded-lg file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-primary-dark"
              />
            )}
            <p className="text-xs text-gray-400 mt-1">
              Upload small images under 1.5 MB, or paste a hosted image URL for larger photos.
            </p>
            {form.image && (
              <div className="mt-2 rounded-lg overflow-hidden w-full h-40 bg-gray-100">
                <img
                  src={form.image} alt="Preview"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                  onError={e => { e.target.style.display = 'none'; }}
                />
              </div>
            )}
          </Field>

          {/* News-format preview */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {form.image && (
              <div className="h-56 bg-gray-100">
                <img src={form.image} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" />
              </div>
            )}
            <div className="p-5">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="px-3 py-1 bg-accent text-white text-xs font-bold rounded-full">
                  {form.category}
                </span>
                {form.is_featured && (
                  <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">Featured</span>
                )}
              </div>
              <h2 className="text-2xl font-bold text-primary mb-3">{form.title || 'Article title preview'}</h2>
              <p className="text-gray-600 mb-4">{form.excerpt || 'The excerpt preview will appear here.'}</p>
              <div className="text-sm text-gray-400">{form.author || 'Author'} · {form.date || 'Date'}</div>
            </div>
          </div>

          {/* Category + Author */}
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Category *" error={errors.category}>
              <select name="category" value={form.category} onChange={handleChange} className={inputCls(errors.category)}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Author *" error={errors.author}>
              <input
                type="text" name="author" value={form.author} onChange={handleChange}
                placeholder="THA Communications"
                className={inputCls(errors.author)}
              />
            </Field>
          </div>

          {/* Date + Tags */}
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Date *" error={errors.date}>
              <input
                type="date" name="date" value={form.date} onChange={handleChange}
                className={inputCls(errors.date)}
              />
            </Field>
            <Field label="Tags (comma-separated)" error={errors.tags}>
              <input
                type="text" name="tags" value={form.tags} onChange={handleChange}
                placeholder="Hepatitis, Vaccination, Youth"
                className={inputCls(errors.tags)}
              />
            </Field>
          </div>

          {/* Toggles */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col sm:flex-row gap-5">
            <Toggle
              name="is_featured"
              checked={form.is_featured}
              onChange={handleChange}
              label="Featured Article"
              description="Show prominently at the top of the news page"
            />
            <Toggle
              name="published"
              checked={form.published}
              onChange={handleChange}
              label="Published"
              description="Visible to website visitors immediately"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            <Link
              to="/admin"
              className="px-5 py-2.5 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white font-semibold text-sm rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-60"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving…
                </>
              ) : isEditing ? 'Save Changes' : 'Create Article'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────
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
