interface UserMapProps {
  query: string; // A place Google Maps will geocode, e.g. "Sevilla, Spain".
  title?: string;
}

/**
 * Embeds Google Maps for a place via the keyless iframe URL (`output=embed`):
 * real Google Maps with no API key or SDK.
 *
 * We map the user's named city/country rather than the payload's `coordinates`,
 * because randomuser.me generates those coordinates randomly and unrelated to
 * the city (they usually land in open ocean). The raw coordinates are still
 * displayed as text on the profile for completeness.
 */
export function UserMap({ query, title = 'Location map' }: UserMapProps) {
  const src = `https://maps.google.com/maps?q=${encodeURIComponent(
    query,
  )}&z=11&output=embed`;

  return (
    <iframe
      title={title}
      src={src}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      className="h-56 w-full rounded-md border border-slate-200"
    />
  );
}
