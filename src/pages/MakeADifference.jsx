import { useState } from 'react';
import { Icon } from '../components/Icon';
import { SEO } from '../components/SEO';
import { thaData } from '../data/thaData';
import { useSiteContent } from '../hooks/useSiteContent';

export const MakeADifference = () => {
  const site = useSiteContent();
  const funding = site.funding || {};
  const contact = site.contact || {};
  const [activeTab, setActiveTab] = useState('volunteer');
  const roles = [
    {
      title: 'Health Ambassador',
      time: '10-15 hours/week',
      description: 'Conduct community outreach for hepatitis testing, vaccination drives, and health education sessions.',
      icon: 'health_and_safety'
    },
    {
      title: 'Youth Peer Supporter',
      time: '5-10 hours/week',
      description: 'Support young people through Life Unlocked programs, facilitating youth clubs and peer support groups.',
      icon: 'diversity_3'
    },
    {
      title: 'Mental Health Advocate',
      time: 'Flexible',
      description: 'Lead stigma-reduction campaigns and facilitate Talk To Heal support groups in your community.',
      icon: 'volunteer_activism'
    },
  ];


  return (
    <div className="pt-14 md:pt-16">
      <SEO
        title="Make a Difference"
        description="Volunteer, donate, or partner with Tanzania Health Alliance to support community health programs across viral hepatitis, HIV, and mental health."
        canonicalPath="/make-a-difference"
      />

      {/* Hero */}
      <section className="section-padding bg-gradient-to-br from-primary to-primary-dark text-white">
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
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold transition-all text-sm ${
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
                Join our team of passionate volunteers making a real difference in communities across Tanzania
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {roles.map((role) => (
                <div key={role.title} className="bg-white p-6 md:p-8 rounded-2xl shadow-card hover:shadow-elevated transition-all">
                  <div className="w-14 h-14 bg-primary/5 rounded-xl flex items-center justify-center mb-5">
                    <Icon name={role.icon} size={28} category="primary" />
                  </div>
                  <div className="inline-flex items-center gap-1 bg-accent/10 text-accent text-xs font-semibold px-3 py-1 rounded-full mb-4">
                    <Icon name="schedule" size={12} color="#ff9c1a" />
                    {role.time}
                  </div>
                  <h3 className="text-lg font-bold text-primary mb-2">{role.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{role.description}</p>
                </div>
              ))}
            </div>

            <div className="bg-neutral p-8 md:p-12 rounded-2xl">
              <h3 className="heading-md mb-6 text-center">Volunteer Application</h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                alert('Thank you for your interest! We have received your application and will contact you within 48 hours to discuss our current volunteer opportunities.');
                e.target.reset();
              }} className="max-w-2xl mx-auto space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="input-group">
                    <input type="text" required />
                    <label>Full Name</label>
                  </div>
                  <div className="input-group">
                    <input type="email" required />
                    <label>Email Address</label>
                  </div>
                </div>
                <div className="input-group">
                  <input type="tel" required />
                  <label>Phone Number</label>
                </div>
                <div className="input-group">
                  <select className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-secondary focus:outline-none" required>
                    <option value="">Select preferred role</option>
                    <option>Health Ambassador</option>
                    <option>Youth Peer Supporter</option>
                    <option>Mental Health Advocate</option>
                  </select>
                </div>
                <div className="input-group">
                  <textarea rows="4" required></textarea>
                  <label>Why do you want to volunteer?</label>
                </div>
                <button type="submit" className="btn-primary w-full justify-center">
                  Submit Application
                  <Icon name="arrow_forward" size={20} />
                </button>
              </form>
            </div>
          </div>
        </section>
      )}

      {/* Donate Section */}
      {activeTab === 'donate' && (
        <section className="section-padding">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="heading-lg mb-4">Support Our Mission</h2>
              <p className="body-lg max-w-3xl mx-auto">
                {funding.donationIntro || "We welcome support for clearly defined activities, with an agreed purpose, budget and reporting approach."}
              </p>
            </div>

            <div className="max-w-4xl mx-auto grid gap-6 md:grid-cols-2">
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-card">
                <div className="w-11 h-11 rounded-xl bg-primary/5 flex items-center justify-center mb-5">
                  <Icon name="assignment" size={22} category="primary" />
                </div>
                <h3 className="heading-sm mb-3">Fund a defined activity</h3>
                <p className="body-md text-neutral-dark/70 mb-5">
                  {funding.institutionalText || "For institutional or project funding, THA can agree the activity, target group, budget, timeline and reporting requirements before implementation begins."}
                </p>
                <a
                  href="mailto:${contact.email || "info@tzhealthalliance.or.tz"}?subject=Funding%20or%20grant%20discussion"
                  className="inline-flex items-center gap-2 text-secondary font-semibold hover:underline"
                >
                  Start a funding conversation
                  <Icon name="arrow_forward" size={17} category="secondary" />
                </a>
              </div>

              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-card">
                <div className="w-11 h-11 rounded-xl bg-primary/5 flex items-center justify-center mb-5">
                  <Icon name="account_balance" size={22} category="primary" />
                </div>
                <h3 className="heading-sm mb-3">Request verified donation details</h3>
                <p className="body-md text-neutral-dark/70 mb-5">
                  To protect donors and THA, current banking or payment instructions are shared directly by the organization rather than published as unverified website data.
                </p>
                <a
                  href="mailto:${contact.email || "info@tzhealthalliance.or.tz"}?subject=Request%20for%20verified%20THA%20donation%20details"
                  className="inline-flex items-center gap-2 text-secondary font-semibold hover:underline"
                >
                  Request payment instructions
                  <Icon name="mail" size={17} category="secondary" />
                </a>
              </div>

              <div className="md:col-span-2 rounded-2xl bg-primary p-6 md:p-8 text-white">
                <h3 className="text-xl font-bold mb-3">For grantmakers and institutional partners</h3>
                <p className="text-white/80 mb-5 max-w-3xl">
                  Registration information, public activity records and independent verification are available on our Documents & Accountability page. Additional due-diligence documents can be requested directly from THA.
                </p>
                <a href="/documents" className="inline-flex items-center gap-2 font-semibold text-white hover:underline">
                  Review Documents & Accountability
                  <Icon name="arrow_forward" size={17} color="white" />
                </a>
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

            <div className="max-w-3xl mx-auto bg-white p-6 md:p-12 rounded-2xl shadow-card">
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="input-group">
                    <input type="text" required />
                    <label>Organization Name</label>
                  </div>
                  <div className="input-group">
                    <input type="text" required />
                    <label>Contact Person</label>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="input-group">
                    <input type="email" required />
                    <label>Email Address</label>
                  </div>
                  <div className="input-group">
                    <input type="tel" required />
                    <label>Phone Number</label>
                  </div>
                </div>
                <div className="input-group">
                  <select className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-secondary focus:outline-none" required>
                    <option value="">Partnership type</option>
                    <option>Corporate Sponsorship</option>
                    <option>Technical Partnership</option>
                    <option>Research Collaboration</option>
                    <option>Resource Sharing</option>
                  </select>
                </div>
                <div className="input-group">
                  <textarea rows="5" required></textarea>
                  <label>Tell us about your organization and partnership goals</label>
                </div>
                <button type="submit" className="btn-primary w-full justify-center">
                  Submit Partnership Inquiry
                  <Icon name="arrow_forward" size={20} />
                </button>
              </form>
            </div>
          </div>
        </section>
      )}

      {/* Success Story */}
      <section className="section-padding bg-gradient-to-br from-primary to-primary-dark text-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="heading-lg text-white mb-4">Impact Story</h2>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-8 md:p-12 rounded-2xl">
              <blockquote className="text-xl md:text-2xl text-white/95 mb-6 leading-relaxed italic">
                "Getting tested through KAPIME saved my life. I discovered my hepatitis B status early and started treatment immediately. Now I help others in my community get tested too."
              </blockquote>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <Icon name="person" size={32} color="white" />
                </div>
                <div>
                  <div className="font-bold text-white">Fatima M.</div>
                  <div className="text-white/80">KAPIME Beneficiary, Dar es Salaam</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
