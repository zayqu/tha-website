import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import SectionHeader from '../components/SectionHeader'
import ButtonPrimary from '../components/ButtonPrimary'
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    alert('Thank you for your message! We will respond within 24-48 hours.')
  }

  return (
    <>
      <Helmet>
        <title>Contact Us - Tanzania Health Alliance</title>
        <meta name="description" content="Get in touch with Tanzania Health Alliance. Visit our office in Upanga, Dar es Salaam or reach out via email and phone." />
      </Helmet>

      {/* Hero */}
      <section className="bg-primary text-white py-20">
        <div className="container-custom mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Have questions or want to get involved? We'd love to hear from you.
          </p>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-custom mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Info & Map */}
            <div className="space-y-8">
              <SectionHeader 
                title="Get in Touch"
                subtitle="Visit our headquarters or reach out through any of these channels"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <MapPin className="w-8 h-8 text-accent mb-4" />
                  <h3 className="font-bold text-neutral mb-2">Location</h3>
                  <p className="text-neutral/70 text-sm leading-relaxed">
                    Upanga, Dar es Salaam<br />
                    P.O. Box 65000<br />
                    Tanzania
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <Phone className="w-8 h-8 text-accent mb-4" />
                  <h3 className="font-bold text-neutral mb-2">Phone</h3>
                  <p className="text-neutral/70 text-sm">
                    +255 123 456 789<br />
                    +255 987 654 321
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <Mail className="w-8 h-8 text-accent mb-4" />
                  <h3 className="font-bold text-neutral mb-2">Email</h3>
                  <p className="text-neutral/70 text-sm">
                    info@tanzaniahealth.org<br />
                    programs@tanzaniahealth.org
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <Clock className="w-8 h-8 text-accent mb-4" />
                  <h3 className="font-bold text-neutral mb-2">Office Hours</h3>
                  <p className="text-neutral/70 text-sm">
                    Mon - Fri: 8:00 AM - 5:00 PM<br />
                    Sat: 9:00 AM - 1:00 PM
                  </p>
                </div>
              </div>

              {/* Static Map */}
              <div className="rounded-2xl overflow-hidden shadow-lg bg-gray-200 h-[300px] relative">
                <img 
                  src="https://maps.googleapis.com/maps/api/staticmap?center=Upanga,Dar+es+Salaam,Tanzania&zoom=14&size=800x400&maptype=roadmap&markers=color:red%7CUpanga,Dar+es+Salaam,Tanzania&key=YOUR_API_KEY" 
                  alt="Map showing THA office location in Upanga, Dar es Salaam"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg text-sm text-neutral shadow-lg">
                  📍 Upanga, Dar es Salaam
                </div>
              </div>
              <p className="text-xs text-neutral/60 text-center">
                * Replace YOUR_API_KEY with your Google Maps Static API key or use an embedded iframe
              </p>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg">
              <h2 className="text-2xl font-bold text-neutral mb-6">Send us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-neutral mb-2">Full Name *</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-accent focus:bg-white focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="John Doe"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral mb-2">Email Address *</label>
                    <input
                      type="email"
                      required
                      className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-accent focus:bg-white focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral mb-2">Phone Number</label>
                    <input
                      type="tel"
                      className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-accent focus:bg-white focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="+255 XXX XXX XXX"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral mb-2">Message *</label>
                  <textarea
                    required
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-accent focus:bg-white focus:ring-2 focus:ring-accent/20 outline-none transition-all resize-none"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder="How can we help you?"
                  ></textarea>
                </div>

                <ButtonPrimary type="submit" className="w-full">
                  <Send className="w-5 h-5 mr-2" /> Send Message
                </ButtonPrimary>

                <p className="text-xs text-neutral/60 text-center">
                  We typically respond within 24-48 hours. For urgent inquiries, please call us directly.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}