import type { ReactNode } from 'react';

interface StateMessageProps {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

/**
 * Reusable centred message block for empty / error / not-found states.
 * Keeping these visually consistent avoids one-off layouts per state.
 */
export function StateMessage({
  icon,
  title,
  description,
  action,
}: StateMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
      <div className="text-slate-400">{icon}</div>
      <h2 className="text-lg font-semibold text-slate-700">{title}</h2>
      {description ? (
        <p className="max-w-md text-sm text-slate-500">{description}</p>
      ) : null}
      {action}
    </div>
  );
}
