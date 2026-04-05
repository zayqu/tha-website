import { Link } from 'react-router-dom';
import { Icon } from './Icon';

export const Footer = () => {
  return (
    <footer className="bg-primary text-white">
      {/* Newsletter Section */}
      <div className="bg-primary-dark py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl md:text-3xl font-heading font-bold tracking-tighter mb-4">
            Stay Updated
          </h3>
          <p className="body-md mb-6 max-w-2xl mx-auto opacity-90">
            Subscribe to our newsletter for the latest on our health initiatives and impact stories.
          </p>
          <form className="flex gap-2 max-w-md mx-auto mb-4">
            <input 
              type="email" 
              placeholder="Your email" 
              required
              className="flex-1 px-4 py-3 rounded-md text-near-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary"
            />
            <button 
              type="submit"
              className="px-6 py-3 bg-secondary text-white font-medium rounded-md hover:bg-secondary-dark transition"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            {/* About */}
            <div>
              <h4 className="text-lg font-bold font-heading tracking-tighter mb-4">
                Tanzania Health Alliance
              </h4>
              <p className="body-sm opacity-80 mb-4">
                Transforming health outcomes across Tanzania through education, advocacy, and community engagement.
              </p>
              <div className="flex gap-4">
                <a href="#" className="hover:text-secondary transition">
                  <Icon name="facebook" size={20} />
                </a>
                <a href="#" className="hover:text-secondary transition">
                  <Icon name="instagram" size={20} />
                </a>
                <a href="#" className="hover:text-secondary transition">
                  <Icon name="linkedin" size={20} />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-bold font-heading tracking-tighter mb-4">
                Quick Links
              </h4>
              <ul className="space-y-2">
                <li><Link to="/" className="opacity-80 hover:text-secondary transition body-sm">Home</Link></li>
                <li><Link to="/about" className="opacity-80 hover:text-secondary transition body-sm">About Us</Link></li>
                <li><Link to="/academy" className="opacity-80 hover:text-secondary transition body-sm">Academy</Link></li>
                <li><Link to="/news" className="opacity-80 hover:text-secondary transition body-sm">News</Link></li>
              </ul>
            </div>

            {/* Get Involved */}
            <div>
              <h4 className="text-lg font-bold font-heading tracking-tighter mb-4">
                Get Involved
              </h4>
              <ul className="space-y-2">
                <li><Link to="/make-a-difference" className="opacity-80 hover:text-secondary transition body-sm">Volunteer</Link></li>
                <li><Link to="/make-a-difference" className="opacity-80 hover:text-secondary transition body-sm">Donate</Link></li>
                <li><Link to="/make-a-difference" className="opacity-80 hover:text-secondary transition body-sm">Partner With Us</Link></li>
                <li><Link to="/contact" className="opacity-80 hover:text-secondary transition body-sm">Contact</Link></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-bold font-heading tracking-tighter mb-4">
                Contact
              </h4>
              <div className="space-y-3">
                <p className="body-sm opacity-80">
                  <strong>Address:</strong><br />
                  Upanga, Dar es Salaam<br />
                  P.O. Box 65000
                </p>
                <p className="body-sm opacity-80">
                  <strong>Phone:</strong><br />
                  +255 (0) XXX XXX XXX
                </p>
                <p className="body-sm opacity-80">
                  <strong>Email:</strong><br />
                  info@tzhealthalliance.org
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="body-sm opacity-80">
              © 2024 Tanzania Health Alliance. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="body-sm opacity-80 hover:text-secondary transition">
                Privacy Policy
              </a>
              <a href="#" className="body-sm opacity-80 hover:text-secondary transition">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
