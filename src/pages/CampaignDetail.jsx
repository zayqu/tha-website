import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { SEO } from '../components/SEO';
import campaigns from '../data/campaigns.json';
import { fetchPublishedNews, normalizeArticle } from '../lib/api';

// A news article counts as activity for a campaign if its category or tags
// mention the campaign by name, tagline, or subtitle keyword. This is a
// simple, real (not fabricated) link between published news and campaign
// pages — no manual per-article tagging required.
function matchesCampaign(article, campaign) {
  const haystack = [article.category, ...(article.tags || [])]
    .join(' ').toLowerCase();
  const keywords = [campaign.name, campaign.tagline, campaign.subtitle]
    .filter(Boolean)
    .flatMap(text => text.split(/\s+/))
    .map(w => w.toLowerCase())
    .filter(w => w.length > 3); // skip short/common words
  return keywords.some(word => haystack.includes(word));
}

export const CampaignDetail = () => {
  const { campaignId } = useParams();
  const navigate = useNavigate();

  const campaign = campaigns.campaigns.find(c => c.id === campaignId);
  const [relatedNews, setRelatedNews] = useState([]);

  useEffect(() => {
    if (!campaign) return;
    let isMounted = true;
    fetchPublishedNews({ limit: 50 })
      .then(articles => {
        if (!isMounted) return;
        const matches = articles
          .map(normalizeArticle)
          .filter(article => matchesCampaign(article, campaign))
          .slice(0, 3);
        setRelatedNews(matches);
      })
      .catch(() => {});
    return () => { isMounted = false; };
  }, [campaign]);

  if (!campaign) {
    return (
      <div className="pt-24 pb-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Campaign Not Found</h1>
        <button onClick={() => navigate(-1)} className="text-secondary hover:text-secondary-dark font-bold">
          ← Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="pt-14 md:pt-16 bg-white">
      <SEO
        title={campaign.name}
        description={campaign.description}
        canonicalPath={`/campaigns/${campaign.id}`}
      />

      {/* Hero with Banner Image */}
      <section className="relative text-white py-24 md:py-32 overflow-hidden">
        <img
          src={campaign.image}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/30" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate(-1)}
            className="mb-8 flex items-center gap-2 text-white/60 hover:text-white transition text-sm"
          >
            ← Back
          </button>
          <span className="inline-block bg-white/15 backdrop-blur-md text-white text-xs font-semibold px-4 py-1.5 rounded-full border border-white/20 mb-4">
            {campaign.tagline}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-2 tracking-tight">{campaign.name}</h1>
          <p className="text-xl text-white/80">{campaign.subtitle}</p>
          <p className="text-base text-white/60 max-w-2xl mt-4 leading-relaxed">{campaign.description}</p>
        </div>
      </section>

      {/* Activities & Impact */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-primary/50 font-semibold text-xs uppercase tracking-widest">Campaign Progress</span>
            <h2 className="text-3xl font-bold text-primary mt-2">What We Did & What We Achieved</h2>
          </div>

          <div className="bg-white rounded-2xl overflow-hidden shadow-card">
            <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">

              {/* Activities */}
              <div className="p-6 md:p-10">
                <h3 className="text-base font-bold text-primary mb-5 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center">
                    <Icon name="track_changes" size={18} category="primary" />
                  </div>
                  Activities
                </h3>
                <ul className="space-y-4">
                  {campaign.activities2025.map((act, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-lg bg-primary/5 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-primary">{String(i + 1).padStart(2, '0')}</span>
                      </span>
                      <span className="text-gray-600 text-sm">{act}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Impact */}
              <div className="p-6 md:p-10">
                <h3 className="text-base font-bold text-primary mb-5 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-secondary/5 flex items-center justify-center">
                    <Icon name="trending_up" size={18} category="secondary" />
                  </div>
                  Impact
                </h3>
                <ul className="space-y-4">
                  {campaign.impact2025.map((imp, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Icon name="arrow_upward" size={14} category="secondary" />
                      </span>
                      <span className="text-gray-700 text-sm font-medium">{imp}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </div>

          {/* Recent Activity — sourced live from published news, not hardcoded */}
          {relatedNews.length > 0 && (
            <div className="mt-10">
              <h3 className="text-base font-bold text-primary mb-5 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Icon name="update" size={18} category="accent" />
                </div>
                Recent Activity
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                {relatedNews.map(article => (
                  <Link
                    key={article.id}
                    to={`/news/${article.slug}`}
                    className="block bg-white rounded-xl shadow-card hover:shadow-elevated transition-all duration-300 overflow-hidden"
                  >
                    <img src={article.image} alt={article.title} loading="lazy" decoding="async" className="w-full h-32 object-cover" />
                    <div className="p-4">
                      <p className="text-xs text-gray-400 mb-1">{article.date}</p>
                      <p className="text-sm font-semibold text-gray-800 line-clamp-2">{article.title}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* What Is */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-primary mb-6">What is {campaign.name}?</h2>
          <p className="text-lg text-gray-500 leading-relaxed">{campaign.whatIs}</p>
        </div>
      </section>

      {/* Why It Matters */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-primary mb-6">Why It Matters</h2>
          <p className="text-lg text-gray-500 leading-relaxed">{campaign.whyMatters}</p>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-primary mb-12">How We Work</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {campaign.howWorks.map((step, i) => (
              <div key={i} className="flex gap-4 p-5 bg-white rounded-xl shadow-card hover:shadow-elevated transition-all duration-300">
                <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0 text-sm font-bold text-primary/50 shadow-subtle">
                  {i + 1}
                </span>
                <p className="text-gray-600 pt-1">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Where Active */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-primary mb-8">Where We're Active</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {campaign.whereActive.map((location, i) => (
              <div key={i} className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-card hover:shadow-elevated transition-all duration-300">
                <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center">
                  <Icon name="location_on" size={16} category="primary" />
                </div>
                <span className="text-gray-600 font-medium">{location}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl p-10 shadow-card">
            <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center mb-6">
              <Icon name="forum" size={20} category="primary" />
            </div>
            <p className="text-xl text-gray-700 leading-relaxed mb-6 italic">
              "{campaign.testimonial.quote}"
            </p>
            <div>
              <p className="font-bold text-primary">{campaign.testimonial.name}</p>
              <p className="text-gray-400 text-sm">{campaign.testimonial.role}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <img
          src={campaign.image}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{campaign.ctaText}</h2>
          <p className="text-lg text-white/60 mb-8">
            Join us in making a difference. Learn more about how you can get involved.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/make-a-difference" className="px-8 py-3 bg-white text-primary font-bold rounded-xl hover:bg-gray-100 transition text-center">
              Get Involved
            </Link>
            <Link to="/contact" className="px-8 py-3 bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold rounded-xl hover:bg-white hover:text-primary transition text-center">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
