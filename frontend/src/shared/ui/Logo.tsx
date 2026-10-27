import React from 'react';

export interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showWordmark?: boolean;
  showSubtext?: boolean;
}

export function Logo({
  size = 'md',
  className = '',
  showWordmark = true,
  showSubtext = true
}: LogoProps) {
  const sizeClass = size === 'sm' ? 'h-6' : size === 'lg' ? 'h-10' : 'h-7';
  const viewBox = showWordmark ? '0 0 110 36' : '0 0 38 36';

  return (
    <div
      className={`inline-flex items-center gap-2 select-none text-slate-900 dark:text-slate-100 ${className}`}
    >
      <svg
        viewBox={viewBox}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`block shrink-0 w-auto ${sizeClass}`}
        aria-label="Apex Auctions"
      >
        <path d="M19 2L10 20L19 23Z" fill="#6366F1" />
        <path d="M19 2L19 23L28 20Z" fill="#06B6D4" />
        <path d="M10 20L2 34L19 23Z" fill="#4F46E5" />
        <path d="M28 20L19 23L36 34Z" fill="#3B82F6" />
        <path d="M19 23L2 34L19 34Z" fill="#1E1B4B" />
        <path d="M19 23L19 34L36 34Z" fill="#0284C7" />
        <path d="M19 2L23 11L19 13Z" fill="#A5B4FC" opacity="0.8" />
        {showWordmark && (
          <text
            x="44"
            y="25"
            fill="currentColor"
            fontFamily="system-ui, -apple-system, 'Inter', sans-serif"
            fontWeight="800"
            fontSize="21"
            letterSpacing="-0.5px"
          >
            Apex
          </text>
        )}
      </svg>

      {showWordmark && showSubtext && (
        <span className="hidden sm:inline-block self-center pl-2 text-[11px] font-bold tracking-widest uppercase border-l border-slate-300 text-slate-500 dark:border-slate-700 dark:text-slate-400">
          auctions
        </span>
      )}
    </div>
  );
}
