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
    { label: 'Make a Difference', path: '/make-a-difference' },
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
              className="h-12 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-1 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="px-3 py-2 text-sm font-medium text-near-black hover:text-primary transition rounded-md"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA Button + Mobile Menu */}
          <div className="flex items-center gap-4">
            <button className="hidden md:inline-flex px-4 py-2 bg-secondary text-white font-medium rounded-md hover:bg-secondary-dark transition shadow-subtle">
              Join the Alliance
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-near-black hover:text-primary transition"
            >
              <Icon name={isMenuOpen ? 'close' : 'menu'} size={24} />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="md:hidden pb-4 space-y-2 border-t border-cool-gray-dark">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="block px-4 py-3 text-near-black hover:bg-cool-gray-dark hover:text-primary transition font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <button className="w-full mt-4 px-4 py-2 bg-secondary text-white font-medium rounded-md hover:bg-secondary-dark transition">
              Join the Alliance
            </button>
          </nav>
        )}
      </div>
    </header>
  );
};
