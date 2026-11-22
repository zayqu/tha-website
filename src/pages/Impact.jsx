import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { SEO } from '../components/SEO';
import campaignsData from '../data/campaigns.json';
import { fetchImpactTotals, fetchJourney, fetchProjects } from '../lib/api';
import { JourneyTimeline } from '../components/JourneyTimeline';
import { useSiteContent } from '../hooks/useSiteContent';

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
    const start = Date.now();
    const t = setInterval(() => {
      const p = Math.min((Date.now() - start) / 1200, 1);
      setCount(Math.floor(p * end));
      if (p === 1) clearInterval(t);
    }, 16);
    return () => clearInterval(t);
  }, [visible, end]);
  return <span ref={ref} className="text-3xl md:text-5xl font-bold text-white">{count.toLocaleString()}{suffix}</span>;
};

const campaignIcons = { kapime: 'health_and_safety', 'life-unlocked': 'psychology', 'talk-to-heal': 'forum' };

const CampaignImpactCard = ({ campaign }) => (
  <div className="bg-white rounded-2xl shadow-card hover:shadow-elevated transition-all overflow-hidden">
    <div className="h-40 relative overflow-hidden">
      <img src={campaign.image} alt={campaign.name} className="w-full h-full object-cover" loading="lazy" decoding="async" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <div className="absolute bottom-3 left-4 flex items-center gap-2">
        <Icon name={campaignIcons[campaign.id] || 'campaign'} size={20} color="white" />
        <h3 className="text-lg font-bold text-white">{campaign.name}</h3>
      </div>
    </div>
    <div className="p-5">
      {(campaign.impact2025 || []).length ? (
        <ul className="space-y-2.5 mb-5">
          {(campaign.impact2025 || []).map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 p-2.5 bg-cool-gray rounded-lg">
              <span className="w-5 h-5 rounded bg-secondary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Icon name="check" size={12} category="secondary" />
              </span>
              <span className="text-gray-700 text-sm font-medium">{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mb-5 text-sm leading-relaxed text-gray-600">{campaign.description || campaign.subtitle}</p>
      )}
      <Link to={`/campaigns/${campaign.slug || campaign.id}`} className="flex items-center justify-center gap-2 bg-primary text-white py-2.5 rounded-xl hover:bg-primary-dark transition font-semibold text-sm shadow-sm">
        View campaign <Icon name="arrow_forward" size={16} color="white" />
      </Link>
    </div>
  </div>
);

export const Impact = () => {
  const site = useSiteContent();
  const impact = site.impact || {};
  const [totals, setTotals] = React.useState({});
  const [campaigns, setCampaigns] = React.useState(campaignsData.campaigns);
  const [journey, setJourney] = React.useState([]);

  React.useEffect(() => {
    let isMounted = true;
    Promise.allSettled([fetchImpactTotals(), fetchProjects(), fetchJourney()])
      .then(([totalsResult, projectsResult, journeyResult]) => {
        if (!isMounted) return;
        if (totalsResult.status === 'fulfilled' && totalsResult.value) setTotals(totalsResult.value);
        if (projectsResult.status === 'fulfilled' && projectsResult.value.length) setCampaigns(projectsResult.value);
        if (journeyResult.status === 'fulfilled' && journeyResult.value.length) setJourney(journeyResult.value);
      });
    return () => { isMounted = false; };
  }, []);

  const metrics = [
    ['peopleReached', 'People Reached', '+'],
    ['studentsReached', 'Students Reached', '+'],
    ['institutionsEngaged', 'Institutions', ''],
    ['communityEvents', 'Community Events', ''],
  ].filter(([key]) => Number(totals[key]) > 0);

  return (
    <div className="pt-14 md:pt-16 bg-cool-gray">
      <SEO
        title="Impact"
        description="Explore documented Tanzania Health Alliance activities, project results, partnerships and milestones."
        canonicalPath="/impact"
      />

      <section className="py-14 md:py-20 bg-primary text-white">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-5">{impact.heroTitle || 'Impact built through documented work'}</h1>
          <p className="text-base md:text-xl text-white/90 max-w-3xl mx-auto">
            {impact.heroText || 'We track our work through dated activities, campaign records, partner engagement and project-level results rather than broad claims.'}
          </p>
        </div>
      </section>

      {metrics.length ? (
        <section className="py-12 md:py-16 bg-secondary">
          <div className="max-w-6xl mx-auto px-4">
            <p className="mb-8 text-center text-sm text-white/80 max-w-3xl mx-auto">
              {impact.metricsIntro || 'Where numerical results are shown, they come from the corresponding project records managed in Admin.'}
            </p>
            <div className={`grid gap-6 text-center ${metrics.length >= 4 ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3'}`}>
              {metrics.map(([key,label,suffix]) => (
                <div key={key}>
                  <Counter end={Number(totals[key])} suffix={suffix} />
                  <p className="text-white/80 mt-2 text-sm md:text-base font-medium">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10 md:mb-14">
            <span className="text-accent font-semibold text-sm uppercase tracking-wider">Our Journey</span>
            <h2 className="text-2xl md:text-4xl font-bold text-primary mt-2">Milestones</h2>
            <p className="text-gray-500 mt-3 text-sm md:text-base">A dated record that can be updated from Journey Admin.</p>
          </div>
          {journey.length ? <JourneyTimeline milestones={journey} /> : <p className="text-center text-gray-500">Milestones will appear here when published.</p>}
        </div>
      </section>

      <section className="py-14 md:py-20 bg-cool-gray">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <span className="text-accent font-semibold text-sm uppercase tracking-wider">Project Results</span>
            <h2 className="text-2xl md:text-4xl font-bold text-primary mt-2">Impact by Campaign</h2>
            <p className="mt-3 text-gray-500 max-w-3xl mx-auto">{impact.evidenceIntro || 'Project results and evidence are maintained with the corresponding campaign records.'}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {campaigns.map(c => <CampaignImpactCard key={c.id} campaign={c} />)}
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20 bg-primary-dark text-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="max-w-3xl mb-8">
            <span className="text-white/60 text-sm uppercase tracking-wider font-semibold">Evidence & Accountability</span>
            <h2 className="text-2xl md:text-4xl font-bold mt-2 mb-4">See the record behind the claims</h2>
            <p className="text-white/80">Registration information, independent references and dated activity records are available publicly.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link to="/documents" className="rounded-2xl bg-white/10 p-6 hover:bg-white/15 transition">
              <Icon name="description" size={28} color="white" />
              <h3 className="mt-4 font-bold">Documents & Accountability</h3>
              <p className="mt-2 text-sm text-white/70">Registration, policies and external verification.</p>
            </Link>
            <Link to="/news" className="rounded-2xl bg-white/10 p-6 hover:bg-white/15 transition">
              <Icon name="article" size={28} color="white" />
              <h3 className="mt-4 font-bold">Activity Archive</h3>
              <p className="mt-2 text-sm text-white/70">Dated records of advocacy, meetings and community work.</p>
            </Link>
            <Link to="/projects" className="rounded-2xl bg-white/10 p-6 hover:bg-white/15 transition">
              <Icon name="campaign" size={28} color="white" />
              <h3 className="mt-4 font-bold">Campaigns</h3>
              <p className="mt-2 text-sm text-white/70">Program objectives, activities and results.</p>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-14 bg-secondary text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-5">Interested in supporting the next project?</h2>
          <p className="text-white/90 text-base md:text-lg mb-8 max-w-2xl mx-auto">Talk to THA about a defined activity, budget, timeline and reporting approach.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/make-a-difference" className="px-8 py-3 bg-white text-secondary font-bold rounded-xl hover:bg-cool-gray transition">Funding & Partnership</Link>
            <Link to="/contact" className="px-8 py-3 border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-secondary transition">Contact Us</Link>
          </div>
        </div>
      </section>
    </div>
  );
};
