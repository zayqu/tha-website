import { Link } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { SEO } from '../components/SEO';
import { useSiteContent } from '../hooks/useSiteContent';

const CATEGORY_COPY = {
  'Legal & Registration': 'Core information about Tanzania Health Alliance as a registered non-governmental organization in Tanzania.',
  'Governance & Policies': 'Policies and governance documents that explain how THA works and protects its stakeholders.',
  'Reports & Evidence': 'Reports, program records and evidence that document THA activities and results.',
  'External Verification': 'Independent organizations and public records that reference THA or its leadership.',
  'Public Activity & Evidence': 'Dated THA records documenting advocacy, partnerships and community health work.',
};

function DocumentCard({ item }) {
  const classes = 'group flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-card sm:p-6';
  const content = (
    <>
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-primary/5">
          <Icon name={item.external ? 'verified' : 'description'} size={22} category="primary" />
        </div>
        {item.status ? (
          <span className="rounded-full bg-secondary/10 px-3 py-1 text-[11px] font-semibold text-secondary">{item.status}</span>
        ) : null}
      </div>
      {item.meta ? <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-accent">{item.meta}</p> : null}
      <h3 className="mb-3 text-lg font-bold text-primary sm:text-xl">{item.title}</h3>
      <p className="mb-6 text-sm leading-relaxed text-gray-600">{item.description}</p>
      <span className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-secondary group-hover:underline">
        {item.action || 'View'}
        <Icon name={item.external ? 'open_in_new' : 'arrow_forward'} size={15} category="secondary" />
      </span>
    </>
  );

  const url = item.url || '#';
  const isFile = /^\/api\/media\/documents\//i.test(url);
  if (item.external || /^mailto:/i.test(url) || isFile) {
    return <a href={url} target={/^mailto:/i.test(url) ? undefined : '_blank'} rel="noopener noreferrer" className={classes}>{content}</a>;
  }
  return <Link to={url} className={classes}>{content}</Link>;
}

export default function Documents() {
  const site = useSiteContent();
  const org = site.organization || {};
  const contact = site.contact || {};
  const documents = (site.documents || [])
    .filter(item => item.published !== false)
    .sort((a, b) => Number(a.sortOrder || 0) - Number(b.sortOrder || 0));

  const groups = Object.entries(documents.reduce((acc, item) => {
    const key = item.category || 'Documents';
    (acc[key] ||= []).push(item);
    return acc;
  }, {}));

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Documents & Accountability | Tanzania Health Alliance',
    description: 'Legal, policy, accountability and independent verification resources for Tanzania Health Alliance.',
    url: 'https://tzhealthalliance.or.tz/documents',
    about: {
      '@type': 'NGO',
      name: org.name || 'Tanzania Health Alliance',
      alternateName: [org.shortName || 'THA', 'THA Tanzania'],
      identifier: org.registrationNumber || '',
      address: {
        '@type': 'PostalAddress',
        addressLocality: contact.city || 'Dar es Salaam',
        addressCountry: 'TZ',
      },
    },
  };

  return (
    <div className="pt-14 md:pt-16 bg-cool-gray">
      <SEO
        title="Documents & Accountability"
        description="Access Tanzania Health Alliance registration information, policies, public activity records and independent verification links."
        canonicalPath="/documents"
        structuredData={structuredData}
      />

      <section className="bg-primary py-14 text-white md:py-20">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-white/70">Transparency</p>
          <h1 className="mb-5 text-4xl font-bold tracking-tight md:text-5xl">Documents & Accountability</h1>
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-white/90">
            Registration information, policies, public records and independent references that help partners, funders and communities understand who we are and how we work.
          </p>
        </div>
      </section>

      <section className="border-b border-gray-200 bg-white py-7">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 sm:px-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold text-primary">{org.name || 'Tanzania Health Alliance'} ({org.shortName || 'THA'})</p>
            <p className="mt-1 text-sm text-gray-600">
              Registered NGO{org.registrationNumber ? ` · No. ${org.registrationNumber}` : ''}{contact.city ? ` · ${contact.city}, ${contact.country || 'Tanzania'}` : ''}
            </p>
          </div>
          <a
            href={`mailto:${contact.email || 'info@tzhealthalliance.or.tz'}?subject=THA%20due%20diligence%20documents`}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-secondary px-5 py-3 text-sm font-semibold text-white transition hover:bg-secondary-dark md:w-auto"
          >
            Request due-diligence documents
            <Icon name="mail" size={17} color="white" />
          </a>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-20">
        {groups.length ? groups.map(([name, items], index) => (
          <section key={name} className={index ? 'mt-14 md:mt-16' : ''}>
            <div className="mb-7 max-w-3xl">
              <h2 className="mb-3 text-2xl font-bold text-primary md:text-3xl">{name}</h2>
              <p className="leading-relaxed text-gray-600">{CATEGORY_COPY[name] || 'THA documents, records and verification resources.'}</p>
            </div>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {items.map(item => <DocumentCard key={item.id || item.title} item={item} />)}
            </div>
          </section>
        )) : (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-500">
            No public documents are listed yet.
          </div>
        )}
      </div>

      <section className="bg-white py-12 md:py-14">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h2 className="mb-4 text-2xl font-bold text-primary">Need something that is not listed?</h2>
          <p className="mx-auto mb-7 max-w-2xl text-gray-600">
            Funding partners and institutions can request registration, governance, program or due-diligence documents directly from THA.
          </p>
          <Link to="/contact" className="inline-flex items-center gap-2 rounded-lg border-2 border-primary px-6 py-3 font-semibold text-primary transition hover:bg-primary hover:text-white">
            Contact THA
            <Icon name="arrow_forward" size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
