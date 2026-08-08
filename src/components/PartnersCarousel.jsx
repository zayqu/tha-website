import { getPartnerImageProps } from '../lib/imageUtils';

export const PartnersCarousel = ({ partners }) => {
  return (
    <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {partners.map((partner) => (
          <a
            key={partner.id}
            href={partner.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-20 min-w-0 items-center justify-center rounded-xl bg-white p-3 shadow-card transition-shadow hover:shadow-elevated"
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
  );
};
