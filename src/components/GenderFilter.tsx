import { SlidersHorizontal } from 'lucide-react';
import type { GenderFilter as GenderFilterValue } from '../types/user';

interface GenderFilterProps {
  value: GenderFilterValue;
  onChange: (value: GenderFilterValue) => void;
}

const OPTIONS: ReadonlyArray<{ label: string; value: GenderFilterValue }> = [
  { label: 'All', value: '' },
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
];

/**
 * Segmented control for filtering by gender. Fully controlled - it owns no
 * state, so the URL (via the listing page) stays the single source of truth.
 */
export function GenderFilter({ value, onChange }: GenderFilterProps) {
  return (
    <div className="flex items-center gap-2">
      <SlidersHorizontal
        className="h-4 w-4 text-slate-400"
        aria-hidden="true"
      />
      <span className="text-sm font-medium text-slate-500">Gender</span>
      <div
        role="group"
        aria-label="Filter by gender"
        className="inline-flex rounded-lg border border-slate-200 bg-white p-1"
      >
        {OPTIONS.map((option) => {
          const isActive = option.value === value;
          return (
            <button
              key={option.label}
              type="button"
              aria-pressed={isActive}
              onClick={() => onChange(option.value)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
