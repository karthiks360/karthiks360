/**
 * Illustrated avatar for Karthik S — a self-contained SVG (no external image),
 * drawn on the site's blue→purple brand gradient. Scales crisply at any size;
 * the parent should clip it to a circle (`rounded-full overflow-hidden`).
 */
export function Avatar({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role="img"
      aria-label="Karthik S"
    >
      <defs>
        <linearGradient id="avatarBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#9333ea" />
        </linearGradient>
      </defs>

      {/* Background */}
      <rect width="100" height="100" fill="url(#avatarBg)" />

      {/* Shoulders / shirt */}
      <path d="M14 100 C14 79 30 67 50 67 C70 67 86 79 86 100 Z" fill="#1e293b" />
      {/* Collar */}
      <path d="M42 68 L50 78 L58 68 Z" fill="#0f172a" />

      {/* Neck */}
      <path d="M44 55 h12 v9 c0 4 -12 4 -12 0 Z" fill="#e0a375" />

      {/* Ears */}
      <circle cx="32" cy="45" r="4" fill="#f0bd93" />
      <circle cx="68" cy="45" r="4" fill="#f0bd93" />

      {/* Head */}
      <circle cx="50" cy="43" r="17" fill="#f3c49b" />

      {/* Hair */}
      <path
        d="M32 45 C31 28 40 20 50 20 C60 20 69 28 68 45 C66 38 63 33 59 32 C56 28 44 28 41 32 C37 33 34 38 32 45 Z"
        fill="#241c1a"
      />

      {/* Glasses */}
      <g fill="none" stroke="#111827" strokeWidth="2.4">
        <rect x="36.5" y="39" width="11" height="8.5" rx="3" />
        <rect x="52.5" y="39" width="11" height="8.5" rx="3" />
        <path d="M47.5 42 h5" />
      </g>

      {/* Eyes */}
      <circle cx="42" cy="43.2" r="1.6" fill="#111827" />
      <circle cx="58" cy="43.2" r="1.6" fill="#111827" />

      {/* Smile */}
      <path
        d="M44 52 Q50 57 56 52"
        fill="none"
        stroke="#c47a4a"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
