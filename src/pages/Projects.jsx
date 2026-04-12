import { Link } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { SEO } from '../components/SEO';
import campaignsData from '../data/campaigns.json';

const colorMap = {
  hepatitis: {
    border: 'border-hepatitis',
    headerBg: 'from-hepatitis to-red-400',
    iconBg: 'bg-red-50',
    iconColor: '#EF4444',
    badge: 'bg-red-100 text-red-700',
    numBg: 'bg-red-50',
    numText: 'text-red-600',
  },
  mental: {
    border: 'border-mental',
    headerBg: 'from-mental to-purple-400',
    iconBg: 'bg-purple-50',
    iconColor: '#8B5CF6',
    badge: 'bg-purple-100 text-purple-700',
    numBg: 'bg-purple-50',
    numText: 'text-mental',
  },
};

const defaultColors = {
  border: 'border-primary',
  headerBg: 'from-primary to-primary-dark',
  iconBg: 'bg-blue-50',
  iconColor: '#024d85',
  badge: 'bg-blue-100 text-primary',
  numBg: 'bg-blue-50',
  numText: 'text-primary',
};

export const Projects = () => {
  return (
    <div className="pt-14 md:pt-16 bg-cool-gray">
      <SEO
        title="Programs"
        description="Explore Tanzania Health Alliance campaigns and activities including KAPIME, Life Unlocked, and Talk To Heal."
        canonicalPath="/projects"
      />

      {/* Hero */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-primary to-primary-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-accent font-semibold text-sm uppercase tracking-wider">2025 Annual Report</span>
          <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-4">Our Campaigns & Activities</h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Every THA activity maps to one of three strategic campaigns — each targeting a critical health challenge in Tanzania.
          </p>
        </div>
      </section>

      {/* Campaign → Activities → Impact */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {campaignsData.campaigns.map((campaign) => {
            const colors = colorMap[campaign.color] || defaultColors;
            return (
              <div key={campaign.id} className={`bg-white rounded-2xl shadow-card overflow-hidden border-t-4 ${colors.border}`}>

                {/* Campaign Header */}
                <div className="p-8 md:p-10">
                  <div className="flex flex-col md:flex-row md:items-start gap-6">
                    <div className={`w-16 h-16 rounded-2xl ${colors.iconBg} flex items-center justify-center flex-shrink-0`}>
                      <Icon name={campaign.icon} size={32} color={colors.iconColor} />
                    </div>
                    <div className="flex-1">
                      <span className={`text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full ${colors.badge}`}>
                        Campaign
                      </span>
                      <h2 className="text-2xl md:text-3xl font-bold text-primary mt-2">{campaign.name}</h2>
                      <p className="text-gray-500 font-medium mb-3">{campaign.subtitle}</p>
                      <p className="text-gray-600 max-w-2xl">{campaign.description}</p>
                    </div>
                    <Link
                      to={`/campaigns/${campaign.id}`}
                      className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg hover:bg-primary-dark transition font-semibold text-sm whitespace-nowrap self-start"
                    >
                      View Campaign <Icon name="arrow_forward" size={16} />
                    </Link>
                  </div>
                </div>

                {/* Activities & Impact */}
                <div className="grid md:grid-cols-2 border-t border-gray-100">

                  {/* Activities */}
                  <div className="p-8 md:p-10 border-b md:border-b-0 md:border-r border-gray-100">
                    <h3 className="text-base font-bold text-primary mb-5 flex items-center gap-2">
                      <Icon name="track_changes" size={18} category="primary" />
                      Activities
                    </h3>
                    <ul className="space-y-4">
                      {campaign.activities2025.map((act, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <div className={`w-7 h-7 rounded-full ${colors.numBg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                            <span className={`text-xs font-bold ${colors.numText}`}>{i + 1}</span>
                          </div>
                          <span className="text-gray-700">{act}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Impact */}
                  <div className="p-8 md:p-10">
                    <h3 className="text-base font-bold text-primary mb-5 flex items-center gap-2">
                      <Icon name="check_circle" size={18} category="secondary" />
                      Impact
                    </h3>
                    <ul className="space-y-4">
                      {campaign.impact2025.map((imp, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <Icon name="check_circle" size={18} category="secondary" className="flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700 font-medium">{imp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-secondary to-secondary-dark text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Be Part of the Change</h2>
          <p className="text-white/90 text-lg mb-8">
            Support our campaigns and help us reach more communities across Tanzania.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/make-a-difference" className="px-8 py-3 bg-white text-secondary font-bold rounded-lg hover:bg-cool-gray transition">
              Get Involved
            </Link>
            <Link to="/contact" className="px-8 py-3 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-secondary transition">
              Partner With Us
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
