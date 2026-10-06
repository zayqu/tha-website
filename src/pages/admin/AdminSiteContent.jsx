import { useEffect, useMemo, useState } from 'react';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { useAuth } from '../../contexts/AuthContext';

const TABS = [
  ['organization', 'Organization'],
  ['contact', 'Contact'],
  ['home', 'Home'],
  ['about', 'About'],
  ['funding', 'Funding'],
  ['impact', 'Impact'],
  ['values', 'Values & Objectives'],
  ['stories', 'Stories'],
  ['academy', 'Academy'],
  ['topics', 'Health Topics'],
  ['policies', 'Policies'],
  ['team', 'Team'],
  ['partners', 'Partners'],
  ['documents', 'Documents'],
];

const sectionFields = {
  organization: [
    ['name', 'Organization name'],
    ['shortName', 'Short name'],
    ['registrationNumber', 'Registration number'],
    ['foundedYear', 'Founded year', 'number'],
    ['mission', 'Mission', 'textarea'],
    ['vision', 'Vision', 'textarea'],
    ['motto', 'Motto'],
    ['founderName', 'Founder name'],
    ['founderTitle', 'Founder title'],
  ],
  contact: [
    ['address', 'Street / office address'],
    ['poBox', 'P.O. Box'],
    ['city', 'City'],
    ['country', 'Country'],
    ['phone', 'Primary phone'],
    ['secondaryPhone', 'Secondary phone'],
    ['email', 'Email', 'email'],
    ['facebook', 'Facebook URL'],
    ['instagram', 'Instagram URL'],
    ['linkedin', 'LinkedIn URL'],
  ],
  home: [
    ['heroTitle', 'Hero title'],
    ['heroDescription', 'Hero description', 'textarea'],
    ['journeyIntro', 'Journey introduction', 'textarea'],
    ['programsIntro', 'Programs introduction', 'textarea'],
    ['engagementTitle', 'Institutional engagement title'],
    ['engagementIntro', 'Institutional engagement introduction', 'textarea'],
    ['ctaText', 'Closing call to action', 'textarea'],
  ],
  about: [
    ['heroText', 'About hero text', 'textarea'],
    ['founderHeading', 'Founder section heading'],
    ['founderStory', 'Founder story', 'textarea'],
    ['campaignsIntro', 'Campaigns introduction', 'textarea'],
    ['partnersIntro', 'Partners introduction', 'textarea'],
    ['closingText', 'Closing call to action', 'textarea'],
  ],
  funding: [
    ['heroText', 'Funding page hero', 'textarea'],
    ['donationIntro', 'Funding introduction', 'textarea'],
    ['institutionalText', 'Institutional funding text', 'textarea'],
    ['partnerIntro', 'Partnership introduction', 'textarea'],
  ],
  impact: [
    ['heroTitle', 'Impact page title'],
    ['heroText', 'Impact page introduction', 'textarea'],
    ['metricsIntro', 'Metrics explanation', 'textarea'],
    ['evidenceIntro', 'Evidence introduction', 'textarea'],
  ],
};

function Field({ label, value, type = 'text', onChange }) {
  const base = 'w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-[16px] text-gray-800 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10';
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-gray-700">{label}</span>
      {type === 'textarea' ? (
        <textarea rows={5} value={value ?? ''} onChange={e => onChange(e.target.value)} className={base} />
      ) : (
        <input type={type} value={value ?? ''} onChange={e => onChange(type === 'number' ? Number(e.target.value) : e.target.value)} className={base} />
      )}
    </label>
  );
}

function makeId(prefix = 'item') {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function emptyValue() {
  return { id: makeId('value'), value: '', description: '', icon: 'shield', published: true, sortOrder: Date.now() };
}

function emptyObjective() {
  return { id: makeId('objective'), title: '', description: '', icon: 'check_circle', published: true, sortOrder: Date.now() };
}

function emptyStory() {
  return { id: makeId('story'), quote: '', name: '', role: '', photo: '', published: true, sortOrder: Date.now() };
}

function emptyGuide() {
  return { id: makeId('guide'), topic: 'HIV', icon: 'health_and_safety', title: '', summary: '', action: 'Explore', published: true, sortOrder: Date.now() };
}

function emptyResource() {
  return { id: makeId('resource'), title: '', excerpt: '', source: '', url: '', date: '', category: 'Guidance', topics: [], published: true, sortOrder: Date.now() };
}

function emptyTeamMember() {
  return {
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    name: '',
    title: '',
    photo: '',
    bio: '',
    credentials: [],
    linkedIn: '',
    instagram: '',
    published: true,
    sortOrder: Date.now(),
  };
}

function emptyPartner() {
  return {
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    name: '',
    logo: '',
    description: '',
    relationship: '',
    website: '',
    published: true,
    sortOrder: Date.now(),
  };
}

function emptyDocument() {
  return {
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    category: 'Legal & Registration',
    title: '',
    meta: '',
    description: '',
    status: '',
    action: 'View',
    url: '',
    external: false,
    published: true,
    sortOrder: Date.now(),
  };
}

export default function AdminSiteContent() {
  const { authFetch } = useAuth();
  const [active, setActive] = useState('organization');
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    let mounted = true;
    authFetch('/api/site-content/admin')
      .then(async res => {
        if (!res.ok) throw new Error('Could not load site content');
        return res.json();
      })
      .then(data => { if (mounted) setContent(data.content); })
      .catch(err => { if (mounted) setMessage(err.message); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [authFetch]);

  const documents = useMemo(() => Array.isArray(content?.documents) ? content.documents : [], [content]);
  const team = useMemo(() => Array.isArray(content?.team) ? content.team : [], [content]);
  const partners = useMemo(() => Array.isArray(content?.partners) ? content.partners : [], [content]);
  const coreValues = useMemo(() => Array.isArray(content?.coreValues) ? content.coreValues : [], [content]);
  const objectives = useMemo(() => Array.isArray(content?.objectives) ? content.objectives : [], [content]);
  const testimonials = useMemo(() => Array.isArray(content?.testimonials) ? content.testimonials : [], [content]);
  const academyGuides = useMemo(() => Array.isArray(content?.academy?.guides) ? content.academy.guides : [], [content]);
  const academyResources = useMemo(() => Array.isArray(content?.academy?.resources) ? content.academy.resources : [], [content]);

  function setSectionValue(section, key, value) {
    setContent(prev => ({
      ...prev,
      [section]: { ...(prev?.[section] || {}), [key]: value },
    }));
  }

  function updateDocument(id, key, value) {
    setContent(prev => ({
      ...prev,
      documents: (prev.documents || []).map(doc => doc.id === id ? { ...doc, [key]: value } : doc),
    }));
  }

  function setNestedValue(section, key, nestedKey, value) {
    setContent(prev => ({
      ...prev,
      [section]: {
        ...(prev?.[section] || {}),
        [key]: { ...(prev?.[section]?.[key] || {}), [nestedKey]: value },
      },
    }));
  }

  function updateNestedList(section, key, id, field, value) {
    setContent(prev => ({
      ...prev,
      [section]: {
        ...(prev?.[section] || {}),
        [key]: (prev?.[section]?.[key] || []).map(item => item.id === id ? { ...item, [field]: value } : item),
      },
    }));
  }

  function addNestedListItem(section, key, item) {
    setContent(prev => ({
      ...prev,
      [section]: {
        ...(prev?.[section] || {}),
        [key]: [...(prev?.[section]?.[key] || []), item],
      },
    }));
  }

  function removeNestedListItem(section, key, id, label) {
    if (!window.confirm(`Remove ${label || 'this item'} from the website?`)) return;
    setContent(prev => ({
      ...prev,
      [section]: {
        ...(prev?.[section] || {}),
        [key]: (prev?.[section]?.[key] || []).filter(item => item.id !== id),
      },
    }));
  }

  function updateListItem(section, id, key, value) {
    setContent(prev => ({
      ...prev,
      [section]: (prev[section] || []).map(item => item.id === id ? { ...item, [key]: value } : item),
    }));
  }

  function addListItem(section, item) {
    setContent(prev => ({ ...prev, [section]: [...(prev[section] || []), item] }));
  }

  function removeListItem(section, id, label) {
    if (!window.confirm(`Remove ${label || 'this item'} from the website?`)) return;
    setContent(prev => ({ ...prev, [section]: (prev[section] || []).filter(item => item.id !== id) }));
  }

  function addDocument() {
    setContent(prev => ({ ...prev, documents: [...(prev.documents || []), emptyDocument()] }));
  }

  function removeDocument(id) {
    if (!window.confirm('Remove this document/link from the website?')) return;
    setContent(prev => ({ ...prev, documents: (prev.documents || []).filter(doc => doc.id !== id) }));
  }

  async function save() {
    setSaving(true);
    setMessage('');
    try {
      const res = await authFetch('/api/site-content', {
        method: 'PUT',
        body: JSON.stringify({ content }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Save failed');
      setContent(data.content);
      try { window.localStorage.setItem('tha:site-content:v1', JSON.stringify(data.content)); } catch {}
      setMessage('Saved. Public pages will use these updates.');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminHeader section="Site Content" />
        <div className="flex min-h-[60vh] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24 sm:pb-8">
      <AdminHeader section="Site Content" />

      <main className="mx-auto max-w-6xl px-3 py-5 sm:px-6 sm:py-8 lg:px-8">
        <div className="mb-5">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Site Content</h1>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-gray-500">
            Update organization details, public copy and document links from one place. Changes are saved to the persistent live content store.
          </p>
        </div>

        <div className="-mx-3 mb-5 overflow-x-auto px-3 sm:mx-0 sm:px-0">
          <div className="flex min-w-max gap-2 sm:flex-wrap">
            {TABS.map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setActive(id)}
                className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${active === id ? 'bg-primary text-white shadow-sm' : 'border border-gray-200 bg-white text-gray-600'}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {['organization','contact','home','about','funding','impact'].includes(active) ? (
          <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="grid gap-5 md:grid-cols-2">
              {(sectionFields[active] || []).map(([key, label, type]) => (
                <div key={key} className={type === 'textarea' ? 'md:col-span-2' : ''}>
                  <Field
                    label={label}
                    type={type}
                    value={content?.[active]?.[key]}
                    onChange={value => setSectionValue(active, key, value)}
                  />
                </div>
              ))}
            </div>
          </section>
        ) : active === 'team' ? (
          <section className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Team</h2>
                <p className="text-sm text-gray-500">Manage public leadership profiles and their order.</p>
              </div>
              <button type="button" onClick={() => addListItem('team', emptyTeamMember())} className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white sm:w-auto">+ Add team member</button>
            </div>
            {team.map((member, index) => (
              <article key={member.id} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Person {index + 1}</p>
                    <h3 className="font-bold text-gray-800">{member.name || 'New team member'}</h3>
                  </div>
                  <button type="button" onClick={() => removeListItem('team', member.id, member.name)} className="rounded-lg px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50">Remove</button>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Name" value={member.name} onChange={v => updateListItem('team', member.id, 'name', v)} />
                  <Field label="Title" value={member.title} onChange={v => updateListItem('team', member.id, 'title', v)} />
                  <Field label="Photo path / URL" value={member.photo} onChange={v => updateListItem('team', member.id, 'photo', v)} />
                  <Field label="Sort order" type="number" value={member.sortOrder} onChange={v => updateListItem('team', member.id, 'sortOrder', v)} />
                  <div className="md:col-span-2"><Field label="Short bio" type="textarea" value={member.bio} onChange={v => updateListItem('team', member.id, 'bio', v)} /></div>
                  <div className="md:col-span-2">
                    <Field label="Credentials (one per line)" type="textarea" value={(member.credentials || []).join('\n')} onChange={v => updateListItem('team', member.id, 'credentials', v.split('\n').map(x => x.trim()).filter(Boolean))} />
                  </div>
                  <Field label="LinkedIn URL" value={member.linkedIn} onChange={v => updateListItem('team', member.id, 'linkedIn', v)} />
                  <Field label="Instagram URL" value={member.instagram} onChange={v => updateListItem('team', member.id, 'instagram', v)} />
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <input type="checkbox" checked={Boolean(member.published)} onChange={e => updateListItem('team', member.id, 'published', e.target.checked)} className="h-5 w-5 rounded border-gray-300" />
                    Published
                  </label>
                </div>
              </article>
            ))}
          </section>
        ) : active === 'partners' ? (
          <section className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Partners</h2>
                <p className="text-sm text-gray-500">Keep only relationships THA can support with evidence.</p>
              </div>
              <button type="button" onClick={() => addListItem('partners', emptyPartner())} className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white sm:w-auto">+ Add partner</button>
            </div>
            {partners.map((partner, index) => (
              <article key={partner.id} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Partner {index + 1}</p>
                    <h3 className="font-bold text-gray-800">{partner.name || 'New partner'}</h3>
                  </div>
                  <button type="button" onClick={() => removeListItem('partners', partner.id, partner.name)} className="rounded-lg px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50">Remove</button>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Name" value={partner.name} onChange={v => updateListItem('partners', partner.id, 'name', v)} />
                  <Field label="Relationship" value={partner.relationship} onChange={v => updateListItem('partners', partner.id, 'relationship', v)} />
                  <Field label="Logo path / URL" value={partner.logo} onChange={v => updateListItem('partners', partner.id, 'logo', v)} />
                  <Field label="Website URL" value={partner.website} onChange={v => updateListItem('partners', partner.id, 'website', v)} />
                  <div className="md:col-span-2"><Field label="Description" type="textarea" value={partner.description} onChange={v => updateListItem('partners', partner.id, 'description', v)} /></div>
                  <Field label="Sort order" type="number" value={partner.sortOrder} onChange={v => updateListItem('partners', partner.id, 'sortOrder', v)} />
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <input type="checkbox" checked={Boolean(partner.published)} onChange={e => updateListItem('partners', partner.id, 'published', e.target.checked)} className="h-5 w-5 rounded border-gray-300" />
                    Published
                  </label>
                </div>
              </article>
            ))}
          </section>
        ) : (
          <section className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Documents & links</h2>
                <p className="text-sm text-gray-500">Add policies, reports, certificates or external verification links.</p>
              </div>
              <button type="button" onClick={addDocument} className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white sm:w-auto">
                + Add document
              </button>
            </div>

            {documents.map((doc, index) => (
              <article key={doc.id} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Item {index + 1}</p>
                    <h3 className="font-bold text-gray-800">{doc.title || 'New document'}</h3>
                  </div>
                  <button type="button" onClick={() => removeDocument(doc.id)} className="rounded-lg px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50">Remove</button>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Category" value={doc.category} onChange={v => updateDocument(doc.id, 'category', v)} />
                  <Field label="Title" value={doc.title} onChange={v => updateDocument(doc.id, 'title', v)} />
                  <Field label="Meta / date" value={doc.meta} onChange={v => updateDocument(doc.id, 'meta', v)} />
                  <Field label="Status badge" value={doc.status} onChange={v => updateDocument(doc.id, 'status', v)} />
                  <div className="md:col-span-2">
                    <Field label="Description" type="textarea" value={doc.description} onChange={v => updateDocument(doc.id, 'description', v)} />
                  </div>
                  <Field label="Button label" value={doc.action} onChange={v => updateDocument(doc.id, 'action', v)} />
                  <Field label="Document or external URL" value={doc.url} onChange={v => updateDocument(doc.id, 'url', v)} />
                  <Field label="Sort order" type="number" value={doc.sortOrder} onChange={v => updateDocument(doc.id, 'sortOrder', v)} />
                  <div className="flex flex-wrap items-center gap-5 pt-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <input type="checkbox" checked={Boolean(doc.published)} onChange={e => updateDocument(doc.id, 'published', e.target.checked)} className="h-5 w-5 rounded border-gray-300" />
                      Published
                    </label>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <input type="checkbox" checked={Boolean(doc.external)} onChange={e => updateDocument(doc.id, 'external', e.target.checked)} className="h-5 w-5 rounded border-gray-300" />
                      External link
                    </label>
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}

        {message && (
          <div className={`mt-5 rounded-xl px-4 py-3 text-sm font-medium ${message.startsWith('Saved') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {message}
          </div>
        )}
      </main>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 p-3 backdrop-blur sm:static sm:mt-2 sm:border-0 sm:bg-transparent sm:p-0">
        <div className="mx-auto max-w-6xl sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={save}
            disabled={saving || !content}
            className="w-full rounded-xl bg-secondary px-5 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-secondary-dark disabled:opacity-50 sm:w-auto sm:min-w-40"
          >
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
