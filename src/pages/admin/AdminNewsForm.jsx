import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { useAuth } from '../../contexts/AuthContext';

const CATEGORY_SUGGESTIONS = [
  'Announcements', 'Events', 'Press Releases', 'Success Stories',
  'HIV', 'Viral Hepatitis', 'Mental Health', 'Community Health',
  'Research', 'Partnerships', 'Advocacy', 'Training',
];

const PURPOSES = {
  announcement: 'Announcement',
  event: 'Event update',
  education: 'Health education',
  success: 'Success story',
  press: 'Press release',
};

const MAX_IMAGES = 3;
const MAX_SOURCE_BYTES = 15_000_000;
const MAX_IMAGE_EDGE = 1400;
const TARGET_IMAGE_BYTES = 350_000;

const EMPTY_FORM = {
  title: '',
  excerpt: '',
  content: '',
  image: '',
  inline_images: [],
  category: 'Events',
  author: 'THA Communications',
  date: new Date().toISOString().split('T')[0],
  tags: '',
  is_featured: false,
  published: true,
};

function formatBytes(bytes) {
  if (!bytes) return '0 KB';
  return bytes >= 1_000_000
    ? `${(bytes / 1_000_000).toFixed(1)} MB`
    : `${Math.round(bytes / 1000)} KB`;
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
    throw new Error('Please upload JPG, PNG or WebP images.');
  }
  if (file.size > MAX_SOURCE_BYTES) {
    throw new Error('Each original image must be under 15 MB.');
  }

  const source = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Could not read this image.'));
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

  let quality = 0.78;
  let dataUrl = canvas.toDataURL('image/webp', quality);
  while (dataUrl.length * 0.75 > TARGET_IMAGE_BYTES && quality > 0.42) {
    quality -= 0.07;
    dataUrl = canvas.toDataURL('image/webp', quality);
  }

  const outputBytes = Math.round(dataUrl.length * 0.75);
  if (outputBytes > 520_000) {
    throw new Error('This image could not be reduced enough. Please choose a smaller image.');
  }

  return { dataUrl, width, height, outputBytes };
}

function defaultImagePlan(items, title) {
  if (!items.length) return { banner: '', inline: [] };
  return {
    banner: items[0].src,
    inline: items.slice(1).map((item, index) => ({
      src: item.src,
      alt: title ? `${title} - supporting image ${index + 1}` : `THA article supporting image ${index + 1}`,
      after_paragraph: index === 0 ? 2 : 4,
    })),
  };
}

export default function AdminNewsForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const { authFetch } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState(isEditing ? 'manual' : null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [assistant, setAssistant] = useState({ details: '', purpose: 'announcement' });
  const [uploadedImages, setUploadedImages] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState(CATEGORY_SUGGESTIONS);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [processingImages, setProcessingImages] = useState(false);
  const [generatingDraft, setGeneratingDraft] = useState(false);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    authFetch('/api/news/admin')
      .then(r => r.json())
      .then(data => {
        const articles = data.articles || [];
        const categories = articles.map(a => a.category?.trim()).filter(Boolean);
        setCategoryOptions([...new Set([...CATEGORY_SUGGESTIONS, ...categories])].sort());

        if (!isEditing) return;
        const article = articles.find(item => item.id === id);
        if (!article) {
          setLoadError('Article not found.');
          return;
        }

        setForm({
          title: article.title || '',
          excerpt: article.excerpt || '',
          content: article.content || '',
          image: article.image || '',
          inline_images: Array.isArray(article.inline_images) ? article.inline_images : [],
          category: article.category || 'Events',
          author: article.author || 'THA Communications',
          date: article.date?.split('T')[0] || article.date || new Date().toISOString().split('T')[0],
          tags: Array.isArray(article.tags) ? article.tags.join(', ') : '',
          is_featured: Boolean(article.is_featured),
          published: Boolean(article.published),
        });

        const restored = [];
        if (article.image) restored.push({ src: article.image, label: 'Banner image' });
        (article.inline_images || []).forEach((img, index) => restored.push({
          src: img.src,
          label: `Article image ${index + 1}`,
        }));
        setUploadedImages(restored);
      })
      .catch(() => {
        if (isEditing) setLoadError('Failed to load article.');
      });
  }, [authFetch, id, isEditing]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  }

  async function handleImagesChange(e) {
    const files = [...(e.target.files || [])].slice(0, MAX_IMAGES);
    if (!files.length) return;

    setProcessingImages(true);
    setErrors(prev => ({ ...prev, images: '' }));
    try {
      const compressed = [];
      for (const file of files) {
        const result = await compressImage(file);
        compressed.push({
          src: result.dataUrl,
          original: file.size,
          compressed: result.outputBytes,
          dimensions: `${result.width} × ${result.height}`,
        });
      }
      setUploadedImages(compressed);
      const plan = defaultImagePlan(compressed, form.title);
      setForm(prev => ({ ...prev, image: plan.banner, inline_images: plan.inline }));
    } catch (err) {
      setErrors(prev => ({ ...prev, images: err.message }));
    } finally {
      setProcessingImages(false);
      e.target.value = '';
    }
  }

  async function generateDraft() {
    const details = assistant.details.trim();
    if (!details) {
      setErrors(prev => ({ ...prev, assistant: 'Write a short description of what happened.' }));
      return;
    }

    setGeneratingDraft(true);
    setErrors(prev => ({ ...prev, assistant: '' }));
    try {
      const res = await authFetch('/api/news/generate', {
        method: 'POST',
        body: JSON.stringify({
          topic: details,
          purpose: PURPOSES[assistant.purpose],
          images: uploadedImages.map(item => item.src),
          categories: categoryOptions,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.draft) {
        throw new Error(data.error || 'Could not prepare the article.');
      }

      const draft = data.draft;
      const imagePlan = Array.isArray(draft.image_plan) ? draft.image_plan : [];
      let bannerIndex = imagePlan.find(item => item.role === 'banner')?.image_index ?? 0;
      if (bannerIndex < 0 || bannerIndex >= uploadedImages.length) bannerIndex = 0;

      const banner = uploadedImages[bannerIndex]?.src || form.image;
      const inline = imagePlan
        .filter(item => item.role === 'inline')
        .filter(item => item.image_index >= 0 && item.image_index < uploadedImages.length)
        .filter(item => item.image_index !== bannerIndex)
        .slice(0, 2)
        .map((item, index) => ({
          src: uploadedImages[item.image_index].src,
          alt: item.alt || `${draft.title} - supporting image ${index + 1}`,
          after_paragraph: Math.max(1, Math.min(8, Number(item.after_paragraph) || (index === 0 ? 2 : 4))),
        }));

      const fallbackPlan = defaultImagePlan(uploadedImages, draft.title);
      setForm(prev => ({
        ...prev,
        title: draft.title,
        excerpt: draft.excerpt,
        content: draft.content,
        category: draft.category || prev.category,
        tags: Array.isArray(draft.tags) ? draft.tags.join(', ') : prev.tags,
        image: banner || fallbackPlan.banner,
        inline_images: inline.length ? inline : fallbackPlan.inline,
        author: prev.author || 'THA Communications',
      }));

      if (draft.category) {
        setCategoryOptions(options => [...new Set([...options, draft.category])].sort());
      }
    } catch (err) {
      setErrors(prev => ({ ...prev, assistant: err.message }));
    } finally {
      setGeneratingDraft(false);
    }
  }

  function validate() {
    const next = {};
    if (!form.title.trim()) next.title = 'Headline is required.';
    if (!form.excerpt.trim()) next.excerpt = 'Short summary is required.';
    if (!form.content.trim()) next.content = 'Article content is required.';
    if (!form.image) next.images = 'Add at least one image.';
    if (!form.category.trim()) next.category = 'Category is required.';
    if (!form.author.trim()) next.author = 'Author is required.';
    if (!form.date) next.date = 'Date is required.';
    if (form.excerpt.length > 500) next.excerpt = 'Summary must be 500 characters or fewer.';
    return next;
  }

  async function handleSubmit(e, publishOverride) {
    e.preventDefault();
    const nextErrors = validate();
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...form,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        published: typeof publishOverride === 'boolean' ? publishOverride : form.published,
      };

      const res = await authFetch(isEditing ? `/api/news/${id}` : '/api/news', {
        method: isEditing ? 'PUT' : 'POST',
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.errors?.[0]?.msg || data.error || 'Save failed.');
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
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
        {!isEditing && !mode ? (
          <div className="space-y-5">
            <div>
              <h1 className="text-2xl font-bold text-primary">How would you like to post?</h1>
              <p className="text-gray-500 mt-1">Choose one workflow. You will not see the other controls while posting.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setMode('ai')}
                className="text-left bg-white border-2 border-primary rounded-2xl p-6 shadow-sm hover:shadow-md transition"
              >
                <div className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Recommended</div>
                <h2 className="text-xl font-bold text-gray-900">Create with AI</h2>
                <p className="text-sm text-gray-600 mt-2">
                  Add a short description and your photos. THA prepares the complete article, headline, summary, category, tags and image placement.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setMode('manual')}
                className="text-left bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:border-primary hover:shadow-md transition"
              >
                <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Full control</div>
                <h2 className="text-xl font-bold text-gray-900">Post manually</h2>
                <p className="text-sm text-gray-600 mt-2">
                  Write the headline, summary and article yourself. The system will still optimize and place your photos.
                </p>
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={event => handleSubmit(event, true)} noValidate className="space-y-6">
            {errors._global && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
                {errors._global}
              </div>
            )}

            {!isEditing && (
              <button
                type="button"
                onClick={() => setMode(null)}
                className="text-sm font-semibold text-primary hover:underline"
              >
                ← Change posting method
              </button>
            )}

            {mode === 'ai' && !isEditing && (
              <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-5 py-5 md:px-6 border-b border-gray-100">
                  <p className="text-xs font-bold uppercase tracking-widest text-primary/70">AI-assisted posting</p>
                  <h2 className="text-xl font-bold text-primary mt-1">Tell us the story briefly</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    A few factual details are enough. Do not worry about writing an article.
                  </p>
                </div>

                <div className="p-5 md:p-6 space-y-5">
                  <Field label="What happened?" error={errors.assistant}>
                    <textarea
                      value={assistant.details}
                      onChange={e => {
                        setAssistant(prev => ({ ...prev, details: e.target.value }));
                        setErrors(prev => ({ ...prev, assistant: '' }));
                      }}
                      rows={6}
                      placeholder="Example: THA held a hepatitis awareness session in Dodoma on 3 October. Health workers and university students attended. The discussion focused on testing, vaccination and early treatment. About 80 people participated."
                      className={inputCls(errors.assistant)}
                    />
                  </Field>

                  <Field label="Type of post">
                    <select
                      value={assistant.purpose}
                      onChange={e => setAssistant(prev => ({ ...prev, purpose: e.target.value }))}
                      className={inputCls()}
                    >
                      {Object.entries(PURPOSES).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </Field>

                  <ImageUploader
                    images={uploadedImages}
                    processing={processingImages}
                    error={errors.images}
                    onChange={handleImagesChange}
                  />

                  <button
                    type="button"
                    onClick={generateDraft}
                    disabled={generatingDraft || processingImages}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition disabled:opacity-60"
                  >
                    {generatingDraft ? 'Preparing full article…' : 'Generate full article'}
                  </button>
                </div>
              </section>
            )}

            {(mode === 'manual' || isEditing) && (
              <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-5 py-5 md:px-6 border-b border-gray-100">
                  <p className="text-xs font-bold uppercase tracking-widest text-primary/70">Manual posting</p>
                  <h2 className="text-xl font-bold text-primary mt-1">{isEditing ? 'Edit article' : 'Write your article'}</h2>
                </div>
                <div className="p-5 md:p-6">
                  <ImageUploader
                    images={uploadedImages}
                    processing={processingImages}
                    error={errors.images}
                    onChange={handleImagesChange}
                  />
                </div>
              </section>
            )}

            {(mode === 'manual' || isEditing || form.title || form.content) && (
              <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-5 py-5 md:px-6 border-b border-gray-100">
                  <p className="text-xs font-bold uppercase tracking-widest text-primary/70">
                    {mode === 'ai' ? 'Review before publishing' : 'Article'}
                  </p>
                  <h2 className="text-xl font-bold text-primary mt-1">
                    {mode === 'ai' ? 'Check the generated article' : 'Article details'}
                  </h2>
                  {mode === 'ai' && (
                    <p className="text-sm text-gray-500 mt-1">Everything remains editable before it goes live.</p>
                  )}
                </div>

                <div className="p-5 md:p-6 space-y-5">
                  <Field label="Headline *" error={errors.title}>
                    <input name="title" value={form.title} onChange={handleChange} className={inputCls(errors.title)} />
                  </Field>

                  <Field label="Short summary *" error={errors.excerpt}>
                    <textarea name="excerpt" value={form.excerpt} onChange={handleChange} rows={3} className={inputCls(errors.excerpt)} />
                    <p className="text-xs text-gray-400 mt-1">{form.excerpt.length}/500 characters</p>
                  </Field>

                  <Field label="Full article *" error={errors.content}>
                    <textarea name="content" value={form.content} onChange={handleChange} rows={14} className={inputCls(errors.content)} />
                  </Field>

                  {form.image && (
                    <div className="rounded-xl border border-gray-200 overflow-hidden">
                      <img src={form.image} alt="Banner preview" className="w-full h-56 object-cover" />
                      <div className="px-4 py-2 text-xs font-semibold text-gray-500">Banner image</div>
                    </div>
                  )}

                  {form.inline_images?.length > 0 && (
                    <div className="grid sm:grid-cols-2 gap-4">
                      {form.inline_images.map((img, index) => (
                        <div key={index} className="rounded-xl border border-gray-200 overflow-hidden">
                          <img src={img.src} alt={img.alt || ''} className="w-full h-40 object-cover" />
                          <div className="px-3 py-2 text-xs text-gray-500">
                            Inside article after paragraph {img.after_paragraph}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </section>
            )}

            {(mode === 'manual' || isEditing || form.title || form.content) && (
              <details className="bg-white rounded-2xl border border-gray-200 shadow-sm group">
                <summary className="cursor-pointer list-none px-5 py-4 md:px-6 flex items-center justify-between gap-4">
                  <div>
                    <div className="font-bold text-gray-800">More settings</div>
                    <div className="text-xs text-gray-500 mt-0.5">Category, author, date, tags and featured status</div>
                  </div>
                  <span className="text-primary text-xl group-open:rotate-45 transition-transform">+</span>
                </summary>

                <div className="px-5 pb-5 md:px-6 md:pb-6 border-t border-gray-100 pt-5 space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="Category *" error={errors.category}>
                      <select name="category" value={form.category} onChange={handleChange} className={inputCls(errors.category)}>
                        {categoryOptions.map(category => <option key={category} value={category}>{category}</option>)}
                      </select>
                    </Field>
                    <Field label="Author *" error={errors.author}>
                      <input name="author" value={form.author} onChange={handleChange} className={inputCls(errors.author)} />
                    </Field>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="Date *" error={errors.date}>
                      <input type="date" name="date" value={form.date} onChange={handleChange} className={inputCls(errors.date)} />
                    </Field>
                    <Field label="Tags">
                      <input name="tags" value={form.tags} onChange={handleChange} className={inputCls()} placeholder="Hepatitis, Youth, Awareness" />
                    </Field>
                  </div>

                  <Toggle
                    name="is_featured"
                    checked={form.is_featured}
                    onChange={handleChange}
                    label="Featured article"
                    description="Show prominently on the News page"
                  />
                </div>
              </details>
            )}

            {(mode === 'manual' || isEditing || form.title || form.content) && (
              <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
                <Link to="/admin" className="px-5 py-2.5 text-center text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-xl">
                  Cancel
                </Link>
                <div className="flex flex-col-reverse sm:flex-row gap-3">
                  <button
                    type="button"
                    disabled={saving || processingImages}
                    onClick={event => handleSubmit(event, false)}
                    className="px-5 py-2.5 bg-white border border-primary text-primary font-semibold text-sm rounded-xl disabled:opacity-60"
                  >
                    Save as draft
                  </button>
                  <button
                    type="submit"
                    disabled={saving || processingImages || generatingDraft}
                    className="px-6 py-2.5 bg-primary text-white font-bold text-sm rounded-xl hover:bg-primary-dark disabled:opacity-60"
                  >
                    {saving ? 'Saving…' : 'Publish now'}
                  </button>
                </div>
              </div>
            )}
          </form>
        )}
      </main>
    </div>
  );
}

function ImageUploader({ images, processing, error, onChange }) {
  return (
    <Field label="Photos" error={error}>
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        onChange={onChange}
        disabled={processing}
        className="block w-full text-sm text-gray-600 file:mr-4 file:rounded-lg file:border-0 file:bg-primary file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-white hover:file:bg-primary-dark disabled:opacity-60"
      />
      <p className="text-xs text-gray-500 mt-2">
        {processing
          ? 'Optimizing photos…'
          : 'Upload up to 3 photos. The system converts them to WebP, reduces their size and decides which is the banner and which go inside the article.'}
      </p>
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
          {images.map((item, index) => (
            <div key={index} className="rounded-xl border border-gray-200 overflow-hidden bg-gray-50">
              <img src={item.src} alt="" className="w-full h-28 object-cover" />
              <div className="px-2 py-2 text-[11px] text-gray-500">
                {index === 0 ? 'Photo 1' : `Photo ${index + 1}`}
                {item.compressed ? ` · ${formatBytes(item.compressed)}` : ''}
              </div>
            </div>
          ))}
        </div>
      )}
    </Field>
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
  return `w-full border rounded-xl px-4 py-2.5 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition ${error ? 'border-red-300 bg-red-50' : 'border-gray-300'}`;
}

function Toggle({ name, checked, onChange, label, description }) {
  return (
    <label className="flex items-start gap-3 cursor-pointer">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="mt-1 h-4 w-4 accent-primary"
      />
      <span>
        <span className="block text-sm font-semibold text-gray-700">{label}</span>
        <span className="block text-xs text-gray-400">{description}</span>
      </span>
    </label>
  );
}
