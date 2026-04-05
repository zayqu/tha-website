<<<<<<< HEAD
import { useState } from 'react';
import { Icon } from '../components/Icon';
import { thaData, sendEmail } from '../data/thaData';

export const Contact = () => {
=======
import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import SectionHeader from '../components/SectionHeader'
import ButtonPrimary from '../components/ButtonPrimary'
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react'

export default function Contact() {
>>>>>>> 5ac31723d5b9b56bde9fed84c9a0ddf1a28941a9
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
<<<<<<< HEAD
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await sendEmail(formData);
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      setIsSubmitting(false);
      alert('Failed to send message. Please email us directly at info@tzhealthalliance.or.tz');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const contactInfo = [
    {
      icon: 'location_on',
      title: 'Our Office',
      details: [thaData.contact.address, `${thaData.contact.city}, ${thaData.contact.country}`]
    },
    {
      icon: 'phone',
      title: 'Phone',
      details: [thaData.contact.phone, thaData.contact.mobile]
    },
    {
      icon: 'email',
      title: 'Email',
      details: thaData.contact.emails
    },
  ];

  const socialLinks = [
    { name: 'Facebook', icon: 'facebook', url: 'https://facebook.com/tzhealthalliance', color: 'from-blue-500 to-blue-600' },
    { name: 'Twitter', icon: 'twitter', url: 'https://twitter.com/tzhealthalliance', color: 'from-sky-500 to-sky-600' },
    { name: 'Instagram', icon: 'instagram', url: 'https://instagram.com/tzhealthalliance', color: 'from-pink-500 to-pink-600' },
    { name: 'LinkedIn', icon: 'linkedin', url: 'https://linkedin.com/company/tzhealthalliance', color: 'from-blue-600 to-blue-700' },
  ];

  return (
    <div className="pt-16 md:pt-20">
      {/* Hero */}
      <section className="section-padding bg-gradient-to-br from-primary to-primary-light text-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="heading-xl text-white mb-6">Get in Touch</h1>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Contact Info - Left Side */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="heading-md mb-6">Contact Information</h2>
                <p className="body-md text-neutral-dark/70 mb-8">
                  Reach out to us through any of these channels. We're here to help and answer any questions you might have.
                </p>
              </div>

              {/* Contact Details */}
              <div className="space-y-6">
                {contactInfo.map((info) => (
                  <div key={info.title} className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-secondary to-secondary-dark rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon name={info.icon} size={24} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary mb-2">{info.title}</h3>
                      {info.details.map((detail, index) => (
                        <p key={index} className="text-neutral-dark/70 text-sm">
                          {detail}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Social Links */}
              <div>
                <h3 className="font-semibold text-primary mb-4">Follow Us</h3>
                <div className="flex gap-3">
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-12 h-12 bg-gradient-to-br ${social.color} rounded-lg flex items-center justify-center text-white hover:scale-110 transition-transform shadow-md hover:shadow-lg`}
                      aria-label={social.name}
                    >
                      <Icon name={social.icon} size={20} />
                    </a>
                  ))}
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="bg-neutral rounded-2xl overflow-hidden shadow-lg">
                <div className="h-64 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <div className="text-center">
                    <Icon name="location_on" size={48} className="text-primary/40 mx-auto mb-2" />
                    <p className="text-primary/60 font-medium">Map View</p>
                    <p className="text-sm text-primary/40">Upanga, Dar es Salaam</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form - Right Side */}
            <div className="lg:col-span-3">
              <div className="bg-white p-8 md:p-10 rounded-2xl shadow-lg">
                <h2 className="heading-md mb-6">Send us a Message</h2>
                
                {submitted ? (
                  <div className="bg-secondary/10 border-2 border-secondary rounded-xl p-8 text-center">
                    <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon name="check_circle" size={32} className="text-white" />
                    </div>
                    <h3 className="heading-sm text-secondary mb-2">Message Sent!</h3>
                    <p className="body-md text-neutral-dark/70">
                      Thank you for contacting us. We'll get back to you shortly.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="input-group">
                        <input 
                          type="text" 
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required 
                        />
                        <label>Full Name</label>
                      </div>
                      <div className="input-group">
                        <input 
                          type="email" 
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required 
                        />
                        <label>Email Address</label>
                      </div>
                    </div>

                    <div className="input-group">
                      <input 
                        type="tel" 
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required 
                      />
                      <label>Phone Number</label>
                    </div>

                    <div className="input-group">
                      <select 
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-secondary focus:outline-none transition-colors" 
                        required
                      >
                        <option value="">Select subject</option>
                        <option value="general">General Inquiry</option>
                        <option value="partnership">Partnership Opportunity</option>
                        <option value="volunteer">Volunteer Application</option>
                        <option value="donation">Donation Information</option>
                        <option value="programs">Program Information</option>
                        <option value="support">Technical Support</option>
                      </select>
                    </div>

                    <div className="input-group">
                      <textarea 
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows="6" 
                        required
                      ></textarea>
                      <label>Your Message</label>
                    </div>

                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <Icon name="arrow_forward" size={20} />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
=======
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
>>>>>>> 5ac31723d5b9b56bde9fed84c9a0ddf1a28941a9
            </div>
          </div>
        </div>
      </section>
<<<<<<< HEAD

      {/* Office Hours */}
      <section className="section-padding bg-neutral">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="heading-md mb-8">Office Hours</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="font-semibold text-primary mb-2">Weekdays</h3>
                <p className="text-neutral-dark/70">Monday - Friday</p>
                <p className="text-lg font-semibold text-secondary">8:00 AM - 5:00 PM</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="font-semibold text-primary mb-2">Weekend</h3>
                <p className="text-neutral-dark/70">Saturday</p>
                <p className="text-lg font-semibold text-secondary">9:00 AM - 1:00 PM</p>
              </div>
            </div>
            <p className="text-sm text-neutral-dark/60 mt-6">
              Closed on Sundays and Public Holidays
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
=======
    </>
  )
}
>>>>>>> 5ac31723d5b9b56bde9fed84c9a0ddf1a28941a9
