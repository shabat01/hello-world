"use client";

interface KnectIQLogoProps {
  variant?: "full" | "mark" | "wordmark";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizes = {
  sm: { mark: 28, text: 16 },
  md: { mark: 36, text: 20 },
  lg: { mark: 48, text: 26 },
  xl: { mark: 64, text: 34 },
};

export function KnectIQLogo({
  variant = "full",
  size = "md",
  className = "",
}: KnectIQLogoProps) {
  const dim = sizes[size];

  const Mark = () => (
    <svg
      width={dim.mark}
      height={dim.mark}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer hexagonal ring */}
      <polygon
        points="50,4 93,27.5 93,72.5 50,96 7,72.5 7,27.5"
        fill="none"
        stroke="url(#logoGrad)"
        strokeWidth="3"
      />
      {/* Inner network nodes */}
      <circle cx="50" cy="50" r="8" fill="url(#logoGrad)" />
      <circle cx="25" cy="37" r="4.5" fill="#06b6d4" />
      <circle cx="75" cy="37" r="4.5" fill="#06b6d4" />
      <circle cx="25" cy="63" r="4.5" fill="#0872e9" />
      <circle cx="75" cy="63" r="4.5" fill="#0872e9" />
      <circle cx="50" cy="22" r="4.5" fill="#60a5fa" />
      <circle cx="50" cy="78" r="4.5" fill="#60a5fa" />
      {/* Connection lines */}
      <line x1="50" y1="50" x2="25" y2="37" stroke="rgba(96,165,250,0.5)" strokeWidth="1.5" />
      <line x1="50" y1="50" x2="75" y2="37" stroke="rgba(96,165,250,0.5)" strokeWidth="1.5" />
      <line x1="50" y1="50" x2="25" y2="63" stroke="rgba(96,165,250,0.5)" strokeWidth="1.5" />
      <line x1="50" y1="50" x2="75" y2="63" stroke="rgba(96,165,250,0.5)" strokeWidth="1.5" />
      <line x1="50" y1="50" x2="50" y2="22" stroke="rgba(96,165,250,0.5)" strokeWidth="1.5" />
      <line x1="50" y1="50" x2="50" y2="78" stroke="rgba(96,165,250,0.5)" strokeWidth="1.5" />
      {/* Outer connections */}
      <line x1="25" y1="37" x2="50" y2="22" stroke="rgba(6,182,212,0.3)" strokeWidth="1" />
      <line x1="75" y1="37" x2="50" y2="22" stroke="rgba(6,182,212,0.3)" strokeWidth="1" />
      <line x1="25" y1="63" x2="50" y2="78" stroke="rgba(6,182,212,0.3)" strokeWidth="1" />
      <line x1="75" y1="63" x2="50" y2="78" stroke="rgba(6,182,212,0.3)" strokeWidth="1" />
      <line x1="25" y1="37" x2="25" y2="63" stroke="rgba(6,182,212,0.3)" strokeWidth="1" />
      <line x1="75" y1="37" x2="75" y2="63" stroke="rgba(6,182,212,0.3)" strokeWidth="1" />
      <defs>
        <linearGradient id="logoGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#60a5fa" />
          <stop offset="0.5" stopColor="#0872e9" />
          <stop offset="1" stopColor="#06b6d4" />
        </linearGradient>
      </defs>
    </svg>
  );

  const Wordmark = () => (
    <span
      style={{ fontSize: dim.text }}
      className="font-bold tracking-tight text-white"
    >
      Knect
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-trust-500 to-sovereign-500">
        IQ
      </span>
    </span>
  );

  if (variant === "mark") return <Mark />;
  if (variant === "wordmark") return <Wordmark />;

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <Mark />
      <Wordmark />
    </div>
  );
}

export function SelectiveTrustMark({ className = "" }: { className?: string }) {
  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          d="M8 1L14.5 4.5V11.5L8 15L1.5 11.5V4.5L8 1Z"
          stroke="url(#stGrad)"
          strokeWidth="1.5"
          fill="rgba(8,114,233,0.1)"
        />
        <path d="M5 8l2 2 4-4" stroke="#06b6d4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <defs>
          <linearGradient id="stGrad" x1="0" y1="0" x2="16" y2="16" gradientUnits="userSpaceOnUse">
            <stop stopColor="#60a5fa" />
            <stop offset="1" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
      </svg>
      <span className="font-semibold text-sm">
        <span className="text-white">Selective</span>
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-trust-400 to-sovereign-400">
          TRUST
        </span>
        <sup className="text-sovereign-400 text-xs">®</sup>
      </span>
    </div>
  );
}
