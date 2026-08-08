import { useRef } from 'react';
import { Icon } from './Icon';

const COLOR_STYLES = {
  primary: 'border-primary bg-primary text-white',
  secondary: 'border-secondary bg-secondary text-white',
  accent: 'border-accent bg-accent text-white',
};

export function JourneyTimeline({ milestones }) {
  const scrollerRef = useRef(null);

  if (!milestones?.length) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-500">
        Journey milestones will appear here once they are published.
      </div>
    );
  }

  const scrollTimeline = (direction) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    scroller.scrollBy({
      left: direction * Math.min(scroller.clientWidth * 0.85, 640),
      behavior: 'smooth',
    });
  };

  return (
    <div className="min-w-0 max-w-full">
      <div className="mb-4 flex items-center justify-between gap-4">
        <p className="text-sm text-gray-500">Swipe or use the arrows to explore the full journey.</p>
        <div className="flex shrink-0 gap-2" aria-label="Journey navigation">
          <button
            type="button"
            onClick={() => scrollTimeline(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/20 bg-white text-primary shadow-sm transition hover:border-primary hover:bg-primary hover:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-label="Previous milestones"
          >
            <Icon name="chevron_left" size={22} />
          </button>
          <button
            type="button"
            onClick={() => scrollTimeline(1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/20 bg-white text-primary shadow-sm transition hover:border-primary hover:bg-primary hover:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-label="Next milestones"
          >
            <Icon name="chevron_right" size={22} />
          </button>
        </div>
      </div>

      <div
        ref={scrollerRef}
        className="relative w-full max-w-full overflow-x-auto overscroll-x-contain scroll-smooth pb-6 custom-scrollbar"
        aria-label="THA journey timeline"
        tabIndex={0}
      >
        <ol className="relative flex w-max min-w-full snap-x snap-mandatory gap-5 px-2">
          {milestones.map((item, index) => (
            <li key={item.id || `${item.month}-${index}`} className="relative w-[17rem] shrink-0 snap-start pt-1 sm:w-[19rem]">
              {index < milestones.length - 1 && (
                <div
                  className="pointer-events-none absolute left-7 top-8 h-1 w-[calc(100%+1.25rem)] -translate-y-1/2 bg-gradient-to-r from-primary via-secondary to-accent"
                  aria-hidden="true"
                />
              )}
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
    </div>
  );
}
