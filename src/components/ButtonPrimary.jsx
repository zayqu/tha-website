import { Link } from 'react-router-dom'

export default function ButtonPrimary({ children, to, onClick, className = '', type = 'button' }) {
  const baseClasses = "inline-flex items-center justify-center bg-accent text-white px-8 py-3.5 rounded-lg font-semibold hover:bg-accent/90 transition-all duration-200 shadow-lg shadow-accent/20 hover:shadow-xl hover:shadow-accent/30 active:scale-95"
  
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