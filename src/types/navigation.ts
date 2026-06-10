import type { User } from './user';

/**
 * State handed to the profile route via React Router's `Link state`.
 * Typed explicitly so `location.state` is never read as `any`.
 */
export interface ProfileNavState {
  user: User; // The selected user: lets the profile render instantly without a refetch.
  from: string; // The listing URL (path + query) to return to, preserving filters/search.
}
