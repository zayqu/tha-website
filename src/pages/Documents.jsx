import { Link } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { SEO } from '../components/SEO';

const groups = [
  {
    title: 'Legal & Registration',
    intro: 'Core information about Tanzania Health Alliance as a registered non-governmental organization in Tanzania.',
    items: [
      {
        title: 'NGO Registration',
        meta: 'Registration No. 00NGO/R/8379',
        description: 'Tanzania Health Alliance (THA) is registered as a non-governmental organization in Tanzania and is based in Dar es Salaam.',
        status: 'Verified in THA records',
        action: 'Request certificate copy',
        href: 'mailto:info@tzhealthalliance.or.tz?subject=Request%20for%20THA%20registration%20certificate',
        external: true,
      },
      {
        title: 'Privacy Policy',
        meta: 'Website policy',
        description: 'How THA handles information submitted through this website.',
        action: 'View policy',
        href: '/privacy',
      },
      {
        title: 'Cookie Policy',
        meta: 'Website policy',
        description: 'Information about cookies and related technologies used on the THA website.',
        action: 'View policy',
        href: '/cookies',
      },
      {
        title: 'Terms of Use',
        meta: 'Website policy',
        description: 'Terms governing use of the THA website and its public information.',
        action: 'View terms',
        href: '/terms',
      },
    ],
  },
  {
    title: 'External Verification',
    intro: 'Independent organizations and public records that reference THA or its leadership.',
    items: [
      {
        title: 'World Hepatitis Alliance — AFRO Board',
        meta: 'Independent verification',
        description: 'World Hepatitis Alliance identifies Shaibu Issa, Founder and Director of THA, as its AFRO Board Member.',
        action: 'Verify externally',
        href: 'https://www.worldhepatitisalliance.org/our-team-2025/',
        external: true,
      },
      {
        title: 'AASLD — Patient Advocate Profile',
        meta: 'Independent verification',
        description: 'AASLD identifies Shaibu Issa as Founder and Director of Tanzania Health Alliance and a WHA African Region Board Member.',
        action: 'Verify externally',
        href: 'https://www.aasld.org/tlm-26/shaibu-issa',
        external: true,
      },
      {
        title: '2025 UHC Day Champion',
        meta: 'Independent recognition',
        description: 'Universal Health Coverage Day recognizes Shaibu Issa as Founder and Director of THA and highlights THA’s hepatitis advocacy.',
        action: 'View recognition',
        href: 'https://www.universalhealthcoverageday.org/uhc-champions/2025-uhc-champion-shaibu-issa/',
        external: true,
      },
      {
        title: '2026 Hepatitis B Advocacy Awardee',
        meta: 'Independent funding record',
        description: 'The African Hepatitis B Advocacy Coalition lists Tanzania Health Alliance as a 2026 awardee for the KAPIME campaign.',
        action: 'View awardee record',
        href: 'https://abachepb.org/funding/current-awardees-2026/',
        external: true,
      },
    ],
  },
  {
    title: 'Public Activity & Evidence',
    intro: 'Dated THA records documenting advocacy, partnerships and community health work.',
    items: [
      {
        title: 'Parliamentary Committee Engagement',
        meta: '6 May 2026',
        description: 'THA engaged the Parliamentary Committee on Health and Wellbeing on hepatitis B birth-dose vaccination.',
        action: 'Read record',
        href: '/news/tha-engages-parliamentary-committee-on-hepatitis-b-birth-dose-vaccination',
      },
      {
        title: 'Recognition in Parliament',
        meta: '2026',
        description: 'THA recorded recognition in the Parliament of Tanzania for its contribution to the fight against viral hepatitis.',
        action: 'Read record',
        href: '/news/tha-recognized-in-parliament-for-contribution-to-the-fight-against-viral-hepatitis',
      },
      {
        title: 'THA–UNICEF Strategic Meeting',
        meta: '18 February 2026',
        description: 'A strategic discussion focused on hepatitis B birth-dose vaccination and maternal-newborn health systems.',
        action: 'Read record',
        href: '/news/tha-unicef-strategic-meeting-on-hepatitis-b-birth-dose-vaccination',
      },
      {
        title: 'Youth Mental Health with ActionAid Tanzania',
        meta: '7 February 2026',
        description: 'THA documented a youth mental-health session delivered in partnership with ActionAid Tanzania.',
        action: 'Read record',
        href: '/news/tanzania-health-alliance-hosts-youth-mental-health-session-in-partnership-with-actionaid-tanzania',
      },
      {
        title: 'Hepatitis B Birth-Dose Advocacy',
        meta: '6 January 2026',
        description: 'THA documented its role in advocacy for introduction of the hepatitis B birth dose in Tanzania.',
        action: 'Read record',
        href: '/news/advancing-high-level-advocacy-for-hepatitis-b-birth-dose-introduction-in-tanzania',
      },
      {
        title: 'Full News & Activity Archive',
        meta: 'Ongoing',
        description: 'Browse THA’s dated public record of programs, advocacy, meetings, campaigns and community activities.',
        action: 'Open archive',
        href: '/news',
      },
    ],
  },
];

const DocumentCard = ({ item }) => {
  const classes = 'group flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-card';
  const content = (
    <>
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-primary/5">
          <Icon name={item.external ? 'verified' : 'description'} size={22} category="primary" />
        </div>
        {item.status && (
          <span className="rounded-full bg-secondary/10 px-3 py-1 text-[11px] font-semibold text-secondary">
            {item.status}
          </span>
        )}
      </div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-accent">{item.meta}</p>
      <h3 className="mb-3 text-xl font-bold text-primary">{item.title}</h3>
      <p className="mb-6 text-sm leading-relaxed text-gray-600">{item.description}</p>
      <span className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-secondary group-hover:underline">
        {item.action}
        <Icon name={item.external ? 'open_in_new' : 'arrow_forward'} size={15} category="secondary" />
      </span>
    </>
  );

  if (item.external) {
    return <a href={item.href} target={item.href.startsWith('mailto:') ? undefined : '_blank'} rel="noopener noreferrer" className={classes}>{content}</a>;
  }
  return <Link to={item.href} className={classes}>{content}</Link>;
};

export default function Documents() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Documents & Accountability | Tanzania Health Alliance',
    description: 'Legal, policy, accountability and independent verification resources for Tanzania Health Alliance.',
    url: 'https://tzhealthalliance.or.tz/documents',
    about: {
      '@type': 'NGO',
      name: 'Tanzania Health Alliance',
      alternateName: ['THA', 'THA Tanzania'],
      identifier: '00NGO/R/8379',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Dar es Salaam',
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

      <section className="bg-primary py-16 text-white md:py-20">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-white/70">Transparency</p>
          <h1 className="mb-5 text-4xl font-bold tracking-tight md:text-5xl">Documents & Accountability</h1>
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-white/90">
            Registration information, policies, public records and independent references that help partners, funders and communities understand who we are and how we work.
          </p>
        </div>
      </section>

      <section className="border-b border-gray-200 bg-white py-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 sm:px-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold text-primary">Tanzania Health Alliance (THA)</p>
            <p className="mt-1 text-sm text-gray-600">Registered NGO · No. 00NGO/R/8379 · Dar es Salaam, Tanzania</p>
          </div>
          <a
            href="mailto:info@tzhealthalliance.or.tz?subject=THA%20due%20diligence%20documents"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-secondary px-5 py-3 text-sm font-semibold text-white transition hover:bg-secondary-dark"
          >
            Request due-diligence documents
            <Icon name="mail" size={17} color="white" />
          </a>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-20">
        {groups.map((group, index) => (
          <section key={group.title} className={index ? 'mt-16' : ''}>
            <div className="mb-8 max-w-3xl">
              <h2 className="mb-3 text-2xl font-bold text-primary md:text-3xl">{group.title}</h2>
              <p className="leading-relaxed text-gray-600">{group.intro}</p>
            </div>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {group.items.map(item => <DocumentCard key={item.title} item={item} />)}
            </div>
          </section>
        ))}
      </div>

      <section className="bg-white py-14">
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
