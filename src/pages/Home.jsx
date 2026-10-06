import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../components/Icon';
import campaignsData from '../data/campaigns.json';
import impactData from '../data/impact.json';
import { PartnersCarousel } from '../components/PartnersCarousel';
import { TestimonialsCarousel } from '../components/TestimonialCarousel';
import { SEO, organizationSchema } from '../components/SEO';
import { thaData } from '../data/thaData';
import NewsCard from '../components/NewsCard';
import { fetchPublishedNews, fetchImpactTotals, fetchProjects, fetchJourney } from '../lib/api';
import { getHeroImageProps } from '../lib/imageUtils';
import { JourneyTimeline } from '../components/JourneyTimeline';
import { useSiteContent } from '../hooks/useSiteContent';

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
    <div ref={ref} className="text-3xl md:text-5xl font-bold text-white">
      {count.toLocaleString()}{suffix}
    </div>
  );
};

/* =========================
   Campaign Card — Banner + White Body
========================= */
const campaignIcons = { kapime: 'health_and_safety', 'life-unlocked': 'psychology', 'talk-to-heal': 'forum' };

const CampaignCard = ({ campaign, index }) => {
  const [ref, show] = useReveal();

  return (
    <div
      ref={ref}
      className={`group bg-white rounded-2xl shadow-card hover:shadow-elevated transition-all duration-700 overflow-hidden flex flex-col h-full min-w-[82vw] max-w-[82vw] md:min-w-0 md:max-w-none ${
        show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      {/* Banner Image */}
      <div className="relative overflow-hidden h-40 sm:h-56">
        <img
          src={campaign.image}
          alt={campaign.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute top-3 left-3">
          <span className="bg-white/90 backdrop-blur-sm text-primary text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
            {campaign.tagline}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6 flex flex-col flex-grow">
        <div className="flex items-center gap-2 mb-3">
          <Icon name={campaignIcons[campaign.id] || 'campaign'} size={22} category="primary" />
          <h3 className="font-bold text-lg sm:text-xl text-primary tracking-tight">{campaign.name}</h3>
        </div>
        <p className="text-gray-500 text-sm mb-4 leading-relaxed line-clamp-2">{campaign.subtitle}</p>

        <div className="flex flex-wrap gap-1.5 mb-5">
          {(campaign.impact2025 || []).slice(0, 2).map((imp, i) => (
            <span key={i} className="text-xs bg-cool-gray text-gray-600 px-2.5 py-1 rounded-full">
              {imp}
            </span>
          ))}
        </div>

        <Link
          to={`/campaigns/${campaign.slug || campaign.id}`}
          className="mt-auto flex items-center justify-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl hover:bg-primary-dark transition-all duration-300 font-semibold text-sm shadow-sm"
        >
          Explore Campaign
          <Icon name="arrow_forward" size={16} color="white" />
        </Link>
      </div>
    </div>
  );
};

/* =========================
   Objective Card — Clean Minimal
========================= */
const ObjectiveCard = ({ obj, index }) => {
  const [ref, show] = useReveal();
  return (
    <div
      ref={ref}
      className={`p-4 sm:p-6 bg-white rounded-xl shadow-card hover:shadow-elevated transition-all duration-300 ${
        show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-primary/5 flex items-center justify-center mb-3 sm:mb-4">
        <Icon name={obj.icon || 'check_circle'} size={20} category="primary" />
      </div>
      <h3 className="font-bold text-sm sm:text-base text-primary mb-1.5 sm:mb-2">{obj.title}</h3>
      <p className="text-xs sm:text-base text-gray-700 leading-relaxed">{obj.description}</p>
    </div>
  );
};

export const Home = () => {
  const site = useSiteContent();
  const org = site.organization || {};
  const home = site.home || {};
  const contact = site.contact || {};
  const partners = { partners: (site.partners || []).filter(partner => partner.published !== false).sort((a,b) => Number(a.sortOrder||0)-Number(b.sortOrder||0)) };
  const objectives = (site.objectives || []).filter(item => item.published !== false).sort((a,b) => Number(a.sortOrder||0)-Number(b.sortOrder||0));
  const testimonials = (site.testimonials || []).filter(item => item.published !== false).sort((a,b) => Number(a.sortOrder||0)-Number(b.sortOrder||0));
  const documents = (site.documents || []).filter(item => item.published !== false);
  const whaEvidence = documents.find(item => item.id === 'wha-board');
  const awardEvidence = documents.find(item => item.id === 'aba-2026');
  const parliamentEvidence = documents.find(item => item.id === 'parliamentary-committee');
  const unicefEvidence = documents.find(item => item.id === 'unicef-meeting');
  const [latestNews, setLatestNews] = useState([]);
  const [latestNewsLoading, setLatestNewsLoading] = useState(true);
  const [impactTotals, setImpactTotals] = useState(impactData.impactMetrics.total);
  const [campaigns, setCampaigns] = useState(campaignsData.campaigns);
  const [journey, setJourney] = useState(impactData.yearOneTimeline);

  useEffect(() => {
    let isMounted = true;
    fetchPublishedNews({ limit: 3 })
      .then(articles => {
        if (isMounted) setLatestNews(articles);
      })
      .catch(() => {
        if (isMounted) setLatestNews([]);
      })
      .finally(() => {
        if (isMounted) setLatestNewsLoading(false);
      });

    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    let isMounted = true;
    Promise.allSettled([fetchProjects(), fetchJourney()])
      .then(([projectsResult, journeyResult]) => {
        if (!isMounted) return;
        if (projectsResult.status === 'fulfilled' && projectsResult.value.length) {
          setCampaigns(projectsResult.value);
        }
        if (journeyResult.status === 'fulfilled' && journeyResult.value.length) {
          setJourney(journeyResult.value);
        }
      });
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    let isMounted = true;
    // Impact stats are driven by real project data (see /admin projects
    // dashboard). Any metric an admin hasn't set yet keeps its static
    // fallback so the page never shows a stat regressing to zero.
    fetchImpactTotals().then(totals => {
      if (isMounted && totals) {
        setImpactTotals(prev => ({ ...prev, ...totals }));
      }
    });
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="pt-14 md:pt-16 bg-cool-gray">
      <SEO
        title="Tanzania Health Alliance | Together for a Healthier Tanzania"
        description="Tanzania Health Alliance addresses viral hepatitis, HIV, and mental health through awareness, advocacy, research, and partnerships across Tanzania."
        canonicalPath="/"
        structuredData={organizationSchema}
      />

      {/* HERO */}
      <section className="relative min-h-[68svh] md:h-screen flex items-end md:items-center justify-center text-left md:text-center overflow-hidden">
        <img
          src={home.heroImage || "/images/hero-bg-lg.jpg"}
          alt=""
          width="1920"
          height="1080"
          aria-hidden="true"
          {...getHeroImageProps(home.heroImage || '/images/hero-bg-lg.jpg')}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/90 to-primary/80" />

        <div className="relative z-10 w-full px-5 pb-10 pt-16 md:px-4 md:pb-0 md:pt-0 max-w-5xl mx-auto">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-white/70 md:hidden">Tanzania Health Alliance</p>
          <h1 className="text-[2rem] md:text-5xl lg:text-6xl text-white font-bold mb-4 md:mb-6 leading-[1.05] md:leading-tight">
            <span className="md:hidden">{home.heroTitle || org.motto || "Together for a Healthier Tanzania"}</span>
            <span className="hidden md:inline"><TypingText text={home.heroTitle || org.motto || "Together for a Healthier Tanzania"} /></span>
          </h1>

          <p className="text-white/85 text-[15px] md:text-xl leading-relaxed mb-6 md:mb-8 max-w-2xl md:mx-auto">
            {home.heroDescription || thaData.heroDescription}
          </p>

          <div className="grid grid-cols-2 gap-3 md:flex md:gap-4 md:justify-center md:flex-wrap">
            <Link to="/about" className="btn-primary justify-center px-4 py-2.5 text-sm md:px-6 md:py-3">Learn About THA</Link>
            <Link to="/contact" className="px-4 py-2.5 md:px-6 md:py-3 border border-white/70 md:border-2 text-white text-sm md:text-base text-center font-semibold rounded-lg hover:bg-white hover:text-primary transition">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* TRUST & ACCOUNTABILITY */}
      <section className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-4 md:py-6">
          <div className="grid grid-cols-2 gap-x-4 gap-y-5 lg:grid-cols-4">
            <div className="flex min-w-0 items-start gap-2.5">
              <Icon name="verified" size={22} category="primary" />
              <div>
                <p className="text-[13px] md:text-sm font-bold leading-tight text-primary">Registered NGO</p>
                <p className="mt-1 text-[11px] leading-tight text-gray-500">No. {org.registrationNumber || "00NGO/R/8379"} · {contact.city || "Dar es Salaam"}</p>
              </div>
            </div>
            {whaEvidence ? (
              <a href={whaEvidence.url} target="_blank" rel="noopener noreferrer" className="flex min-w-0 items-start gap-2.5 hover:opacity-80 transition">
                <Icon name="public" size={22} category="primary" />
                <div>
                  <p className="text-[13px] md:text-sm font-bold leading-tight text-primary">{whaEvidence.title}</p>
                  <p className="mt-1 text-[11px] leading-tight text-gray-500">{whaEvidence.meta}</p>
                </div>
              </a>
            ) : null}
            {awardEvidence ? (
              <a href={awardEvidence.url} target="_blank" rel="noopener noreferrer" className="flex min-w-0 items-start gap-2.5 hover:opacity-80 transition">
                <Icon name="workspace_premium" size={22} category="primary" />
                <div>
                  <p className="text-[13px] md:text-sm font-bold leading-tight text-primary">{awardEvidence.title}</p>
                  <p className="mt-1 text-[11px] leading-tight text-gray-500">{awardEvidence.meta}</p>
                </div>
              </a>
            ) : null}
            <Link to="/documents" className="flex min-w-0 items-start gap-2.5 hover:opacity-80 transition">
              <Icon name="description" size={22} category="primary" />
              <div>
                <p className="text-[13px] md:text-sm font-bold leading-tight text-primary">Documents & Accountability</p>
                <p className="mt-1 text-[11px] leading-tight text-gray-500">Registration, records and verification</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* IMPACT STATS */}
      <section className="py-9 md:py-16 bg-gradient-to-r from-primary to-primary-dark">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-7 md:gap-8 text-center">
            <div>
              <Counter end={impactTotals.peopleReached} />
              <p className="text-white/75 mt-1.5 text-xs md:text-base">People Reached</p>
            </div>
            <div>
              <Counter end={impactTotals.studentsReached} />
              <p className="text-white/75 mt-1.5 text-xs md:text-base">Students Reached</p>
            </div>
            <div>
              <Counter end={impactTotals.institutionsEngaged} suffix="" />
              <p className="text-white/75 mt-1.5 text-xs md:text-base">Institutions Engaged</p>
            </div>
            <div>
              <Counter end={impactTotals.communityEvents} suffix="" />
              <p className="text-white/75 mt-1.5 text-xs md:text-base">Community Events</p>
            </div>
          </div>
        </div>
      </section>

      {/* CAMPAIGNS */}
      <section className="py-12 md:py-20 bg-cool-gray">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-left md:text-center mb-7 md:mb-12">
            <span className="text-accent font-semibold text-sm uppercase tracking-wider">What We Do</span>
            <h2 className="text-2xl md:text-4xl font-bold text-primary mt-2 mb-3 md:mb-4">Our Campaigns & Impact</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {home.programsIntro || "Three focused programs built around practical public-health needs: hepatitis prevention, youth mental health and community support."}
            </p>
          </div>

          <div className="-mx-4 flex gap-4 overflow-x-auto snap-x snap-mandatory px-4 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-8 md:overflow-visible md:px-0 md:pb-0">
            {campaigns.map((campaign, index) => (
              <CampaignCard key={campaign.id} campaign={campaign} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* YEAR ONE TIMELINE */}
      <section className="py-12 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-left md:text-center mb-7 md:mb-12">
            <h2 className="text-2xl md:text-4xl font-bold text-primary mb-3 md:mb-4">Our Journey</h2>
            <p className="text-gray-600">{home.journeyIntro || "A growing public record of community work, advocacy and institutional engagement"}</p>
          </div>
          <JourneyTimeline milestones={journey} />
        </div>
      </section>

      {/* INSTITUTIONAL ENGAGEMENT */}
      <section className="py-12 md:py-20 bg-primary-dark text-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="max-w-3xl mb-7 md:mb-10">
            <span className="text-white/60 text-sm uppercase tracking-wider font-semibold">Institutional Engagement</span>
            <h2 className="text-2xl md:text-4xl font-bold mt-2 mb-3 md:mb-4">{home.engagementTitle || "Turning advocacy into conversations that can move policy"}</h2>
            <p className="text-white/75 text-sm md:text-lg leading-relaxed">
              {home.engagementIntro || "THA’s public record includes engagement with national institutions and health partners on hepatitis prevention, birth-dose vaccination and community health."}
            </p>
          </div>
          <div className="-mx-4 flex gap-4 overflow-x-auto snap-x snap-mandatory px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:grid md:grid-cols-3 md:px-0 md:overflow-visible">
            {parliamentEvidence ? (
              <Link to={parliamentEvidence.url} className="min-w-[78vw] max-w-[78vw] snap-center rounded-2xl bg-white/10 p-5 hover:bg-white/15 transition md:min-w-0 md:max-w-none md:p-6">
                <p className="text-xs uppercase tracking-wider text-white/60 mb-2">{parliamentEvidence.meta}</p>
                <h3 className="text-lg font-bold mb-2">{parliamentEvidence.title}</h3>
                <p className="text-sm text-white/75">{parliamentEvidence.description}</p>
              </Link>
            ) : null}
            {unicefEvidence ? (
              <Link to={unicefEvidence.url} className="min-w-[78vw] max-w-[78vw] snap-center rounded-2xl bg-white/10 p-5 hover:bg-white/15 transition md:min-w-0 md:max-w-none md:p-6">
                <p className="text-xs uppercase tracking-wider text-white/60 mb-2">{unicefEvidence.meta}</p>
                <h3 className="text-lg font-bold mb-2">{unicefEvidence.title}</h3>
                <p className="text-sm text-white/75">{unicefEvidence.description}</p>
              </Link>
            ) : null}
            <Link to="/documents" className="min-w-[78vw] max-w-[78vw] snap-center rounded-2xl bg-white/10 p-5 hover:bg-white/15 transition md:min-w-0 md:max-w-none md:p-6">
              <p className="text-xs uppercase tracking-wider text-white/60 mb-2">Public Record</p>
              <h3 className="text-lg font-bold mb-2">Evidence & Verification</h3>
              <p className="text-sm text-white/75">Review registration information, dated records and independent references.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* OBJECTIVES */}
      <section className="py-12 md:py-20 bg-cool-gray">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-left md:text-center text-primary mb-7 md:mb-12">What We Do</h2>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
            {objectives.map((obj, i) => (
              <ObjectiveCard key={obj.id || i} obj={obj} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* PARTNERS */}
      <section id="partners" className="scroll-mt-16 py-12 md:py-20 bg-white">
        <div className="text-left md:text-center px-4 mb-6 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-primary">Our Partners</h2>
          <p className="text-gray-600 mt-2">Working with global and local organizations</p>
        </div>
        <PartnersCarousel partners={partners.partners} />
      </section>

      {/* TESTIMONIALS */}
      {testimonials.length > 0 ? (
        <section className="py-20 bg-cool-gray">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary">Stories of Impact</h2>
          </div>
          <TestimonialsCarousel testimonials={testimonials} />
        </section>
      ) : null}

      {/* NEWS */}
      <section className="py-12 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-primary">Latest News</h2>
            <Link to="/news" className="hidden sm:inline-flex items-center gap-1 text-secondary font-semibold hover:underline">
              View All <Icon name="arrow_forward" size={16} />
            </Link>
          </div>
          {latestNewsLoading ? (
            <p className="text-center text-gray-500 py-8">Loading latest news...</p>
          ) : latestNews.length > 0 ? (
            <div className="-mx-4 flex gap-4 overflow-x-auto snap-x snap-mandatory px-4 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0 md:pb-0">
              {latestNews.map((n) => (\n                <div key={n.id} className="min-w-[82vw] max-w-[82vw] snap-center md:min-w-0 md:max-w-none"><NewsCard news={n} /></div>\n              ))}
            </div>
          ) : (
            <div className="rounded-xl bg-cool-gray px-6 py-8 text-center">
              <p className="text-gray-600 mb-4">Latest news is temporarily unavailable.</p>
              <Link to="/news" className="inline-flex items-center gap-2 text-primary font-semibold hover:underline">
                Open News <Icon name="arrow_forward" size={16} />
              </Link>
            </div>
          )}
          <div className="mt-8 text-center sm:hidden">
            <Link
              to="/news"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition shadow-sm"
            >
              Read All News <Icon name="arrow_forward" size={16} color="white" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-20 bg-gradient-to-r from-secondary to-secondary-dark text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6">Get Involved</h2>
          <p className="text-white/85 text-sm md:text-lg leading-relaxed mb-6 md:mb-8">
            {home.ctaText || "If you want to fund, partner, volunteer or bring a health concern to us, start with a conversation."}
          </p>
          <div className="grid grid-cols-2 gap-3 sm:flex sm:justify-center sm:gap-4 sm:flex-wrap">
            <Link to="/make-a-difference" className="px-4 py-2.5 md:px-8 md:py-3 bg-white text-secondary text-sm md:text-base font-bold rounded-lg hover:bg-cool-gray transition">
              Volunteer
            </Link>
            <Link to="/make-a-difference" className="px-4 py-2.5 md:px-8 md:py-3 border border-white md:border-2 text-white text-sm md:text-base font-bold rounded-lg hover:bg-white hover:text-secondary transition">
              Donate
            </Link>
            <Link to="/contact" className="col-span-2 sm:col-auto px-4 py-2.5 md:px-8 md:py-3 bg-accent text-white text-sm md:text-base font-bold rounded-lg hover:bg-accent-dark transition">
              Partner With Us
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
