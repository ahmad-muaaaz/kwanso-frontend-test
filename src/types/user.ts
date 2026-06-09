/**
 * Type definitions mapped against the Random User Generator API payload.
 * Reference: https://randomuser.me/documentation#format
 *
 * Only the fields the application consumes are modelled. Everything is typed
 * explicitly so the codebase never falls back to `any`.
 */

export type Gender = 'male' | 'female';

/** Gender choices the UI exposes. `''` represents "no filter / all". */
export type GenderFilter = Gender | '';

export interface UserName {
  title: string;
  first: string;
  last: string;
}

export interface Coordinates {
  latitude: string;
  longitude: string;
}

export interface Timezone {
  offset: string;
  description: string;
}

export interface Street {
  number: number;
  name: string;
}

export interface Location {
  street: Street;
  city: string;
  state: string;
  country: string;
  postcode: string | number;
  coordinates: Coordinates;
  timezone: Timezone;
}

export interface Login {
  uuid: string;
  username: string;
}

export interface DateOfBirth {
  date: string;
  age: number;
}

export interface Picture {
  large: string;
  medium: string;
  thumbnail: string;
}

export interface User {
  gender: Gender;
  name: UserName;
  location: Location;
  email: string;
  login: Login;
  dob: DateOfBirth;
  phone: string;
  cell: string;
  picture: Picture;
  /** ISO 3166-1 alpha-2 country code, e.g. "US", "FR". */
  nat: string;
}

export interface ApiInfo {
  seed: string;
  results: number;
  page: number;
  version: string;
}

/** Shape of a successful `https://randomuser.me/api/` response. */
export interface UsersResponse {
  results: User[];
  info: ApiInfo;
}
