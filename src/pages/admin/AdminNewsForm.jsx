import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const CATEGORY_SUGGESTIONS = [
  'Announcements', 'Events', 'Press Releases', 'Success Stories',
  'HIV', 'Viral Hepatitis', 'Mental Health', 'Community Health',
  'Research', 'Partnerships', 'Advocacy', 'Training',
];

const PURPOSES = {
  announcement: {
    label: 'Announcement',
    category: 'Announcements',
    opening: topic => `Tanzania Health Alliance is pleased to share an important update about ${topic}.`,
  },
  event: {
    label: 'Event update',
    category: 'Events',
    opening: topic => `Tanzania Health Alliance is bringing partners and communities together for ${topic}.`,
  },
  education: {
    label: 'Health education',
    category: 'Community Health',
    opening: topic => `${topic} matters to the health and wellbeing of people, families and communities across Tanzania.`,
  },
  success: {
    label: 'Success story',
    category: 'Success Stories',
    opening: topic => `Through partnership and community leadership, ${topic} is creating meaningful progress.`,
  },
  press: {
    label: 'Press release',
    category: 'Press Releases',
    opening: topic => `Tanzania Health Alliance today announced ${topic}.`,
  },
};

const MAX_SOURCE_BYTES = 15_000_000;
const MAX_IMAGE_EDGE = 1600;
const TARGET_IMAGE_BYTES = 1_200_000;

function formatBytes(bytes) {
  if (!bytes) return '0 KB';
  return bytes >= 1_000_000 ? `${(bytes / 1_000_000).toFixed(1)} MB` : `${Math.round(bytes / 1000)} KB`;
}

function loadImage(dataUrl) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Could not process this image.'));
    image.src = dataUrl;
  });
}

async function compressImage(file) {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    throw new Error('Please upload a JPG, PNG or WebP image.');
  }
  if (file.size > MAX_SOURCE_BYTES) {
    throw new Error('The original image must be under 15 MB.');
  }

  const source = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Could not read the image file.'));
    reader.readAsDataURL(file);
  });
  const image = await loadImage(source);
  const scale = Math.min(1, MAX_IMAGE_EDGE / Math.max(image.width, image.height));
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  canvas.getContext('2d').drawImage(image, 0, 0, width, height);

  let quality = 0.84;
  let dataUrl = canvas.toDataURL('image/webp', quality);
  while (dataUrl.length * 0.75 > TARGET_IMAGE_BYTES && quality > 0.5) {
    quality -= 0.08;
    dataUrl = canvas.toDataURL('image/webp', quality);
  }
  if (dataUrl.length > 1_900_000) {
    throw new Error('This image could not be made small enough. Please choose another image.');
  }
  return { dataUrl, width, height, outputBytes: Math.round(dataUrl.length * 0.75) };
}

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
  const [imageInfo, setImageInfo] = useState(null);
  const [processingImage, setProcessingImage] = useState(false);
  const [assistant, setAssistant] = useState({ topic: '', purpose: 'announcement', facts: '' });

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

  async function handleImageFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setProcessingImage(true);
    try {
      const compressed = await compressImage(file);
      setForm(prev => ({ ...prev, image: compressed.dataUrl }));
      setImageInfo({
        original: file.size,
        compressed: compressed.outputBytes,
        dimensions: `${compressed.width} × ${compressed.height}`,
      });
      setErrors(prev => ({ ...prev, image: '' }));
    } catch (err) {
      setErrors(prev => ({ ...prev, image: err.message }));
    } finally {
      setProcessingImage(false);
    }
  }

  function generateDraft() {
    const topic = assistant.topic.trim();
    if (!topic) {
      setErrors(prev => ({ ...prev, assistant: 'Add a topic before creating a draft.' }));
      return;
    }
    const purpose = PURPOSES[assistant.purpose];
    const facts = assistant.facts
      .split('\n')
      .map(item => item.replace(/^[-•]\s*/, '').trim())
      .filter(Boolean);
    const title = topic.length > 90 ? topic.slice(0, 87) + '…' : topic;
    const opening = purpose.opening(topic);
    const factParagraph = facts.length
      ? `\n\nKey information\n${facts.map(item => `• ${item}`).join('\n')}`
      : '';
    const content = `${opening}${factParagraph}\n\nWhy this matters\nThis work supports healthier, informed and resilient communities. It reflects our commitment to practical action, trusted information and partnerships that improve health outcomes.\n\nWhat happens next\nTanzania Health Alliance will continue to share verified updates and opportunities for communities and partners to take part. For further information, contact our team through the website.`;
    const excerpt = `${opening} Read the key information, why it matters and what happens next.`.slice(0, 500);
    const topicTags = topic.split(/[^A-Za-z0-9]+/).filter(word => word.length > 4).slice(0, 4);

    setForm(prev => ({
      ...prev,
      title: prev.title || title,
      excerpt: prev.excerpt || excerpt,
      content: prev.content || content,
      category: prev.category === 'Events' ? purpose.category : prev.category,
      tags: prev.tags || topicTags.join(', '),
      author: prev.author || 'THA Communications',
    }));
    setErrors(prev => ({ ...prev, assistant: '' }));
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
  async function handleSubmit(e, publishOverride) {
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
        published: typeof publishOverride === 'boolean' ? publishOverride : form.published,
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

      navigate('/admin', { replace: true, state: { saved: true, published: payload.published } });
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

          {/* Guided drafting assistant */}
          <section className="bg-gradient-to-br from-primary to-primary-dark text-white rounded-2xl p-5 md:p-6 shadow-lg">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-white/70">Draft assistant</p>
                <h2 className="text-xl font-bold mt-1">Turn a topic into a structured first draft</h2>
                <p className="text-sm text-white/80 mt-1">Add the facts you know. The assistant creates an editable draft; review it before publishing.</p>
              </div>
              <span className="self-start px-3 py-1 rounded-full bg-white/15 text-xs font-semibold">No extra account required</span>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5">Topic</label>
                <input
                  value={assistant.topic}
                  onChange={e => setAssistant(prev => ({ ...prev, topic: e.target.value }))}
                  placeholder="Example: World Hepatitis Day outreach in Dodoma"
                  className="w-full rounded-xl px-4 py-2.5 text-gray-900 border-0 focus:ring-2 focus:ring-accent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">Type of story</label>
                <select
                  value={assistant.purpose}
                  onChange={e => setAssistant(prev => ({ ...prev, purpose: e.target.value }))}
                  className="w-full rounded-xl px-4 py-2.5 text-gray-900 border-0 focus:ring-2 focus:ring-accent"
                >
                  {Object.entries(PURPOSES).map(([value, item]) => <option key={value} value={value}>{item.label}</option>)}
                </select>
              </div>
            </div>
            <label className="block text-sm font-semibold mt-4 mb-1.5">Key facts (one per line)</label>
            <textarea
              value={assistant.facts}
              onChange={e => setAssistant(prev => ({ ...prev, facts: e.target.value }))}
              rows={3}
              placeholder={"Date and location\nWho participated\nResult or next step"}
              className="w-full rounded-xl px-4 py-2.5 text-gray-900 border-0 focus:ring-2 focus:ring-accent"
            />
            {errors.assistant && <p className="text-yellow-200 text-xs mt-2">{errors.assistant}</p>}
            <button
              type="button"
              onClick={generateDraft}
              className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-white font-bold rounded-xl hover:brightness-95 transition"
            >
              Create editable draft
            </button>
          </section>

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
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageFileChange}
                disabled={processingImage}
                className="block w-full text-sm text-gray-600 file:mr-4 file:rounded-lg file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-primary-dark disabled:opacity-60"
              />
            )}
            <p className="text-xs text-gray-500 mt-2">
              {processingImage ? 'Optimizing image…' : 'JPG, PNG and WebP up to 15 MB. Large images are resized to 1600 px and compressed automatically.'}
            </p>
            {imageInfo && (
              <div className="mt-2 inline-flex flex-wrap gap-x-3 gap-y-1 rounded-lg bg-green-50 px-3 py-2 text-xs font-semibold text-green-700">
                <span>{formatBytes(imageInfo.original)} → {formatBytes(imageInfo.compressed)}</span>
                <span>{imageInfo.dimensions}</span>
              </div>
            )}
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
              <input
                type="text"
                name="category"
                value={form.category}
                onChange={handleChange}
                list="news-category-suggestions"
                maxLength={80}
                placeholder="Choose or type a category"
                className={inputCls(errors.category)}
              />
              <datalist id="news-category-suggestions">
                {CATEGORY_SUGGESTIONS.map(category => <option key={category} value={category} />)}
              </datalist>
              <p className="text-xs text-gray-400 mt-1">Choose a suggestion or type a new category.</p>
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
            <Link
              to="/admin"
              className="px-5 py-2.5 text-center text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <div className="flex flex-col-reverse sm:flex-row gap-3">
              <button
                type="button"
                disabled={saving}
                onClick={event => handleSubmit(event, false)}
                className="px-5 py-2.5 bg-white border border-primary text-primary font-semibold text-sm rounded-xl hover:bg-primary/5 transition disabled:opacity-60"
              >
                Save as draft
              </button>
              <button
                type="submit"
                disabled={saving || processingImage}
                onClick={() => setForm(prev => ({ ...prev, published: true }))}
                className="inline-flex justify-center items-center gap-2 px-6 py-2.5 bg-primary text-white font-bold text-sm rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving…
                  </>
                ) : 'Publish now'}
              </button>
            </div>
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
