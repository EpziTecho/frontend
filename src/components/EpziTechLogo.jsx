// Convertido de mockups/logo/ic_logo_epzitech.xml (Android VectorDrawable)
// a SVG -- mismo pathData, mismo color de marca (cian).
export function EpziTechLogo({ className = 'w-6 h-6' }) {
  return (
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path
        d="M16,10 L16,54 M16,10 L38,10 M16,32 L30,32 M16,54 L38,54"
        stroke="#22D3EE"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M46,18 L58,32 L46,46"
        stroke="#22D3EE"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="38" cy="10" r="3.5" fill="#22D3EE" />
      <circle cx="30" cy="32" r="3.5" fill="#22D3EE" />
      <circle cx="38" cy="54" r="3.5" fill="#22D3EE" />
      <circle cx="58" cy="32" r="3.5" fill="#22D3EE" />
    </svg>
  );
}
