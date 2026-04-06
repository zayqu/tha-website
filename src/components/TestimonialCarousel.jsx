import { useState, useEffect, useCallback } from 'react';
import { Icon } from './Icon';

export const TestimonialsCarousel = ({ testimonials }) => {
  const [current, setCurrent] = useState(0);
  const [fade, setFade] = useState(true);
  const [autoplay, setAutoplay] = useState(true);

  // Number of testimonials visible at once (responsive)
  const [visibleCount, setVisibleCount] = useState(3);

  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 768) setVisibleCount(1);
      else if (window.innerWidth < 1024) setVisibleCount(2);
      else setVisibleCount(3);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const total = testimonials.length;
  const totalPages = Math.max(1, total - visibleCount + 1);

  const transition = useCallback((dir) => {
    setFade(false);
    setTimeout(() => {
      setCurrent((prev) => {
        const next = prev + dir;
        if (next < 0) return totalPages - 1;
        if (next >= totalPages) return 0;
        return next;
      });
      setFade(true);
    }, 300);
  }, [totalPages]);

  // Autoplay
  useEffect(() => {
    if (!autoplay) return;
    const id = setInterval(() => transition(1), 5000);
    return () => clearInterval(id);
  }, [autoplay, transition]);

  if (!total) return null;

  return (
    <div
      className="relative"
      onMouseEnter={() => setAutoplay(false)}
      onMouseLeave={() => setAutoplay(true)}
    >
      {/* Controls */}
      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={() => transition(-1)}
          className="w-10 h-10 rounded-full bg-white shadow-card flex items-center justify-center hover:shadow-elevated hover:bg-secondary hover:text-white transition-all text-primary"
          aria-label="Previous testimonials"
        >
          <Icon name="chevron_left" size={24} />
        </button>
        <button
          onClick={() => transition(1)}
          className="w-10 h-10 rounded-full bg-white shadow-card flex items-center justify-center hover:shadow-elevated hover:bg-secondary hover:text-white transition-all text-primary"
          aria-label="Next testimonials"
        >
          <Icon name="chevron_right" size={24} />
        </button>
      </div>

      {/* Cards */}
      <div
        className={`grid gap-6 transition-opacity duration-300 ${
          visibleCount === 1
            ? 'grid-cols-1'
            : visibleCount === 2
              ? 'grid-cols-1 md:grid-cols-2'
              : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
        }`}
        style={{ opacity: fade ? 1 : 0 }}
      >
        {testimonials.slice(current, current + visibleCount).length > 0
          ? testimonials
              .slice(current, current + visibleCount)
              .map((t) => (
                <div
                  key={t.id}
                  className="bg-white rounded-lg shadow-card p-6 hover:shadow-elevated transition-shadow flex flex-col"
                >
                  <p className="text-gray-600 italic mb-5 flex-grow">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="border-t border-cool-gray-dark pt-4">
                    <p className="font-bold text-primary text-sm">{t.author}</p>
                    <p className="text-secondary text-xs mt-0.5">{t.title}</p>
                    <p className="text-gray-500 text-xs">{t.organization}</p>
                  </div>
                </div>
              ))
          : testimonials.slice(0, visibleCount).map((t) => (
              <div
                key={`wrap-${t.id}`}
                className="bg-white rounded-lg shadow-card p-6 hover:shadow-elevated transition-shadow flex flex-col"
              >
                <p className="text-gray-600 italic mb-5 flex-grow">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="border-t border-cool-gray-dark pt-4">
                  <p className="font-bold text-primary text-sm">{t.author}</p>
                  <p className="text-secondary text-xs mt-0.5">{t.title}</p>
                  <p className="text-gray-500 text-xs">{t.organization}</p>
                </div>
              </div>
            ))}
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-8">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setFade(false);
              setTimeout(() => {
                setCurrent(i);
                setFade(true);
              }, 300);
            }}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              i === current ? 'bg-secondary w-6' : 'bg-gray-300'
            }`}
            aria-label={`Go to testimonial group ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
