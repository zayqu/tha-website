import { useParams, useNavigate, Link } from 'react-router-dom';
import { Icon } from '../components/Icon';
import campaigns from '../data/campaigns.json';

const colorMap = {
  hepatitis: {
    gradient: 'from-hepatitis to-red-400',
    iconBg: 'bg-red-50',
    iconColor: '#EF4444',
    numBg: 'bg-red-50',
    numText: 'text-red-600',
    badge: 'bg-red-100 text-red-700',
    border: 'border-hepatitis',
  },
  mental: {
    gradient: 'from-mental to-purple-400',
    iconBg: 'bg-purple-50',
    iconColor: '#8B5CF6',
    numBg: 'bg-purple-50',
    numText: 'text-mental',
    badge: 'bg-purple-100 text-purple-700',
    border: 'border-mental',
  },
};

const defaultColors = {
  gradient: 'from-primary to-primary-dark',
  iconBg: 'bg-blue-50',
  iconColor: '#024d85',
  numBg: 'bg-blue-50',
  numText: 'text-primary',
  badge: 'bg-blue-100 text-primary',
  border: 'border-primary',
};

export const CampaignDetail = () => {
  const { campaignId } = useParams();
  const navigate = useNavigate();

  const campaign = campaigns.campaigns.find(c => c.id === campaignId);

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

  const colors = colorMap[campaign.color] || defaultColors;

  return (
    <div className="pt-16 bg-white">

      {/* Hero */}
      <section className={`bg-gradient-to-br ${colors.gradient} text-white py-20 md:py-28`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate(-1)}
            className="mb-8 flex items-center gap-2 text-white/70 hover:text-white transition text-sm"
          >
            ← Back to Campaigns
          </button>
          <div className="flex flex-col md:flex-row md:items-center gap-6 mb-6">
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Icon name={campaign.icon} size={48} color="white" />
            </div>
            <div>
              <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full">
                {campaign.tagline}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-1">{campaign.name}</h1>
              <p className="text-xl text-white/90">{campaign.subtitle}</p>
            </div>
          </div>
          <p className="text-lg text-white/80 max-w-2xl">{campaign.description}</p>
        </div>
      </section>

      {/* 2025 Activities & Impact */}
      <section className="py-16 md:py-24 bg-cool-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-accent font-semibold text-sm uppercase tracking-wider">Annual Report 2025</span>
            <h2 className="text-3xl font-bold text-primary mt-2">What We Did & What We Achieved</h2>
          </div>

          <div className={`bg-white rounded-2xl shadow-card overflow-hidden border-t-4 ${colors.border}`}>
            <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">

              {/* Activities */}
              <div className="p-8 md:p-10">
                <h3 className="text-lg font-bold text-primary mb-6 flex items-center gap-2">
                  <Icon name="track_changes" size={20} category="primary" />
                  Activities
                </h3>
                <ul className="space-y-5">
                  {campaign.activities2025.map((act, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <div className={`w-8 h-8 rounded-full ${colors.numBg} flex items-center justify-center flex-shrink-0`}>
                        <span className={`text-sm font-bold ${colors.numText}`}>{i + 1}</span>
                      </div>
                      <span className="text-gray-700 pt-1">{act}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Impact */}
              <div className="p-8 md:p-10">
                <h3 className="text-lg font-bold text-primary mb-6 flex items-center gap-2">
                  <Icon name="check_circle" size={20} category="secondary" />
                  Impact
                </h3>
                <ul className="space-y-5">
                  {campaign.impact2025.map((imp, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <Icon name="check_circle" size={20} category="secondary" className="flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 font-medium">{imp}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* What Is */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-primary mb-6">What is {campaign.name}?</h2>
          <p className="text-lg text-gray-600 leading-relaxed">{campaign.whatIs}</p>
        </div>
      </section>

      {/* Why It Matters */}
      <section className="py-16 md:py-24 bg-cool-gray">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-primary mb-6">Why It Matters</h2>
          <p className="text-lg text-gray-600 leading-relaxed">{campaign.whyMatters}</p>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-primary mb-12">How We Work</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {campaign.howWorks.map((step, i) => (
              <div key={i} className="flex gap-4 p-6 bg-cool-gray rounded-xl">
                <div className={`w-10 h-10 rounded-full ${colors.numBg} flex items-center justify-center flex-shrink-0 font-bold ${colors.numText}`}>
                  {i + 1}
                </div>
                <p className="text-gray-700 pt-1.5">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Where Active */}
      <section className="py-16 md:py-24 bg-cool-gray">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-primary mb-8">Where We're Active</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {campaign.whereActive.map((location, i) => (
              <div key={i} className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-subtle">
                <Icon name="location_on" size={22} category="primary" />
                <span className="text-gray-700 font-medium">{location}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`bg-cool-gray rounded-2xl p-10 border-l-4 ${colors.border}`}>
            <Icon name="forum" size={32} category="secondary" className="mb-4" />
            <p className="text-xl text-gray-800 leading-relaxed mb-6">
              "{campaign.testimonial.quote}"
            </p>
            <div>
              <p className="font-bold text-primary">{campaign.testimonial.name}</p>
              <p className="text-gray-500 text-sm">{campaign.testimonial.role}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={`py-16 md:py-24 bg-gradient-to-br ${colors.gradient} text-white`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{campaign.ctaText}</h2>
          <p className="text-lg text-white/80 mb-8">
            Join us in making a difference. Learn more about how you can get involved.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/make-a-difference" className="px-8 py-3 bg-white text-primary font-bold rounded-lg hover:bg-cool-gray transition text-center">
              Get Involved
            </Link>
            <Link to="/contact" className="px-8 py-3 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-primary transition text-center">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
