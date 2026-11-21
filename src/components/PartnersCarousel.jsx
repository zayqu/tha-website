import { getPartnerImageProps } from '../lib/imageUtils';

function PartnerItem({ partner }) {
  return (
    <a
      href={partner.website || '#'}
      target={partner.website ? '_blank' : undefined}
      rel={partner.website ? 'noopener noreferrer' : undefined}
      className="flex h-16 w-36 items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50 md:h-20 md:w-44"
      aria-label={partner.name}
    >
      {partner.logo ? (
        <img
          src={partner.logo}
          alt={partner.name}
          width={150}
          height={60}
          {...getPartnerImageProps(partner.logo)}
          className="max-h-10 max-w-[112px] object-contain px-2 md:max-h-14 md:max-w-[150px]"
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
  return (
    <div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-3 px-4 md:gap-5">
      {partners.map(partner => (
        <PartnerItem key={partner.id || partner.name} partner={partner} />
      ))}
    </div>
  );
};
