import { useEffect, useState } from 'react';
import { AlertCircle, SearchX, Users } from 'lucide-react';
import { useListingParams } from '../hooks/useListingParams';
import { useUsers } from '../hooks/useUsers';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { UserGrid } from '../components/UserGrid';
import { UserGridSkeleton } from '../components/UserGridSkeleton';
import { Pagination } from '../components/Pagination';
import { GenderFilter } from '../components/GenderFilter';
import { SearchBar } from '../components/SearchBar';
import { StateMessage } from '../components/StateMessage';
import { PAGE_SIZE } from '../lib/constants';
import { filterUsersByQuery } from '../lib/user';

const SEARCH_DEBOUNCE_MS = 300;

export function ListingPage() {
  const { page, setPage, gender, setGender, search, setSearch } =
    useListingParams();

  const { data, isLoading, isError, error, isFetching, refetch } = useUsers(
    page,
    gender,
  );

  // Local input stays instant; the debounced value drives filtering + the URL.
  const [searchInput, setSearchInput] = useState(search);
  const debouncedSearch = useDebouncedValue(searchInput, SEARCH_DEBOUNCE_MS);

  useEffect(() => {
    if (debouncedSearch !== search) {
      setSearch(debouncedSearch);
    }
  }, [debouncedSearch, search, setSearch]);

  const users = data?.results ?? [];
  const hasNext = users.length === PAGE_SIZE;

  // React Compiler memoises this derivation; it recomputes only when its inputs change.
  const filteredUsers = filterUsersByQuery(users, debouncedSearch);
  const isSearching = debouncedSearch.trim().length > 0;
  const hasResults = filteredUsers.length > 0;

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          User Directory
        </h1>
        <p className="mt-1 text-slate-500">
          Browse users from the Random User API.
        </p>
      </header>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <GenderFilter value={gender} onChange={setGender} />
        <SearchBar value={searchInput} onChange={setSearchInput} />
      </div>

      {isLoading ? (
        <UserGridSkeleton />
      ) : isError ? (
        <StateMessage
          icon={<AlertCircle className="h-12 w-12" />}
          title="Couldn't load users"
          description={
            error instanceof Error ? error.message : 'Something went wrong.'
          }
          action={
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
            >
              Try again
            </button>
          }
        />
      ) : users.length === 0 ? (
        <StateMessage
          icon={<Users className="h-12 w-12" />}
          title="No users found"
          description="Try a different gender filter."
        />
      ) : !hasResults ? (
        <StateMessage
          icon={<SearchX className="h-12 w-12" />}
          title={`No matches for "${debouncedSearch.trim()}" on this page`}
          description="Search runs over the current page. Try another page or clear the search."
          action={
            <button
              type="button"
              onClick={() => setSearchInput('')}
              className="mt-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
            >
              Clear search
            </button>
          }
        />
      ) : (
        <div
          className={`transition-opacity ${isFetching ? 'opacity-60' : 'opacity-100'}`}
        >
          <p className="mb-4 text-sm text-slate-500">
            {isSearching
              ? `${filteredUsers.length} match${filteredUsers.length === 1 ? '' : 'es'} on this page`
              : `Page ${page}`}
          </p>
          <UserGrid users={filteredUsers} context={{ page, gender }} />
        </div>
      )}

      {!isLoading && !isError && users.length > 0 ? (
        <div className="mt-10">
          <Pagination
            page={page}
            hasNext={hasNext}
            onPageChange={handlePageChange}
            isFetching={isFetching}
          />
        </div>
      ) : null}
    </main>
  );
}
