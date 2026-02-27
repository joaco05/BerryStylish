export function BerryLogo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Strawberry body */}
      <ellipse cx="32" cy="38" rx="18" ry="20" fill="oklch(0.72 0.14 350)" />
      {/* Seeds */}
      <circle cx="25" cy="32" r="1.5" fill="oklch(0.96 0.015 80)" />
      <circle cx="32" cy="28" r="1.5" fill="oklch(0.96 0.015 80)" />
      <circle cx="39" cy="32" r="1.5" fill="oklch(0.96 0.015 80)" />
      <circle cx="27" cy="42" r="1.5" fill="oklch(0.96 0.015 80)" />
      <circle cx="37" cy="42" r="1.5" fill="oklch(0.96 0.015 80)" />
      <circle cx="32" cy="48" r="1.5" fill="oklch(0.96 0.015 80)" />
      {/* Leaf */}
      <path
        d="M32 18 C26 14 22 18 24 22 C26 20 30 18 32 18Z"
        fill="oklch(0.65 0.15 145)"
      />
      <path
        d="M32 18 C38 14 42 18 40 22 C38 20 34 18 32 18Z"
        fill="oklch(0.60 0.15 145)"
      />
      {/* Cute face */}
      <circle cx="27" cy="36" r="2.5" fill="oklch(0.28 0.02 350)" />
      <circle cx="37" cy="36" r="2.5" fill="oklch(0.28 0.02 350)" />
      <circle cx="28" cy="35" r="1" fill="oklch(0.99 0 0)" />
      <circle cx="38" cy="35" r="1" fill="oklch(0.99 0 0)" />
      {/* Smile */}
      <path
        d="M29 40 Q32 44 35 40"
        stroke="oklch(0.28 0.02 350)"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Blush */}
      <ellipse cx="23" cy="39" rx="3" ry="2" fill="oklch(0.80 0.10 350)" opacity="0.5" />
      <ellipse cx="41" cy="39" rx="3" ry="2" fill="oklch(0.80 0.10 350)" opacity="0.5" />
    </svg>
  )
}
