import { Link } from 'react-router-dom'
import { Heart, Facebook, Twitter, Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-neutral text-white">
      <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* About Column */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Heart className="w-6 h-6 text-accent" />
              <span className="text-xl font-bold">THA</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Tanzania Health Alliance is dedicated to improving health outcomes through education, 
              advocacy, and community engagement across Tanzania.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-gray-400 hover:text-accent transition-colors" aria-label="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-accent transition-colors" aria-label="Twitter">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-accent transition-colors" aria-label="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-accent transition-colors" aria-label="LinkedIn">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-accent transition-colors text-sm">About Us</Link>
              </li>
              <li>
                <Link to="/academy" className="text-gray-400 hover:text-accent transition-colors text-sm">Academy</Link>
              </li>
              <li>
                <Link to="/news" className="text-gray-400 hover:text-accent transition-colors text-sm">News & Updates</Link>
              </li>
              <li>
                <Link to="/make-a-difference" className="text-gray-400 hover:text-accent transition-colors text-sm">Volunteer</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-accent transition-colors text-sm">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3 text-gray-400 text-sm">
                <MapPin className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <span>Upanga, Dar es Salaam<br />P.O. Box 65000, Tanzania</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-400 text-sm">
                <Phone className="w-5 h-5 text-accent flex-shrink-0" />
                <span>+255 123 456 789</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-400 text-sm">
                <Mail className="w-5 h-5 text-accent flex-shrink-0" />
                <span>info@tanzaniahealth.org</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Newsletter</h3>
            <p className="text-gray-400 text-sm mb-4">
              Subscribe to receive updates on our programs and impact stories.
            </p>
            <form className="space-y-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Your email address"
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-accent text-sm"
                required
              />
              <button
                type="submit"
                className="w-full bg-accent text-white px-4 py-3 rounded-lg font-medium hover:bg-accent/90 transition-colors text-sm"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Tanzania Health Alliance. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}