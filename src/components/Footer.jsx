import { Link } from 'react-router-dom';
import { Icon } from './Icon';
import { thaData } from '../data/thaData';

export const Footer = () => {
  return (
    <footer className="bg-primary-dark text-white">
      {/* Main Footer Content */}
      <div className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

            {/* About */}
            <div>
              {/* Logo */}
              <img
                src="/logo/tha-logo.svg"
                alt="Tanzania Health Alliance"
                width="120"
                height="48"
                loading="lazy"
                decoding="async"
                className="h-12 w-auto mb-4 brightness-0 invert"
              />
              <h4 className="text-base font-bold font-heading tracking-tight mb-4 text-white">
                About Tanzania Health Alliance
              </h4>
              <p className="text-sm text-white/75 leading-relaxed mb-3">
                Tanzania Health Alliance (THA) is a registered non-profit organization focused on improving health outcomes in Tanzania by addressing Viral Hepatitis, HIV, and Mental Health.
              </p>
              <p className="text-sm text-white/75 leading-relaxed mb-5">
                We work closely with communities, government institutions, and partners to deliver impactful health programs that respond to real community needs.
              </p>
              <div className="flex gap-3">
                <a
                  href={thaData.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-md bg-white/10 flex items-center justify-center hover:bg-secondary transition"
                  aria-label="Facebook"
                >
                  <Icon name="facebook" size={18} color="white" />
                </a>
                <a
                  href={thaData.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-md bg-white/10 flex items-center justify-center hover:bg-secondary transition"
                  aria-label="Instagram"
                >
                  <Icon name="instagram" size={18} color="white" />
                </a>
                <a
                  href={thaData.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-md bg-white/10 flex items-center justify-center hover:bg-secondary transition"
                  aria-label="LinkedIn"
                >
                  <Icon name="linkedin" size={18} color="white" />
                </a>
              </div>
            </div>

            {/* Important Links */}
            <div>
              <h4 className="text-base font-bold font-heading tracking-tight mb-4 text-white">
                Important Links
              </h4>
              <ul className="space-y-2">
                <li><Link to="/privacy" className="text-sm text-white/75 hover:text-secondary transition">Privacy Policy</Link></li>
                <li><Link to="/cookies" className="text-sm text-white/75 hover:text-secondary transition">Cookies Policy</Link></li>
                <li><Link to="/terms" className="text-sm text-white/75 hover:text-secondary transition">Terms &amp; Conditions</Link></li>
              </ul>

              <h4 className="text-base font-bold font-heading tracking-tight mt-8 mb-4 text-white">
                Useful Links
              </h4>
              <ul className="space-y-2">
                <li><Link to="/" className="text-sm text-white/75 hover:text-secondary transition">Introduction</Link></li>
                <li><Link to="/#partners" className="text-sm text-white/75 hover:text-secondary transition">Our Partners</Link></li>
                <li><Link to="/about" className="text-sm text-white/75 hover:text-secondary transition">About Us</Link></li>
                <li><Link to="/news" className="text-sm text-white/75 hover:text-secondary transition">Our Journeys</Link></li>
              </ul>
            </div>

            {/* Quick Nav */}
            <div>
              <h4 className="text-base font-bold font-heading tracking-tight mb-4 text-white">
                Quick Links
              </h4>
              <ul className="space-y-2">
                <li><Link to="/" className="text-sm text-white/75 hover:text-secondary transition">Home</Link></li>
                <li><Link to="/about" className="text-sm text-white/75 hover:text-secondary transition">About</Link></li>
                <li><Link to="/make-a-difference" className="text-sm text-white/75 hover:text-secondary transition">Make a Difference</Link></li>
                <li><Link to="/academy" className="text-sm text-white/75 hover:text-secondary transition">Academy</Link></li>
                <li><Link to="/news" className="text-sm text-white/75 hover:text-secondary transition">News</Link></li>
                <li><Link to="/contact" className="text-sm text-white/75 hover:text-secondary transition">Contact</Link></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-base font-bold font-heading tracking-tight mb-4 text-white">
                Contact Info
              </h4>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Icon name="location_on" size={18} color="white" className="mt-0.5 flex-shrink-0 opacity-75" />
                  <p className="text-sm text-white/75 leading-relaxed">
                    Adda Estate, House No. 03, Kinondoni,<br />
                    P.O. Box 31902,<br />
                    Dar es Salaam, Tanzania
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Icon name="phone" size={18} color="white" className="flex-shrink-0 opacity-75" />
                  <div>
                    <p className="text-sm text-white/75">+255 659-114-754</p>
                    <p className="text-sm text-white/75">+255 659-114-754</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Icon name="email" size={18} color="white" className="flex-shrink-0 opacity-75" />
                  <a
                    href="mailto:info@tzhealthalliance.or.tz"
                    className="text-sm text-white/75 hover:text-secondary transition"
                  >
                    info@tzhealthalliance.or.tz
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/15 pt-8 pb-16 md:pb-0 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-white/60">
              Copyright &copy; {new Date().getFullYear()} - Tanzania Health Alliance
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
              <Link to="/privacy" className="text-sm text-white/60 hover:text-secondary transition">Privacy Policy</Link>
              <Link to="/cookies" className="text-sm text-white/60 hover:text-secondary transition">Cookies Policy</Link>
              <Link to="/terms" className="text-sm text-white/60 hover:text-secondary transition">Terms &amp; Conditions</Link>
              <Link
                to="/admin"
                className="flex items-center gap-1.5 text-sm text-white/40 hover:text-secondary transition"
              >
                <Icon name="edit_note" size={16} color="currentColor" />
                Staff Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
