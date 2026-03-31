import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import SectionHeader from '../components/SectionHeader'
import ButtonPrimary from '../components/ButtonPrimary'
import { Users, ClipboardList, Stethoscope, Quote, CheckCircle } from 'lucide-react'

const volunteerTypes = [
  {
    icon: Users,
    title: 'Community Outreach',
    description: 'Join our field teams conducting health screenings, education sessions, and community mobilization activities in urban and rural areas.',
    commitment: '4-8 hours/week',
    location: 'Field-based'
  },
  {
    icon: ClipboardList,
    title: 'Administrative Support',
    description: 'Assist with office operations, data entry, event coordination, and communications from our headquarters in Dar es Salaam.',
    commitment: 'Flexible',
    location: 'Office-based'
  },
  {
    icon: Stethoscope,
    title: 'Professional Volunteer',
    description: 'Healthcare professionals, counselors, and specialists providing clinical services, training, or technical assistance.',
    commitment: 'Project-based',
    location: 'Varies'
  }
]

const testimonials = [
  {
    quote: "Volunteering with THA transformed my perspective on public health. The organization's commitment to underserved communities is truly inspiring.",
    author: "Dr. Sarah Kimaro",
    role: "Medical Volunteer, 2023"
  },
  {
    quote: "As a community outreach volunteer, I've seen firsthand how education and early screening saves lives. THA empowers both volunteers and beneficiaries.",
    author: "John Mwaipopo",
    role: "Community Volunteer, 2022-Present"
  }
]

export default function MakeDifference() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    interest: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    alert('Thank you for your interest! We will contact you within 48 hours.')
  }

  return (
    <>
      <Helmet>
        <title>Make a Difference - Tanzania Health Alliance</title>
        <meta name="description" content="Volunteer, donate, or become a member of Tanzania Health Alliance. Join us in improving health outcomes across Tanzania." />
      </Helmet>

      {/* Hero */}
      <section className="bg-primary text-white py-20">
        <div className="container-custom mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Make a Difference</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Whether you have time, skills, or resources to share, your contribution 
            helps us create lasting health impact in Tanzania.
          </p>
        </div>
      </section>

      {/* Volunteer Opportunities */}
      <section className="section-padding bg-white">
        <div className="container-custom mx-auto">
          <SectionHeader 
            title="Volunteer With Us"
            subtitle="Join our network of dedicated volunteers working to improve community health"
            centered
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {volunteerTypes.map((type, index) => (
              <div key={index} className="bg-background rounded-2xl p-8 border border-gray-100 hover:border-accent/20 transition-colors">
                <type.icon className="w-12 h-12 text-accent mb-6" />
                <h3 className="text-xl font-bold text-neutral mb-3">{type.title}</h3>
                <p className="text-neutral/70 mb-6 leading-relaxed">{type.description}</p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-neutral/60">
                    <CheckCircle className="w-4 h-4 mr-2 text-secondary" />
                    {type.commitment}
                  </div>
                  <div className="flex items-center text-neutral/60">
                    <CheckCircle className="w-4 h-4 mr-2 text-secondary" />
                    {type.location}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <ButtonPrimary to="#member-form">Apply to Volunteer</ButtonPrimary>
          </div>
        </div>
      </section>

      {/* Donation Section */}
      <section className="section-padding bg-background">
        <div className="container-custom mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <SectionHeader 
                title="Support Our Work"
                subtitle="Your donation directly supports health screenings, education programs, and treatment access for underserved communities."
              />
              
              <div className="space-y-6">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="font-bold text-neutral mb-2">Mobile Money</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-neutral/60">M-Pesa:</span>
                      <p className="font-mono font-semibold">+255 123 456 789</p>
                    </div>
                    <div>
                      <span className="text-neutral/60">Tigo Pesa:</span>
                      <p className="font-mono font-semibold">+255 987 654 321</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="font-bold text-neutral mb-2">Bank Transfer</h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-neutral/60">Bank:</span> CRDB Bank Tanzania</p>
                    <p><span className="text-neutral/60">Account Name:</span> Tanzania Health Alliance</p>
                    <p><span className="text-neutral/60">Account Number:</span> 1234567890</p>
                    <p><span className="text-neutral/60">SWIFT:</span> CORUTZTZ</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-neutral mb-6">Why Donate?</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-secondary mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-neutral/70">Fund free hepatitis and HIV screening camps in rural areas</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-secondary mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-neutral/70">Support training for community health workers</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-secondary mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-neutral/70">Provide treatment subsidies for low-income patients</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-secondary mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-neutral/70">Develop educational materials in local languages</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Membership Form */}
      <section id="member-form" className="section-padding bg-white">
        <div className="container-custom mx-auto max-w-2xl">
          <SectionHeader 
            title="Become a Member"
            subtitle="Join our alliance to receive updates, event invitations, and opportunities to contribute"
            centered
          />
          
          <form onSubmit={handleSubmit} className="space-y-6 bg-background rounded-2xl p-8 md:p-12">
            <div>
              <label className="block text-sm font-medium text-neutral mb-2">Full Name *</label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral mb-2">Email Address *</label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral mb-2">Phone Number</label>
                <input
                  type="tel"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral mb-2">Area of Interest</label>
              <select
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                value={formData.interest}
                onChange={(e) => setFormData({...formData, interest: e.target.value})}
              >
                <option value="">Select an area...</option>
                <option value="volunteer">Volunteering</option>
                <option value="donate">Donating</option>
                <option value="hepatitis">Viral Hepatitis Programs</option>
                <option value="hiv">HIV/AIDS Programs</option>
                <option value="mental">Mental Health Programs</option>
                <option value="general">General Support</option>
              </select>
            </div>
            
            <ButtonPrimary type="submit" className="w-full">
              Submit Application
            </ButtonPrimary>
            
            <p className="text-xs text-neutral/60 text-center">
              By submitting, you agree to receive communications from THA. You can unsubscribe at any time.
            </p>
          </form>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-primary text-white">
        <div className="container-custom mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Impact Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((item, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 relative">
                <Quote className="w-10 h-10 text-accent/50 absolute top-6 left-6" />
                <p className="text-lg leading-relaxed mb-6 relative z-10 pl-8">{item.quote}</p>
                <div className="border-t border-white/20 pt-4">
                  <p className="font-semibold">{item.author}</p>
                  <p className="text-white/70 text-sm">{item.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}