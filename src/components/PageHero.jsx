import { Link } from 'react-router-dom';

/** Shared heading and vertical rhythm for THA's public section pages. */
export function PageHero({ title, description, eyebrow, backTo, backLabel = 'Back', meta }) {
  return <section className="bg-gradient-to-br from-primary to-primary-dark px-4 py-16 text-white sm:px-6 md:py-24 lg:px-8">
    <div className="container-custom">
      {backTo && <Link to={backTo} className="mb-6 inline-block text-sm font-semibold text-white/85 hover:text-white">← {backLabel}</Link>}
      <div className="mx-auto max-w-4xl text-center">
        {eyebrow && <p className="mb-4 text-sm font-bold uppercase tracking-wider text-white/80">{eyebrow}</p>}
        <h1 className="heading-xl mx-auto max-w-4xl break-words text-white">{title}</h1>
        {description && <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-white/90 md:text-xl">{description}</p>}
        {meta && <p className="mt-5 text-base text-white/90">{meta}</p>}
      </div>
    </div>
  </section>;
}
