import { useLocation, useParams, useSearchParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { usersQueryKey } from './useUsers';
import { parseGender } from './useListingParams';
import type { ProfileNavState } from '../types/navigation';
import type { User, UsersResponse } from '../types/user';

export interface ProfileUserResult {
  user: User | null; // The resolved user, or null if it can't be recovered (e.g. cold refresh).
  backPath: string; // Where the "Back" control should navigate.
}

/**
 * Resolves the user for the current profile route without a dedicated API
 * endpoint (randomuser.me has none). Resolution order:
 *   1. Router state: present when navigating from the listing (instant).
 *   2. React Query cache: the listing page for this (page, gender) is cached.
 * Both fail only on a cold deep-link/refresh, where we return null so the page
 * can show a graceful fallback.
 */
export function useProfileUser(): ProfileUserResult {
  const { uuid } = useParams<{ uuid: string }>();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();

  const navState = location.state as ProfileNavState | null;
  const backPath = navState?.from ?? buildBackPath(searchParams);

  if (navState?.user && navState.user.login.uuid === uuid) {
    return { user: navState.user, backPath };
  }

  const page = Math.max(1, Number(searchParams.get('page')) || 1);
  const gender = parseGender(searchParams.get('gender'));
  const cached = queryClient.getQueryData<UsersResponse>(
    usersQueryKey(page, gender),
  );
  const cachedUser =
    cached?.results.find((candidate) => candidate.login.uuid === uuid) ?? null;

  return { user: cachedUser, backPath };
}

/** Reconstructs a listing URL from the profile's own query params. */
function buildBackPath(searchParams: URLSearchParams): string {
  const next = new URLSearchParams();
  const page = searchParams.get('page');
  const gender = searchParams.get('gender');
  if (page) {
    next.set('page', page);
  }
  if (gender) {
    next.set('gender', gender);
  }
  const query = next.toString();
  return `/users${query ? `?${query}` : ''}`;
}
