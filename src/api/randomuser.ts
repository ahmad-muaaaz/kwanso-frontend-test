import {
  API_BASE_URL,
  API_VERSION,
  INCLUDED_FIELDS,
  PAGE_SIZE,
} from '../lib/constants';
import type { GenderFilter, UsersResponse } from '../types/user';

export interface FetchUsersParams {
  page: number;
  /** Optional gender filter applied server-side by the API. */
  gender?: GenderFilter;
  /** Lets TanStack Query abort in-flight requests on param changes. */
  signal?: AbortSignal;
}

/**
 * Fetches one page of users from the Random User API for the given
 * (page, gender) selection. No seed is sent so that the `gender` filter is
 * honoured server-side; the query cache keeps pages stable within a session.
 */
export async function fetchUsers({
  page,
  gender,
  signal,
}: FetchUsersParams): Promise<UsersResponse> {
  const params = new URLSearchParams({
    page: String(page),
    results: String(PAGE_SIZE),
    inc: INCLUDED_FIELDS.join(','),
    version: API_VERSION,
  });

  if (gender) {
    params.set('gender', gender);
  }

  const response = await fetch(`${API_BASE_URL}?${params.toString()}`, {
    signal,
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch users (HTTP ${response.status} ${response.statusText})`,
    );
  }

  // randomuser.me reports some failures as HTTP 200 with an `{ "error": ... }`
  // body, so a successful status is not enough; validate the payload shape.
  const payload: unknown = await response.json();
  if (!isUsersResponse(payload)) {
    throw new Error(extractApiError(payload));
  }

  return payload;
}

function isUsersResponse(value: unknown): value is UsersResponse {
  return (
    typeof value === 'object' &&
    value !== null &&
    Array.isArray((value as { results?: unknown }).results)
  );
}

function extractApiError(value: unknown): string {
  if (typeof value === 'object' && value !== null && 'error' in value) {
    return `Random User API error: ${String((value as { error: unknown }).error)}`;
  }
  return 'Unexpected response from the Random User API';
}
