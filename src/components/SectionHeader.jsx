export default function SectionHeader({ title, subtitle, centered = false }) {
  return (
    <div className={`mb-12 ${centered ? 'text-center' : ''}`}>
      <h2 className="text-3xl md:text-4xl font-bold text-neutral mb-3">{title}</h2>
      <div className={`h-1 w-10 bg-accent rounded-full ${centered ? 'mx-auto' : ''}`}></div>
      {subtitle && (
        <p className="mt-4 text-neutral/70 max-w-2xl leading-relaxed text-base">
          {subtitle}
        </p>
      )}
    </div>
  )
}