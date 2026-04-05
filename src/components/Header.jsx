<<<<<<< HEAD
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Icon } from './Icon';

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navItems = [
    { path: '/', label: 'Home', icon: 'home' },
    { path: '/about', label: 'About', icon: 'info' },
    { path: '/projects', label: 'Projects', icon: 'groups' },
    { path: '/make-a-difference', label: 'Get Involved', icon: 'volunteer_activism' },
    { path: '/academy', label: 'Academy', icon: 'school' },
    { path: '/news', label: 'News', icon: 'newspaper' },
    { path: '/contact', label: 'Contact', icon: 'mail' },
  ];

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'glass-header shadow-lg' : 'bg-white'
      }`}>
        <div className="container-custom">
          <div className="flex items-center justify-between h-16 md:h-20 px-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-secondary to-secondary-dark rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                <span className="text-white font-bold text-lg md:text-xl">THA</span>
              </div>
              <div className="hidden sm:block">
                <div className="text-primary font-bold text-base md:text-lg leading-tight tracking-tight">
                  Tanzania Health
                </div>
                <div className="text-primary/60 text-xs md:text-sm leading-tight">
                  Alliance
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    location.pathname === item.path
                      ? 'bg-secondary/10 text-secondary'
                      : 'text-primary/70 hover:text-primary hover:bg-neutral'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* CTA Button */}
            <div className="hidden lg:block">
              <button 
                onClick={() => setShowJoinModal(true)}
                className="btn-primary text-sm md:text-base"
              >
                Join the Alliance
                <Icon name="arrow_forward" size={20} />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-neutral transition-colors"
              aria-label="Toggle menu"
            >
              <Icon name={isMobileMenuOpen ? 'close' : 'menu'} size={28} className="text-primary" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      <div className={`fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white z-50 lg:hidden transition-transform duration-300 ease-out shadow-2xl ${
        isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        {/* Mobile Menu Header */}
        <div className="h-16 md:h-20 flex items-center justify-between px-6 border-b border-gray-100">
          <div className="text-primary font-bold text-lg">Menu</div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 rounded-lg hover:bg-neutral transition-colors"
          >
            <Icon name="close" size={24} className="text-primary" />
          </button>
        </div>

        {/* Mobile Menu Content */}
        <nav className="py-8 px-6 space-y-2">
          {navItems.map((item, index) => (
            <Link
              key={item.path}
              to={item.path}
              style={{ animationDelay: `${index * 50}ms` }}
              className={`flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-200 animate-slide-in ${
                location.pathname === item.path
                  ? 'bg-secondary/10 text-secondary shadow-sm'
                  : 'text-primary/70 hover:text-primary hover:bg-neutral'
              }`}
            >
              <Icon name={item.icon} size={24} />
              <span className="font-medium text-lg">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Mobile CTA */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-100 bg-gradient-to-t from-neutral to-white">
          <button 
            onClick={() => {
              setShowJoinModal(true);
              setIsMobileMenuOpen(false);
            }}
            className="btn-primary w-full justify-center text-lg"
          >
            Join the Alliance
            <Icon name="arrow_forward" size={20} />
=======
import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Heart } from 'lucide-react'

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Make a Difference', path: '/make-a-difference' },
  { name: 'Academy', path: '/academy' },
  { name: 'News', path: '/news' },
  { name: 'Contact', path: '/contact' },
]

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsOpen(false)
  }, [location])

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-white/95 backdrop-blur-sm'
      }`}
    >
      <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-primary p-2 rounded-lg">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-primary leading-none">THA</span>
              <span className="text-xs text-neutral/70 tracking-wider">TANZANIA HEALTH ALLIANCE</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-accent ${
                  location.pathname === link.path ? 'text-accent' : 'text-neutral/80'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/make-a-difference"
              className="bg-accent text-white px-6 py-2.5 rounded-lg font-medium hover:bg-accent/90 transition-colors shadow-lg shadow-accent/20"
            >
              Join Us
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-neutral hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
>>>>>>> 5ac31723d5b9b56bde9fed84c9a0ddf1a28941a9
          </button>
        </div>
      </div>

<<<<<<< HEAD
      {/* Join Modal */}
      {showJoinModal && (
        <div className="modal-backdrop" onClick={() => setShowJoinModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="heading-md">Join the Alliance</h2>
                <button
                  onClick={() => setShowJoinModal(false)}
                  className="p-2 rounded-lg hover:bg-neutral transition-colors"
                >
                  <Icon name="close" size={24} />
                </button>
              </div>
              
              <p className="body-md mb-6">
                Become a member of Tanzania Health Alliance and help us make a lasting impact on health outcomes across Tanzania.
              </p>

              <form className="space-y-6">
                <div className="input-group">
                  <input type="text" required />
                  <label>Full Name</label>
                </div>

                <div className="input-group">
                  <input type="email" required />
                  <label>Email Address</label>
                </div>

                <div className="input-group">
                  <input type="tel" required />
                  <label>Phone Number</label>
                </div>

                <div className="input-group">
                  <select className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-secondary focus:outline-none transition-colors" required>
                    <option value="">Select membership type</option>
                    <option value="individual">Individual Member</option>
                    <option value="organization">Organization Partner</option>
                    <option value="volunteer">Volunteer</option>
                    <option value="professional">Healthcare Professional</option>
                  </select>
                </div>

                <div className="input-group">
                  <textarea rows="4" required></textarea>
                  <label>Why do you want to join?</label>
                </div>

                <button type="submit" className="btn-primary w-full justify-center">
                  Submit Application
                  <Icon name="arrow_forward" size={20} />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
=======
      {/* Mobile Navigation */}
      <div 
        className={`md:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-lg transition-all duration-300 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <nav className="container-custom mx-auto px-4 py-4 flex flex-col space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                location.pathname === link.path 
                  ? 'bg-accent/10 text-accent' 
                  : 'text-neutral/80 hover:bg-gray-50'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <Link
            to="/make-a-difference"
            className="mt-4 bg-accent text-white px-4 py-3 rounded-lg font-medium text-center hover:bg-accent/90 transition-colors"
          >
            Join the Alliance
          </Link>
        </nav>
      </div>
    </header>
  )
}
>>>>>>> 5ac31723d5b9b56bde9fed84c9a0ddf1a28941a9
