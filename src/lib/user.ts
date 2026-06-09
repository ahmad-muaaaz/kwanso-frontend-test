import type { DateOfBirth, Location, User, UserName } from '../types/user';

/** "Jennie Nichols" */
export function getFullName(name: UserName): string {
  return `${name.first} ${name.last}`;
}

/** "Miss Jennie Nichols" */
export function getFullNameWithTitle(name: UserName): string {
  return `${name.title} ${name.first} ${name.last}`;
}

/** "Billings, United States" */
export function getShortLocation(location: Location): string {
  return `${location.city}, ${location.country}`;
}

/** "8929 Valwood Pkwy, Billings, Michigan 63104, United States" */
export function getFullAddress(location: Location): string {
  const { street, city, state, postcode, country } = location;
  return `${street.number} ${street.name}, ${city}, ${state} ${postcode}, ${country}`;
}

/** Geocodable place string for the map, e.g. "Billings, Michigan, United States" */
export function getMapQuery(location: Location): string {
  return `${location.city}, ${location.state}, ${location.country}`;
}

/** "March 8, 1992" */
export function formatDateOfBirth(dob: DateOfBirth): string {
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(
    new Date(dob.date),
  );
}

/** Stable, unique identifier for a user across the app (routing + React keys). */
export function getUserId(user: User): string {
  return user.login.uuid;
}

/**
 * Case-insensitive client-side search across a user's most identifying fields.
 * Pure and side-effect free so it's trivial to reason about and memoise.
 */
export function matchesQuery(user: User, query: string): boolean {
  const haystack = [
    user.name.first,
    user.name.last,
    user.email,
    user.login.username,
    user.location.city,
    user.location.country,
    user.nat,
  ]
    .join(' ')
    .toLowerCase();

  return haystack.includes(query);
}

/** Filters a list of users by a raw query string (trimmed + lower-cased once). */
export function filterUsersByQuery(users: User[], query: string): User[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return users;
  }
  return users.filter((user) => matchesQuery(user, normalized));
}
