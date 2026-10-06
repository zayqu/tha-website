export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  centered = false,
  inverse = false,
  compact = false,
  className = '',
}) {
  return (
    <div className={`${compact ? 'mb-7 md:mb-10' : 'mb-8 md:mb-12'} ${centered ? 'text-center' : ''} ${className}`}>
      {eyebrow ? (
        <p className={`mb-2 text-xs font-bold uppercase tracking-[0.16em] ${inverse ? 'text-white/60' : 'text-accent'}`}>
          {eyebrow}
        </p>
      ) : null}
      <h2 className={`text-2xl md:text-4xl font-bold tracking-tight ${inverse ? 'text-white' : 'text-primary'}`}>
        {title}
      </h2>
      {subtitle ? (
        <p className={`mt-3 max-w-2xl text-sm md:text-base leading-relaxed ${centered ? 'md:mx-auto' : ''} ${inverse ? 'text-white/75' : 'text-gray-600'}`}>
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
