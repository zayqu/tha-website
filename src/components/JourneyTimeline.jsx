import { useCallback, useEffect, useRef, useState } from 'react';
import { Icon } from './Icon';

const COLOR_STYLES = {
  primary: 'border-primary bg-primary text-white',
  secondary: 'border-secondary bg-secondary text-white',
  accent: 'border-accent bg-accent text-white',
};

const CARD_ACCENTS = {
  primary: 'from-primary to-primary/70',
  secondary: 'from-secondary to-secondary/70',
  accent: 'from-accent to-accent/70',
};

export function JourneyTimeline({ milestones }) {
  const viewportRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [progress, setProgress] = useState(0);

  const updateNavigation = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const items = Array.from(viewport.querySelectorAll('[data-journey-item]'));
    const maxScrollLeft = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
    const scrollLeft = viewport.scrollLeft;
    const nearestIndex = items.reduce((nearest, item, index) => (
      Math.abs(item.offsetLeft - scrollLeft) < Math.abs(items[nearest]?.offsetLeft - scrollLeft)
        ? index
        : nearest
    ), 0);

    setActiveIndex(nearestIndex);
    setCanGoBack(scrollLeft > 4);
    setCanGoForward(scrollLeft < maxScrollLeft - 4);
    setProgress(maxScrollLeft > 0 ? (scrollLeft / maxScrollLeft) * 100 : 100);
  }, []);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return undefined;

    const handleScroll = () => window.requestAnimationFrame(updateNavigation);
    const resizeObserver = new ResizeObserver(updateNavigation);

    viewport.addEventListener('scroll', handleScroll, { passive: true });
    resizeObserver.observe(viewport);
    updateNavigation();

    return () => {
      viewport.removeEventListener('scroll', handleScroll);
      resizeObserver.disconnect();
    };
  }, [milestones?.length, updateNavigation]);

  const moveJourney = (direction) => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const items = Array.from(viewport.querySelectorAll('[data-journey-item]'));
    const targetIndex = Math.min(
      Math.max(activeIndex + direction, 0),
      items.length - 1,
    );
    const target = items[targetIndex];

    if (target) {
      viewport.scrollTo({
        left: target.offsetLeft,
        behavior: 'smooth',
      });
    }
  };

  if (!milestones?.length) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-500">
        Journey milestones will appear here once they are published.
      </div>
    );
  }

  return (
    <section className="min-w-0 max-w-full" aria-label="THA journey timeline">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-center justify-between gap-3 text-xs font-bold uppercase tracking-[0.16em] text-primary">
            <span>Explore our journey</span>
            <span className="shrink-0" aria-live="polite">
              {activeIndex + 1} / {milestones.length}
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-primary/10" aria-hidden="true">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary via-secondary to-accent transition-[width] duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => moveJourney(-1)}
            disabled={!canGoBack}
            className="group inline-flex h-11 w-11 items-center justify-center rounded-full border border-primary/20 bg-white text-primary shadow-card transition hover:-translate-y-0.5 hover:border-primary hover:bg-primary hover:text-white hover:shadow-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:translate-y-0 disabled:hover:border-primary/20 disabled:hover:bg-white disabled:hover:text-primary disabled:hover:shadow-card"
            aria-label="View previous journey milestone"
          >
            <Icon name="chevron_left" size={26} color="currentColor" />
          </button>
          <button
            type="button"
            onClick={() => moveJourney(1)}
            disabled={!canGoForward}
            className="group inline-flex h-11 w-11 items-center justify-center rounded-full border border-primary/20 bg-white text-primary shadow-card transition hover:-translate-y-0.5 hover:border-primary hover:bg-primary hover:text-white hover:shadow-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:translate-y-0 disabled:hover:border-primary/20 disabled:hover:bg-white disabled:hover:text-primary disabled:hover:shadow-card"
            aria-label="View next journey milestone"
          >
            <Icon name="chevron_right" size={26} color="currentColor" />
          </button>
        </div>
      </div>

      <div
        ref={viewportRef}
        className="max-w-full overflow-x-auto scroll-smooth pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        tabIndex="0"
        role="region"
        aria-label="Journey milestones carousel"
      >
        <ol className="relative flex min-w-full snap-x snap-mandatory gap-5 px-1">
          {milestones.map((item, index) => (
            <li
              key={item.id || `${item.month}-${index}`}
              data-journey-item
              className="relative min-w-0 shrink-0 basis-[88%] snap-start pt-1 sm:basis-[calc(50%-0.625rem)] xl:basis-[calc(33.333%-0.875rem)]"
            >
              {index < milestones.length - 1 ? (
                <div
                  className="pointer-events-none absolute left-7 top-8 h-1 w-[calc(100%+1.25rem)] -translate-y-1/2 bg-gradient-to-r from-primary via-secondary to-accent"
                  aria-hidden="true"
                />
              ) : null}

              <div className={`relative z-10 mb-5 flex h-14 w-14 items-center justify-center rounded-full border-4 shadow-card ${COLOR_STYLES[item.color] || COLOR_STYLES.primary}`}>
                <Icon name={item.icon || 'flag'} size={23} color="white" />
              </div>

              <article className="group relative min-h-[15rem] min-w-0 overflow-hidden rounded-3xl border border-primary/10 bg-white p-6 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-elevated">
                <div
                  className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${CARD_ACCENTS[item.color] || CARD_ACCENTS.primary}`}
                  aria-hidden="true"
                />
                <div className="mb-5 flex items-center justify-between gap-3">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent">
                    {item.month}
                  </p>
                  <span className="rounded-full bg-primary/5 px-3 py-1 text-[0.68rem] font-bold uppercase tracking-wider text-primary">
                    Milestone {index + 1}
                  </span>
                </div>
                <h3 className="break-words text-xl font-bold leading-tight text-primary">
                  {item.milestone}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-gray-600">
                  {item.description}
                </p>
                <div className="absolute bottom-0 right-0 h-20 w-20 translate-x-8 translate-y-8 rounded-full bg-secondary/10 transition-transform duration-300 group-hover:scale-125" aria-hidden="true" />
              </article>
            </li>
          ))}
        </ol>
      </div>

      <p className="mt-2 text-center text-xs text-gray-500 sm:hidden">
        Use the arrows or swipe to explore more milestones.
      </p>
    </section>
  );
}
