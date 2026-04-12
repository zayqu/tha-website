import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Programs', path: '/projects' },
    { label: 'Academy', path: '/academy' },
    { label: 'News', path: '/news' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 hidden md:block ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-subtle border-b border-cool-gray-dark'
          : 'bg-white/50 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition">
            <img
              src="/logo/tha-logo.svg"
              alt="Tanzania Health Alliance"
              width="120"
              height="48"
              decoding="async"
              className="h-12 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="flex gap-1 items-center justify-center">
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

          {/* CTA Button */}
          <Link
            to="/make-a-difference"
            className="px-4 py-2 bg-secondary text-white font-medium rounded-md hover:bg-secondary-dark transition shadow-subtle"
          >
            Join the Alliance
          </Link>
        </div>
      </div>
    </header>
  );
};
