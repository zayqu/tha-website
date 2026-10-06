import { getPartnerImageProps } from '../lib/imageUtils';

function PartnerItem({ partner, mobile = false }) {
  return (
    <a
      href={partner.website || '#'}
      target={partner.website ? '_blank' : undefined}
      rel={partner.website ? 'noopener noreferrer' : undefined}
      className={`flex shrink-0 items-center justify-center rounded-xl border border-gray-100 bg-white shadow-card transition hover:-translate-y-0.5 hover:shadow-elevated ${mobile ? 'h-16 w-36' : 'h-20 w-44 md:h-24 md:w-48'}`}
      aria-label={partner.name}
    >
      {partner.logo ? (
        <img
          src={partner.logo}
          alt={partner.name}
          width={mobile ? 112 : 150}
          height={mobile ? 42 : 60}
          {...getPartnerImageProps(partner.logo)}
          className={`${mobile ? 'max-h-10 max-w-[112px]' : 'max-h-14 max-w-[150px]'} object-contain px-2`}
        />
      ) : (
        <span className="px-3 text-center text-xs font-bold leading-tight text-gray-700 md:text-sm">
          {partner.name}
        </span>
      )}
    </a>
  );
}

export const PartnersCarousel = ({ partners = [] }) => {
  if (!partners.length) return null;
  const loop = [...partners, ...partners];

  return (
    <div className="partner-marquee w-full overflow-hidden">
      <div className="partner-track flex w-max items-center gap-4 px-4 md:gap-6 md:px-0">
        {loop.map((partner, index) => (
          <PartnerItem
            key={`${partner.id || partner.name}-${index}`}
            partner={partner}
            mobile={true}
          />
        ))}
      </div>

      <style>{`
        .partner-marquee {
          mask-image: linear-gradient(to right, transparent, black 6%, black 94%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 6%, black 94%, transparent);
        }
        .partner-track {
          animation: thaPartnerMarquee 24s linear infinite;
          will-change: transform;
        }
        .partner-marquee:hover .partner-track,
        .partner-marquee:focus-within .partner-track {
          animation-play-state: paused;
        }
        @keyframes thaPartnerMarquee {
          from { transform: translate3d(0,0,0); }
          to { transform: translate3d(calc(-50% - 0.5rem),0,0); }
        }
        @media (min-width: 768px) {
          .partner-track { animation-duration: 30s; }
          .partner-track > a { width: 12rem; height: 6rem; }
          .partner-track > a img { max-width: 160px; max-height: 64px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .partner-track { animation: none; }
          .partner-marquee { overflow-x: auto; }
        }
      `}</style>
    </div>
  );
};
