import { Link } from 'react-router-dom'

export default function ButtonSecondary({ children, to, onClick, className = '', type = 'button' }) {
  const baseClasses = "inline-flex items-center justify-center border-2 border-accent text-accent px-8 py-3.5 rounded-lg font-semibold hover:bg-accent hover:text-white transition-all duration-200 active:scale-95"
  
  if (to) {
    return (
      <Link to={to} className={`${baseClasses} ${className}`}>
        {children}
      </Link>
    )
  }
  
  return (
    <button type={type} onClick={onClick} className={`${baseClasses} ${className}`}>
      {children}
    </button>
  )
}