import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { SEO } from '../components/SEO';
import { thaData } from '../data/thaData';
import { useSiteContent } from '../hooks/useSiteContent';

export const Contact = () => {
  const site = useSiteContent();
  const contact = site.contact || {};
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const email = contact.email || thaData.contact.emails[0];
    const subject = encodeURIComponent(formData.subject || 'Website enquiry');
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`
    );
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="pt-14 md:pt-16 bg-cool-gray">
      <SEO
        title="Contact"
        description="Contact Tanzania Health Alliance in Dar es Salaam for public health programs, partnerships, volunteering, and community health collaboration."
        canonicalPath="/contact"
      />

      {/* Hero */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-primary to-primary-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-hero-lg font-heading font-bold tracking-tighter mb-4">
            Get in Touch
          </h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            Whether you are looking for program information, partnership opportunities, due-diligence documents or a way to support our work, talk to our team.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">

            {/* Contact Info */}
            <div className="space-y-6">
              {/* Address */}
              <div className="bg-white rounded-xl shadow-card p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon name="location_on" size={22} category="primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-primary mb-1">Physical Address</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {contact.address || 'Adda Estate, House No. 03, Kinondoni'},<br />
                      {contact.poBox || 'P.O. Box 31902'},<br />
                      {contact.city || 'Dar es Salaam'}, {contact.country || 'Tanzania'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Work Hours */}
              <div className="bg-white rounded-xl shadow-card p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon name="calendar_today" size={22} category="primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-primary mb-2">Work Hours</h3>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex justify-between gap-8">
                        <span>Monday – Friday</span>
                        <span className="font-medium text-primary">{contact.workHours?.mondayFriday || '9:00 AM – 5:00 PM'}</span>
                      </div>
                      <div className="flex justify-between gap-8">
                        <span>Saturday</span>
                        <span className="font-medium text-primary">{contact.workHours?.saturday || '10:00 AM – 2:00 PM'}</span>
                      </div>
                      <div className="flex justify-between gap-8">
                        <span>Sunday</span>
                        <span className="font-medium text-gray-400">{contact.workHours?.sunday || 'Closed'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div className="bg-white rounded-xl shadow-card p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon name="phone" size={22} category="primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-primary mb-1">Phone & Mobile</h3>
                    <p className="text-sm text-gray-600">
                      Phone:{' '}
                      <a href={`tel:${contact.phone || thaData.contact.phone}`} className="hover:text-secondary transition">
                        {contact.phone || thaData.contact.phone}
                      </a>
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Mobile:{' '}
                      <a href={`tel:${contact.secondaryPhone || contact.phone || thaData.contact.mobile}`} className="hover:text-secondary transition">
                        {contact.secondaryPhone || contact.phone || thaData.contact.mobile}
                      </a>
                    </p>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="bg-white rounded-xl shadow-card p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon name="email" size={22} category="primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-primary mb-1">Email</h3>
                    <a
                      href={`mailto:${contact.email || thaData.contact.emails[0]}`}
                      className="text-sm text-gray-600 hover:text-secondary transition"
                    >
                      {contact.email || thaData.contact.emails[0]}
                    </a>
                  </div>
                </div>
              </div>

              {/* Socials */}
              <div className="bg-white rounded-xl shadow-card p-6">
                <h3 className="font-bold text-primary mb-4">Follow Us</h3>
                <div className="flex gap-3">
                  <a href={contact.facebook || thaData.social.facebook} target="_blank" rel="noopener noreferrer"
                    className="w-11 h-11 rounded-lg bg-primary text-white flex items-center justify-center hover:bg-secondary transition">
                    <Icon name="facebook" size={22} color="white" />
                  </a>
                  <a href={contact.instagram || thaData.social.instagram} target="_blank" rel="noopener noreferrer"
                    className="w-11 h-11 rounded-lg bg-primary text-white flex items-center justify-center hover:bg-secondary transition">
                    <Icon name="instagram" size={22} color="white" />
                  </a>
                  <a href={contact.linkedin || thaData.social.linkedin} target="_blank" rel="noopener noreferrer"
                    className="w-11 h-11 rounded-lg bg-primary text-white flex items-center justify-center hover:bg-secondary transition">
                    <Icon name="linkedin" size={22} color="white" />
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-xl shadow-card p-8 md:p-10 h-fit">
              <h2 className="text-2xl font-heading font-bold text-primary mb-2">Talk to our team</h2>
              <p className="text-gray-600 text-sm mb-8">Whether you need health-program information, want to partner with us, or have a community concern, send us a message. Our team will respond as soon as possible.</p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-near-black mb-1.5">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="Your full name"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-secondary focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-near-black mb-1.5">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-secondary focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-near-black mb-1.5">Subject *</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      placeholder="What is this about?"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-secondary focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-near-black mb-1.5">Message *</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows="5"
                      placeholder="How can we help?"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-secondary focus:outline-none transition-colors resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full px-6 py-3 bg-secondary text-white font-bold rounded-lg hover:bg-secondary-dark transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    Send Message
                    <Icon name="arrow_forward" size={20} color="white" />
                  </button>
                </form>

            </div>
          </div>
        </div>
      </section>

      {/* Volunteer CTA */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary to-primary-dark text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-hero-md font-heading font-bold tracking-tighter mb-4">
            Become a Volunteer
          </h2>
          <h3 className="text-xl font-semibold text-white/90 mb-4">
            Want to help with the work?
          </h3>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            Tell us what you can contribute and how much time you have. We will match that with current THA activities where your support is genuinely useful.
          </p>
          <Link
            to="/make-a-difference"
            className="inline-block px-8 py-3 bg-secondary text-white font-bold rounded-lg hover:bg-secondary-dark transition shadow-card"
          >
            Apply Now
          </Link>
        </div>
      </section>
    </div>
  );
};
