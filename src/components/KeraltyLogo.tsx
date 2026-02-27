const KeraltyLogo = ({ className = "h-10" }: { className?: string }) => (
  <svg viewBox="0 0 280 80" className={className} xmlns="http://www.w3.org/2000/svg">
    <g>
      <ellipse cx="28" cy="28" rx="14" ry="22" fill="#7BC8A4" transform="rotate(-30 28 28)" />
      <ellipse cx="22" cy="35" rx="14" ry="22" fill="#8CC63F" transform="rotate(15 22 35)" />
      <ellipse cx="35" cy="20" rx="12" ry="18" fill="#00AEEF" transform="rotate(-50 35 20)" />
    </g>
    <text x="65" y="55" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="40" fill="#003B71">
      Keralty
    </text>
  </svg>
);

export default KeraltyLogo;
