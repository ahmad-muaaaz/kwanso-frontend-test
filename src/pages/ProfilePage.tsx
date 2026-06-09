import { Link } from 'react-router-dom';
import { ArrowLeft, UserX } from 'lucide-react';
import { useProfileUser } from '../hooks/useProfileUser';
import { ProfileCard } from '../components/ProfileCard';
import { StateMessage } from '../components/StateMessage';

export function ProfilePage() {
  const { user, backPath } = useProfileUser();

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Link
        to={backPath}
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-emerald-600"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to directory
      </Link>

      {user ? (
        <ProfileCard user={user} />
      ) : (
        <StateMessage
          icon={<UserX className="h-12 w-12" />}
          title="Profile unavailable"
          description="This profile can't be opened directly. Open it from the user directory."
          action={
            <Link
              to="/users"
              className="mt-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
            >
              Go to directory
            </Link>
          }
        />
      )}
    </main>
  );
}
