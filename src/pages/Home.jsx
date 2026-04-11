import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../components/Icon';
import campaigns from '../data/campaigns.json';
import partners from '../data/partners.json';
import testimonials from '../data/testimonials.json';
import impactData from '../data/impact.json';
import { PartnersCarousel } from '../components/PartnersCarousel';
import { TestimonialsCarousel } from '../components/TestimonialCarousel';
import { thaData } from '../data/thaData';
import { newsArticles } from '../data/newsData';
import NewsCard from '../components/NewsCard';

/* =========================
   Typing Animation
========================= */
const TypingText = ({ text, speed = 40 }) => {
  const [display, setDisplay] = useState('');

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplay(text.slice(0, i));
      i++;
      if (i > text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return <span>{display}</span>;
};

/* =========================
   Scroll Reveal Hook
========================= */
const useReveal = () => {
  const ref = useRef(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setShow(true);
    });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return [ref, show];
};

/* =========================
   Counter
========================= */
const Counter = ({ end, suffix = '+' }) => {
  const [ref, visible] = useReveal();
  const [count, setCount] = useState(0);

  useEffect(() => {
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
    <div ref={ref} className="text-4xl md:text-5xl font-bold text-white">
      {count.toLocaleString()}{suffix}
    </div>
  );
};

/* =========================
   Campaign Card
========================= */
const CampaignCard = ({ campaign, index }) => {
  const [ref, show] = useReveal();
  const colorClasses = {
    hepatitis: 'from-hepatitis to-red-400',
    mental: 'from-mental to-purple-400',
    default: 'from-primary to-secondary'
  };
  const bgClass = colorClasses[campaign.color] || colorClasses.default;

  return (
    <div
      ref={ref}
      className={`group bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-elevated transition-all duration-500 ${
        show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      {/* Gradient Header */}
      <div className={`h-40 bg-gradient-to-br ${bgClass} flex items-center justify-center relative`}>
        <div className="absolute inset-0 bg-black/10" />
        <Icon name={campaign.icon} size={48} color="white" />
        <span className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full">
          {campaign.tagline}
        </span>
      </div>

      <div className="p-6">
        <h3 className="font-bold text-xl text-primary mb-1">{campaign.name}</h3>
        <p className="text-gray-500 text-sm mb-4">{campaign.subtitle}</p>

        {/* Activities */}
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Key Activities</p>
          <ul className="space-y-1.5">
            {campaign.activities2025.map((act, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                <Icon name="check_circle" size={14} category="secondary" className="mt-0.5 flex-shrink-0" />
                {act}
              </li>
            ))}
          </ul>
        </div>

        {/* Impact */}
        <div className="bg-cool-gray rounded-lg p-3 mb-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">2025 Impact</p>
          {campaign.impact2025.slice(0, 2).map((imp, i) => (
            <p key={i} className="text-sm font-semibold text-primary leading-snug">{imp}</p>
          ))}
        </div>

        <Link
          to={`/campaigns/${campaign.id}`}
          className="flex items-center justify-center gap-2 bg-primary text-white px-4 py-3 rounded-lg hover:bg-primary-dark transition font-semibold"
        >
          Learn More <Icon name="arrow_forward" size={18} />
        </Link>
      </div>
    </div>
  );
};

/* =========================
   Objective Card
========================= */
const ObjectiveCard = ({ obj, index }) => {
  const [ref, show] = useReveal();
  return (
    <div
      ref={ref}
      className={`p-6 bg-white rounded-lg shadow-card border-l-4 border-secondary ${
        show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <Icon name="check_circle" size={24} category="secondary" className="mb-3" />
      <p className="text-gray-700">{obj}</p>
    </div>
  );
};

/* =========================
   Timeline Item
========================= */
const TimelineItem = ({ milestone, index }) => {
  const [ref, show] = useReveal();
  const colorClasses = {
    primary: 'bg-primary text-white',
    secondary: 'bg-secondary text-white',
    accent: 'bg-accent text-white'
  };

  return (
    <div
      ref={ref}
      className={`flex gap-4 ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
    >
      <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${colorClasses[milestone.color] || colorClasses.primary}`}>
        <Icon name={milestone.icon} size={24} color="white" />
      </div>
      <div
        className={`flex-1 bg-white rounded-lg p-6 shadow-card ${
          show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
        style={{ transitionDelay: `${index * 100}ms` }}
      >
        <span className="text-sm font-semibold text-accent">{milestone.month}</span>
        <h4 className="font-bold text-lg text-primary mt-1">{milestone.milestone}</h4>
        <p className="text-gray-600 text-sm mt-2">{milestone.description}</p>
      </div>
    </div>
  );
};

export const Home = () => {
  return (
    <div className="pt-16 bg-cool-gray">

      {/* HERO */}
      <section className="relative h-screen flex items-center justify-center text-center overflow-hidden">
        <img
          src="/images/hero-bg-lg.jpg"
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/90 to-primary/80" />

        <div className="relative z-10 px-4 max-w-5xl mx-auto">
          <h1 className="text-3xl md:text-5xl lg:text-6xl text-white font-bold mb-6 leading-tight">
            <TypingText text="Together for a Healthier Tanzania" />
          </h1>

          <p className="text-white/90 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            {thaData.heroDescription}
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/about" className="btn-primary">Learn More</Link>
            <Link to="/contact" className="px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-primary transition">
              Contact Us
            </Link>
          </div>

          {/* Year Founded */}
          <div className="mt-12 text-white/70 text-sm">
            Founded {thaData.foundedYear} — Representing Tanzania Globally
          </div>
        </div>
      </section>

      {/* IMPACT STATS */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary-dark">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <Counter end={1500} />
              <p className="text-white/80 mt-2">People Reached</p>
            </div>
            <div>
              <Counter end={1000} />
              <p className="text-white/80 mt-2">Students Reached</p>
            </div>
            <div>
              <Counter end={3} suffix="" />
              <p className="text-white/80 mt-2">Institutions Engaged</p>
            </div>
            <div>
              <Counter end={2} suffix="" />
              <p className="text-white/80 mt-2">Community Events</p>
            </div>
          </div>
        </div>
      </section>

      {/* PROGRAMS */}
      <section className="py-20 bg-cool-gray">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-accent font-semibold text-sm uppercase tracking-wider">What We Do</span>
            <h2 className="text-3xl md:text-4xl font-bold text-primary mt-2 mb-4">Our Campaigns & Impact</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Three strategic campaigns addressing Tanzania's most pressing health challenges, each grounded in real community action.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {campaigns.campaigns.map((c, i) => (
              <CampaignCard key={c.id} campaign={c} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* YEAR ONE TIMELINE */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Our Journey</h2>
            <p className="text-gray-600">From a single idea to national impact in just over a year</p>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-accent" />

            <div className="space-y-8">
              {impactData.yearOneTimeline.map((milestone, i) => (
                <TimelineItem key={i} milestone={milestone} index={i} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* GOVERNMENT PARTNERSHIP */}
      <section className="py-20 bg-gradient-to-br from-primary-dark to-primary text-white">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <Icon name="local_hospital" size={64} color="white" className="mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {impactData.governmentPartnership.headline}
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-3xl mx-auto">
            {impactData.governmentPartnership.description}
          </p>
          <blockquote className="border-l-4 border-accent pl-6 max-w-2xl mx-auto text-left">
            <p className="text-lg italic text-white/90">
              "{impactData.governmentPartnership.permanentSecretaryQuote}"
            </p>
            <cite className="text-sm text-white/60 mt-2 block">
              — {impactData.governmentPartnership.permanentSecretaryTitle}
            </cite>
          </blockquote>
        </div>
      </section>

      {/* OBJECTIVES */}
      <section className="py-20 bg-cool-gray">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-primary mb-12">What We Do</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {thaData.objectives.map((obj, i) => (
              <ObjectiveCard key={i} obj={obj} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* PARTNERS */}
      <section className="py-20 bg-white">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary">Our Partners</h2>
          <p className="text-gray-600 mt-2">Working with global and local organizations</p>
        </div>
        <PartnersCarousel partners={partners.partners} />
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 bg-cool-gray">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary">Stories of Impact</h2>
        </div>
        <TestimonialsCarousel testimonials={testimonials.testimonials} />
      </section>

      {/* NEWS */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-primary">Latest News</h2>
            <Link to="/news" className="text-secondary font-semibold hover:underline">View All →</Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {newsArticles.slice(0, 3).map((n) => (
              <NewsCard key={n.id} news={n} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-secondary to-secondary-dark text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Get Involved</h2>
          <p className="text-white/90 text-lg mb-8">
            Join our mission to strengthen Tanzania's health systems. Every action counts.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link to="/make-a-difference" className="px-8 py-3 bg-white text-secondary font-bold rounded-lg hover:bg-cool-gray transition">
              Volunteer
            </Link>
            <Link to="/make-a-difference" className="px-8 py-3 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-secondary transition">
              Donate
            </Link>
            <Link to="/contact" className="px-8 py-3 bg-accent text-white font-bold rounded-lg hover:bg-accent-dark transition">
              Partner With Us
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};