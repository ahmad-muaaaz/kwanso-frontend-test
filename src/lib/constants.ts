/** Shared, immutable configuration for the Random User API integration. */

export const API_BASE_URL = 'https://randomuser.me/api/';

export const PAGE_SIZE = 12; // Users fetched per page. Chosen to fill the responsive grid evenly.

/**
 * Note on seeding: randomuser.me supports a `seed` for deterministic results,
 * but a seed *overrides* the `gender` filter (it reproduces one fixed set
 * regardless of gender). Because true server-side gender filtering is a core
 * requirement, we deliberately omit the seed and instead keep fetched pages
 * stable within a session via the query cache (see `useUsers`).
 */

/** Top-level fields requested via `inc` to keep the payload lean. */
export const INCLUDED_FIELDS = [
  'gender',
  'name',
  'location',
  'email',
  'login',
  'dob',
  'phone',
  'cell',
  'picture',
  'nat',
] as const;

export const API_VERSION = '1.4';
