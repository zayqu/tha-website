/** Consistent reading width, responsive spacing and card treatment for public detail pages. */
export function DetailBody({ children, className = '', narrow = false }) {
  return <div className={`mx-auto w-full ${narrow ? 'max-w-4xl' : 'max-w-7xl'} px-4 py-12 sm:px-6 md:py-16 lg:px-8 ${className}`}>
    {children}
  </div>;
}
export function DetailCard({ children, className = '' }) {
  return <article className={`min-w-0 overflow-hidden rounded-2xl bg-white shadow-card ${className}`}>{children}</article>;
}
export function DetailSection({ title, children, className = '' }) {
  return <section className={`p-6 md:p-10 ${className}`}>
    {title && <h2 className="heading-md mb-6 text-primary">{title}</h2>}
    {children}
  </section>;
}
