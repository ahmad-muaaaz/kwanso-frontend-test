interface PaginationProps {
  page: number;
  hasNext: boolean; // Whether the current page returned a full set (i.e. a next page exists).
  onPageChange: (page: number) => void;
  isFetching?: boolean; // Disables controls while a page transition is in flight.
}

const WINDOW = 2; // How many page numbers to show on each side of the current page.

/**
 * The Random User API generates pages on demand and never reports a total
 * count, so there is no "last page". We render a sliding window of page numbers
 * around the current page plus Prev/Next - the only pattern the API supports.
 */
export function Pagination({
  page,
  hasNext,
  onPageChange,
  isFetching = false,
}: PaginationProps) {
  const start = Math.max(1, page - WINDOW);
  const end = page + (hasNext ? WINDOW : 0);
  const pages: number[] = [];
  for (let p = start; p <= end; p += 1) {
    pages.push(p);
  }

  const baseButton =
    'inline-flex h-10 min-w-10 items-center justify-center rounded-lg px-3 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40';

  return (
    <nav
      className="flex items-center justify-center gap-2"
      aria-label="Pagination"
    >
      <button
        type="button"
        className={`${baseButton} border border-slate-200 bg-white text-slate-600 hover:bg-slate-50`}
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1 || isFetching}
      >
        Prev
      </button>

      {pages.map((p) => {
        const isActive = p === page;
        return (
          <button
            key={p}
            type="button"
            aria-current={isActive ? 'page' : undefined}
            className={`${baseButton} border ${
              isActive
                ? 'border-emerald-600 bg-emerald-600 text-white'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
            }`}
            onClick={() => onPageChange(p)}
            disabled={isFetching}
          >
            {p}
          </button>
        );
      })}

      <button
        type="button"
        className={`${baseButton} border border-slate-200 bg-white text-slate-600 hover:bg-slate-50`}
        onClick={() => onPageChange(page + 1)}
        disabled={!hasNext || isFetching}
      >
        Next
      </button>
    </nav>
  );
}
