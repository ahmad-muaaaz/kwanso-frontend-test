# Kwanso Front-End Coding Challenge: User Directory

A React + TypeScript application that lists users from the public
[Random User API](https://randomuser.me/api/), with pagination, a persistent
gender filter, debounced search, and a routed public profile page (including a
Google Map and nationality flag).

## Tech Stack

- React 19 + TypeScript: component model with strict, explicit typing (no `any`).
- Vite: fast dev server and build tooling.
- React Compiler: automatic memoization, so manual `useMemo`/`useCallback` are not needed.
- TanStack Query: server-state caching, loading/error states, and pagination.
- React Router: client-side routing for the listing and profile views.
- Tailwind CSS: utility-first styling with small, reusable components.
- lucide-react: icon set (no hand-written inline SVGs).

## Local Setup

- Why this section exists: the brief asks for step-by-step instructions to clone, install, and run the codebase locally.

Prerequisites:

- Node.js 18 or newer and npm.

Steps:

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd frontend-kwanso

# 2. Install dependencies
npm install

# 3. Start the dev server (http://localhost:5173)
npm run dev

# 4. Production build and local preview
npm run build
npm run preview

# 5. Lint
npm run lint
```

- No environment variables or API keys are required. The Google Map uses a keyless embed and the API is public.

## Project Structure

- Why this layout: separating data access, domain types, reusable UI, and route-level composition keeps components small and the direction of dependencies clear.

```
src/
  api/         randomuser.ts        Typed fetch client for the Random User API
  types/       user.ts              Domain types mapped to the API payload
               navigation.ts        Typed router-state contract for the profile route
  hooks/       useUsers.ts          TanStack Query hook for a page of users
               useListingParams.ts  URL query-string state (page, gender, search)
               useDebouncedValue.ts Generic debounce hook
               useProfileUser.ts    Resolves a user for the profile route
  components/  UserCard, UserGrid, Pagination, GenderFilter, SearchBar,
               ProfileCard, UserMap, Flag, GenderBadge, StateMessage, ...
  pages/       ListingPage.tsx      Listing view (grid + filter + search + pagination)
               ProfilePage.tsx      Profile view
               NotFoundPage.tsx     404 fallback
  lib/         constants.ts, user.ts, paths.ts, queryClient.ts
  App.tsx      Route definitions
  main.tsx     App bootstrap (Query + Router providers)
```

## Architectural Overview

- Why this section exists: the brief asks for developer notes on how components are structured and the thinking behind them.

Component design:

- Presentational components are "dumb" and fully controlled. `GenderFilter`, `SearchBar`, `Pagination`, and `UserCard` own no state and receive `value`/`onChange`-style props, so they are reusable and easy to test.
- Pages compose hooks and presentational components. `ListingPage` and `ProfilePage` hold the wiring; the building blocks stay generic.
- Shared display logic lives in pure helpers (`lib/user.ts`). Formatting a name, address, date, and the search predicate are side-effect-free functions, kept out of components.
- Feedback states are unified. One `StateMessage` component renders loading-error, empty, no-search-match, and not-found states for visual consistency.

State management:

- The URL is the single source of truth for listing state. `page`, `gender`, and `q` live in the query string via `useListingParams`, so the state is shareable, survives refresh and back/forward, and persists across navigation for free.
- Server state is owned by TanStack Query. `useUsers` caches each `(page, gender)` page, provides loading/error flags, and uses `keepPreviousData` so paging does not flash an empty grid.
- The profile page avoids a refetch. The selected user is passed via router state on navigation, with the Query cache as a fallback (see below).

## Features

### User Listing and Pagination

- What was asked: a listing component with pagination using the API.
- How it works: `useUsers(page, gender)` fetches a page; `UserGrid` renders a responsive grid of `UserCard`s; `Pagination` drives the `page` URL param.
- Why this pagination shape: the API generates pages on demand and never returns a total count, so there is no "last page". We render a sliding window of page numbers plus Prev/Next, which is the only pattern the API supports.

### Gender Filter (Persistent)

- What was asked: a gender filter whose selection persists when navigating away and back.
- How it works: `GenderFilter` writes `gender` to the URL; the filter is applied server-side by the API; selecting a filter resets the page to 1.
- Why it persists: because the value is stored in the URL, leaving for a profile page and returning restores it automatically, with no extra persistence layer.

### Search

- What was asked: search on the listing page, with the approach explained in this file (see the dedicated section below).

### Public Profile Page

- What was asked: navigate from any listing entry to that person's public profile.
- How it works: each card links to `/users/:uuid`; `ProfileCard` renders the mockup's tabbed card (About, Email, Birthday, Address, Phone, Username).
- Why it does not refetch: the user object is handed to the route via router state for an instant render; the Query cache is the fallback; a cold deep-link with neither shows a graceful "open from the directory" message.

### Bonus: Nationality Flag

- What was asked: show the nationality flag.
- How it works: the `Flag` component maps the `nat` country code to an image from flagcdn.com (no key, no bundled assets); it appears on each listing card and on the profile's Address tab.

### Bonus: Google Maps

- What was asked: add Google Maps on the profile page.
- How it works: `UserMap` embeds Google Maps via the keyless iframe URL (`output=embed`) on the Address tab.
- Why it maps the city, not the raw coordinates: randomuser.me generates `coordinates` randomly and unrelated to the city (they usually fall in open ocean and render as blank gray). The map therefore targets the user's named city/country, while the raw `latitude`/`longitude` from the payload are still displayed as text for completeness.

## Search and Filtering Approach

- Why this section exists: the brief specifically asks for the approach to search to be explained clearly.

Search:

- Search is client-side filtering of the currently loaded page. The Random User API has no name-search endpoint, so there is nothing to query server-side.
- The input is debounced (300 ms). The field stays instantly responsive while filtering and the URL update are deferred until typing pauses.
- The committed query is persisted to the URL (`q`), making the searched view shareable and resilient to refresh, consistent with the other listing state.
- Matching is a pure predicate over name, email, username, city, country, and nationality, defined in `lib/user.ts`, so it is trivial to read and reuse.
- Known trade-off: because pagination is server-side and search is client-side, search only sees the current page. This is surfaced honestly in the empty state ("Search runs over the current page").

Filtering:

- Gender filtering is server-side, applied by the API via the `gender` parameter, so it filters the entire dataset across pages rather than just the loaded page.
- Filter, search, and page are independent URL parameters, so they compose cleanly and all persist together.

## Performance and Re-render Strategy

- Why this section exists: the brief asks to be mindful of the number of re-renders.
- The React Compiler (`babel-plugin-react-compiler`, wired in `vite.config.ts`) handles memoization automatically. It memoizes components, derived values, and callbacks at build time, so manual `useMemo`/`useCallback`/`React.memo` are intentionally omitted rather than forgotten.
- The search input is debounced, so keystrokes do not trigger a filter pass or URL write on every character.
- `keepPreviousData` and a high `staleTime` avoid redundant fetches. Pages are fetched once and reused for the session, including by the profile page.

## Type Safety

- Why this section exists: the brief prohibits `any` and asks for proper types and API return types.
- The API payload is modelled explicitly in `types/user.ts` and the fetch client returns a typed `UsersResponse`.
- Router state is typed via `ProfileNavState`, so `location.state` is never read as `any`.
- The project type-checks cleanly (`tsc`) and lints cleanly (ESLint) with zero `any`.

## Notable API Constraints and Decisions

- No request seed is used. randomuser.me's `seed` parameter overrides the `gender` filter (a seeded request reproduces one fixed set and ignores `gender`). Since real gender filtering is required, the seed is omitted and pages are kept stable within a session via the Query cache.
- No total result count. The API does not report one, hence the Prev/Next sliding-window pagination instead of numbered jump-to-last.
- Random coordinates. The payload's `coordinates` are unrelated to the city, which is why the map targets the named city (see Bonus: Google Maps).

## Exercise Answers

- Why this section exists: the brief asks for answers to the exercise questions. The PDF's explicit exercise is to explain the search approach (covered above); the questions below answer the remaining implied prompts.

- How is search implemented, and why this way? Debounced, client-side filtering over the loaded page, persisted to the URL, because the API offers no search endpoint. See "Search and Filtering Approach".
- How do the filters persist across navigation? All listing state lives in the URL query string, so it survives navigation, refresh, and back/forward without any extra storage.
- How are unnecessary re-renders avoided? React Compiler memoizes automatically, the search input is debounced, and server pages are cached. See "Performance and Re-render Strategy".
- How is `any` avoided? Every API field and router-state shape is modelled with explicit interfaces; the build type-checks and lints clean.
- How does the profile page get its data without a single-user endpoint? Via router state on navigation, with the Query cache as fallback and a graceful message on a cold deep-link.
