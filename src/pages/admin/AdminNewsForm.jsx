import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { AdminHeader } from '../../components/admin/AdminHeader';

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
  author: 'THA Communications',
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
  const [imageInfo, setImageInfo] = useState(null);
  const [processingImage, setProcessingImage] = useState(false);
  const [assistant, setAssistant] = useState({ topic: '', purpose: 'announcement', facts: '' });
  const [generatingDraft, setGeneratingDraft] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState(CATEGORY_SUGGESTIONS);

  // ── Load categories and the current article ───────────────────────────────
  useEffect(() => {
    authFetch('/api/news/admin')
      .then(r => r.json())
      .then(data => {
        const articles = data.articles || [];
        const existingCategories = articles
          .map(article => article.category?.trim())
          .filter(Boolean);
        setCategoryOptions(
          [...new Set([...CATEGORY_SUGGESTIONS, ...existingCategories])]
            .sort((a, b) => a.localeCompare(b))
        );

        if (!isEditing) return;
        const article = articles.find(item => item.id === id);
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
      })
      .catch(() => {
        if (isEditing) setLoadError('Failed to load article.');
      });
  }, [id, isEditing, authFetch]);

  // ── Field change handler ──────────────────────────────────────────────────
  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
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

  async function generateDraft() {
    const suppliedTopic = assistant.topic.trim();
    const hasImage = Boolean(form.image);
    if (!suppliedTopic && !hasImage) {
      setErrors(prev => ({ ...prev, assistant: 'Add a topic or upload an image before generating the article.' }));
      return;
    }

    setGeneratingDraft(true);
    setErrors(prev => ({ ...prev, assistant: '' }));
    try {
      const purpose = PURPOSES[assistant.purpose];
      const res = await authFetch('/api/news/generate', {
        method: 'POST',
        body: JSON.stringify({
          topic: suppliedTopic || 'Create a factual THA news article based only on the supplied image',
          purpose: purpose.label,
          facts: assistant.facts,
          image: form.image || null,
          categories: categoryOptions,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.draft) {
        throw new Error(data.error || 'Could not generate the article. Please try again.');
      }

      const draft = data.draft;
      setForm(prev => ({
        ...prev,
        title: draft.title,
        excerpt: draft.excerpt,
        content: draft.content,
        category: draft.category || prev.category,
        tags: Array.isArray(draft.tags) ? draft.tags.join(', ') : prev.tags,
        author: prev.author || 'THA Communications',
      }));
      if (draft.category) {
        setCategoryOptions(options =>
          [...new Set([...options, draft.category])].sort((a, b) => a.localeCompare(b))
        );
      }
    } catch (err) {
      setErrors(prev => ({ ...prev, assistant: err.message }));
    } finally {
      setGeneratingDraft(false);
    }
  }

  // ── Client-side validation ────────────────────────────────────────────────
  function validate() {
    const e = {};
    if (!form.title.trim())   e.title   = 'Title is required.';
    if (!form.excerpt.trim()) e.excerpt = 'Excerpt is required.';
    if (!form.content.trim()) e.content = 'Content is required.';
    if (!form.image.trim())   e.image   = 'Image URL is required.';
    if (!form.category.trim()) e.category = 'Category is required.';
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

      <AdminHeader section={isEditing ? 'Edit Article' : 'New Article'} backTo="/admin" />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={event => handleSubmit(event, true)} noValidate className="space-y-6">

          {/* Global error */}
          {errors._global && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
              {errors._global}
            </div>
          )}

          {/* Simple posting flow */}
          <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 py-5 md:px-6 border-b border-gray-100">
              <p className="text-xs font-bold uppercase tracking-widest text-primary/70">Step 1</p>
              <h2 className="text-xl font-bold text-primary mt-1">Tell us what happened</h2>
              <p className="text-sm text-gray-500 mt-1">
                Write a short note in your own words. The assistant will prepare the headline, summary, article, category and tags for you.
              </p>
            </div>

            <div className="p-5 md:p-6 space-y-5">
              <div className="grid md:grid-cols-[1fr_220px] gap-4">
                <Field label="Story details" error={errors.assistant}>
                  <textarea
                    value={assistant.topic}
                    onChange={e => {
                      setAssistant(prev => ({ ...prev, topic: e.target.value }));
                      if (errors.assistant) setErrors(prev => ({ ...prev, assistant: '' }));
                    }}
                    rows={5}
                    placeholder={"Example: On 3 October, THA held a hepatitis awareness session in Dodoma with health workers and students. About 80 people attended and the session focused on testing and vaccination."}
                    className={inputCls(errors.assistant)}
                  />
                </Field>

                <Field label="Type of post">
                  <select
                    value={assistant.purpose}
                    onChange={e => setAssistant(prev => ({ ...prev, purpose: e.target.value }))}
                    className={inputCls()}
                  >
                    {Object.entries(PURPOSES).map(([value, item]) => (
                      <option key={value} value={value}>{item.label}</option>
                    ))}
                  </select>
                </Field>
              </div>

              <Field label="Main image *" error={errors.image}>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageFileChange}
                  disabled={processingImage}
                  className="block w-full text-sm text-gray-600 file:mr-4 file:rounded-lg file:border-0 file:bg-primary file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-white hover:file:bg-primary-dark disabled:opacity-60"
                />
                <p className="text-xs text-gray-500 mt-2">
                  {processingImage ? 'Preparing image…' : 'Upload JPG, PNG or WebP. Large images are resized and compressed automatically.'}
                </p>
                {imageInfo && (
                  <div className="mt-2 inline-flex flex-wrap gap-x-3 gap-y-1 rounded-lg bg-green-50 px-3 py-2 text-xs font-semibold text-green-700">
                    <span>{formatBytes(imageInfo.original)} → {formatBytes(imageInfo.compressed)}</span>
                    <span>{imageInfo.dimensions}</span>
                  </div>
                )}
                {form.image && (
                  <div className="mt-3 rounded-xl overflow-hidden w-full h-48 bg-gray-100">
                    <img
                      src={form.image}
                      alt="Article preview"
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                      onError={e => { e.target.style.display = 'none'; }}
                    />
                  </div>
                )}
              </Field>

              <button
                type="button"
                onClick={generateDraft}
                disabled={generatingDraft || processingImage}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition disabled:opacity-60 disabled:cursor-wait"
              >
                {generatingDraft ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                    Preparing article…
                  </>
                ) : (form.title || form.content ? 'Regenerate article' : 'Prepare article')}
              </button>
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 py-5 md:px-6 border-b border-gray-100">
              <p className="text-xs font-bold uppercase tracking-widest text-primary/70">Step 2</p>
              <h2 className="text-xl font-bold text-primary mt-1">Review the article</h2>
              <p className="text-sm text-gray-500 mt-1">
                Check the wording before publishing. You can edit anything the assistant prepared.
              </p>
            </div>

            <div className="p-5 md:p-6 space-y-5">
              <Field label="Headline *" error={errors.title}>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Article headline"
                  className={inputCls(errors.title)}
                />
              </Field>

              <Field label="Short summary *" error={errors.excerpt}>
                <textarea
                  name="excerpt"
                  value={form.excerpt}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Short summary for the news page"
                  className={inputCls(errors.excerpt)}
                />
                <p className="text-xs text-gray-400 mt-1">{form.excerpt.length}/500 characters</p>
              </Field>

              <Field label="Article *" error={errors.content}>
                <textarea
                  name="content"
                  value={form.content}
                  onChange={handleChange}
                  rows={12}
                  placeholder="The full article will appear here."
                  className={inputCls(errors.content)}
                />
              </Field>
            </div>
          </section>

          <details className="bg-white rounded-2xl border border-gray-200 shadow-sm group">
            <summary className="cursor-pointer list-none px-5 py-4 md:px-6 flex items-center justify-between gap-4">
              <div>
                <div className="font-bold text-gray-800">More settings</div>
                <div className="text-xs text-gray-500 mt-0.5">Category, author, date, tags, image URL and featured status</div>
              </div>
              <span className="text-primary text-xl leading-none group-open:rotate-45 transition-transform">+</span>
            </summary>

            <div className="px-5 pb-5 md:px-6 md:pb-6 border-t border-gray-100 pt-5 space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Category *" error={errors.category}>
                  <select
                    name="category"
                    value={categoryOptions.includes(form.category) ? form.category : ''}
                    onChange={handleChange}
                    className={inputCls(errors.category)}
                  >
                    <option value="" disabled>Choose a category</option>
                    {categoryOptions.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </Field>

                <Field label="Author *" error={errors.author}>
                  <input
                    type="text"
                    name="author"
                    value={form.author}
                    onChange={handleChange}
                    className={inputCls(errors.author)}
                  />
                </Field>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Date *" error={errors.date}>
                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    className={inputCls(errors.date)}
                  />
                </Field>

                <Field label="Tags">
                  <input
                    type="text"
                    name="tags"
                    value={form.tags}
                    onChange={handleChange}
                    placeholder="Hepatitis, Vaccination, Youth"
                    className={inputCls(errors.tags)}
                  />
                </Field>
              </div>

              <Field label="Use an image URL instead">
                <input
                  type="url"
                  name="image"
                  value={form.image?.startsWith('data:') ? '' : form.image}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className={inputCls(errors.image)}
                />
              </Field>

              <Toggle
                name="is_featured"
                checked={form.is_featured}
                onChange={handleChange}
                label="Featured article"
                description="Show this article prominently on the News page"
              />
            </div>
          </details>

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
