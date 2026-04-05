import { useState } from 'react';
import { Icon } from '../components/Icon';

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // TODO: Implement form submission (e.g., send to email service)
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Thank you for your message. We will get back to you soon!');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    }, 1000);
  };

  return (
    <div className="pt-16 bg-cool-gray">
      {/* Hero */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-primary to-primary-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-hero-lg font-heading font-bold tracking-tighter mb-4">
            Get in Touch
          </h1>
          <p className="text-lg text-white/90">
            Have a question or want to collaborate? We'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-primary mb-8">Contact Information</h2>
              </div>

              {/* Location */}
              <div className="bg-white rounded-lg shadow-card p-8">
                <div className="flex items-start gap-4 mb-4">
                  <Icon name="location_on" size={32} category="primary" className="flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-bold text-primary mb-2">Address</h3>
                    <p className="body-sm">
                      Upanga, Dar es Salaam<br />
                      Tanzania
                    </p>
                    <p className="body-sm text-gray-600 mt-2">
                      P.O. Box 65000
                    </p>
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div className="bg-white rounded-lg shadow-card p-8">
                <div className="flex items-start gap-4 mb-4">
                  <Icon name="phone" size={32} category="primary" className="flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-bold text-primary mb-2">Phone</h3>
                    <p className="body-sm">
                      <a href="tel:+255XXX" className="hover:text-secondary transition">
                        +255 (0) XXX XXX XXX
                      </a>
                    </p>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="bg-white rounded-lg shadow-card p-8">
                <div className="flex items-start gap-4 mb-4">
                  <Icon name="email" size={32} category="primary" className="flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-bold text-primary mb-2">Email</h3>
                    <p className="body-sm">
                      <a href="mailto:info@tzhealthalliance.org" className="hover:text-secondary transition">
                        info@tzhealthalliance.org
                      </a>
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="bg-white rounded-lg shadow-card p-8">
                <h3 className="text-lg font-bold text-primary mb-6">Follow Us</h3>
                <div className="flex gap-4">
                  <a href="#" className="w-12 h-12 rounded-lg bg-primary text-white flex items-center justify-center hover:bg-secondary transition">
                    <Icon name="facebook" size={24} />
                  </a>
                  <a href="#" className="w-12 h-12 rounded-lg bg-primary text-white flex items-center justify-center hover:bg-secondary transition">
                    <Icon name="instagram" size={24} />
                  </a>
                  <a href="#" className="w-12 h-12 rounded-lg bg-primary text-white flex items-center justify-center hover:bg-secondary transition">
                    <Icon name="linkedin" size={24} />
                  </a>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="rounded-lg shadow-card overflow-hidden h-64 bg-cool-gray flex items-center justify-center">
                <span className="text-gray-400">Map placeholder - TODO: Add embedded map</span>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-card p-8 md:p-12 h-fit">
              <h2 className="text-2xl font-bold text-primary mb-8">Send us a Message</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-near-black mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-secondary focus:outline-none transition-colors"
                    placeholder="Your name"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-near-black mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-secondary focus:outline-none transition-colors"
                    placeholder="your@email.com"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-near-black mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-secondary focus:outline-none transition-colors"
                    placeholder="Your phone number"
                  />
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="subject" className="block text-sm font-semibold text-near-black mb-2">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-secondary focus:outline-none transition-colors"
                  >
                    <option value="">Select a subject</option>
                    <option value="partnership">Partnership Inquiry</option>
                    <option value="volunteer">Volunteer Interest</option>
                    <option value="donation">Donation Question</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-near-black mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows="5"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-secondary focus:outline-none transition-colors resize-none"
                    placeholder="Tell us what's on your mind..."
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-3 bg-secondary text-white font-bold rounded-lg hover:bg-secondary-dark transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                  <Icon name="arrow_forward" size={20} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 md:py-24 bg-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-heading font-bold tracking-tighter mb-6">
            Stay Updated
          </h2>
          <p className="text-lg text-white/90 mb-8">
            Subscribe to our newsletter for the latest health initiatives and impact stories.
          </p>
          <form className="flex gap-2 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Your email" 
              required
              className="flex-1 px-4 py-3 rounded-md text-near-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary"
            />
            <button 
              type="submit"
              className="px-6 py-3 bg-secondary text-white font-bold rounded-md hover:bg-secondary-dark transition"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};
