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
import SectionHeader from '../components/SectionHeader';
import ResponsiveRail from '../components/ResponsiveRail';

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
   Campaign card
========================= */
const campaignIcons = { kapime: 'health_and_safety', 'life-unlocked': 'psychology', 'talk-to-heal': 'forum' };

const CampaignCard = ({ campaign, index }) => {
  const [ref, show] = useReveal();

  return (
    <div
      ref={ref}
      className={`group bg-white rounded-2xl shadow-card hover:shadow-elevated transition-all duration-700 overflow-hidden flex flex-col h-full ${
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

export const Home = () => {
  const site = useSiteContent();
  const org = site.organization || {};
  const home = site.home || {};
  const contact = site.contact || {};
  const partners = { partners: (site.partners || []).filter(partner => partner.published !== false).sort((a,b) => Number(a.sortOrder||0)-Number(b.sortOrder||0)) };
  const testimonials = (site.testimonials || []).filter(item => item.published !== false).sort((a,b) => Number(a.sortOrder||0)-Number(b.sortOrder||0));
  const documents = (site.documents || []).filter(item => item.published !== false);
  const parliamentEvidence = documents.find(item => item.id === 'parliamentary-committee');
  const unicefEvidence = documents.find(item => item.id === 'unicef-meeting');
  const unicefCard = unicefEvidence && /^THA[–-]UNICEF Strategic Meeting$/.test(unicefEvidence.title)
    ? { ...unicefEvidence, title: 'Strategic meeting with UNICEF' }
    : unicefEvidence;
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
      <section className="relative flex min-h-[32rem] items-center overflow-hidden text-left md:min-h-[34rem]">
        <img
          src={home.heroImage || "/images/hero-bg-lg.jpg"}
          alt=""
          width="1920"
          height="1080"
          aria-hidden="true"
          {...getHeroImageProps(home.heroImage || '/images/hero-bg-lg.jpg')}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-primary-dark/85" />

        <div className="relative z-10 mx-auto w-full max-w-6xl px-5 py-16 md:px-4">
          <h1 className="max-w-3xl text-4xl font-bold leading-tight text-white md:text-6xl">
            {home.heroTitle || org.motto || "Together for a Healthier Tanzania"}
          </h1>

          <p className="mb-6 mt-4 max-w-xl text-base leading-relaxed text-white/90 md:text-lg">
            {home.heroDescription || thaData.heroDescription}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Link to="/make-a-difference?tab=donate" className="rounded-lg bg-white px-5 py-3 font-semibold text-primary hover:bg-cool-gray">
              Support our work
            </Link>
            <Link to="/impact" className="rounded-lg border border-white/70 px-5 py-3 font-semibold text-white hover:bg-white/15">
              See our impact
            </Link>
          </div>
        </div>
      </section>

      <section aria-label="Registration and impact" className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-5 py-8 md:px-4">
          <dl className="grid grid-cols-2 gap-5 md:grid-cols-4">
            {[
              ['peopleReached', 'People reached'],
              ['studentsReached', 'Students reached'],
              ['institutionsEngaged', 'Institutions engaged'],
              ['communityEvents', 'Community events'],
            ].map(([key, label]) => (
              <div key={key} className="flex flex-col-reverse gap-1">
                <dt className="text-sm text-gray-600">{label}</dt>
                <dd className="text-3xl font-bold text-primary">{Number(impactTotals[key]).toLocaleString('en-TZ')}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-gray-100 pt-4 text-sm">
            <p className="text-gray-600">Registered NGO No. {org.registrationNumber || '00NGO/R/8379'} · {contact.city || 'Dar es Salaam'}</p>
            <Link to="/documents" className="font-semibold text-primary underline underline-offset-4">Documents &amp; Accountability</Link>
          </div>
        </div>
      </section>

      {/* CAMPAIGNS */}
      <section className="py-12 md:py-20 bg-cool-gray">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader
            title="Our campaigns"
            subtitle={home.programsIntro || "Explore our work on hepatitis, HIV and mental health."}
            centered
            compact
          />
          <ResponsiveRail desktopGrid="md:grid-cols-2 lg:grid-cols-3" mobileWidth="82vw">
            {campaigns.map((campaign, index) => (
              <CampaignCard key={campaign.id} campaign={campaign} index={index} />
            ))}
          </ResponsiveRail>
        </div>
      </section>

      {/* JOURNEY TIMELINE */}
      <section id="our-journey" className="scroll-mt-20 py-12 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader
            title="Our Journey"
            subtitle={home.journeyIntro || "A growing public record of community work, advocacy and institutional engagement"}
            centered
            compact
          />
          <JourneyTimeline milestones={journey} />
        </div>
      </section>

      {/* INSTITUTIONAL ENGAGEMENT */}
      <section className="bg-white py-12 md:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHeader
            title="Institutional engagement"
            compact
          />
          <ResponsiveRail desktopGrid="md:grid-cols-3" mobileWidth="78vw" className="md:gap-5">
            {[
              parliamentEvidence,
              unicefCard,
              {
                id: 'verification',
                url: '/documents',
                meta: 'Public Record',
                title: 'Evidence & Verification',
                description: 'Review registration information, dated records and independent references.',
              },
            ].filter(record => record?.url).map(record => (
              <Link
                key={record.id}
                to={record.url}
                className="block h-full rounded-2xl border border-gray-200 bg-white p-5 transition hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary md:p-6"
              >
                <p className="mb-2 text-xs uppercase tracking-wider text-gray-600">{record.meta}</p>
                <h3 className="mb-2 text-lg font-bold text-primary">{record.title}</h3>
                <p className="text-sm text-gray-700">{record.description}</p>
              </Link>
            ))}
          </ResponsiveRail>
        </div>
      </section>

      <section id="partners" className="scroll-mt-16 py-12 md:py-20 bg-white">
        <div className="px-4">
          <SectionHeader
            title="Our Partners"
            centered
            compact
          />
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
          <div className="flex items-start justify-between gap-4">
            <SectionHeader title="Latest News" compact />
            <Link to="/news" className="hidden sm:inline-flex items-center gap-1 pt-1 text-secondary font-semibold hover:underline">
              View All <Icon name="arrow_forward" size={16} />
            </Link>
          </div>
          {latestNewsLoading ? (
            <p className="text-center text-gray-500 py-8">Loading latest news...</p>
          ) : latestNews.length > 0 ? (
            <ResponsiveRail desktopGrid="md:grid-cols-3" mobileWidth="82vw">
              {latestNews.map((n) => (
                <NewsCard key={n.id} news={n} />
              ))}
            </ResponsiveRail>
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


    </div>
  );
};
