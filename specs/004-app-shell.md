# 004: App shell and navigation

**Status:** Approved

## Goal

Give signed-in learners a simple, Duolingo-like way to move around the app: a "Learn" home and a "Profile" page, reachable with one tap on mobile and desktop.

## Requirements

- Signed-in pages (except lessons) share one app layout with two navigation items: "Learn" (`/learn`, book icon) and "Profile" (`/profile`, user icon).
- On mobile (below `lg`) the navigation is a fixed bottom bar with the two items, icon above label.
- From `lg` up the navigation is a left sidebar with the two items, icon next to label; the page content sits in a centered column (`max-w-2xl`).
- The active item is clearly marked (green icon and text plus `bg-green-50`), not by color alone.
- The site header (logo and account menu) stays at the top on these pages.
- `/profile` shows the user's avatar and name, their current role with a "Change role" button (goes to `/welcome`), and a "Sign out" button.
- Lesson pages (`/lesson/...`, built in spec 006) will not use this layout; the layout is set up so they can opt out.
- All UI follows `DESIGN.md` and works at 360px.

## Acceptance criteria

- [ ] On a 360px screen, `/learn` and `/profile` show a bottom bar with "Learn" and "Profile"; tapping each opens the page.
- [ ] On a 1280px screen, the same pages show a left sidebar instead of a bottom bar.
- [ ] The active item is highlighted and has `aria-current="page"`.
- [ ] The bottom bar never covers page content (the last element on the page can be scrolled into view).
- [ ] `/profile` shows avatar, name and current role; "Change role" opens `/welcome`; "Sign out" signs the user out and shows `/`.
- [ ] Navigation items are at least 44×44px and reachable with the keyboard, with a visible focus ring.
- [ ] No horizontal scroll at 360px, 768px or 1280px.
- [ ] `pnpm lint` and `pnpm typecheck` pass.

## Out of scope

- Content of the `/learn` page beyond the existing placeholder (spec 005).
- Stats on the profile page (completed lessons come with spec 006).
- More navigation items (leaderboards, shop, settings, notifications).
- Editing name or avatar, account deletion.

## Notes

- Depends on spec 003 (roles, `/welcome`, protected pages).
- Use a Next.js route group for the shared app layout; check `node_modules/next/dist/docs/` for layouts and route groups.
