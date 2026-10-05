import { Link, Navigate, useParams } from 'react-router-dom';
import thematicData from '../data/thematicAreas.json';
import { SEO } from '../components/SEO';

const topicMap = {
  hepatitis: 'viral-hepatitis',
  hiv: 'hiv',
  'mental-health': 'mental-health',
};

const extraCopy = {
  'viral-hepatitis': {
    title: 'Viral Hepatitis in Tanzania',
    intro: 'Tanzania Health Alliance works to improve awareness, prevention, early testing, vaccination advocacy and access to care for viral hepatitis, with particular attention to hepatitis B.',
    searches: 'Hepatitis Tanzania, Hepatitis B Tanzania, hepatitis awareness, hepatitis testing, hepatitis vaccination, liver health, viral hepatitis NGO Tanzania, KAPIME.',
    related: '/campaigns/kapime',
    relatedLabel: 'Explore the KAPIME campaign',
  },
  hiv: {
    title: 'HIV Awareness and Community Health in Tanzania',
    intro: 'Tanzania Health Alliance supports HIV awareness, stigma reduction, testing education, treatment access and community-led health engagement in Tanzania.',
    searches: 'HIV Tanzania, HIV awareness Tanzania, HIV testing Tanzania, HIV stigma reduction, HIV community health, public health NGO Tanzania.',
    related: '/projects',
    relatedLabel: 'Explore THA projects',
  },
  'mental-health': {
    title: 'Mental Health Awareness in Tanzania',
    intro: 'Tanzania Health Alliance supports mental health awareness, stigma reduction, youth resilience, peer support and healthier community conversations in Tanzania.',
    searches: 'Mental health Tanzania, youth mental health Tanzania, mental health NGO Tanzania, mental health awareness, mental wellbeing, Life Unlocked, Talk To Heal.',
    related: '/campaigns/life-unlocked',
    relatedLabel: 'Explore Life Unlocked',
  },
};

export default function TopicHub() {
  const { topicId } = useParams();
  const id = topicMap[topicId];
  const area = thematicData.thematicAreas.find(item => item.id === id);
  const copy = extraCopy[id];

  if (!area || !copy) return <Navigate to="/about" replace />;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: copy.title,
    description: copy.intro,
    url: `https://tzhealthalliance.or.tz/health/${topicId}`,
    about: [
      { '@type': 'Thing', name: area.name },
      { '@type': 'NGO', name: 'Tanzania Health Alliance', alternateName: ['THA', 'THA Tanzania'] },
    ],
    isPartOf: {
      '@type': 'WebSite',
      name: 'Tanzania Health Alliance',
      url: 'https://tzhealthalliance.or.tz/',
    },
  };

  return (
    <div className="pt-14 md:pt-16">
      <SEO
        title={copy.title}
        description={copy.intro}
        canonicalPath={`/health/${topicId}`}
        structuredData={structuredData}
      />

      <section className="section-padding bg-primary text-white">
        <div className="container-custom max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-white/70 mb-3">Health Focus</p>
          <h1 className="heading-xl text-white mb-5">{copy.title}</h1>
          <p className="text-lg md:text-xl text-white/90 leading-relaxed">{copy.intro}</p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom max-w-5xl grid lg:grid-cols-2 gap-10">
          <div>
            <h2 className="heading-md mb-4">Why it matters</h2>
            <p className="body-lg text-neutral-dark/80 mb-6">{area.overview}</p>
            <p className="body-md text-neutral-dark/70">{area.whyItMatters}</p>
          </div>
          <div>
            <h2 className="heading-md mb-4">What THA does</h2>
            <ul className="space-y-3">
              {area.ourActions.map(action => (
                <li key={action} className="body-md text-neutral-dark/80">• {action}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section-padding bg-neutral">
        <div className="container-custom max-w-5xl">
          <h2 className="heading-md mb-4">Related public health topics</h2>
          <p className="body-md text-neutral-dark/70 mb-6">{copy.searches}</p>
          <div className="flex flex-wrap gap-3">
            <Link to={copy.related} className="px-5 py-3 bg-primary text-white rounded-xl font-semibold">
              {copy.relatedLabel}
            </Link>
            <Link to="/news" className="px-5 py-3 bg-white text-primary rounded-xl font-semibold border border-primary/10">
              Read THA news
            </Link>
            <Link to="/academy" className="px-5 py-3 bg-white text-primary rounded-xl font-semibold border border-primary/10">
              Health resources
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
