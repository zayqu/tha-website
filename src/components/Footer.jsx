import { Link } from 'react-router-dom';
import { Icon } from './Icon';
import { useState } from 'react';
import { thaData } from '../data/thaData';

export const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // In production, this would connect to an email service
    setSubscribed(true);
    setTimeout(() => {
      setSubscribed(false);
      setEmail('');
    }, 3000);
  };

  const quickLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About Us' },
    { path: '/make-a-difference', label: 'Make a Difference' },
    { path: '/academy', label: 'Academy' },
    { path: '/news', label: 'News' },
    { path: '/contact', label: 'Contact' },
  ];

  const focusAreas = [
    { label: 'Hepatitis Programs', icon: 'local_hospital' },
    { label: 'HIV/AIDS Support', icon: 'favorite' },
    { label: 'Mental Health', icon: 'psychology' },
    { label: 'Healthcare Access', icon: 'groups' },
  ];

  const socialLinks = [
    { name: 'Facebook', icon: 'facebook', url: thaData.social.facebook },
    { name: 'Instagram', icon: 'instagram', url: thaData.social.instagram },
    { name: 'LinkedIn', icon: 'linkedin', url: thaData.social.linkedin },
  ];

  return (
    <footer className="bg-primary text-white">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-secondary to-secondary-dark">
        <div className="container-custom px-4 py-12 md:py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="heading-md text-white mb-4">Stay Connected</h3>
            <p className="body-md text-white/90 mb-6">
              Get the latest updates on our programs, events, and health resources delivered to your inbox.
            </p>
            
            {!subscribed ? (
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="flex-1 px-4 py-3 rounded-lg text-primary focus:outline-none focus:ring-2 focus:ring-white"
                />
                <button type="submit" className="bg-white text-secondary font-semibold px-6 py-3 rounded-lg hover:bg-neutral transition-colors flex items-center justify-center gap-2">
                  Subscribe
                  <Icon name="arrow_forward" size={20} />
                </button>
              </form>
            ) : (
              <div className="bg-white/20 text-white px-6 py-4 rounded-lg max-w-md mx-auto flex items-center justify-center gap-2">
                <Icon name="check_circle" size={24} />
                <span className="font-semibold">Thank you for subscribing!</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container-custom px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* About Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-secondary to-secondary-dark rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">THA</span>
              </div>
              <div>
                <div className="text-white font-bold text-lg leading-tight">
                  Tanzania Health
                </div>
                <div className="text-white/70 text-sm leading-tight">
                  Alliance
                </div>
              </div>
            </div>
            <p className="text-white/70 text-sm leading-relaxed mb-6">
              Tanzania's premier health NGO dedicated to improving health outcomes through education, advocacy, and community partnerships.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 hover:bg-secondary rounded-lg flex items-center justify-center transition-colors group"
                  aria-label={social.name}
                >
                  <Icon name={social.icon} size={20} className="group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path}
                    className="text-white/70 hover:text-secondary transition-colors flex items-center gap-2 group"
                  >
                    <Icon name="arrow_forward" size={16} className="group-hover:translate-x-1 transition-transform" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Focus Areas */}
          <div>
            <h4 className="font-bold text-lg mb-4 text-white">Our Focus</h4>
            <ul className="space-y-3">
              {focusAreas.map((area) => (
                <li key={area.label} className="flex items-center gap-3 text-white/70">
                  <Icon name={area.icon} size={20} className="text-secondary" />
                  <span className="text-sm">{area.label}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold text-lg mb-4 text-white">Get in Touch</h4>
            <div className="space-y-3 text-white/70 text-sm">
              <div className="flex items-start gap-3">
                <Icon name="location_on" size={20} className="text-secondary mt-0.5 flex-shrink-0" />
                <div>
                  <div>Upanga, Dar es Salaam</div>
                  <div>P.O. Box 65000</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Icon name="phone" size={20} className="text-secondary flex-shrink-0" />
                <a href="tel:+255222123456" className="hover:text-secondary transition-colors">
                  +255 22 212 3456
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Icon name="email" size={20} className="text-secondary flex-shrink-0" />
                <a href="mailto:info@tzhealthalliance.or.tz" className="hover:text-secondary transition-colors">
                  info@tzhealthalliance.or.tz
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container-custom px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/60">
            <div>
              © {new Date().getFullYear()} Tanzania Health Alliance. All rights reserved.
            </div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-secondary transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-secondary transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
