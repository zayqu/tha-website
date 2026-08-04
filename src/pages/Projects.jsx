import { Link } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { SEO } from '../components/SEO';
import campaignsData from '../data/campaigns.json';

const campaignIcons = {
  kapime: 'health_and_safety',
  'life-unlocked': 'psychology',
  'talk-to-heal': 'forum',
};

export const Projects = () => {
  return (
    <div className="pt-14 md:pt-16 bg-cool-gray">
      <SEO
        title="Campaigns"
        description="Explore Tanzania Health Alliance campaigns and activities including KAPIME, Life Unlocked, and Talk To Heal."
        canonicalPath="/projects"
      />

      {/* Hero */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary to-primary-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Our Campaigns & Activities</h1>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
            Every THA activity maps to one of three strategic campaigns, each targeting a critical health challenge in Tanzania.
          </p>
        </div>
      </section>

      {/* Campaign Cards */}
      <section className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {campaignsData.campaigns.map((campaign) => (
            <div key={campaign.id} className="bg-white rounded-2xl shadow-card overflow-hidden">

              {/* Campaign Header — banner + info */}
              <div className="md:flex">
                {/* Banner Image */}
                <div className="h-48 md:h-auto md:w-72 flex-shrink-0 relative overflow-hidden">
                  <img
                    src={campaign.image}
                    alt={campaign.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </div>

                {/* Info */}
                <div className="p-6 md:p-8 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon name={campaignIcons[campaign.id] || 'campaign'} size={24} category="primary" />
                        <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Campaign</span>
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold text-primary">{campaign.name}</h2>
                      <p className="text-gray-500 font-medium mt-1">{campaign.subtitle}</p>
                      <p className="text-gray-600 mt-3 max-w-2xl text-sm md:text-base leading-relaxed">{campaign.description}</p>
                    </div>
                    <Link
                      to={`/campaigns/${campaign.id}`}
                      className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl hover:bg-primary-dark transition font-semibold text-sm whitespace-nowrap shadow-sm"
                    >
                      View Campaign <Icon name="arrow_forward" size={16} color="white" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Activities & Impact */}
              <div className="grid md:grid-cols-2 border-t border-gray-100">
                <div className="p-6 md:p-8 border-b md:border-b-0 md:border-r border-gray-100">
                  <h3 className="text-sm font-bold text-primary mb-4 flex items-center gap-2">
                    <Icon name="track_changes" size={18} category="primary" />
                    Activities
                  </h3>
                  <ul className="space-y-3">
                    {campaign.activities2025.map((act, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-lg bg-primary/5 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-primary">{String(i + 1).padStart(2, '0')}</span>
                        </span>
                        <span className="text-gray-700 text-sm">{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-6 md:p-8">
                  <h3 className="text-sm font-bold text-primary mb-4 flex items-center gap-2">
                    <Icon name="trending_up" size={18} category="secondary" />
                    Impact
                  </h3>
                  <ul className="space-y-3">
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
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-secondary to-secondary-dark text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Be Part of the Change</h2>
          <p className="text-white/90 text-base md:text-lg mb-8">
            Support our campaigns and help us reach more communities across Tanzania.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/make-a-difference" className="px-8 py-3 bg-white text-secondary font-bold rounded-xl hover:bg-cool-gray transition">
              Get Involved
            </Link>
            <Link to="/contact" className="px-8 py-3 border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-secondary transition">
              Partner With Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
