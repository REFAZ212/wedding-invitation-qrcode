interface OrnamentProps {
  className?: string;
  variant?: "divider" | "corner" | "monogram";
}

/**
 * Elemen dekoratif garis floral bergaya line-art emas.
 * Menjadi "signature element" visual yang berulang di seluruh halaman,
 * menyatukan identitas desain undangan.
 */
export default function Ornament({ className = "", variant = "divider" }: OrnamentProps) {
  if (variant === "monogram") {
    return (
      <svg viewBox="0 0 200 200" className={className} fill="none" aria-hidden="true">
        <circle cx="100" cy="100" r="92" stroke="currentColor" strokeWidth="1" />
        <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 4" />
        <path
          d="M40 100 C 55 70, 75 70, 85 95 C 95 120, 60 130, 40 100 Z"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.5"
        />
        <path
          d="M160 100 C 145 70, 125 70, 115 95 C 105 120, 140 130, 160 100 Z"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.5"
        />
      </svg>
    );
  }

  if (variant === "corner") {
    return (
      <svg viewBox="0 0 120 120" className={className} fill="none" aria-hidden="true">
        <path
          d="M4 60 Q4 4 60 4"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.6"
        />
        <path
          d="M20 60 Q20 20 60 20"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.4"
        />
        <circle cx="60" cy="4" r="3" fill="currentColor" opacity="0.6" />
        <circle cx="4" cy="60" r="3" fill="currentColor" opacity="0.6" />
        <path d="M35 35 C 45 25, 55 30, 50 42 C 45 54, 28 48, 35 35 Z" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      </svg>
    );
  }

  // divider
  return (
    <svg viewBox="0 0 300 40" className={className} fill="none" aria-hidden="true">
      <line x1="0" y1="20" x2="115" y2="20" stroke="currentColor" strokeWidth="1" opacity="0.6" />
      <line x1="185" y1="20" x2="300" y2="20" stroke="currentColor" strokeWidth="1" opacity="0.6" />
      <path
        d="M150 6 C 158 14, 158 26, 150 34 C 142 26, 142 14, 150 6 Z"
        stroke="currentColor"
        strokeWidth="1"
      />
      <circle cx="130" cy="20" r="2" fill="currentColor" opacity="0.7" />
      <circle cx="170" cy="20" r="2" fill="currentColor" opacity="0.7" />
    </svg>
  );
}
