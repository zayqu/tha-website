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
        <meta name="description" content="Get in touch with Tanzania Health Alliance." />
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

      {/* Content */}
      <section className="section-padding bg-background">
        <div className="container-custom mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

            {/* LEFT SIDE */}
            <div className="space-y-8">
              <SectionHeader 
                title="Get in Touch"
                subtitle="Visit our headquarters or reach out through any of these channels"
              />

              {/* Contact Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <MapPin className="w-8 h-8 text-accent mb-4" />
                  <h3 className="font-bold text-neutral mb-2">Location</h3>
                  <p className="text-neutral/70 text-sm">
                    Upanga, Dar es Salaam<br />
                    P.O. Box 65000<br />
                    Tanzania
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <Phone className="w-8 h-8 text-accent mb-4" />
                  <h3 className="font-bold text-neutral mb-2">Phone</h3>
                  <p className="text-neutral/70 text-sm">
                    +255 659 114 754
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <Mail className="w-8 h-8 text-accent mb-4" />
                  <h3 className="font-bold text-neutral mb-2">Email</h3>
                  <p className="text-neutral/70 text-sm">
                    info@tzhealthalliance.or.tz
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <Clock className="w-8 h-8 text-accent mb-4" />
                  <h3 className="font-bold text-neutral mb-2">Office Hours</h3>
                  <p className="text-neutral/70 text-sm">
                    Mon - Fri: 8:00 AM - 5:00 PM
                  </p>
                </div>
              </div>

              {/* MAP (Assistant Integrated) */}
              <div className="rounded-2xl overflow-hidden shadow-lg h-[300px]">
                <iframe
                  src="https://www.google.com/maps?q=Upanga, Dar es Salaam, Tanzania&output=embed"
                  className="w-full h-full border-0"
                  allowFullScreen
                  loading="lazy"
                ></iframe>
              </div>
            </div>

            {/* RIGHT SIDE FORM */}
            <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg">
              <h2 className="text-2xl font-bold text-neutral mb-6">Send us a Message</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-neutral mb-2">Full Name *</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral mb-2">Email *</label>
                    <input
                      type="email"
                      required
                      className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral mb-2">Phone</label>
                    <input
                      type="tel"
                      className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral mb-2">Message *</label>
                  <textarea
                    required
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none resize-none"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                  ></textarea>
                </div>

                <ButtonPrimary type="submit" className="w-full">
                  <Send className="w-5 h-5 mr-2" /> Send Message
                </ButtonPrimary>
              </form>
            </div>

          </div>
        </div>
      </section>
    </>
  )
}