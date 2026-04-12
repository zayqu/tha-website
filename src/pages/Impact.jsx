import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { SEO } from '../components/SEO';
import impactData from '../data/impact.json';
import campaigns from '../data/campaigns.json';

const useReveal = () => {
  const ref = React.useRef(null);
  const [show, setShow] = React.useState(false);
  React.useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setShow(true);
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return [ref, show];
};

const Counter = ({ end, suffix = '+' }) => {
  const [ref, visible] = useReveal();
  const [count, setCount] = React.useState(0);
  React.useEffect(() => {
    if (!visible) return;
    let start = Date.now();
    const t = setInterval(() => {
      const p = Math.min((Date.now() - start) / 2000, 1);
      setCount(Math.floor(p * end));
      if (p === 1) clearInterval(t);
    }, 16);
    return () => clearInterval(t);
  }, [visible, end]);
  return (
    <span ref={ref} className="text-3xl md:text-5xl font-bold text-white">
      {count.toLocaleString()}{suffix}
    </span>
  );
};

const TimelineItem = ({ milestone, index }) => {
  const [ref, show] = useReveal();
  return (
    <div
      ref={ref}
      className={`relative flex items-start gap-4 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
    >
      <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 bg-white shadow-card border border-gray-100 z-10 ${
        show ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
      } transition-all duration-500`} style={{ transitionDelay: `${index * 150}ms` }}>
        <Icon name={milestone.icon} size={22} category="primary" />
      </div>
      <div
        className={`flex-1 ml-4 md:ml-0 bg-white rounded-xl p-5 md:p-6 shadow-card hover:shadow-elevated transition-all duration-500 ${
          show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
        style={{ transitionDelay: `${index * 100 + 200}ms` }}
      >
        <span className="text-xs font-semibold text-primary/50 uppercase tracking-wider">{milestone.month}</span>
        <h4 className="font-bold text-lg text-primary mt-1">{milestone.milestone}</h4>
        <p className="text-gray-500 text-sm mt-2 leading-relaxed">{milestone.description}</p>
      </div>
    </div>
  );
};

const campaignIcons = { kapime: 'health_and_safety', 'life-unlocked': 'psychology', 'talk-to-heal': 'forum' };

const CampaignImpactCard = ({ campaign }) => (
  <div className="bg-white rounded-2xl shadow-card hover:shadow-elevated transition-all overflow-hidden">
    {/* Banner */}
    <div className="h-40 relative overflow-hidden">
      <img src={campaign.image} alt={campaign.name} className="w-full h-full object-cover" loading="lazy" decoding="async" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <div className="absolute bottom-3 left-4 flex items-center gap-2">
        <Icon name={campaignIcons[campaign.id] || 'campaign'} size={20} color="white" />
        <h3 className="text-lg font-bold text-white">{campaign.name}</h3>
      </div>
    </div>
    <div className="p-5">
      <ul className="space-y-2.5 mb-5">
        {campaign.impact2025.map((item, i) => (
          <li key={i} className="flex items-start gap-2.5 p-2.5 bg-cool-gray rounded-lg">
            <Icon name="check_circle" size={16} category="secondary" className="mt-0.5 flex-shrink-0" />
            <span className="text-gray-700 text-sm font-medium">{item}</span>
          </li>
        ))}
      </ul>
      <Link
        to={`/campaigns/${campaign.id}`}
        className="flex items-center justify-center gap-2 bg-primary text-white py-2.5 rounded-xl hover:bg-primary-dark transition font-semibold text-sm shadow-sm"
      >
        Learn More <Icon name="arrow_forward" size={16} color="white" />
      </Link>
    </div>
  </div>
);

export const Impact = () => {
  return (
    <div className="pt-14 md:pt-16 bg-cool-gray">
      <SEO
        title="Impact"
        description="Explore Tanzania Health Alliance impact metrics, campaign results, partnerships, and milestones across Tanzania public health programs."
        canonicalPath="/impact"
      />

      {/* Hero */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary to-primary-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-accent font-semibold text-sm uppercase tracking-wider">Annual Report 2025</span>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mt-3 mb-5">Making an Impact</h1>
          <p className="text-base md:text-xl text-white/90 max-w-3xl mx-auto">
            From a single idea in January 2025 to national recognition — see how Tanzania Health Alliance is transforming health outcomes.
          </p>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-12 md:py-16 bg-gradient-to-r from-secondary to-secondary-dark">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center">
            <div>
              <Counter end={1500} />
              <p className="text-white/80 mt-2 text-sm md:text-base font-medium">People Reached</p>
            </div>
            <div>
              <Counter end={1000} />
              <p className="text-white/80 mt-2 text-sm md:text-base font-medium">Students Reached</p>
            </div>
            <div>
              <Counter end={3} suffix="" />
              <p className="text-white/80 mt-2 text-sm md:text-base font-medium">Institutions</p>
            </div>
            <div>
              <Counter end={2} suffix="" />
              <p className="text-white/80 mt-2 text-sm md:text-base font-medium">Community Events</p>
            </div>
          </div>
        </div>
      </section>

      {/* Year One Timeline */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <span className="text-accent font-semibold text-sm uppercase tracking-wider">Our Journey</span>
            <h2 className="text-2xl md:text-4xl font-bold text-primary mt-2">Year One Timeline</h2>
            <p className="text-gray-500 mt-3 text-sm md:text-base">From founding to national health partnership in just 15 months</p>
          </div>
          <div className="relative">
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-accent" />
            <div className="space-y-6 md:space-y-8">
              {impactData.yearOneTimeline.map((milestone, i) => (
                <TimelineItem key={i} milestone={milestone} index={i} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Impact by Campaign */}
      <section className="py-16 md:py-20 bg-cool-gray">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-accent font-semibold text-sm uppercase tracking-wider">2025 Results</span>
            <h2 className="text-2xl md:text-4xl font-bold text-primary mt-2">Impact by Campaign</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {campaigns.campaigns.map(c => (
              <CampaignImpactCard key={c.id} campaign={c} />
            ))}
          </div>
        </div>
      </section>

      {/* National Partnership */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-primary-dark to-primary text-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <span className="text-accent font-semibold text-sm uppercase tracking-wider">March 2026</span>
              <h2 className="text-2xl md:text-4xl font-bold mt-2 mb-5">
                {impactData.governmentPartnership.headline}
              </h2>
              <p className="text-white/80 text-base md:text-lg leading-relaxed mb-6">
                {impactData.governmentPartnership.description}
              </p>
              <ul className="space-y-3">
                {impactData.governmentPartnership.whatItMeans.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Icon name="check_circle" size={20} color="white" className="mt-0.5 flex-shrink-0" />
                    <span className="text-white/90 text-sm md:text-base">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8">
              <Icon name="account_balance" size={48} color="white" className="mb-5" />
              <blockquote className="border-l-4 border-accent pl-5">
                <p className="text-base md:text-lg italic text-white/90 mb-4">
                  "{impactData.governmentPartnership.permanentSecretaryQuote}"
                </p>
                <cite className="text-white/60 not-italic text-sm">
                  — {impactData.governmentPartnership.permanentSecretaryTitle}
                </cite>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* International Recognition */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-accent font-semibold text-sm uppercase tracking-wider">Global Stage</span>
            <h2 className="text-2xl md:text-4xl font-bold text-primary mt-2">International Recognition</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { data: impactData.internationalRecognition.whoDocumentary, icon: 'movie' },
              { data: impactData.internationalRecognition.whaBoard, icon: 'emoji_events' },
              { data: impactData.internationalRecognition.whaMemembership, icon: 'public' },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 md:p-8 shadow-card hover:shadow-elevated transition-all text-center">
                <div className="w-14 h-14 bg-primary/5 rounded-xl flex items-center justify-center mx-auto mb-5">
                  <Icon name={item.icon} size={28} category="primary" />
                </div>
                <h3 className="text-lg font-bold text-primary mb-3">{item.data.title}</h3>
                <p className="text-gray-600 text-sm mb-3 leading-relaxed">{item.data.description}</p>
                <p className="text-xs text-accent font-medium">{item.data.relevance}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-secondary to-secondary-dark text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-5">Be Part of Our Impact</h2>
          <p className="text-white/90 text-base md:text-lg mb-8 max-w-2xl mx-auto">
            Join Tanzanians who are working together to build a healthier future.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/make-a-difference" className="px-8 py-3 bg-white text-secondary font-bold rounded-xl hover:bg-cool-gray transition">
              Get Involved
            </Link>
            <Link to="/contact" className="px-8 py-3 border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-secondary transition">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
