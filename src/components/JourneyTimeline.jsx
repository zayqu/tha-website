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
    <div className="min-w-0 max-w-full" aria-label="THA journey timeline">
      <ol className="relative grid min-w-0 grid-cols-1 gap-8 xl:grid-cols-6 xl:gap-4">
          {milestones.map((item, index) => (
            <li
              key={item.id || `${item.month}-${index}`}
              className="relative grid min-w-0 grid-cols-[3.5rem_minmax(0,1fr)] gap-4 xl:block xl:pt-1"
            >
              {index < milestones.length - 1 && (
                <div
                  className="pointer-events-none absolute bottom-[-3.75rem] left-7 top-7 w-1 -translate-x-1/2 bg-gradient-to-b from-primary via-secondary to-accent xl:bottom-auto xl:left-7 xl:top-8 xl:h-1 xl:w-[calc(100%+1rem)] xl:translate-x-0 xl:-translate-y-1/2 xl:bg-gradient-to-r"
                  aria-hidden="true"
                />
              )}
              <div className={`relative z-10 flex h-14 w-14 items-center justify-center rounded-full border-4 shadow-card xl:mb-5 ${COLOR_STYLES[item.color] || COLOR_STYLES.primary}`}>
                <Icon name={item.icon || 'flag'} size={23} color="white" />
              </div>
              <article className="min-w-0 rounded-2xl border border-gray-100 bg-white p-5 shadow-card transition hover:-translate-y-1 hover:shadow-elevated xl:p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-accent">{item.month}</p>
                <h3 className="mt-2 break-words text-lg font-bold text-primary xl:text-base">{item.milestone}</h3>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">{item.description}</p>
              </article>
            </li>
          ))}
      </ol>
    </div>
  );
}
