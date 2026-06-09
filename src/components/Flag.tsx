type FlagSize = 'sm' | 'md' | 'lg';

interface FlagProps {
  /** ISO 3166-1 alpha-2 country code (the API's `nat` field), e.g. "US". */
  nat: string;
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
  const code = nat.toLowerCase();
  const width = FLAG_WIDTH[size];

  return (
    <img
      src={`https://flagcdn.com/w80/${code}.png`}
      alt={`${nat} flag`}
      title={nat}
      loading="lazy"
      style={{ width }}
      className={`inline-block h-auto rounded-[2px] ring-1 ring-black/10 ${className}`}
    />
  );
}
