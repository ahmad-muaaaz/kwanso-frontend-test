import { useState } from 'react';

type FlagSize = 'sm' | 'md' | 'lg';

interface FlagProps {
  nat: string; // ISO 3166-1 alpha-2 country code (the API's `nat` field), e.g. "US".
  size?: FlagSize;
  className?: string;
}

/** Rendered width per size; the image itself is fetched at 2× for sharpness. */
const FLAG_WIDTH: Record<FlagSize, number> = {
  sm: 20,
  md: 28,
  lg: 40,
};

/**
 * Nationality flag sourced from flagcdn.com (free, no API key). Maps the `nat`
 * country code to a flag image rather than bundling flag assets.
 */
export function Flag({ nat, size = 'md', className = '' }: FlagProps) {
  const [failed, setFailed] = useState(false);
  const code = nat.toLowerCase();
  const width = FLAG_WIDTH[size];

  // Fall back to the country code if the flag image can't be loaded, rather
  // than rendering the browser's broken-image glyph.
  if (failed) {
    return (
      <span
        title={nat}
        className={`inline-block rounded-[2px] bg-slate-100 px-1 text-[10px] font-medium uppercase text-slate-500 ring-1 ring-black/10 ${className}`}
      >
        {nat}
      </span>
    );
  }

  return (
    <img
      src={`https://flagcdn.com/w80/${code}.png`}
      alt={`${nat} flag`}
      title={nat}
      loading="lazy"
      onError={() => setFailed(true)}
      style={{ width }}
      className={`inline-block h-auto rounded-[2px] ring-1 ring-black/10 ${className}`}
    />
  );
}
