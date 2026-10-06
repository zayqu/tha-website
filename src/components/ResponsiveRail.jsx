export default function ResponsiveRail({
  children,
  className = '',
  itemClassName = '',
  desktopGrid = 'md:grid-cols-3',
  mobileWidth = '82vw',
}) {
  return (
    <div
      className={`responsive-rail -mx-4 flex gap-4 overflow-x-auto snap-x snap-mandatory px-4 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:grid ${desktopGrid} md:gap-6 md:overflow-visible md:px-0 md:pb-0 ${className}`}
    >
      {Array.isArray(children)
        ? children.map((child, index) => (
            <div
              key={child?.key || index}
              className={`shrink-0 snap-center w-[min(var(--rail-mobile-width),calc(100vw-2rem))] md:w-auto md:min-w-0 md:max-w-none ${itemClassName}`}
              style={{ '--rail-mobile-width': mobileWidth }}
            >
              {child}
            </div>
          ))
        : children}
    </div>
  );
}
