import { Icon } from './Icon';

const COLOR_STYLES = {
  primary: 'border-primary bg-primary text-white',
  secondary: 'border-secondary bg-secondary text-white',
  accent: 'border-accent bg-accent text-white',
};

export function JourneyTimeline({ milestones }) {
  if (!milestones?.length) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-500">
        Journey milestones will appear here once they are published.
      </div>
    );
  }

  return (
    <div className="relative overflow-x-auto pb-6 custom-scrollbar" aria-label="THA journey timeline">
      <div className="absolute left-10 right-10 top-[2.15rem] h-0.5 bg-gradient-to-r from-primary via-secondary to-accent" />
      <ol className="relative flex min-w-max snap-x snap-mandatory gap-5 px-2">
        {milestones.map((item, index) => (
          <li key={item.id || `${item.month}-${index}`} className="w-[17rem] snap-start pt-1 sm:w-[19rem]">
            <div className={`relative z-10 mb-5 flex h-14 w-14 items-center justify-center rounded-full border-4 shadow-card ${COLOR_STYLES[item.color] || COLOR_STYLES.primary}`}>
              <Icon name={item.icon || 'flag'} size={23} color="white" />
            </div>
            <article className="h-full rounded-2xl border border-gray-100 bg-white p-5 shadow-card transition hover:-translate-y-1 hover:shadow-elevated">
              <p className="text-xs font-bold uppercase tracking-wider text-accent">{item.month}</p>
              <h3 className="mt-2 text-lg font-bold text-primary">{item.milestone}</h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">{item.description}</p>
            </article>
          </li>
        ))}
      </ol>
    </div>
  );
}
