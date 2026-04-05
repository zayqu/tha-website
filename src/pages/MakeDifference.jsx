import { useState } from 'react';
import { Icon } from '../components/Icon';

export const MakeADifference = () => {
  const [activeTab, setActiveTab] = useState('volunteer');

  const volunteerRoles = [
    {
      title: 'Community Outreach',
      commitment: '4-8 hrs/week',
      description: 'Connect with communities, conduct awareness campaigns, and help distribute health information.',
      icon: 'groups',
      color: 'health'
    },
    {
      title: 'Professional Services',
      commitment: 'Flexible',
      description: 'Contribute your expertise in healthcare, communications, design, or technology.',
      icon: 'person',
      color: 'primary'
    },
    {
      title: 'Administrative Support',
      commitment: '2-4 hrs/week',
      description: 'Support our operations with administrative, research, or data analysis tasks.',
      icon: 'calendar_today',
      color: 'primary'
    }
  ];

  const mobileMoneyOptions = [
    {
      name: 'M-Pesa',
      code: '*151*01*+255 XXX XXX XXX#',
      instruction: 'Use your M-Pesa app or dial the code above'
    },
    {
      name: 'Tigo Pesa',
      code: '*150*01*+255 XXX XXX XXX#',
      instruction: 'Use your Tigo Pesa app or dial the code above'
    },
    {
      name: 'Airtel Money',
      code: '*150*01*+255 XXX XXX XXX#',
      instruction: 'Use your Airtel Money app or dial the code above'
    }
  ];

  const impactCalculations = [
    { amount: '10,000 TZS', provides: 'Health education materials for 10 people' },
    { amount: '50,000 TZS', provides: 'Awareness campaign in one community' },
    { amount: '100,000 TZS', provides: 'Training for 5 community health workers' },
    { amount: '500,000 TZS', provides: 'Comprehensive health program for one region' }
  ];

  return (
    <div className="pt-16 bg-cool-gray">
      {/* Hero */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary to-primary-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-hero-lg font-heading font-bold tracking-tighter mb-6">
            Make a Difference
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Join us in transforming health outcomes across Tanzania. Whether you volunteer, donate, or partner with us, your contribution matters.
          </p>
        </div>
      </section>

      {/* Action Selector */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              { id: 'volunteer', label: 'Volunteer', icon: 'volunteer_activism' },
              { id: 'donate', label: 'Donate', icon: 'favorite' },
              { id: 'partner', label: 'Partner', icon: 'groups' }
            ].map(action => (
              <button
                key={action.id}
                onClick={() => setActiveTab(action.id)}
                className={`p-8 rounded-lg transition-all ${
                  activeTab === action.id
                    ? 'bg-gradient-to-br from-secondary to-secondary-dark text-white shadow-elevated'
                    : 'bg-cool-gray text-near-black shadow-card hover:shadow-elevated'
                }`}
              >
                <Icon name={action.icon} size={40} className="mx-auto mb-3" />
                <h3 className="text-xl font-bold">{action.label}</h3>
              </button>
            ))}
          </div>

          {/* Volunteer Section */}
          {activeTab === 'volunteer' && (
            <div className="animate-fade-up">
              <h2 className="text-3xl font-heading font-bold tracking-tighter mb-8">Volunteer Opportunities</h2>
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                {volunteerRoles.map((role) => (
                  <div key={role.title} className="bg-white border-2 border-cool-gray rounded-lg p-6 hover:border-secondary hover:shadow-elevated transition">
                    <Icon name={role.icon} size={40} category={role.color} className="mb-4" />
                    <h3 className="text-xl font-bold text-primary mb-2">{role.title}</h3>
                    <p className="text-secondary font-semibold text-sm mb-4">{role.commitment}</p>
                    <p className="body-sm">{role.description}</p>
                  </div>
                ))}
              </div>

              <div className="bg-primary text-white p-8 rounded-lg">
                <h3 className="text-xl font-bold mb-4">Ready to volunteer?</h3>
                <p className="mb-6">Fill out our volunteer form and we'll connect you with opportunities that match your skills and availability.</p>
                <button className="px-6 py-3 bg-secondary text-white font-bold rounded-md hover:bg-secondary-dark transition">
                  Apply as Volunteer
                </button>
              </div>
            </div>
          )}

          {/* Donate Section */}
          {activeTab === 'donate' && (
            <div className="animate-fade-up">
              <h2 className="text-3xl font-heading font-bold tracking-tighter mb-8">Support Our Mission</h2>

              {/* Mobile Money */}
              <div className="mb-12">
                <h3 className="text-2xl font-bold text-primary mb-6">Mobile Money</h3>
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  {mobileMoneyOptions.map((option) => (
                    <div key={option.name} className="bg-white border-2 border-cool-gray rounded-lg p-6">
                      <h4 className="text-lg font-bold text-primary mb-2">{option.name}</h4>
                      <div className="bg-primary text-white p-4 rounded mb-4 font-mono text-sm text-center">
                        {option.code}
                      </div>
                      <p className="body-sm text-gray-600">{option.instruction}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bank Transfer */}
              <div className="mb-12">
                <h3 className="text-2xl font-bold text-primary mb-6">Bank Transfer</h3>
                <div className="bg-white border-2 border-cool-gray rounded-lg p-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600">Account Name</p>
                      <p className="font-bold text-lg">Tanzania Health Alliance</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Bank Name</p>
                      <p className="font-bold text-lg">Tanzanian Bank Name</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Account Number</p>
                      <p className="font-bold text-lg">000 000 0000 000</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Swift Code</p>
                      <p className="font-bold text-lg">XXXTZTZ</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Impact Calculator */}
              <div className="mb-12">
                <h3 className="text-2xl font-bold text-primary mb-6">Your Impact</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {impactCalculations.map((calc) => (
                    <div key={calc.amount} className="bg-gradient-to-r from-secondary to-secondary-dark text-white rounded-lg p-6">
                      <p className="text-2xl font-bold mb-2">{calc.amount}</p>
                      <p className="font-medium">{calc.provides}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Partner Section */}
          {activeTab === 'partner' && (
            <div className="animate-fade-up">
              <h2 className="text-3xl font-heading font-bold tracking-tighter mb-8">Partnership Opportunities</h2>

              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div className="bg-white border-2 border-cool-gray rounded-lg p-8">
                  <h3 className="text-xl font-bold text-primary mb-4">Organization Partnerships</h3>
                  <p className="body-md mb-6">
                    Collaborate with THA to expand your impact and reach. We partner with NGOs, healthcare facilities, government agencies, and corporate organizations.
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center gap-2">
                      <Icon name="check_circle" size={20} className="text-secondary flex-shrink-0" />
                      <span>Co-branded initiatives</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Icon name="check_circle" size={20} className="text-secondary flex-shrink-0" />
                      <span>Joint training programs</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Icon name="check_circle" size={20} className="text-secondary flex-shrink-0" />
                      <span>Shared resources</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white border-2 border-cool-gray rounded-lg p-8">
                  <h3 className="text-xl font-bold text-primary mb-4">Corporate Partnerships</h3>
                  <p className="body-md mb-6">
                    Help your organization make a meaningful social impact while supporting Tanzania's health priorities.
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center gap-2">
                      <Icon name="check_circle" size={20} className="text-secondary flex-shrink-0" />
                      <span>Employee volunteer programs</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Icon name="check_circle" size={20} className="text-secondary flex-shrink-0" />
                      <span>In-kind donations</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Icon name="check_circle" size={20} className="text-secondary flex-shrink-0" />
                      <span>Sponsorship opportunities</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-primary text-white p-8 rounded-lg">
                <h3 className="text-xl font-bold mb-4">Let's Work Together</h3>
                <p className="mb-6">Tell us about your organization and partnership interests. We'll discuss how we can collaborate to maximize impact.</p>
                <button className="px-6 py-3 bg-secondary text-white font-bold rounded-md hover:bg-secondary-dark transition">
                  Explore Partnership
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Success Story */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-heading font-bold tracking-tighter text-center mb-12">
            Stories of Impact
          </h2>

          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-8 md:p-12">
            <div className="md:flex gap-8">
              <div className="md:w-1/3 h-64 md:h-auto bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center mb-6 md:mb-0">
                <span className="text-gray-400">Success Story Photo</span>
              </div>

              <div className="md:w-2/3">
                <p className="text-lg italic text-primary mb-6">
                  "THA's hepatitis awareness program saved my life. I never knew I had hepatitis B until the screening they conducted. Early detection changed everything."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-white font-bold">
                    JK
                  </div>
                  <div>
                    <p className="font-bold text-primary">Jane K.</p>
                    <p className="text-gray-600">Dar es Salaam</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
