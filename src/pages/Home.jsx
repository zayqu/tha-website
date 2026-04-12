import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../components/Icon';
import campaigns from '../data/campaigns.json';
import partners from '../data/partners.json';
import testimonials from '../data/testimonials.json';
import impactData from '../data/impact.json';
import { PartnersCarousel } from '../components/PartnersCarousel';
import { TestimonialsCarousel } from '../components/TestimonialCarousel';
import { SEO, organizationSchema } from '../components/SEO';
import { thaData } from '../data/thaData';
import { newsArticles } from '../data/newsData';
import NewsCard from '../components/NewsCard';
import { fetchPublishedNews, normalizeArticle } from '../lib/api';
import { getHeroImageProps } from '../lib/imageUtils';

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
   Campaign Card — Premium Glass Design
========================= */
const CampaignCard = ({ campaign, index }) => {
  const [ref, show] = useReveal();

  return (
    <div
      ref={ref}
      className={`group relative rounded-2xl overflow-hidden transition-all duration-700 ${
        show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={campaign.image}
          alt=""
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
      </div>

      {/* Glass Content */}
      <div className="relative z-10 p-6 flex flex-col min-h-[420px]">
        {/* Top Tag */}
        <span className="self-start bg-white/15 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/20">
          {campaign.tagline}
        </span>

        {/* Spacer */}
        <div className="flex-grow" />

        {/* Bottom Content */}
        <div>
          <h3 className="font-bold text-2xl text-white mb-1 tracking-tight">{campaign.name}</h3>
          <p className="text-white/70 text-sm mb-5">{campaign.subtitle}</p>

          {/* Impact Pills */}
          <div className="flex flex-wrap gap-2 mb-5">
            {campaign.impact2025.slice(0, 2).map((imp, i) => (
              <span key={i} className="text-xs bg-white/10 backdrop-blur-sm text-white/90 px-3 py-1.5 rounded-full border border-white/10">
                {imp}
              </span>
            ))}
          </div>

          <Link
            to={`/campaigns/${campaign.id}`}
            className="flex items-center justify-center gap-2 bg-white/15 backdrop-blur-md text-white px-5 py-3 rounded-xl border border-white/20 hover:bg-white hover:text-primary transition-all duration-300 font-semibold text-sm"
          >
            Explore {campaign.name}
            <Icon name="arrow_forward" size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};

/* =========================
   Objective Card — Clean Minimal
========================= */
const objectiveIcons = ['local_hospital', 'school', 'search', 'groups', 'favorite'];
const ObjectiveCard = ({ obj, index }) => {
  const [ref, show] = useReveal();
  return (
    <div
      ref={ref}
      className={`p-6 bg-white/80 backdrop-blur-sm rounded-xl hover:bg-white hover:shadow-elevated transition-all duration-300 ${
        show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center mb-4">
        <Icon name={objectiveIcons[index] || 'check_circle'} size={20} category="primary" />
      </div>
      <p className="text-gray-700 leading-relaxed">{obj}</p>
    </div>
  );
};

/* =========================
   Timeline Item — Clean Design
========================= */
const TimelineItem = ({ milestone, index }) => {
  const [ref, show] = useReveal();

  return (
    <div
      ref={ref}
      className={`flex gap-4 ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
    >
      <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 bg-white shadow-subtle border border-gray-100">
        <Icon name={milestone.icon} size={20} category="primary" />
      </div>
      <div
        className={`flex-1 bg-white/80 backdrop-blur-sm rounded-xl p-6 hover:shadow-elevated transition-all duration-300 ${
          show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
        style={{ transitionDelay: `${index * 100}ms` }}
      >
        <span className="text-xs font-semibold text-primary/60 uppercase tracking-wider">{milestone.month}</span>
        <h4 className="font-bold text-lg text-primary mt-1">{milestone.milestone}</h4>
        <p className="text-gray-500 text-sm mt-2 leading-relaxed">{milestone.description}</p>
      </div>
    </div>
  );
};

export const Home = () => {
  const [latestNews, setLatestNews] = useState(newsArticles.map(normalizeArticle).slice(0, 3));

  useEffect(() => {
    let isMounted = true;
    fetchPublishedNews({ limit: 3 })
      .then(articles => {
        if (isMounted && articles.length > 0) setLatestNews(articles);
      })
      .catch(() => {});

    return () => { isMounted = false; };
  }, []);

  return (
    <div className="pt-16 bg-cool-gray">
      <SEO
        title="Tanzania Health Alliance | Together for a Healthier Tanzania"
        description="Tanzania Health Alliance addresses viral hepatitis, HIV, and mental health through awareness, advocacy, research, and partnerships across Tanzania."
        canonicalPath="/"
        structuredData={organizationSchema}
      />

      {/* HERO */}
      <section className="relative h-screen flex items-center justify-center text-center overflow-hidden">
        <img
          src="/images/hero-bg-lg.jpg"
          alt=""
          width="1920"
          height="1080"
          aria-hidden="true"
          {...getHeroImageProps('/images/hero-bg-lg.jpg')}
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
            <Link to="/about" className="btn-primary">Learn About THA</Link>
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
            {latestNews.map((n) => (
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
