"use client";

interface SprayCanProps {
  color: string;
  isSelected: boolean;
  onClick: () => void;
  label: string;
}

export function SprayCan({ color, isSelected, onClick, label }: SprayCanProps) {
  return (
    <button
      onClick={onClick}
      className={`group relative flex flex-col items-center gap-2 transition-transform duration-200 ${
        isSelected ? "scale-110" : "hover:scale-105"
      }`}
      aria-label={`Select ${label} spray paint`}
      aria-pressed={isSelected}
    >
      {/* Spray Can SVG */}
      <svg
        width="48"
        height="100"
        viewBox="0 0 48 100"
        className={`drop-shadow-lg transition-all duration-200 ${
          isSelected ? "drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]" : ""
        }`}
      >
        {/* Nozzle/Cap */}
        <rect x="18" y="0" width="12" height="8" rx="2" fill="#000000" />
        <rect x="20" y="2" width="8" height="4" rx="1" fill="#000000" />
        <ellipse cx="24" cy="3" rx="2" ry="1" fill="#000000" />

        {/* Top rim */}
        <ellipse cx="24" cy="12" rx="16" ry="4" fill="#666" />

        {/* Can body */}
        <rect x="8" y="12" width="32" height="80" rx="2" fill={color} />

        {/* Highlight stripe */}
        <rect
          x="10"
          y="12"
          width="6"
          height="80"
          rx="1"
          fill="rgba(255,255,255,0.3)"
        />

        {/* Dark stripe for depth */}
        <rect x="36" y="12" width="3" height="80" fill="rgba(0,0,0,0.2)" />

        {/* Label band */}
        <rect
          x="8"
          y="35"
          width="32"
          height="30"
          fill="rgba(255,255,255,0.15)"
        />
        <rect x="8" y="35" width="32" height="2" fill="rgba(0,0,0,0.2)" />
        <rect x="8" y="63" width="32" height="2" fill="rgba(0,0,0,0.2)" />

        {/* Color indicator dot */}
        <circle
          cx="24"
          cy="50"
          r="8"
          fill={color}
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="2"
        />
        <circle cx="24" cy="50" r="4" fill="rgba(255,255,255,0.3)" />

        {/* Bottom rim */}
        <ellipse cx="24" cy="92" rx="16" ry="4" fill="#555" />
        <ellipse cx="24" cy="92" rx="14" ry="3" fill="#444" />
      </svg>

      {/* Selection ring */}
      {isSelected && (
        <div
          className="absolute -inset-2 rounded-xl border-2 animate-pulse"
          style={{ borderColor: color }}
        />
      )}

      {/* Color name */}
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {label}
      </span>
    </button>
  );
}
