import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { fetchUsers } from '../api/randomuser';
import type { GenderFilter, UsersResponse } from '../types/user';

/** Centralised query key so the listing and profile pages share one cache entry. */
export function usersQueryKey(page: number, gender: GenderFilter) {
  return ['users', { page, gender }] as const;
}

/**
 * Fetches a page of users for the current (page, gender) selection.
 *
 * `keepPreviousData` keeps the previous page on screen while the next one loads,
 * so pagination never flashes an empty grid. Gender is part of the query key, so
 * switching gender transparently swaps to (or fetches) the right cache entry.
 *
 * `staleTime: Infinity` means a page, once fetched, is never silently refetched.
 * Since no seed is used, this is what keeps pagination (and the cached data the
 * profile page reads) consistent for the lifetime of the session.
 */
export function useUsers(page: number, gender: GenderFilter) {
  return useQuery<UsersResponse>({
    queryKey: usersQueryKey(page, gender),
    queryFn: ({ signal }) => fetchUsers({ page, gender, signal }),
    placeholderData: keepPreviousData,
    staleTime: Infinity,
  });
}
