import { Link, useSearchParams } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { SEO } from '../components/SEO';
import { useSiteContent } from '../hooks/useSiteContent';

export const MakeADifference = () => {
  const site = useSiteContent();
  const funding = site.funding || {};
  const contactEmail = site.contact?.email || "info@tzhealthalliance.or.tz";
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedTab = searchParams.get('tab');
  const activeTab = ['donate', 'partner'].includes(requestedTab) ? requestedTab : 'volunteer';
  const roles = (funding.volunteerRoles || [])
    .filter(role => role.published !== false)
    .sort((a,b) => Number(a.sortOrder||0)-Number(b.sortOrder||0));
  const successStory = funding.successStory || {};

  return (
    <div className="pt-14 md:pt-16">
      <SEO
        title="Make a Difference"
        description="Volunteer, donate, or partner with Tanzania Health Alliance to support community health programs across viral hepatitis, HIV, and mental health."
        canonicalPath="/make-a-difference"
      />

      {/* Hero */}
      <section className="section-padding bg-primary-dark text-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="heading-xl text-white mb-6">Make a Difference</h1>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed">
              {funding.heroText || "Work with us where your time, funding or institutional support can meet a clear public-health need."}
            </p>
          </div>
        </div>
      </section>

      {/* Tab Selector */}
      <section className="bg-white shadow-md sticky top-14 md:top-16 z-30">
        <div className="container-custom px-4">
          <div className="flex justify-center gap-2 py-4">
            {[
              { id: 'volunteer', label: 'Volunteer', icon: 'volunteer_activism' },
              { id: 'donate', label: 'Donate', icon: 'favorite' },
              { id: 'partner', label: 'Partner', icon: 'handshake' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSearchParams({ tab: tab.id })}
                aria-pressed={activeTab === tab.id}
                className={`flex items-center gap-2 px-3 py-2.5 sm:px-5 rounded-lg font-semibold transition-all text-sm ${
                  activeTab === tab.id
                    ? 'bg-secondary text-white shadow-sm'
                    : 'bg-cool-gray text-primary hover:bg-gray-200'
                }`}
              >
                <Icon name={tab.icon} size={18} color={activeTab === tab.id ? 'white' : '#024d85'} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Volunteer Section */}
      {activeTab === 'volunteer' && (
        <section className="section-padding">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="heading-lg mb-4">Volunteer With Us</h2>
              <p className="body-lg max-w-3xl mx-auto">
                Support THA through a role that matches your time, skills and the needs of current programs.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {roles.map((role) => (
                <div key={role.title} className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 hover:shadow-elevated transition-all">
                  <div className="w-14 h-14 bg-primary/5 rounded-xl flex items-center justify-center mb-5">
                    <Icon name={role.icon} size={28} category="primary" />
                  </div>
                  <div className="mb-4 inline-flex items-center gap-1 text-xs font-semibold text-gray-600">
                    <Icon name="schedule" size={12} color="currentColor" />
                    {role.time?.replace(/–/g, ' to ')}
                  </div>
                  <h3 className="text-lg font-bold text-primary mb-2">{role.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{role.description}</p>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 text-center">
              <p className="mb-4 text-gray-700">Tell us which role interests you and when you’re available.</p>
              <a href={`mailto:${contactEmail}?subject=Volunteer%20with%20THA`} className="btn-primary">
                Email about volunteering
              </a>
            </div>
          </div>
        </section>
      )}

      {/* Donate Section */}
      {activeTab === 'donate' && (
        <section className="section-padding">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="heading-lg mb-4">Support THA’s work</h2>
              <p className="body-lg max-w-3xl mx-auto">
                {funding.donationIntro || "Fund a THA activity or ask us how to donate."}
              </p>
            </div>

            <div className="max-w-4xl mx-auto grid gap-6 md:grid-cols-2">
              <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200">
                <div className="w-11 h-11 rounded-xl bg-primary/5 flex items-center justify-center mb-5">
                  <Icon name="assignment" size={22} category="primary" />
                </div>
                <h3 className="heading-sm mb-3">Fund a defined activity</h3>
                <p className="body-md text-neutral-dark/70 mb-5">
                  {funding.institutionalText || "We can agree on the activity, who it will reach, the budget and how we will report back."}
                </p>
                <a
                  href={`mailto:${contactEmail}?subject=Funding%20or%20grant%20discussion`}
                  className="inline-flex items-center gap-2 text-secondary font-semibold hover:underline"
                >
                  Start a funding conversation
                  <Icon name="arrow_forward" size={17} category="secondary" />
                </a>
              </div>

              <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200">
                <div className="w-11 h-11 rounded-xl bg-primary/5 flex items-center justify-center mb-5">
                  <Icon name="account_balance" size={22} category="primary" />
                </div>
                <h3 className="heading-sm mb-3">Request verified donation details</h3>
                <p className="body-md text-neutral-dark/70 mb-5">
                  Contact THA to confirm current payment details before sending a donation.
                </p>
                <a
                  href={`mailto:${contactEmail}?subject=Request%20for%20verified%20THA%20donation%20details`}
                  className="inline-flex items-center gap-2 text-secondary font-semibold hover:underline"
                >
                  Request payment instructions
                  <Icon name="mail" size={17} category="secondary" />
                </a>
              </div>

              <div className="md:col-span-2 rounded-2xl border border-gray-200 bg-white p-6 md:p-8 text-primary">
                <h3 className="text-xl font-bold mb-3">For grantmakers and institutional partners</h3>
                <p className="text-gray-700 mb-5 max-w-3xl">
                  See our registration and activity records. Contact THA for any other documents you need.
                </p>
                <Link to="/documents" className="inline-flex items-center gap-2 font-semibold text-primary hover:underline">
                  Review Documents & Accountability
                  <Icon name="arrow_forward" size={17} color="currentColor" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Partner Section */}
      {activeTab === 'partner' && (
        <section className="section-padding">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="heading-lg mb-4">Partner With Us</h2>
              <p className="body-lg max-w-3xl mx-auto">
                {funding.partnerIntro || "If our work aligns with your organization, tell us what you are trying to achieve and where collaboration may make sense."}
              </p>
            </div>

            <div className="mx-auto max-w-3xl rounded-xl border border-gray-200 bg-white p-6 text-center">
              <p className="mb-4 text-gray-700">Tell us about your organization and the work you’d like to do together.</p>
              <a href={`mailto:${contactEmail}?subject=Partner%20with%20THA`} className="btn-primary">
                Email about a partnership
              </a>
            </div>
          </div>
        </section>
      )}

      {/* Success Story */}
      {successStory.published && successStory.quote ? (
        <section className="section-padding bg-primary-dark text-white">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="heading-lg text-white mb-4">Impact Story</h2>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-8 md:p-12 rounded-2xl">
                <blockquote className="text-xl md:text-2xl text-white/95 mb-6 leading-relaxed italic">
                  "{successStory.quote}"
                </blockquote>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <Icon name="person" size={32} color="white" />
                  </div>
                  <div>
                    <div className="font-bold text-white">{successStory.name}</div>
                    <div className="text-white/80">{successStory.role}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
};
