import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { useSiteContent } from '../hooks/useSiteContent';



export default function LegalPolicy({ type }) {
  const site = useSiteContent();
  const policies = site.policies || {};
  const policy = policies[type] || policies.privacy || { title: 'Policy', intro: '', sections: [] };

  return (
    <div className="bg-cool-gray pt-14 md:pt-16">
      <SEO title={policy.title} description={policy.intro} canonicalPath={`/${type}`} />
      <section className="bg-gradient-to-br from-primary to-primary-dark py-16 text-white md:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="text-3xl font-bold md:text-5xl">{policy.title}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/85">{policy.intro}</p>
        </div>
      </section>
      <section className="mx-auto max-w-4xl px-4 py-12 md:py-16">
        <div className="space-y-5">
          {(policy.sections || []).map((section) => (
            <article key={section.id || section.heading} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-primary">{section.heading}</h2>
              <p className="mt-3 leading-relaxed text-gray-700">{section.text}</p>
            </article>
          ))}
        </div>
        <div className="mt-8 rounded-2xl bg-primary/5 p-6 text-center">
          <p className="text-gray-700">Questions about this policy?</p>
          <Link to="/contact" className="mt-3 inline-flex rounded-lg bg-primary px-5 py-2.5 font-semibold text-white hover:bg-primary-dark">
            Contact Tanzania Health Alliance
          </Link>
        </div>
      </section>
    </div>
  );
}
