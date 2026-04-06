import { useParams, useNavigate, Link } from 'react-router-dom';
import { Icon } from '../components/Icon';
import campaigns from '../data/campaigns.json';

export const CampaignDetail = () => {
  const { campaignId } = useParams();
  const navigate = useNavigate();

  const campaign = campaigns.campaigns.find(c => c.id === campaignId);

  if (!campaign) {
    return (
      <div className="pt-24 pb-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Campaign Not Found</h1>
        <button
          onClick={() => navigate(-1)}
          className="text-secondary hover:text-secondary-dark font-bold"
        >
          ← Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="pt-16 bg-white">
      {/* Hero Banner */}
      <section className="bg-gradient-to-br from-primary to-primary-dark text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate(-1)}
            className="mb-6 flex items-center gap-2 text-white/80 hover:text-white transition"
          >
            ← Back to Campaigns
          </button>
          <div className="flex items-center gap-6 mb-8">
            <div className="w-24 h-24 bg-white/20 rounded-lg flex items-center justify-center">
              <Icon name={campaign.icon} size={64} category={campaign.color} />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">
                {campaign.name}
              </h1>
              <p className="text-xl text-white/90">{campaign.subtitle}</p>
            </div>
          </div>
          <p className="text-lg text-white/80 max-w-2xl">
            {campaign.description}
          </p>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="py-16 md:py-24 bg-cool-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Impact By The Numbers
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {Object.entries(campaign.metrics).map(([key, value]) => (
              <div key={key} className="bg-white rounded-lg shadow-card p-8 text-center">
                <p className="text-4xl font-bold text-secondary mb-2">
                  {value >= 1000 ? `${(value / 1000).toFixed(1)}k+` : value.toLocaleString()}
                </p>
                <p className="text-gray-600 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What Is */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-6">What is {campaign.name}?</h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            {campaign.whatIs}
          </p>
        </div>
      </section>

      {/* Why It Matters */}
      <section className="py-16 md:py-24 bg-cool-gray">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-6">Why It Matters</h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            {campaign.whyMatters}
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12">How We Work</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {campaign.howWorks.map((step, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="w-12 h-12 bg-secondary text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                  {idx + 1}
                </div>
                <div className="pt-2">
                  <p className="text-lg text-gray-700">{step}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Where Active */}
      <section className="py-16 md:py-24 bg-cool-gray">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8">Where We're Active</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {campaign.whereActive.map((location, idx) => (
              <div key={idx} className="flex items-center gap-3 p-4 bg-white rounded-lg">
                <Icon name="location_on" size={24} category="primary" />
                <span className="text-lg text-gray-700">{location}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg p-12 border-l-4 border-secondary">
            <p className="text-2xl font-bold text-gray-800 mb-6">
              "{campaign.testimonial.quote}"
            </p>
            <div>
              <p className="font-bold text-lg text-primary">
                {campaign.testimonial.name}
              </p>
              <p className="text-gray-600">
                {campaign.testimonial.role}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-primary to-primary-dark text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {campaign.ctaText}
          </h2>
          <p className="text-lg text-white/80 mb-8">
            Join us in making a difference. Learn more about how you can get involved.
          </p>
          <div className="flex gap-4 justify-center flex-col sm:flex-row">
            <Link
              to="/make-a-difference"
              className="px-8 py-3 bg-secondary text-white font-bold rounded-md hover:bg-secondary-dark transition shadow-card text-center"
            >
              Get Involved
            </Link>
            <Link
              to="/contact"
              className="px-8 py-3 border-2 border-white text-white font-bold rounded-md hover:bg-white hover:text-primary transition text-center"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
