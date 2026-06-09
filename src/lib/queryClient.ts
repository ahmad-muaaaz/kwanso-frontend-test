import { QueryClient } from '@tanstack/react-query';

/**
 * Single shared QueryClient.
 *
 * `staleTime` is generous because pages are stable within a session: no seed is
 * used, so refetching on focus or remount would be wasted work and cause
 * needless re-renders. Cached pages also make list, profile, and back instant.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});
