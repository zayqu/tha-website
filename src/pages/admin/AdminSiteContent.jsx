import { useEffect, useMemo, useState } from 'react';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { useAuth } from '../../contexts/AuthContext';
import AdminAiAssist from '../../components/AdminAiAssist';

const TABS = [
  ['organization', 'Organization'],
  ['contact', 'Contact'],
  ['home', 'Home'],
  ['projectsPage', 'Campaigns Page'],
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
  ['documentsPage', 'Documents Page'],
  ['documents', 'Documents'],
];

const SIMPLE_FIELDS = {
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
    ['pageIntro', 'Contact page introduction', 'textarea'],
    ['formIntro', 'Contact form introduction', 'textarea'],
    ['volunteerCtaTitle', 'Volunteer CTA title'],
    ['volunteerCtaText', 'Volunteer CTA text', 'textarea'],
  ],
  home: [
    ['heroTitle', 'Hero title'],
    ['heroDescription', 'Hero description', 'textarea'],
    ['journeyIntro', 'Journey introduction', 'textarea'],
    ['programsIntro', 'Programs introduction', 'textarea'],
    ['engagementTitle', 'Institutional engagement title'],
    ['engagementIntro', 'Institutional engagement introduction', 'textarea'],
    ['approachEyebrow', 'How we work eyebrow'],
    ['approachTitle', 'How we work title'],
    ['approachIntro', 'How we work introduction', 'textarea'],
    ['needTitle', 'Community need title'],
    ['needText', 'Community need text', 'textarea'],
    ['actionTitle', 'Action title'],
    ['actionText', 'Action text', 'textarea'],
    ['learningTitle', 'Results & learning title'],
    ['learningText', 'Results & learning text', 'textarea'],
    ['ctaText', 'Closing call to action', 'textarea'],
  ],
  projectsPage: [
    ['heroTitle', 'Campaigns page title'],
    ['heroText', 'Campaigns page introduction', 'textarea'],
    ['ctaTitle', 'Campaigns closing title'],
    ['ctaText', 'Campaigns closing text', 'textarea'],
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
    ['funderTitle', 'Homepage funder section title'],
    ['scopeTitle', 'Scope & budget title'],
    ['scopeText', 'Scope & budget text', 'textarea'],
    ['outcomesTitle', 'Measurement title'],
    ['outcomesText', 'Measurement text', 'textarea'],
    ['reportingTitle', 'Reporting title'],
    ['reportingText', 'Reporting text', 'textarea'],
    ['partnerIntro', 'Partnership introduction', 'textarea'],
  ],
  documentsPage: [
    ['eyebrow', 'Documents eyebrow'],
    ['title', 'Documents page title'],
    ['intro', 'Documents page introduction', 'textarea'],
    ['requestText', 'Due-diligence request text', 'textarea'],
  ],
  impact: [
    ['heroTitle', 'Impact page title'],
    ['heroText', 'Impact page introduction', 'textarea'],
    ['metricsIntro', 'Metrics explanation', 'textarea'],
    ['evidenceIntro', 'Evidence introduction', 'textarea'],
  ],
};

const cx = (...items) => items.filter(Boolean).join(' ');

function makeId(prefix='item') {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2,7)}`;
}

function Field({ label, value, type='text', onChange, rows=5, placeholder='' }) {
  const base='w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-[16px] text-gray-800 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10';
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-gray-700">{label}</span>
      {type === 'textarea' ? (
        <textarea rows={rows} value={value ?? ''} placeholder={placeholder} onChange={e=>onChange(e.target.value)} className={base} />
      ) : (
        <input type={type} value={value ?? ''} placeholder={placeholder} onChange={e=>onChange(type==='number'?Number(e.target.value):e.target.value)} className={base} />
      )}
    </label>
  );
}

function Toggle({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
      <input type="checkbox" checked={Boolean(checked)} onChange={e=>onChange(e.target.checked)} className="h-5 w-5 rounded border-gray-300" />
      {label}
    </label>
  );
}

function Card({ children }) {
  return <article className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">{children}</article>;
}

function CardHeader({ eyebrow, title, onRemove }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <div className="min-w-0">
        {eyebrow ? <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">{eyebrow}</p> : null}
        <h3 className="truncate font-bold text-gray-800">{title || 'Untitled'}</h3>
      </div>
      {onRemove ? <button type="button" onClick={onRemove} className="rounded-lg px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50">Remove</button> : null}
    </div>
  );
}

function AddRow({ title, description, button, onClick }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
        {description ? <p className="text-sm text-gray-500">{description}</p> : null}
      </div>
      {onClick ? <button type="button" onClick={onClick} className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white sm:w-auto">{button}</button> : null}
    </div>
  );
}

const emptyValue=()=>({id:makeId('value'),value:'',description:'',icon:'shield',published:true,sortOrder:Date.now()});
const emptyObjective=()=>({id:makeId('objective'),title:'',description:'',icon:'check_circle',published:true,sortOrder:Date.now()});
const emptyStory=()=>({id:makeId('story'),quote:'',name:'',role:'',photo:'',published:true,sortOrder:Date.now()});
const emptyGuide=()=>({id:makeId('guide'),topic:'HIV',icon:'health_and_safety',title:'',summary:'',action:'Explore',published:true,sortOrder:Date.now()});
const emptyResource=()=>({id:makeId('resource'),title:'',excerpt:'',source:'',url:'',date:'',category:'Guidance',topics:[],published:true,sortOrder:Date.now()});
const emptyRole=()=>({id:makeId('role'),title:'',time:'',description:'',icon:'volunteer_activism',published:true,sortOrder:Date.now()});
const emptyTeam=()=>({id:makeId('team'),name:'',title:'',photo:'',bio:'',credentials:[],linkedIn:'',instagram:'',published:true,sortOrder:Date.now()});
const emptyPartner=()=>({id:makeId('partner'),name:'',logo:'',description:'',relationship:'',website:'',published:true,sortOrder:Date.now()});
const emptyDocument=()=>({id:makeId('document'),category:'Legal & Registration',title:'',meta:'',description:'',status:'',action:'View',url:'',external:false,published:true,sortOrder:Date.now()});
const emptyPolicySection=()=>({id:makeId('policy'),heading:'',text:''});

export default function AdminSiteContent() {
  const { authFetch } = useAuth();
  const [active,setActive]=useState('organization');
  const [content,setContent]=useState(null);
  const [loading,setLoading]=useState(true);
  const [saving,setSaving]=useState(false);
  const [uploadingId,setUploadingId]=useState(null);
  const [uploadingMediaKey,setUploadingMediaKey]=useState(null);
  const [message,setMessage]=useState('');

  useEffect(()=>{
    let mounted=true;
    authFetch('/api/site-content/admin')
      .then(async res=>{ if(!res.ok) throw new Error('Could not load site content'); return res.json(); })
      .then(data=>{ if(mounted) setContent(data.content); })
      .catch(err=>{ if(mounted) setMessage(err.message); })
      .finally(()=>{ if(mounted) setLoading(false); });
    return()=>{mounted=false;};
  },[authFetch]);

  const list=(key)=>Array.isArray(content?.[key])?content[key]:[];
  const coreValues=useMemo(()=>list('coreValues'),[content]);
  const objectives=useMemo(()=>list('objectives'),[content]);
  const testimonials=useMemo(()=>list('testimonials'),[content]);
  const team=useMemo(()=>list('team'),[content]);
  const partners=useMemo(()=>list('partners'),[content]);
  const documents=useMemo(()=>list('documents'),[content]);
  const academyGuides=useMemo(()=>Array.isArray(content?.academy?.guides)?content.academy.guides:[],[content]);
  const academyResources=useMemo(()=>Array.isArray(content?.academy?.resources)?content.academy.resources:[],[content]);

  function setSectionValue(section,key,value){
    setContent(prev=>({...prev,[section]:{...(prev?.[section]||{}),[key]:value}}));
  }

  function applySimpleAi(section, suggestions) {
    setContent(prev => {
      const nextSection = { ...(prev?.[section] || {}) };
      for (const suggestion of suggestions) {
        if (Object.prototype.hasOwnProperty.call(nextSection, suggestion.field)) {
          nextSection[suggestion.field] = suggestion.value;
        }
      }
      return { ...prev, [section]: nextSection };
    });
  }
  function setNestedValue(section,key,nestedKey,value){
    setContent(prev=>({...prev,[section]:{...(prev?.[section]||{}),[key]:{...(prev?.[section]?.[key]||{}),[nestedKey]:value}}}));
  }
  function updateList(section,id,key,value){
    setContent(prev=>({...prev,[section]:(prev?.[section]||[]).map(item=>item.id===id?{...item,[key]:value}:item)}));
  }

  function applyListAi(section, id, suggestions, allowedFields) {
    const allowed = new Set(allowedFields);
    setContent(prev => ({
      ...prev,
      [section]: (prev?.[section] || []).map(item => {
        if (item.id !== id) return item;
        const next = { ...item };
        for (const suggestion of suggestions) {
          if (allowed.has(suggestion.field)) next[suggestion.field] = suggestion.value;
        }
        return next;
      }),
    }));
  }

  function applyNestedListAi(section, key, id, suggestions, allowedFields) {
    const allowed = new Set(allowedFields);
    setContent(prev => ({
      ...prev,
      [section]: {
        ...(prev?.[section] || {}),
        [key]: (prev?.[section]?.[key] || []).map(item => {
          if (item.id !== id) return item;
          const next = { ...item };
          for (const suggestion of suggestions) {
            if (allowed.has(suggestion.field)) next[suggestion.field] = suggestion.value;
          }
          return next;
        }),
      },
    }));
  }

  function applyNestedObjectAi(section, key, suggestions, allowedFields) {
    const allowed = new Set(allowedFields);
    setContent(prev => {
      const next = { ...(prev?.[section]?.[key] || {}) };
      for (const suggestion of suggestions) {
        if (allowed.has(suggestion.field)) next[suggestion.field] = suggestion.value;
      }
      return {
        ...prev,
        [section]: { ...(prev?.[section] || {}), [key]: next },
      };
    });
  }
  function addList(section,item){ setContent(prev=>({...prev,[section]:[...(prev?.[section]||[]),item]})); }
  function removeList(section,id,label){
    if(!window.confirm(`Remove ${label||'this item'} from the website?`)) return;
    setContent(prev=>({...prev,[section]:(prev?.[section]||[]).filter(item=>item.id!==id)}));
  }
  function updateNestedList(section,key,id,field,value){
    setContent(prev=>({...prev,[section]:{...(prev?.[section]||{}),[key]:(prev?.[section]?.[key]||[]).map(item=>item.id===id?{...item,[field]:value}:item)}}));
  }
  function addNestedList(section,key,item){ setContent(prev=>({...prev,[section]:{...(prev?.[section]||{}),[key]:[...(prev?.[section]?.[key]||[]),item]}})); }
  function removeNestedList(section,key,id,label){
    if(!window.confirm(`Remove ${label||'this item'} from the website?`)) return;
    setContent(prev=>({...prev,[section]:{...(prev?.[section]||{}),[key]:(prev?.[section]?.[key]||[]).filter(item=>item.id!==id)}}));
  }

  async function uploadSiteImage(mediaKey, file, onUploaded) {
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      setMessage('Image must be 4 MB or smaller.');
      return;
    }
    setUploadingMediaKey(mediaKey);
    setMessage('');
    try {
      const dataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error('Could not read the selected image'));
        reader.readAsDataURL(file);
      });
      const res = await authFetch('/api/site-content/media/upload', {
        method: 'POST',
        body: JSON.stringify({ dataUrl, fileName: file.name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Image upload failed');
      onUploaded(data.url);
      setMessage('Image uploaded. Save changes to publish it.');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setUploadingMediaKey(null);
    }
  }

  async function uploadDocumentFile(documentId, file) {
    if (!file) return;
    if (file.size > 6 * 1024 * 1024) {
      setMessage('Document must be 6 MB or smaller.');
      return;
    }
    setUploadingId(documentId);
    setMessage('');
    try {
      const dataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error('Could not read the selected file'));
        reader.readAsDataURL(file);
      });
      const res = await authFetch('/api/site-content/documents/upload', {
        method: 'POST',
        body: JSON.stringify({ dataUrl, fileName: file.name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      setContent(prev => ({
        ...prev,
        documents: (prev?.documents || []).map(doc => doc.id === documentId ? {
          ...doc,
          url: data.url,
          external: false,
          action: doc.action || 'View document',
          title: doc.title || file.name.replace(/\.[^.]+$/, ''),
        } : doc),
      }));
      setMessage('Document uploaded. Save changes to publish the updated record.');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setUploadingId(null);
    }
  }

  async function save(){
    setSaving(true); setMessage('');
    try{
      const res=await authFetch('/api/site-content',{method:'PUT',body:JSON.stringify({content})});
      const data=await res.json();
      if(!res.ok) throw new Error(data.error||'Save failed');
      setContent(data.content);
      try{window.localStorage.setItem('tha:site-content:v1',JSON.stringify(data.content));}catch{}
      setMessage('Saved. Public pages will use these updates.');
    }catch(error){ setMessage(error.message); }
    finally{ setSaving(false); }
  }

  if(loading){
    return <div className="min-h-screen bg-gray-50"><AdminHeader section="Site Content"/><div className="flex min-h-[60vh] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"/></div></div>;
  }

  const simple=SIMPLE_FIELDS[active];

  return (
    <div className="min-h-screen bg-gray-50 pb-24 sm:pb-8">
      <AdminHeader section="Site Content"/>
      <main className="mx-auto max-w-6xl px-3 py-5 sm:px-6 sm:py-8 lg:px-8">
        <div className="mb-5">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Site Content</h1>
          <p className="mt-1 max-w-3xl text-sm leading-relaxed text-gray-500">Code controls layout and behaviour. This area controls public words, people, links, records and documents.</p>
        </div>

        <div className="-mx-3 mb-5 overflow-x-auto px-3 sm:mx-0 sm:px-0">
          <div className="flex min-w-max gap-2 sm:flex-wrap">
            {TABS.map(([id,label])=>(
              <button key={id} type="button" onClick={()=>setActive(id)} className={cx('rounded-xl px-4 py-2.5 text-sm font-semibold transition',active===id?'bg-primary text-white shadow-sm':'border border-gray-200 bg-white text-gray-600')}>{label}</button>
            ))}
          </div>
        </div>

        {simple ? (
          <section className="space-y-5 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="grid gap-5 md:grid-cols-2">
              {simple.map(([key,label,type])=>(
                <div key={key} className={type==='textarea'?'md:col-span-2':''}>
                  <Field label={label} type={type} value={content?.[active]?.[key]} onChange={value=>setSectionValue(active,key,value)}/>
                </div>
              ))}
            </div>

            <AdminAiAssist
              section={`Site Content: ${active}`}
              current={content?.[active] || {}}
              fields={(SIMPLE_FIELDS[active] || [])
                .filter(([key, _label, type]) => type !== 'number' && !/url|phone|email|registration|year/i.test(key))
                .map(([key, label, type]) => ({ key, label, type: type || 'text' }))}
              onApply={suggestions => applySimpleAi(active, suggestions)}
              defaultInstruction="Keep all facts exactly as provided. Make the wording clearer, more human and appropriate for THA."
              className="mt-5"
            />

            {active==='home' ? (
              <div className="border-t border-gray-100 pt-5">
                <h3 className="mb-3 font-bold text-gray-800">Home hero image</h3>
                <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
                  <Field label="Image path / URL" value={content?.home?.heroImage} onChange={v=>setSectionValue('home','heroImage',v)}/>
                  <label className="flex min-h-12 cursor-pointer items-center justify-center rounded-xl border border-dashed border-primary/30 bg-primary/5 px-4 py-3 text-sm font-semibold text-primary hover:bg-primary/10">
                    {uploadingMediaKey==='home-hero'?'Uploading…':'Upload image'}
                    <input type="file" className="sr-only" accept="image/jpeg,image/png,image/webp" disabled={uploadingMediaKey==='home-hero'} onChange={e=>uploadSiteImage('home-hero',e.target.files?.[0],url=>setSectionValue('home','heroImage',url))}/>
                  </label>
                </div>
              </div>
            ) : null}

            {active==='contact' ? (
              <div className="border-t border-gray-100 pt-5">
                <h3 className="mb-4 font-bold text-gray-800">Working hours</h3>
                <div className="grid gap-4 md:grid-cols-3">
                  <Field label="Monday – Friday" value={content?.contact?.workHours?.mondayFriday} onChange={v=>setNestedValue('contact','workHours','mondayFriday',v)}/>
                  <Field label="Saturday" value={content?.contact?.workHours?.saturday} onChange={v=>setNestedValue('contact','workHours','saturday',v)}/>
                  <Field label="Sunday" value={content?.contact?.workHours?.sunday} onChange={v=>setNestedValue('contact','workHours','sunday',v)}/>
                </div>
              </div>
            ) : null}

            {active==='funding' ? (
              <div className="space-y-5 border-t border-gray-100 pt-5">
                <AddRow title="Volunteer roles" description="Roles shown on the public funding/volunteer page." button="+ Add role" onClick={()=>addNestedList('funding','volunteerRoles',emptyRole())}/>
                {(content?.funding?.volunteerRoles||[]).map((role,index)=>(
                  <Card key={role.id}>
                    <CardHeader eyebrow={`Role ${index+1}`} title={role.title||'New role'} onRemove={()=>removeNestedList('funding','volunteerRoles',role.id,role.title)}/>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="Title" value={role.title} onChange={v=>updateNestedList('funding','volunteerRoles',role.id,'title',v)}/>
                      <Field label="Time commitment" value={role.time} onChange={v=>updateNestedList('funding','volunteerRoles',role.id,'time',v)}/>
                      <Field label="Icon name" value={role.icon} onChange={v=>updateNestedList('funding','volunteerRoles',role.id,'icon',v)}/>
                      <Field label="Sort order" type="number" value={role.sortOrder} onChange={v=>updateNestedList('funding','volunteerRoles',role.id,'sortOrder',v)}/>
                      <div className="md:col-span-2"><Field label="Description" type="textarea" value={role.description} onChange={v=>updateNestedList('funding','volunteerRoles',role.id,'description',v)}/></div>
                      <Toggle label="Published" checked={role.published} onChange={v=>updateNestedList('funding','volunteerRoles',role.id,'published',v)}/>
                    </div>
                  </Card>
                ))}
                <Card>
                  <CardHeader title="Verified impact story"/>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="md:col-span-2"><Field label="Quote" type="textarea" value={content?.funding?.successStory?.quote} onChange={v=>setNestedValue('funding','successStory','quote',v)}/></div>
                    <Field label="Name" value={content?.funding?.successStory?.name} onChange={v=>setNestedValue('funding','successStory','name',v)}/>
                    <Field label="Role / context" value={content?.funding?.successStory?.role} onChange={v=>setNestedValue('funding','successStory','role',v)}/>
                    <Toggle label="Publish story" checked={content?.funding?.successStory?.published} onChange={v=>setNestedValue('funding','successStory','published',v)}/>
                  </div>
                </Card>
              </div>
            ) : null}
          </section>
        ) : active==='values' ? (
          <section className="space-y-6">
            <div className="space-y-4">
              <AddRow title="Core values" description="Keep values specific enough to mean something in practice." button="+ Add value" onClick={()=>addList('coreValues',emptyValue())}/>
              {coreValues.map((item,index)=>(
                <Card key={item.id}>
                  <CardHeader eyebrow={`Value ${index+1}`} title={item.value||'New value'} onRemove={()=>removeList('coreValues',item.id,item.value)}/>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Value" value={item.value} onChange={v=>updateList('coreValues',item.id,'value',v)}/>
                    <Field label="Icon name" value={item.icon} onChange={v=>updateList('coreValues',item.id,'icon',v)}/>
                    <div className="md:col-span-2"><Field label="What it means" type="textarea" value={item.description} onChange={v=>updateList('coreValues',item.id,'description',v)}/></div>
                    <Field label="Sort order" type="number" value={item.sortOrder} onChange={v=>updateList('coreValues',item.id,'sortOrder',v)}/>
                    <Toggle label="Published" checked={item.published} onChange={v=>updateList('coreValues',item.id,'published',v)}/>
                  </div>
                  <AdminAiAssist
                    section="Core value"
                    current={{ value: item.value, description: item.description }}
                    fields={[
                      { key: 'value', label: 'Value', type: 'text' },
                      { key: 'description', label: 'What it means', type: 'textarea' },
                    ]}
                    onApply={suggestions=>applyListAi('coreValues',item.id,suggestions,['value','description'])}
                    defaultInstruction="Keep the meaning practical and specific. Avoid generic NGO language."
                    className="mt-5"
                  />
                </Card>
              ))}
            </div>
            <div className="space-y-4">
              <AddRow title="Objectives" description="The practical things THA exists to do." button="+ Add objective" onClick={()=>addList('objectives',emptyObjective())}/>
              {objectives.map((item,index)=>(
                <Card key={item.id}>
                  <CardHeader eyebrow={`Objective ${index+1}`} title={item.title||'New objective'} onRemove={()=>removeList('objectives',item.id,item.title)}/>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Title" value={item.title} onChange={v=>updateList('objectives',item.id,'title',v)}/>
                    <Field label="Icon name" value={item.icon} onChange={v=>updateList('objectives',item.id,'icon',v)}/>
                    <div className="md:col-span-2"><Field label="Description" type="textarea" value={item.description} onChange={v=>updateList('objectives',item.id,'description',v)}/></div>
                    <Field label="Sort order" type="number" value={item.sortOrder} onChange={v=>updateList('objectives',item.id,'sortOrder',v)}/>
                    <Toggle label="Published" checked={item.published} onChange={v=>updateList('objectives',item.id,'published',v)}/>
                  </div>
                  <AdminAiAssist
                    section="THA objective"
                    current={{ title: item.title, description: item.description }}
                    fields={[
                      { key: 'title', label: 'Title', type: 'text' },
                      { key: 'description', label: 'Description', type: 'textarea' },
                    ]}
                    onApply={suggestions=>applyListAi('objectives',item.id,suggestions,['title','description'])}
                    defaultInstruction="Make this objective clear, human and practical without inventing outcomes."
                    className="mt-5"
                  />
                </Card>
              ))}
            </div>
          </section>
        ) : active==='stories' ? (
          <section className="space-y-4">
            <AddRow title="Verified stories" description="Only publish stories THA can stand behind and has permission to use." button="+ Add story" onClick={()=>addList('testimonials',emptyStory())}/>
            {testimonials.length===0 ? <Card><p className="text-sm text-gray-500">No public stories are published. That is safer than showing an unverified testimonial.</p></Card> : null}
            {testimonials.map((item,index)=>(
              <Card key={item.id}>
                <CardHeader eyebrow={`Story ${index+1}`} title={item.name||'New story'} onRemove={()=>removeList('testimonials',item.id,item.name)}/>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="md:col-span-2"><Field label="Quote" type="textarea" value={item.quote} onChange={v=>updateList('testimonials',item.id,'quote',v)}/></div>
                  <Field label="Name" value={item.name} onChange={v=>updateList('testimonials',item.id,'name',v)}/>
                  <Field label="Role / context" value={item.role} onChange={v=>updateList('testimonials',item.id,'role',v)}/>
                  <Field label="Photo path / URL" value={item.photo} onChange={v=>updateList('testimonials',item.id,'photo',v)}/>
                  <Field label="Sort order" type="number" value={item.sortOrder} onChange={v=>updateList('testimonials',item.id,'sortOrder',v)}/>
                  <Toggle label="Published" checked={item.published} onChange={v=>updateList('testimonials',item.id,'published',v)}/>
                </div>
                <AdminAiAssist
                  section="Verified impact story"
                  current={{ quote: item.quote, role: item.role }}
                  fields={[
                    { key: 'quote', label: 'Quote', type: 'textarea' },
                    { key: 'role', label: 'Role / context', type: 'text' },
                  ]}
                  onApply={suggestions=>applyListAi('testimonials',item.id,suggestions,['quote','role'])}
                  defaultInstruction="Do not invent or embellish the story. Improve only the wording already supplied."
                  className="mt-5"
                />
              </Card>
            ))}
          </section>
        ) : active==='academy' ? (
          <section className="space-y-6">
            <Card>
              <CardHeader title="Academy introduction"/>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Page title" value={content?.academy?.heroTitle} onChange={v=>setSectionValue('academy','heroTitle',v)}/>
                <Field label="Help section title" value={content?.academy?.helpTitle} onChange={v=>setSectionValue('academy','helpTitle',v)}/>
                <div className="md:col-span-2"><Field label="Page introduction" type="textarea" value={content?.academy?.heroText} onChange={v=>setSectionValue('academy','heroText',v)}/></div>
                <div className="md:col-span-2"><Field label="Help guidance (one paragraph per line)" type="textarea" value={(content?.academy?.helpText||[]).join('\n')} onChange={v=>setSectionValue('academy','helpText',v.split('\n').map(x=>x.trim()).filter(Boolean))}/></div>
              </div>
            </Card>
            <div className="space-y-4">
              <AddRow title="Health guides" button="+ Add guide" onClick={()=>addNestedList('academy','guides',emptyGuide())}/>
              {academyGuides.map((g,index)=>(
                <Card key={g.id}>
                  <CardHeader eyebrow={`Guide ${index+1}`} title={g.title||'New guide'} onRemove={()=>removeNestedList('academy','guides',g.id,g.title)}/>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Topic" value={g.topic} onChange={v=>updateNestedList('academy','guides',g.id,'topic',v)}/>
                    <Field label="Icon name" value={g.icon} onChange={v=>updateNestedList('academy','guides',g.id,'icon',v)}/>
                    <Field label="Title" value={g.title} onChange={v=>updateNestedList('academy','guides',g.id,'title',v)}/>
                    <Field label="Button label" value={g.action} onChange={v=>updateNestedList('academy','guides',g.id,'action',v)}/>
                    <div className="md:col-span-2"><Field label="Summary" type="textarea" value={g.summary} onChange={v=>updateNestedList('academy','guides',g.id,'summary',v)}/></div>
                    <Field label="Sort order" type="number" value={g.sortOrder} onChange={v=>updateNestedList('academy','guides',g.id,'sortOrder',v)}/>
                    <Toggle label="Published" checked={g.published} onChange={v=>updateNestedList('academy','guides',g.id,'published',v)}/>
                  </div>
                </Card>
              ))}
            </div>
            <div className="space-y-4">
              <AddRow title="Trusted resources" description="Links to WHO, MOH and other trusted sources." button="+ Add resource" onClick={()=>addNestedList('academy','resources',emptyResource())}/>
              {academyResources.map((r,index)=>(
                <Card key={r.id}>
                  <CardHeader eyebrow={`Resource ${index+1}`} title={r.title||'New resource'} onRemove={()=>removeNestedList('academy','resources',r.id,r.title)}/>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Title" value={r.title} onChange={v=>updateNestedList('academy','resources',r.id,'title',v)}/>
                    <Field label="Source" value={r.source} onChange={v=>updateNestedList('academy','resources',r.id,'source',v)}/>
                    <Field label="URL" value={r.url} onChange={v=>updateNestedList('academy','resources',r.id,'url',v)}/>
                    <Field label="Date" type="date" value={r.date} onChange={v=>updateNestedList('academy','resources',r.id,'date',v)}/>
                    <Field label="Category" value={r.category} onChange={v=>updateNestedList('academy','resources',r.id,'category',v)}/>
                    <Field label="Topics (comma separated)" value={(r.topics||[]).join(', ')} onChange={v=>updateNestedList('academy','resources',r.id,'topics',v.split(',').map(x=>x.trim()).filter(Boolean))}/>
                    <div className="md:col-span-2"><Field label="Excerpt" type="textarea" value={r.excerpt} onChange={v=>updateNestedList('academy','resources',r.id,'excerpt',v)}/></div>
                    <Field label="Sort order" type="number" value={r.sortOrder} onChange={v=>updateNestedList('academy','resources',r.id,'sortOrder',v)}/>
                    <Toggle label="Published" checked={r.published} onChange={v=>updateNestedList('academy','resources',r.id,'published',v)}/>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        ) : active==='topics' ? (
          <section className="space-y-4">
            <AddRow title="Health topic pages" description="These pages support public education, SEO and AI discovery."/>
            {['hepatitis','hiv','mental-health'].map(id=>{
              const topic=content?.healthTopics?.[id]||{};
              return (
                <Card key={id}>
                  <CardHeader eyebrow={id.replace('-', ' ')} title={topic.title||id}/>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Title" value={topic.title} onChange={v=>setNestedValue('healthTopics',id,'title',v)}/>
                    <Field label="Related button label" value={topic.relatedLabel} onChange={v=>setNestedValue('healthTopics',id,'relatedLabel',v)}/>
                    <div className="md:col-span-2"><Field label="Introduction" type="textarea" value={topic.intro} onChange={v=>setNestedValue('healthTopics',id,'intro',v)}/></div>
                    <div className="md:col-span-2"><Field label="Overview" type="textarea" value={topic.overview} onChange={v=>setNestedValue('healthTopics',id,'overview',v)}/></div>
                    <div className="md:col-span-2"><Field label="Why it matters" type="textarea" value={topic.whyItMatters} onChange={v=>setNestedValue('healthTopics',id,'whyItMatters',v)}/></div>
                    <div className="md:col-span-2"><Field label="THA actions (one per line)" type="textarea" value={(topic.actions||[]).join('\n')} onChange={v=>setNestedValue('healthTopics',id,'actions',v.split('\n').map(x=>x.trim()).filter(Boolean))}/></div>
                    <Field label="Related URL" value={topic.related} onChange={v=>setNestedValue('healthTopics',id,'related',v)}/>
                  </div>
                </Card>
              );
            })}
          </section>
        ) : active==='policies' ? (
          <section className="space-y-5">
            <AddRow title="Website policies" description="Keep policy wording current when services or legal requirements change."/>
            {['privacy','cookies','terms'].map(id=>{
              const policy=content?.policies?.[id]||{sections:[]};
              return (
                <Card key={id}>
                  <CardHeader eyebrow={id} title={policy.title||id}/>
                  <div className="grid gap-4">
                    <Field label="Title" value={policy.title} onChange={v=>setNestedValue('policies',id,'title',v)}/>
                    <Field label="Introduction" type="textarea" value={policy.intro} onChange={v=>setNestedValue('policies',id,'intro',v)}/>
                    {(policy.sections||[]).map((section,index)=>(
                      <div key={section.id||index} className="rounded-xl bg-gray-50 p-4">
                        <div className="mb-3 flex items-center justify-between">
                          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Section {index+1}</span>
                          <button type="button" onClick={()=>{
                            const next=(policy.sections||[]).filter((_,i)=>i!==index);
                            setNestedValue('policies',id,'sections',next);
                          }} className="text-xs font-semibold text-red-600">Remove</button>
                        </div>
                        <div className="space-y-3">
                          <Field label="Heading" value={section.heading} onChange={v=>{
                            const next=[...(policy.sections||[])]; next[index]={...section,heading:v}; setNestedValue('policies',id,'sections',next);
                          }}/>
                          <Field label="Text" type="textarea" value={section.text} onChange={v=>{
                            const next=[...(policy.sections||[])]; next[index]={...section,text:v}; setNestedValue('policies',id,'sections',next);
                          }}/>
                        </div>
                      </div>
                    ))}
                    <button type="button" onClick={()=>setNestedValue('policies',id,'sections',[...(policy.sections||[]),emptyPolicySection()])} className="rounded-xl border border-primary/20 px-4 py-3 text-sm font-semibold text-primary hover:bg-primary/5">+ Add section</button>
                  </div>
                </Card>
              );
            })}
          </section>
        ) : active==='team' ? (
          <section className="space-y-4">
            <AddRow title="Team" description="Manage public leadership profiles and their order." button="+ Add team member" onClick={()=>addList('team',emptyTeam())}/>
            {team.map((member,index)=>(
              <Card key={member.id}>
                <CardHeader eyebrow={`Person ${index+1}`} title={member.name||'New team member'} onRemove={()=>removeList('team',member.id,member.name)}/>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Name" value={member.name} onChange={v=>updateList('team',member.id,'name',v)}/>
                  <Field label="Title" value={member.title} onChange={v=>updateList('team',member.id,'title',v)}/>
                  <div>
                    <Field label="Photo path / URL" value={member.photo} onChange={v=>updateList('team',member.id,'photo',v)}/>
                    <label className="mt-2 flex min-h-11 cursor-pointer items-center justify-center rounded-xl border border-dashed border-primary/30 bg-primary/5 px-3 py-2 text-sm font-semibold text-primary hover:bg-primary/10">
                      {uploadingMediaKey===`team-${member.id}`?'Uploading…':'Upload photo'}
                      <input type="file" className="sr-only" accept="image/jpeg,image/png,image/webp" disabled={uploadingMediaKey===`team-${member.id}`} onChange={e=>uploadSiteImage(`team-${member.id}`,e.target.files?.[0],url=>updateList('team',member.id,'photo',url))}/>
                    </label>
                  </div>
                  <Field label="Sort order" type="number" value={member.sortOrder} onChange={v=>updateList('team',member.id,'sortOrder',v)}/>
                  <div className="md:col-span-2"><Field label="Short bio" type="textarea" value={member.bio} onChange={v=>updateList('team',member.id,'bio',v)}/></div>
                  <div className="md:col-span-2"><Field label="Credentials (one per line)" type="textarea" value={(member.credentials||[]).join('\n')} onChange={v=>updateList('team',member.id,'credentials',v.split('\n').map(x=>x.trim()).filter(Boolean))}/></div>
                  <Field label="LinkedIn URL" value={member.linkedIn} onChange={v=>updateList('team',member.id,'linkedIn',v)}/>
                  <Field label="Instagram URL" value={member.instagram} onChange={v=>updateList('team',member.id,'instagram',v)}/>
                  <Toggle label="Published" checked={member.published} onChange={v=>updateList('team',member.id,'published',v)}/>
                </div>
                <AdminAiAssist
                  section="Team profile"
                  current={{ title: member.title, bio: member.bio }}
                  fields={[
                    { key: 'title', label: 'Title', type: 'text' },
                    { key: 'bio', label: 'Short bio', type: 'textarea' },
                  ]}
                  onApply={suggestions=>applyListAi('team',member.id,suggestions,['title','bio'])}
                  defaultInstruction="Keep this factual and professional. Do not invent qualifications, roles or achievements."
                  className="mt-5"
                />
              </Card>
            ))}
          </section>
        ) : active==='partners' ? (
          <section className="space-y-4">
            <AddRow title="Partners" description="Keep only relationships THA can support with evidence." button="+ Add partner" onClick={()=>addList('partners',emptyPartner())}/>
            {partners.map((partner,index)=>(
              <Card key={partner.id}>
                <CardHeader eyebrow={`Partner ${index+1}`} title={partner.name||'New partner'} onRemove={()=>removeList('partners',partner.id,partner.name)}/>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Name" value={partner.name} onChange={v=>updateList('partners',partner.id,'name',v)}/>
                  <Field label="Relationship" value={partner.relationship} onChange={v=>updateList('partners',partner.id,'relationship',v)}/>
                  <div>
                    <Field label="Logo path / URL" value={partner.logo} onChange={v=>updateList('partners',partner.id,'logo',v)}/>
                    <label className="mt-2 flex min-h-11 cursor-pointer items-center justify-center rounded-xl border border-dashed border-primary/30 bg-primary/5 px-3 py-2 text-sm font-semibold text-primary hover:bg-primary/10">
                      {uploadingMediaKey===`partner-${partner.id}`?'Uploading…':'Upload logo'}
                      <input type="file" className="sr-only" accept="image/jpeg,image/png,image/webp" disabled={uploadingMediaKey===`partner-${partner.id}`} onChange={e=>uploadSiteImage(`partner-${partner.id}`,e.target.files?.[0],url=>updateList('partners',partner.id,'logo',url))}/>
                    </label>
                  </div>
                  <Field label="Website URL" value={partner.website} onChange={v=>updateList('partners',partner.id,'website',v)}/>
                  <div className="md:col-span-2"><Field label="Description" type="textarea" value={partner.description} onChange={v=>updateList('partners',partner.id,'description',v)}/></div>
                  <Field label="Sort order" type="number" value={partner.sortOrder} onChange={v=>updateList('partners',partner.id,'sortOrder',v)}/>
                  <Toggle label="Published" checked={partner.published} onChange={v=>updateList('partners',partner.id,'published',v)}/>
                </div>
                <AdminAiAssist
                  section="Partner record"
                  current={{ relationship: partner.relationship, description: partner.description }}
                  fields={[
                    { key: 'relationship', label: 'Relationship', type: 'text' },
                    { key: 'description', label: 'Description', type: 'textarea' },
                  ]}
                  onApply={suggestions=>applyListAi('partners',partner.id,suggestions,['relationship','description'])}
                  defaultInstruction="Describe only the verified relationship. Do not imply a partnership or endorsement that is not already stated."
                  className="mt-5"
                />
              </Card>
            ))}
          </section>
        ) : (
          <section className="space-y-4">
            <AddRow title="Documents & links" description="Add policies, reports, certificates or external verification links." button="+ Add document" onClick={()=>addList('documents',emptyDocument())}/>
            {documents.map((doc,index)=>(
              <Card key={doc.id}>
                <CardHeader eyebrow={`Item ${index+1}`} title={doc.title||'New document'} onRemove={()=>removeList('documents',doc.id,doc.title)}/>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Category" value={doc.category} onChange={v=>updateList('documents',doc.id,'category',v)}/>
                  <Field label="Title" value={doc.title} onChange={v=>updateList('documents',doc.id,'title',v)}/>
                  <Field label="Meta / date" value={doc.meta} onChange={v=>updateList('documents',doc.id,'meta',v)}/>
                  <Field label="Status badge" value={doc.status} onChange={v=>updateList('documents',doc.id,'status',v)}/>
                  <div className="md:col-span-2"><Field label="Description" type="textarea" value={doc.description} onChange={v=>updateList('documents',doc.id,'description',v)}/></div>
                  <Field label="Button label" value={doc.action} onChange={v=>updateList('documents',doc.id,'action',v)}/>
                  <div>
                    <span className="mb-2 block text-sm font-semibold text-gray-700">Upload document</span>
                    <label className="flex min-h-12 cursor-pointer items-center justify-center rounded-xl border border-dashed border-primary/30 bg-primary/5 px-4 py-3 text-center text-sm font-semibold text-primary hover:bg-primary/10">
                      {uploadingId === doc.id ? 'Uploading…' : 'Choose PDF or Office file'}
                      <input
                        type="file"
                        className="sr-only"
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,application/pdf"
                        disabled={uploadingId === doc.id}
                        onChange={e => uploadDocumentFile(doc.id, e.target.files?.[0])}
                      />
                    </label>
                    <p className="mt-1 text-xs text-gray-400">Maximum 6 MB. Uploading fills the URL automatically.</p>
                  </div>
                  <Field label="Document or external URL" value={doc.url} onChange={v=>updateList('documents',doc.id,'url',v)}/>
                  <Field label="Sort order" type="number" value={doc.sortOrder} onChange={v=>updateList('documents',doc.id,'sortOrder',v)}/>
                  <Toggle label="Published" checked={doc.published} onChange={v=>updateList('documents',doc.id,'published',v)}/>
                  <Toggle label="External link" checked={doc.external} onChange={v=>updateList('documents',doc.id,'external',v)}/>
                </div>
                <AdminAiAssist
                  section="Document / accountability record"
                  current={{ title: doc.title, category: doc.category, description: doc.description, action: doc.action }}
                  fields={[
                    { key: 'title', label: 'Title', type: 'text' },
                    { key: 'category', label: 'Category', type: 'text' },
                    { key: 'description', label: 'Description', type: 'textarea' },
                    { key: 'action', label: 'Button label', type: 'text' },
                  ]}
                  onApply={suggestions=>applyListAi('documents',doc.id,suggestions,['title','category','description','action'])}
                  defaultInstruction="Make the record clear and institutional. Do not invent dates, verification status or document contents."
                  className="mt-5"
                />
              </Card>
            ))}
          </section>
        )}

        {message ? <div className={cx('mt-5 rounded-xl px-4 py-3 text-sm font-medium',message.startsWith('Saved')?'bg-green-50 text-green-700':'bg-red-50 text-red-700')}>{message}</div> : null}
      </main>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 p-3 backdrop-blur sm:static sm:mt-2 sm:border-0 sm:bg-transparent sm:p-0">
        <div className="mx-auto max-w-6xl sm:px-6 lg:px-8">
          <button type="button" onClick={save} disabled={saving||!content} className="w-full rounded-xl bg-secondary px-5 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-secondary-dark disabled:opacity-50 sm:w-auto sm:min-w-40">
            {saving?'Saving…':'Save changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
