// Material Design OUTLINED Icons - Using THA Branding Color (#ff9c1a)
export const Icon = ({ name, className = "", size = 24, color = "currentColor" }) => {
  const icons = {
    // Navigation & Basic
    home: <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" fill="none" stroke="currentColor" strokeWidth="1.5"/>,
    info: <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" fill="none" stroke="currentColor" strokeWidth="1.5"/>,
    close: <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" fill="none" stroke="currentColor" strokeWidth="1.5"/>,
    menu: <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" fill="none" stroke="currentColor" strokeWidth="1.5"/>,
    search: <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" fill="none" stroke="currentColor" strokeWidth="1.5"/>,
    
    // Health & Medicine
    local_hospital: <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" fill="none" stroke="currentColor" strokeWidth="1.5"/>,
    favorite: <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="none" stroke="currentColor" strokeWidth="1.5"/>,
    psychology: <path d="M13 8.57c-.79 0-1.43.64-1.43 1.43s.64 1.43 1.43 1.43 1.43-.64 1.43-1.43-.64-1.43-1.43-1.43z M13 3C9.25 3 6.2 5.94 6.02 9.64L4.1 12.2c-.25.32-.25.76 0 1.09l1.57 2.03c.15.19.35.31.57.36l1.3.29.19 1.26c.05.3.24.56.51.7l1.95.98c.32.16.69.16 1.01 0l1.95-.98c.27-.14.46-.4.51-.7l.19-1.26 1.3-.29c.22-.05.42-.17.57-.36l1.57-2.03c.25-.32.25-.76 0-1.09l-1.92-2.56C17.8 5.94 14.75 3 13 3zm0 12.75c-2.07 0-3.75-1.68-3.75-3.75 0-2.07 1.68-3.75 3.75-3.75s3.75 1.68 3.75 3.75c0 2.07-1.68 3.75-3.75 3.75z" fill="none" stroke="currentColor" strokeWidth="1.5"/>,
    
    // Navigation & Links
    arrow_forward: <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8-8-8z" fill="none" stroke="currentColor" strokeWidth="1.5"/>,
    volunteer_activism: <path d="M13.49 5.48c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-3.6 13.9l1-4.4 2.1 2v6h2v-7.5l-2.1-2 .6-3c1.3 1.5 3.3 2.5 5.5 2.5v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1l-5.2 2.2v4.7h2v-3.4l1.8-.7-1.6 8.1-4.9-1-.4 2 7-1.3z" fill="none" stroke="currentColor" strokeWidth="1.5"/>,
    school: <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z" fill="none" stroke="currentColor" strokeWidth="1.5"/>,
    newspaper: <path d="M22 3l-1.67 1.67L18.67 3 17 4.67 15.33 3l-1.66 1.67L12 3l-1.67 1.67L8.67 3 7 4.67 5.33 3 3.67 4.67 2 3v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V3zM11 19H4v-6h7v6zm9 0h-7v-2h7v2zm0-4h-7v-2h7v2zm0-4H4V8h16v3z" fill="none" stroke="currentColor" strokeWidth="1.5"/>,
    
    // Contact & Communication
    mail: <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="none" stroke="currentColor" strokeWidth="1.5"/>,
    phone: <path d="M22.54 6.46l-3.15-3.15c-.78-.78-2.05-.78-2.83 0l-2.63 2.63c-.78.78-.78 2.05 0 2.83l1.82 1.82c-2.35 2.3-5.48 3.5-8.68 3.5-1.47 0-2.92.59-3.97 1.64l5.89 5.89c1.05-1.05 1.64-2.5 1.64-3.97 0-3.2 1.2-6.33 3.5-8.68l1.82 1.82c.39.39.9.59 1.41.59.51 0 1.02-.2 1.41-.59l2.63-2.63c.78-.78.78-2.05 0-2.83z" fill="none" stroke="currentColor" strokeWidth="1.5"/>,
    email: <path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0l-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z" fill="none" stroke="currentColor" strokeWidth="1.5"/>,
    
    // Calendar & Time
    calendar_today: <path d="M20 3h-1V1h-2v2H7V1H5v2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H4V10h16v11zm0-13H4V5h16v3z" fill="none" stroke="currentColor" strokeWidth="1.5"/>,
    
    // People & Groups
    person: <path d="M12 6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2m0 10c2.7 0 5.8 1.29 6 2H6c.23-.72 3.31-2 6-2m0-12C9.79 4 8 5.79 8 8s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 10c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="none" stroke="currentColor" strokeWidth="1.5"/>,
    groups: <path d="M9 13c-1.29 0-2.58.41-3.72 1.2-1.23.88-2.17 2.33-2.42 4.05-.06.39.23.75.63.75h13.98c.4 0 .69-.36.63-.75-.25-1.72-1.19-3.17-2.42-4.05C11.58 13.41 10.29 13 9 13zm0-2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6.5-1c.83 0 1.5-.67 1.5-1.5S16.33 7 15.5 7 14 7.67 14 8.5s.67 1.5 1.5 1.5zm0 2.5c-1.02 0-2.05.38-2.8 1.02-.96.83-1.52 2.05-1.61 3.46-.03.35.23.65.59.65h10.64c.36 0 .62-.3.59-.65-.09-1.41-.65-2.63-1.61-3.46-.75-.64-1.78-1.02-2.8-1.02zM3 13h2c1.1 0 2-.9 2-2s-.9-2-2-2H3c-1.1 0-2 .9-2 2s.9 2 2 2zm0 2H2c-.55 0-.98.45-.95 1 .07 1.17.67 2.22 1.56 2.92.89.7 1.98 1.08 3.12 1.08h.27c.56 0 1-.44 1-1s-.44-1-1-1H3z" fill="none" stroke="currentColor" strokeWidth="1.5"/>,
    
    // Social & Web
    facebook: <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.7 10h-2.6v8.4h-3.5V12h-2.4v-3h2.4V7.7c0-2 .95-3.3 3.3-3.3h2.6v3h-1.9c-.6 0-.7.3-.7.9V9h2.4l-.4 3z" fill="none" stroke="currentColor" strokeWidth="1.5"/>,
    instagram: <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2.5 7c.83 0 1.5.67 1.5 1.5S11.33 12 10.5 12 9 11.33 9 10.5 9.67 9 10.5 9zm5 0h-4v2h4V9zm2 8h-8v-2h8v2zm0-4h-4v2h4v-2zm0-4h-4v2h4v-2z" fill="none" stroke="currentColor" strokeWidth="1.5"/>,
    linkedin: <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" fill="none" stroke="currentColor" strokeWidth="1.5"/>,
    
    // Status & Feedback
    check_circle: <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5z" fill="none" stroke="currentColor" strokeWidth="1.5"/>,
    
    // Location
    location_on: <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="none" stroke="currentColor" strokeWidth="1.5"/>,
    
    // Downloads
    download: <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" fill="none" stroke="currentColor" strokeWidth="1.5"/>,
    
    // Misc
    track_changes: <path d="M19.07 4.93l-1.41 1.41C19.1 7.79 20 9.79 20 12c0 4.42-3.58 8-8 8s-8-3.58-8-8c0-4.08 3.05-7.44 7-7.93v2.02C8.16 6.57 6 9.03 6 12c0 3.31 2.69 6 6 6s6-2.69 6-6c0-1.66-.67-3.16-1.76-4.24l-1.41 1.41C15.55 9.89 16 10.9 16 12c0 2.21-1.79 4-4 4s-4-1.79-4-4c0-1.86 1.28-3.41 3-3.86v2.14c-.6.35-1 .98-1 1.72 0 1.1.9 2 2 2s2-.9 2-2c0-.74-.4-1.38-1-1.72V2h-1C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10c0-2.76-1.12-5.26-2.93-7.07z" fill="none" stroke="currentColor" strokeWidth="1.5"/>,
    visibility: <path d="M12 6.5c2.76 0 5 2.24 5 5 0 .51-.1 1-.24 1.46l3.06 3.06c1.39-1.23 2.49-2.77 3.18-4.53C21.27 7.11 17 4 12 4c-1.27 0-2.49.2-3.64.57l2.17 2.17c.47-.14.96-.24 1.47-.24zM2.71 3.16c-.39.39-.39 1.02 0 1.41l1.97 1.97C3.06 7.83 1.77 9.53 1 11.5 2.73 16.39 7 19.5 12 19.5c1.52 0 2.97-.3 4.31-.82l2.72 2.72c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L4.13 3.16c-.39-.39-1.03-.39-1.42 0zM12 16.5c-2.76 0-5-2.24-5-5 0-.77.18-1.5.49-2.14l1.57 1.57c-.03.18-.06.37-.06.57 0 1.66 1.34 3 3 3 .2 0 .38-.03.57-.07L14.14 16c-.65.32-1.37.5-2.14.5zm2.97-5.33c-.15-1.4-1.25-2.49-2.64-2.64l2.64 2.64z" fill="none" stroke="currentColor" strokeWidth="1.5"/>,
  };

  return (
    <svg 
      className={className} 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      style={{ color: color || "#ff9c1a" }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {icons[name] || icons.info}
    </svg>
  );
};
