import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../components/Icon';
import impactData from '../data/impact.json';
import campaigns from '../data/campaigns.json';

/* =========================
   Scroll Reveal Hook
========================= */
const useReveal = () => {
  const [ref, setRef] = React.useState(null);
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setShow(true);
    });
    if (ref) observer.observe(ref);
    return () => observer.disconnect();
  }, [ref]);

  return [ref, show];
};

/* =========================
   Counter
========================= */
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
    <span ref={ref} className="text-4xl md:text-5xl font-bold text-white">
      {count.toLocaleString()}{suffix}
    </span>
  );
};

export const Impact = () => {
  return (
    <div className="pt-16 bg-cool-gray">

      {/* Hero Section */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-primary to-primary-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-accent font-semibold text-sm uppercase tracking-wider">Our Track Record</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mt-4 mb-6">
            Making an Impact
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            From a single idea in January 2025 to national recognition — see how Tanzania Health Alliance is transforming health outcomes across Tanzania.
          </p>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-16 bg-gradient-to-r from-secondary to-secondary-dark">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <Counter end={21500} />
              <p className="text-white/80 mt-2 font-medium">Lives Reached</p>
            </div>
            <div>
              <Counter end={35} />
              <p className="text-white/80 mt-2 font-medium">Communities</p>
            </div>
            <div>
              <Counter end={450} />
              <p className="text-white/80 mt-2 font-medium">Healthcare Workers</p>
            </div>
            <div>
              <Counter end={45} />
              <p className="text-white/80 mt-2 font-medium">Countries</p>
            </div>
          </div>
        </div>
      </section>

      {/* Year One Timeline */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-accent font-semibold text-sm uppercase tracking-wider">Our Journey</span>
            <h2 className="text-3xl md:text-4xl font-bold text-primary mt-2">Year One Timeline</h2>
            <p className="text-gray-600 mt-4">From founding to government partnership in just 15 months</p>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-accent" />

            <div className="space-y-8">
              {impactData.yearOneTimeline.map((milestone, index) => {
                const [ref, show] = useReveal();
                const colorClasses = {
                  primary: 'bg-primary text-white',
                  secondary: 'bg-secondary text-white',
                  accent: 'bg-accent text-white'
                };
                const isLeft = index % 2 === 0;

                return (
                  <div
                    key={index}
                    ref={ref}
                    className={`relative flex items-center gap-4 ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                  >
                    {/* Dot on timeline */}
                    <div className={`absolute left-6 md:left-1/2 w-4 h-4 rounded-full transform -translate-x-1/2 ${colorClasses[milestone.color] || colorClasses.primary}`} />

                    {/* Icon Circle */}
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 ml-4 md:ml-0 ${colorClasses[milestone.color] || colorClasses.primary} ${
                      show ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                    } transition-all duration-500`} style={{ transitionDelay: `${index * 150}ms` }}>
                      <Icon name={milestone.icon} size={28} color="white" />
                    </div>

                    {/* Content Card */}
                    <div
                      className={`flex-1 ml-12 md:ml-0 md:w-5/12 bg-cool-gray rounded-xl p-6 shadow-card ${
                        show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                      }`}
                      style={{ transitionDelay: `${index * 100 + 200}ms` }}
                    >
                      <span className="text-sm font-semibold text-accent">{milestone.month}</span>
                      <h4 className="font-bold text-lg text-primary mt-1">{milestone.milestone}</h4>
                      <p className="text-gray-600 text-sm mt-2">{milestone.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Impact by Program */}
      <section className="py-20 bg-cool-gray">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-accent font-semibold text-sm uppercase tracking-wider">Program Results</span>
            <h2 className="text-3xl md:text-4xl font-bold text-primary mt-2">Impact by Program</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* KAPIME */}
            <div className="bg-white rounded-2xl shadow-card overflow-hidden">
              <div className="h-20 bg-gradient-to-br from-hepatitis to-red-400 flex items-center justify-center">
                <Icon name="heart-check" size={40} color="white" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-primary mb-4">KAPIME: Get Tested</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-cool-gray rounded-lg">
                    <span className="text-gray-600">People Screened</span>
                    <span className="font-bold text-primary">12,500</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-cool-gray rounded-lg">
                    <span className="text-gray-600">Vaccinated</span>
                    <span className="font-bold text-secondary">8,300</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-cool-gray rounded-lg">
                    <span className="text-gray-600">Cases Caught Early</span>
                    <span className="font-bold text-accent">340</span>
                  </div>
                </div>
                <Link
                  to="/campaigns/kapime"
                  className="mt-6 block text-center bg-primary text-white py-3 rounded-lg hover:bg-primary-dark transition font-semibold"
                >
                  Learn More
                </Link>
              </div>
            </div>

            {/* Life Unlocked */}
            <div className="bg-white rounded-2xl shadow-card overflow-hidden">
              <div className="h-20 bg-gradient-to-br from-mental to-purple-400 flex items-center justify-center">
                <Icon name="psychology" size={40} color="white" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-primary mb-4">Life Unlocked: Youth Mental Health</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-cool-gray rounded-lg">
                    <span className="text-gray-600">Youth Reached</span>
                    <span className="font-bold text-primary">5,600</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-cool-gray rounded-lg">
                    <span className="text-gray-600">Youth Clubs</span>
                    <span className="font-bold text-secondary">28</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-cool-gray rounded-lg">
                    <span className="text-gray-600">Counseling Sessions</span>
                    <span className="font-bold text-accent">1,340</span>
                  </div>
                </div>
                <Link
                  to="/campaigns/life-unlocked"
                  className="mt-6 block text-center bg-primary text-white py-3 rounded-lg hover:bg-primary-dark transition font-semibold"
                >
                  Learn More
                </Link>
              </div>
            </div>

            {/* Talk To Heal */}
            <div className="bg-white rounded-2xl shadow-card overflow-hidden">
              <div className="h-20 bg-gradient-to-br from-mental to-purple-400 flex items-center justify-center">
                <Icon name="forum" size={40} color="white" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-primary mb-4">Talk To Heal: Peer Support</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-cool-gray rounded-lg">
                    <span className="text-gray-600">Support Groups</span>
                    <span className="font-bold text-primary">35</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-cool-gray rounded-lg">
                    <span className="text-gray-600">Peer Supporters</span>
                    <span className="font-bold text-secondary">89</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-cool-gray rounded-lg">
                    <span className="text-gray-600">People Served</span>
                    <span className="font-bold text-accent">3,400</span>
                  </div>
                </div>
                <Link
                  to="/campaigns/talk-to-heal"
                  className="mt-6 block text-center bg-primary text-white py-3 rounded-lg hover:bg-primary-dark transition font-semibold"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Government Partnership */}
      <section className="py-20 bg-gradient-to-br from-primary-dark to-primary text-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-accent font-semibold text-sm uppercase tracking-wider">March 2026</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-6">
                {impactData.governmentPartnership.headline}
              </h2>
              <p className="text-white/80 text-lg leading-relaxed mb-8">
                {impactData.governmentPartnership.description}
              </p>
              <ul className="space-y-3">
                {impactData.governmentPartnership.whatItMeans.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Icon name="check_circle" size={20} color="white" className="mt-0.5" />
                    <span className="text-white/90">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <Icon name="local_hospital" size={64} color="white" className="mb-6" />
              <blockquote className="border-l-4 border-accent pl-6">
                <p className="text-xl italic text-white/90 mb-4">
                  "{impactData.governmentPartnership.permanentSecretaryQuote}"
                </p>
                <cite className="text-white/60 not-italic">
                  — {impactData.governmentPartnership.permanentSecretaryTitle}
                </cite>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* International Recognition */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-accent font-semibold text-sm uppercase tracking-wider">Global Stage</span>
            <h2 className="text-3xl md:text-4xl font-bold text-primary mt-2">International Recognition</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* WHO Documentary */}
            <div className="bg-cool-gray rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Icon name="film" size={32} category="primary" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-4">
                {impactData.internationalRecognition.whoDocumentary.title}
              </h3>
              <p className="text-gray-600 mb-4">
                {impactData.internationalRecognition.whoDocumentary.description}
              </p>
              <p className="text-sm text-accent font-medium">
                {impactData.internationalRecognition.whoDocumentary.relevance}
              </p>
            </div>

            {/* WHA Board */}
            <div className="bg-cool-gray rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Icon name="award" size={32} category="secondary" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-4">
                {impactData.internationalRecognition.whaBoard.title}
              </h3>
              <p className="text-gray-600 mb-4">
                {impactData.internationalRecognition.whaBoard.description}
              </p>
              <p className="text-sm text-accent font-medium">
                {impactData.internationalRecognition.whaBoard.relevance}
              </p>
            </div>

            {/* WHA Membership */}
            <div className="bg-cool-gray rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Icon name="groups" size={32} category="accent" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-4">
                {impactData.internationalRecognition.whaMemembership.title}
              </h3>
              <p className="text-gray-600 mb-4">
                {impactData.internationalRecognition.whaMemembership.description}
              </p>
              <p className="text-sm text-accent font-medium">
                {impactData.internationalRecognition.whaMemembership.relevance}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-secondary to-secondary-dark text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Be Part of Our Impact</h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of Tanzanians who are working together to build a healthier future.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link to="/make-a-difference" className="px-8 py-3 bg-white text-secondary font-bold rounded-lg hover:bg-cool-gray transition">
              Get Involved
            </Link>
            <Link to="/contact" className="px-8 py-3 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-secondary transition">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};