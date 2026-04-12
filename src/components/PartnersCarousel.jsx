import { useState, useRef, useEffect } from 'react';
import { getPartnerImageProps } from '../lib/imageUtils';

export const PartnersCarousel = ({ partners }) => {
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Duplicate for infinite scroll on desktop
  const duplicated = [...partners, ...partners];

  // Touch/drag handlers for mobile swipe
  const handleStart = (clientX) => {
    setIsDragging(true);
    setStartX(clientX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMove = (clientX) => {
    if (!isDragging) return;
    const x = clientX - scrollRef.current.offsetLeft;
    scrollRef.current.scrollLeft = scrollLeft - (x - startX);
  };

  const handleEnd = () => setIsDragging(false);

  return (
    <div className="w-full">
      {/* Mobile: swipeable horizontal scroll */}
      <div
        ref={scrollRef}
        className="md:hidden flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth px-4 pb-4 -mx-4 no-scrollbar"
        onTouchStart={(e) => handleStart(e.touches[0].clientX)}
        onTouchMove={(e) => handleMove(e.touches[0].clientX)}
        onTouchEnd={handleEnd}
        onMouseDown={(e) => { handleStart(e.clientX); e.preventDefault(); }}
        onMouseMove={(e) => handleMove(e.clientX)}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
      >
        {partners.map((partner) => (
          <a
            key={partner.id}
            href={partner.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 snap-center flex items-center justify-center h-20 w-40 bg-white rounded-xl shadow-card cursor-pointer"
          >
            {partner.logo ? (
              <img
                src={partner.logo}
                alt={partner.name}
                width="128"
                height="52"
                {...getPartnerImageProps(partner.logo)}
                className="max-h-12 max-w-[128px] object-contain px-2"
              />
            ) : (
              <span className="font-bold text-center px-3 text-xs text-gray-700">
                {partner.name}
              </span>
            )}
          </a>
        ))}
      </div>

      {/* Desktop: auto-scrolling infinite carousel */}
      <div
        className="hidden md:block overflow-hidden w-full"
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
              className="flex-shrink-0 flex items-center justify-center h-24 w-48 bg-white rounded-lg shadow-card hover:shadow-elevated transition-shadow group cursor-pointer"
            >
              {partner.logo ? (
                <img
                  src={partner.logo}
                  alt={partner.name}
                  width="160"
                  height="64"
                  {...getPartnerImageProps(partner.logo)}
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
      </div>

      <style>{`
        @keyframes partnersScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-partnersScroll {
          animation: partnersScroll 30s linear infinite;
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};
