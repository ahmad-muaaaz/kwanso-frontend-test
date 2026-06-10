import type { User } from '../types/user';
import { getUserId } from '../lib/user';
import { buildProfilePath, type ListingContext } from '../lib/paths';
import { UserCard } from './UserCard';

interface UserGridProps {
  users: User[];
  context: ListingContext; // Listing context woven into each card's profile link.
}

/** Responsive grid of user cards. Purely presentational. */
export function UserGrid({ users, context }: UserGridProps) {
  return (
    <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {users.map((user) => {
        const id = getUserId(user);
        return (
          <li key={id}>
            <UserCard user={user} to={buildProfilePath(id, context)} />
          </li>
        );
      })}
    </ul>
  );
}
