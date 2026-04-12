import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from './Icon';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Impact', path: '/impact' },
    { label: 'Programs', path: '/projects' },
    { label: 'Academy', path: '/academy' },
    { label: 'News', path: '/news' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-subtle border-b border-cool-gray-dark'
          : 'bg-white/50 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 hover:opacity-80 transition"
          >
            <img
              src="/logo/tha-logo.svg"
              alt="Tanzania Health Alliance"
              width="120"
              height="48"
              decoding="async"
              className="h-12 w-auto"
            />
          </Link>

          {/* Desktop Navigation - Centered */}
          <nav className="hidden md:flex gap-1 items-center justify-center" id="desktop-menu">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="px-3 py-2 text-sm font-medium text-near-black hover:text-primary transition rounded-md whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA Button - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-4">
            <button className="px-4 py-2 bg-secondary text-white font-medium rounded-md hover:bg-secondary-dark transition shadow-subtle">
              Join the Alliance
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-near-black hover:text-primary transition"
          >
            <Icon name={isMenuOpen ? 'close' : 'menu'} size={24} />
          </button>
        </div>

        {/* Mobile Navigation - At bottom of header, horizontal scroll */}
        <nav className="md:hidden overflow-x-auto pb-2 -mx-4 px-4 border-t border-cool-gray-dark mt-2 pt-3">
          <div className="flex gap-1 min-w-max">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="px-3 py-2 text-xs font-medium text-near-black hover:text-primary transition rounded-md whitespace-nowrap bg-cool-gray"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>

        {/* Full Mobile Menu - dropdown */}
        {isMenuOpen && (
          <div className="md:hidden absolute left-0 right-0 bg-white shadow-elevated border-t border-cool-gray-dark mt-2 py-4 px-4">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="block px-4 py-3 text-near-black hover:bg-cool-gray hover:text-primary transition font-medium rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <button className="w-full mt-2 px-4 py-3 bg-secondary text-white font-medium rounded-lg hover:bg-secondary-dark transition">
                Join the Alliance
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
