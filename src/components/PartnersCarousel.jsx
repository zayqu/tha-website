import { useState } from 'react';

export const PartnersCarousel = ({ partners }) => {
  const [isPaused, setIsPaused] = useState(false);
  // Double the array for seamless infinite scroll (0% to -50%)
  const duplicated = [...partners, ...partners];

  return (
    <div
      className="overflow-hidden w-full"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        className="flex gap-6 flex-nowrap items-center animate-partnersScroll"
        style={{ animationPlayState: isPaused ? 'paused' : 'running' }}
      >
        {duplicated.map((partner, idx) => (
          <a
            key={`${partner.id}-${idx}`}
            href={partner.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 flex items-center justify-center h-24 w-48 bg-white rounded-lg shadow-subtle hover:shadow-card transition-shadow group cursor-pointer"
          >
            {partner.logo ? (
              <img
                src={partner.logo}
                alt={partner.name}
                width="160"
                height="64"
                loading="lazy"
                decoding="async"
                className="max-h-16 max-w-[160px] object-contain px-3"
              />
            ) : (
              <span className="font-bold text-center px-3 text-sm group-hover:text-secondary transition-colors">
                {partner.name}
              </span>
            )}
          </a>
        ))}
      </div>

      <style>{`
        @keyframes partnersScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-partnersScroll {
          animation: partnersScroll 30s linear infinite;
        }
      `}</style>
    </div>
  );
};
