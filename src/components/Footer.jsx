import { Link } from 'react-router-dom';
import { Icon } from './Icon';
import { thaData } from '../data/thaData';
import { useSiteContent } from '../hooks/useSiteContent';

export const Footer = () => {
  const site = useSiteContent();
  const org = site.organization || {};
  const contact = site.contact || {};
  return (
    <footer className="bg-primary-dark text-white">
      {/* Mobile footer */}
      <div className="px-4 py-8 md:hidden">
        <div className="flex items-center justify-between gap-4">
          <img
            src="/logo/tha-logo.svg"
            alt="Tanzania Health Alliance"
            width="110"
            height="44"
            loading="lazy"
            decoding="async"
            className="h-10 w-auto brightness-0 invert"
          />
          <div className="flex gap-2">
            <a href={contact.facebook || thaData.social.facebook} target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10" aria-label="Facebook"><Icon name="facebook" size={17} color="white" /></a>
            <a href={contact.instagram || thaData.social.instagram} target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10" aria-label="Instagram"><Icon name="instagram" size={17} color="white" /></a>
            <a href={contact.linkedin || thaData.social.linkedin} target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10" aria-label="LinkedIn"><Icon name="linkedin" size={17} color="white" /></a>
          </div>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-white/70">
          {org.name || "Tanzania Health Alliance"} · Registered NGO {org.registrationNumber ? `No. ${org.registrationNumber}` : ''}
        </p>

        <div className="mt-5 grid grid-cols-2 gap-x-5 gap-y-3 text-sm">
          <Link to="/about" className="text-white/80">About</Link>
          <Link to="/projects" className="text-white/80">Campaigns</Link>
          <Link to="/academy" className="text-white/80">Academy</Link>
          <Link to="/news" className="text-white/80">News</Link>
          <Link to="/documents" className="text-white/80">Documents</Link>
          <Link to="/contact" className="text-white/80">Contact</Link>
        </div>

        <div className="mt-6 space-y-2 border-t border-white/10 pt-5 text-sm text-white/70">
          <a href={`tel:${(contact.phone || '+255659114754').replace(/\s+/g,'')}`} className="flex items-center gap-2"><Icon name="phone" size={16} color="white" /> {contact.phone || '+255 659 114 754'}</a>
          <a href={`mailto:${contact.email || 'info@tzhealthalliance.or.tz'}`} className="flex items-center gap-2 break-all"><Icon name="email" size={16} color="white" /> {contact.email || 'info@tzhealthalliance.or.tz'}</a>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-white/10 pt-5 text-xs text-white/50">
          <span>© {new Date().getFullYear()} {org.shortName || 'THA'}</span>
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
          <a href="/admin" target="_blank" rel="noopener noreferrer">Staff</a>
        </div>
      </div>

      {/* Desktop footer */}
      <div className="hidden py-12 md:block md:py-16">
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
                {`${org.name || "Tanzania Health Alliance"} (${org.shortName || "THA"}) is a registered NGO (No. ${org.registrationNumber || "00NGO/R/8379"}) based in ${contact.city || "Dar es Salaam"}, working on Viral Hepatitis, HIV, and Mental Health.`}
              </p>
              <p className="text-sm text-white/75 leading-relaxed mb-5">
                We work with communities, health institutions, government stakeholders and partners to turn public-health advocacy into practical community action.
              </p>
              <div className="flex gap-3">
                <a
                  href={contact.facebook || thaData.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-md bg-white/10 flex items-center justify-center hover:bg-secondary transition"
                  aria-label="Facebook"
                >
                  <Icon name="facebook" size={18} color="white" />
                </a>
                <a
                  href={contact.instagram || thaData.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-md bg-white/10 flex items-center justify-center hover:bg-secondary transition"
                  aria-label="Instagram"
                >
                  <Icon name="instagram" size={18} color="white" />
                </a>
                <a
                  href={contact.linkedin || thaData.social.linkedin}
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
                Health Topics
              </h4>
              <ul className="space-y-2">
                <li><Link to="/health/hepatitis" className="text-sm text-white/75 hover:text-secondary transition">Viral Hepatitis</Link></li>
                <li><Link to="/health/hiv" className="text-sm text-white/75 hover:text-secondary transition">HIV</Link></li>
                <li><Link to="/health/mental-health" className="text-sm text-white/75 hover:text-secondary transition">Mental Health</Link></li>
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
                <li><Link to="/documents" className="text-sm text-white/75 hover:text-secondary transition">Documents</Link></li>
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
                    {contact.address || 'Adda Estate, House No. 03, Kinondoni'},<br />
                    {contact.poBox || 'P.O. Box 31902'},<br />
                    {contact.city || 'Dar es Salaam'}, {contact.country || 'Tanzania'}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Icon name="phone" size={18} color="white" className="flex-shrink-0 opacity-75" />
                  <div>
                    <p className="text-sm text-white/75">{contact.phone || '+255 659 114 754'}</p>
                    {contact.secondaryPhone ? <p className="text-sm text-white/75">{contact.secondaryPhone}</p> : null}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Icon name="email" size={18} color="white" className="flex-shrink-0 opacity-75" />
                  <a
                    href={`mailto:${contact.email || "info@tzhealthalliance.or.tz"}`}
                    className="text-sm text-white/75 hover:text-secondary transition"
                  >
                    {contact.email || "info@tzhealthalliance.or.tz"}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/15 pt-8 pb-16 md:pb-0 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-white/60">
              Copyright &copy; {new Date().getFullYear()} - {org.name || "Tanzania Health Alliance"}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
              <Link to="/privacy" className="text-sm text-white/60 hover:text-secondary transition">Privacy Policy</Link>
              <Link to="/cookies" className="text-sm text-white/60 hover:text-secondary transition">Cookies Policy</Link>
              <Link to="/terms" className="text-sm text-white/60 hover:text-secondary transition">Terms &amp; Conditions</Link>
              <a
                href="/admin"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-white/40 hover:text-secondary transition"
              >
                <Icon name="edit_note" size={16} color="currentColor" />
                Staff Login
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
