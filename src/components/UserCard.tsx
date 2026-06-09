import { Link, useLocation } from 'react-router-dom';
import type { User } from '../types/user';
import type { ProfileNavState } from '../types/navigation';
import { getFullName, getShortLocation } from '../lib/user';
import { Flag } from './Flag';
import { GenderBadge } from './GenderBadge';

interface UserCardProps {
  user: User;
  to: string;
}

export function UserCard({ user, to }: UserCardProps) {
  const location = useLocation();
  const fullName = getFullName(user.name);

  // Hand the full user to the profile page (instant render) plus the exact
  // listing URL so its "Back" can restore page + gender + search.
  const navState: ProfileNavState = {
    user,
    from: `${location.pathname}${location.search}`,
  };

  return (
    <Link
      to={to}
      state={navState}
      className="group flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm transition-all hover:-translate-y-1 hover:border-emerald-300 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
    >
      <img
        src={user.picture.large}
        alt={fullName}
        loading="lazy"
        width={96}
        height={96}
        className="h-24 w-24 rounded-full object-cover ring-4 ring-slate-100 transition-transform group-hover:ring-emerald-100"
      />

      <h2 className="mt-4 text-lg font-semibold text-slate-800">{fullName}</h2>

      <p className="mt-1 max-w-full truncate text-sm text-slate-500">
        {user.email}
      </p>

      <p className="mt-1 flex items-center justify-center gap-1.5 text-sm text-slate-400">
        <Flag nat={user.nat} size="sm" />
        {getShortLocation(user.location)}
      </p>

      <div className="mt-4">
        <GenderBadge gender={user.gender} />
      </div>
    </Link>
  );
}
