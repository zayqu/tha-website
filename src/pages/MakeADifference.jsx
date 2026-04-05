import { useState } from 'react';
import { Icon } from '../components/Icon';
import { thaData } from '../data/thaData';

export const MakeADifference = () => {
  const [activeTab, setActiveTab] = useState('volunteer');
  const [donationAmount, setDonationAmount] = useState(50000);

  const roles = [
    {
      title: 'Community Outreach Coordinator',
      time: '10-15 hours/week',
      description: 'Engage with communities, organize health awareness campaigns, and facilitate workshops.',
      icon: 'groups'
    },
    {
      title: 'Administrative Support',
      time: '5-10 hours/week',
      description: 'Assist with office operations, data entry, scheduling, and general administrative tasks.',
      icon: 'person'
    },
    {
      title: 'Healthcare Professional',
      time: 'Flexible',
      description: 'Provide clinical services, health education, or technical expertise in your specialty.',
      icon: 'local_hospital'
    },
  ];

  const impactCalculations = {
    50000: 'Provides health education materials for 100 community members',
    100000: 'Sponsors hepatitis testing for 50 individuals',
    250000: 'Funds mental health counseling sessions for 10 people',
    500000: 'Supports a full community health screening event',
  };

  return (
    <div className="pt-16 md:pt-20">
      {/* Hero */}
      <section className="section-padding bg-gradient-to-br from-primary to-primary-light text-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="heading-xl text-white mb-6">Make a Difference</h1>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed">
              Your support helps us reach more communities, save more lives, and build a healthier Tanzania.
            </p>
          </div>
        </div>
      </section>

      {/* Tab Selector */}
      <section className="bg-white shadow-md sticky top-16 md:top-20 z-30">
        <div className="container-custom px-4">
          <div className="flex justify-center gap-2 py-4">
            {['volunteer', 'donate', 'partner'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  activeTab === tab
                    ? 'bg-secondary text-white shadow-md'
                    : 'bg-neutral text-primary hover:bg-gray-200'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
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
                <div key={role.title} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all card-hover">
                  <div className="w-16 h-16 bg-gradient-to-br from-secondary to-secondary-dark rounded-xl flex items-center justify-center mb-6">
                    <Icon name={role.icon} size={32} className="text-white" />
                  </div>
                  <div className="badge bg-accent/10 text-accent mb-4">{role.time}</div>
                  <h3 className="heading-sm mb-3">{role.title}</h3>
                  <p className="body-md text-neutral-dark/70">{role.description}</p>
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
                    <option>Community Outreach Coordinator</option>
                    <option>Administrative Support</option>
                    <option>Healthcare Professional</option>
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
                Your generous donation directly funds health programs, education, and community support
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              {/* Impact Calculator */}
              <div className="bg-gradient-to-br from-secondary/10 to-secondary/5 p-8 md:p-12 rounded-2xl mb-8">
                <h3 className="heading-md mb-6 text-center">Your Impact</h3>
                <div className="mb-6">
                  <input
                    type="range"
                    min="50000"
                    max="500000"
                    step="50000"
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(Number(e.target.value))}
                    className="w-full h-3 bg-secondary/20 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="text-center mt-4">
                    <div className="text-4xl font-bold text-secondary mb-2">
                      {donationAmount.toLocaleString()} TZS
                    </div>
                    <p className="body-md text-primary">
                      {impactCalculations[donationAmount]}
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <h4 className="heading-sm mb-6">Bank Transfer</h4>
                <div className="space-y-4 text-sm">
                  <div className="p-4 bg-neutral rounded-lg">
                    <div className="font-semibold text-primary mb-1">Bank Name</div>
                    <div className="text-neutral-dark/70">{thaData.bankDetails.bankName}</div>
                  </div>
                  <div className="p-4 bg-neutral rounded-lg">
                    <div className="font-semibold text-primary mb-1">Account Name</div>
                    <div className="text-neutral-dark/70">{thaData.bankDetails.accountName}</div>
                  </div>
                  <div className="p-4 bg-neutral rounded-lg">
                    <div className="font-semibold text-primary mb-1">Account Number</div>
                    <div className="text-neutral-dark/70 text-lg font-mono">{thaData.bankDetails.accountNumber}</div>
                  </div>
                  <div className="p-4 bg-neutral rounded-lg">
                    <div className="font-semibold text-primary mb-1">SWIFT Code</div>
                    <div className="text-neutral-dark/70 font-mono">{thaData.bankDetails.swiftCode}</div>
                  </div>
                  <div className="mt-6 p-4 bg-secondary/10 rounded-lg">
                    <p className="text-xs text-primary">
                      Please include your name and contact information in the transfer reference. Donations are tax-deductible where applicable.
                    </p>
                  </div>
                </div>
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
                Join leading organizations in supporting sustainable health solutions across Tanzania
              </p>
            </div>

            <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-lg">
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
      <section className="section-padding bg-gradient-to-br from-primary to-primary-light text-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="heading-lg text-white mb-4">Impact Story</h2>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-8 md:p-12 rounded-2xl">
              <blockquote className="text-xl md:text-2xl text-white/95 mb-6 leading-relaxed italic">
                "THA's hepatitis screening program saved my life. I had no idea I was infected until their team came to our village. Today, I'm healthy, educated about my condition, and helping others get tested."
              </blockquote>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-full"></div>
                <div>
                  <div className="font-bold text-white">Sarah M.</div>
                  <div className="text-white/80">Program Participant, Mwanza</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
