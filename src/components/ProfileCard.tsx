import { useState, type ReactNode } from 'react';
import {
  Calendar,
  Lock,
  Mail,
  MapPin,
  Phone,
  User as UserIcon,
  type LucideIcon,
} from 'lucide-react';
import type { User } from '../types/user';
import {
  formatDateOfBirth,
  getFullAddress,
  getFullName,
  getMapQuery,
  getShortLocation,
} from '../lib/user';
import { Flag } from './Flag';
import { UserMap } from './UserMap';

type TabKey = 'about' | 'email' | 'dob' | 'location' | 'phone' | 'login';

interface TabConfig {
  key: TabKey;
  label: string;
  heading: string;
  icon: LucideIcon;
}

const TABS: ReadonlyArray<TabConfig> = [
  { key: 'about', label: 'About', heading: 'Hi, My name is', icon: UserIcon },
  { key: 'email', label: 'Email', heading: 'My email address is', icon: Mail },
  { key: 'dob', label: 'Birthday', heading: 'My birthday is', icon: Calendar },
  { key: 'location', label: 'Address', heading: 'My address is', icon: MapPin },
  { key: 'phone', label: 'Phone', heading: 'You can reach me at', icon: Phone },
  { key: 'login', label: 'Username', heading: 'My username is', icon: Lock },
];

const ACTIVE_GREEN = '#8bc34a'; // Active-tab accent: the muted green from the reference design.

interface ProfileCardProps {
  user: User;
}

/**
 * Public profile card: a light-gray header band and a white body split by a
 * single divider, with a centered avatar straddling it, a headline that changes
 * per tab, and a row of icon tabs with a green bar marking the active one.
 */
export function ProfileCard({ user }: ProfileCardProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('about');
  const tab = TABS.find((entry) => entry.key === activeTab) ?? TABS[0];

  return (
    <article className="mx-auto max-w-xl overflow-hidden rounded-md bg-white shadow-sm">
      <div className="relative h-44">
        <div className="h-[120px] w-full bg-slate-50" />
        <div className="h-px w-full bg-slate-200" />
        <img
          src={user.picture.large}
          alt={getFullName(user.name)}
          width={128}
          height={128}
          className="absolute left-1/2 top-[44px] h-32 w-32 -translate-x-1/2 rounded-full bg-white object-cover p-1 ring-1 ring-slate-200"
        />
      </div>

      <div className="px-6 pt-2 text-center">
        <p className="text-base text-slate-400">{tab.heading}</p>
        <div className="mt-2 min-h-[3.5rem]">
          {renderTabContent(activeTab, user)}
        </div>
      </div>

      <nav className="flex px-4 pb-8 pt-5" aria-label="Profile sections">
        {TABS.map((entry) => {
          const isActive = entry.key === activeTab;
          const Icon = entry.icon;
          return (
            <button
              key={entry.key}
              type="button"
              title={entry.label}
              aria-label={entry.label}
              aria-pressed={isActive}
              onClick={() => setActiveTab(entry.key)}
              className="flex flex-1 flex-col items-center"
            >
              <span
                className="mb-1.5 h-1 w-5 rounded-full"
                style={{
                  backgroundColor: isActive ? ACTIVE_GREEN : 'transparent',
                }}
              />
              <Icon
                className="h-7 w-7 transition-colors"
                strokeWidth={1.5}
                style={{ color: isActive ? ACTIVE_GREEN : '#cbd5e1' }}
              />
            </button>
          );
        })}
      </nav>
    </article>
  );
}

function renderTabContent(tab: TabKey, user: User): ReactNode {
  switch (tab) {
    case 'about':
      return (
        <h1 className="text-4xl font-bold text-slate-700">
          {getFullName(user.name)}
        </h1>
      );
    case 'email':
      return (
        <a
          href={`mailto:${user.email}`}
          className="break-all text-xl font-medium text-slate-700 hover:underline"
        >
          {user.email}
        </a>
      );
    case 'dob':
      return (
        <div className="space-y-1">
          <p className="text-2xl font-normal text-slate-700">
            {formatDateOfBirth(user.dob)}
          </p>
          <p className="text-sm text-slate-400">{user.dob.age} years old</p>
        </div>
      );
    case 'location':
      return (
        <div className="space-y-3">
          <div className="space-y-1">
            <p className="flex items-center justify-center gap-2 text-2xl font-normal text-slate-700">
              {getShortLocation(user.location)}
              <Flag nat={user.nat} size="md" />
            </p>
            <p className="text-sm text-slate-400">
              {getFullAddress(user.location)}
            </p>
          </div>
          <UserMap
            query={getMapQuery(user.location)}
            title={`Map showing ${getShortLocation(user.location)}`}
          />
          <p className="text-xs text-slate-400">
            Coordinates: {user.location.coordinates.latitude},{' '}
            {user.location.coordinates.longitude}
          </p>
        </div>
      );
    case 'phone':
      return (
        <div className="space-y-1">
          <a
            href={`tel:${user.phone}`}
            className="text-2xl font-normal text-slate-700 hover:underline"
          >
            {user.phone}
          </a>
          <p className="text-sm text-slate-400">Cell: {user.cell}</p>
        </div>
      );
    case 'login':
      return (
        <div className="space-y-1">
          <p className="text-2xl font-normal text-slate-700">
            @{user.login.username}
          </p>
          <p className="break-all text-xs text-slate-400">{user.login.uuid}</p>
        </div>
      );
  }
}
