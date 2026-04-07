import { Link } from 'react-router-dom';
import { Icon } from './Icon';

export const MobileBottomNav = () => (
  <nav className="fixed inset-x-0 bottom-0 z-40 flex justify-around items-center bg-white border-t border-cool-gray-dark py-2 md:hidden">
    <Link to="/" className="flex flex-col items-center text-near-black hover:text-primary">
      <Icon name="home" size={24} />
      <span className="text-xs">Home</span>
    </Link>
    <Link to="/about" className="flex flex-col items-center text-near-black hover:text-primary">
      <Icon name="info" size={24} />
      <span className="text-xs">About</span>
    </Link>
    <Link to="/news" className="flex flex-col items-center text-near-black hover:text-primary">
      <Icon name="article" size={24} />
      <span className="text-xs">News</span>
    </Link>
    <Link to="/contact" className="flex flex-col items-center text-near-black hover:text-primary">
      <Icon name="mail" size={24} />
      <span className="text-xs">Contact</span>
    </Link>
  </nav>
);