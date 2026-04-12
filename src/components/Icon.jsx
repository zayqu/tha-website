// Material Symbols Outlined via Google Fonts CDN
// Social icons use inline SVGs (not in Material Symbols)

const colorMap = {
  hepatitis: '#024d85',
  hiv: '#24b805',
  mental: '#ff9c1a',
  health: '#26b805',
  primary: '#024d85',
  secondary: '#26b805',
  accent: '#ff9c1a',
  default: 'currentColor',
};

// Map legacy icon names to Material Symbols names
const symbolMap = {
  home: 'home',
  info: 'info',
  close: 'close',
  menu: 'menu',
  search: 'search',
  local_hospital: 'local_hospital',
  favorite: 'favorite',
  psychology: 'psychology',
  forum: 'forum',
  arrow_forward: 'arrow_forward',
  school: 'school',
  newspaper: 'newspaper',
  mail: 'mail',
  phone: 'phone',
  email: 'email',
  calendar_today: 'calendar_today',
  person: 'person',
  groups: 'groups',
  check_circle: 'check_circle',
  location_on: 'location_on',
  download: 'download',
  film: 'movie',
  award: 'emoji_events',
  star: 'star',
  shield: 'shield',
  scale: 'balance',
  lightbulb: 'lightbulb',
  zap: 'bolt',
  chevron_left: 'chevron_left',
  chevron_right: 'chevron_right',
  track_changes: 'track_changes',
  visibility: 'visibility',
  article: 'article',
  campaign: 'campaign',
  auto_awesome: 'auto_awesome',
  handshake: 'handshake',
  volunteer_activism: 'volunteer_activism',
  health_and_safety: 'health_and_safety',
  medical_services: 'medical_services',
  diversity_3: 'diversity_3',
  workspace_premium: 'workspace_premium',
  eco: 'eco',
  public: 'public',
  trending_up: 'trending_up',
  verified: 'verified',
};

// Social icons need inline SVGs
const socialSvgs = {
  facebook: (color) => (
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  ),
  instagram: (color) => (
    <><rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke={color} strokeWidth="1.5"/><circle cx="12" cy="12" r="5" fill="none" stroke={color} strokeWidth="1.5"/><circle cx="17.5" cy="6.5" r="1.5" fill={color}/></>
  ),
  linkedin: (color) => (
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  ),
};

export const Icon = ({ name, className = "", size = 24, color = "currentColor", category = "default" }) => {
  const resolvedColor = color === "currentColor" ? (colorMap[category] || colorMap.default) : color;

  // Social icons: render as SVGs
  if (socialSvgs[name]) {
    return (
      <svg className={className} width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        {socialSvgs[name](resolvedColor)}
      </svg>
    );
  }

  // Material Symbol
  const symbolName = symbolMap[name] || name;

  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={{
        fontSize: size,
        color: resolvedColor,
        lineHeight: 1,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        userSelect: 'none',
      }}
      aria-hidden="true"
    >
      {symbolName}
    </span>
  );
};
