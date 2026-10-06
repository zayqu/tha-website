import { Link, Navigate, useParams } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { useSiteContent } from '../hooks/useSiteContent';



export default function TopicHub() {
  const { topicId } = useParams();
  const site = useSiteContent();
  const org = site.organization || {};
  const copy = site.healthTopics?.[topicId];

  if (!copy) return <Navigate to="/about" replace />;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: copy.title,
    description: copy.intro,
    url: `https://tzhealthalliance.or.tz/health/${topicId}`,
    about: [
      { '@type': 'Thing', name: copy.title },
      { '@type': 'NGO', name: org.name || 'Tanzania Health Alliance', alternateName: [org.shortName || 'THA', 'THA Tanzania'] },
    ],
    isPartOf: {
      '@type': 'WebSite',
      name: org.name || 'Tanzania Health Alliance',
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
            <p className="body-lg text-neutral-dark/80 mb-6">{copy.overview}</p>
            <p className="body-md text-neutral-dark/70">{copy.whyItMatters}</p>
          </div>
          <div>
            <h2 className="heading-md mb-4">What THA does</h2>
            <ul className="space-y-3">
              {(copy.actions || []).map(action => (
                <li key={action} className="body-md text-neutral-dark/80">• {action}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section-padding bg-neutral">
        <div className="container-custom max-w-5xl">
          <h2 className="heading-md mb-4">Related THA work</h2>
          <p className="body-md text-neutral-dark/70 mb-6">Explore the campaigns, news and public-health resources connected to this topic.</p>
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
