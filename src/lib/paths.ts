import type { GenderFilter } from '../types/user';

export interface ListingContext {
  page: number;
  gender: GenderFilter;
}

/**
 * Builds a profile route that carries the listing context (page + gender) in
 * the query string. The profile page replays that context against the seeded
 * API, so deep-links and refreshes resolve to the correct user.
 */
export function buildProfilePath(uuid: string, context: ListingContext): string {
  const params = new URLSearchParams();
  if (context.page > 1) {
    params.set('page', String(context.page));
  }
  if (context.gender) {
    params.set('gender', context.gender);
  }
  const query = params.toString();
  return `/users/${uuid}${query ? `?${query}` : ''}`;
}
