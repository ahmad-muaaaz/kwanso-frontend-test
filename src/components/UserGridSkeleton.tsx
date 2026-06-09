import { PAGE_SIZE } from '../lib/constants';

interface UserGridSkeletonProps {
  count?: number;
}

/** Placeholder grid shown during the initial load to avoid layout shift. */
export function UserGridSkeleton({ count = PAGE_SIZE }: UserGridSkeletonProps) {
  return (
    <div
      className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      aria-hidden="true"
    >
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-6"
        >
          <div className="h-24 w-24 animate-pulse rounded-full bg-slate-200" />
          <div className="mt-4 h-4 w-32 animate-pulse rounded bg-slate-200" />
          <div className="mt-2 h-3 w-40 animate-pulse rounded bg-slate-100" />
          <div className="mt-2 h-3 w-24 animate-pulse rounded bg-slate-100" />
          <div className="mt-4 h-6 w-16 animate-pulse rounded-full bg-slate-100" />
        </div>
      ))}
    </div>
  );
}
