import type { Gender } from '../types/user';

interface GenderBadgeProps {
  gender: Gender;
}

const GENDER_STYLES: Record<Gender, string> = {
  female: 'bg-pink-50 text-pink-600 ring-pink-200',
  male: 'bg-sky-50 text-sky-600 ring-sky-200',
};

/** Small, capitalised pill conveying a user's gender. */
export function GenderBadge({ gender }: GenderBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium capitalize ring-1 ring-inset ${GENDER_STYLES[gender]}`}
    >
      {gender}
    </span>
  );
}
