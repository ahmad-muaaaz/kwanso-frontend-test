import { useSearchParams } from 'react-router-dom';
import type { GenderFilter } from '../types/user';

export function parseGender(value: string | null): GenderFilter {
  return value === 'male' || value === 'female' ? value : '';
}

/**
 * Reads and writes the listing's state from the URL query string, making the
 * URL the single source of truth. Persisting here means filters/pagination
 * survive navigation, refresh, and back/forward for free, and the page is
 * shareable.
 *
 * The setters are plain functions; React Compiler keeps them referentially
 * stable, so no `useCallback` is required.
 */
export function useListingParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Math.max(1, Number(searchParams.get('page')) || 1);
  const gender = parseGender(searchParams.get('gender'));
  const search = searchParams.get('q') ?? '';

  const setPage = (nextPage: number) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (nextPage <= 1) {
        next.delete('page');
      } else {
        next.set('page', String(nextPage));
      }
      return next;
    });
  };

  const setGender = (nextGender: GenderFilter) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (nextGender) {
        next.set('gender', nextGender);
      } else {
        next.delete('gender');
      }
      // Changing the filter invalidates the current page index.
      next.delete('page');
      return next;
    });
  };

  const setSearch = (value: string) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value) {
          next.set('q', value);
        } else {
          next.delete('q');
        }
        return next;
      },
      // Replace so each keystroke doesn't create a new history entry.
      { replace: true },
    );
  };

  return { page, setPage, gender, setGender, search, setSearch };
}
