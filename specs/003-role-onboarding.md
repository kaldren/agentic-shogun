# 003: Role onboarding

**Status:** Done

## Goal

Let each learner pick their role (profession) after signing in, so we can show them an AI course built around their world, like picking a language in Duolingo. Learning requires sign-in from now on.

## Requirements

- The home page (`/`) is a simple landing page for signed-out visitors: title, one short sentence, a preview of the available roles, and one main "Get started" button that starts Google sign-in.
- Signed-in users who open `/` go straight to `/learn` (or to `/welcome` if they have no role yet).
- Every page except `/` and the auth routes requires sign-in. Signed-out visitors are sent to `/` and, after signing in, return to the page they asked for.
- `/welcome` asks "What do you do?" and shows the roles as clickable cards (icon, name, one-sentence description). The user selects one card and confirms with a "Continue" button.
- Roles for the MVP: Marketing, Software developers, Teachers, Entrepreneurs, Students. The list lives in one place in the code so it is easy to change.
- The chosen role is saved per user in Supabase and survives sign-out and sign-in.
- After a new user signs in for the first time, they land on `/welcome`. Users who already have a role skip it.
- A user can open `/welcome` again later to change their role; the current role is preselected.
- `/learn` exists as a placeholder page that shows the user's role (the real page comes in later specs).
- All UI follows `DESIGN.md` (cards, selected state, one green button per view) and works at 360px.

## Acceptance criteria

- [x] A signed-out visitor on `/` sees the landing page with the role preview and a "Get started" button that opens the Google consent screen.
- [x] A new user lands on `/welcome` after their first sign-in.
- [x] Selecting a role card highlights it (`border-green-500 bg-green-50` plus a check icon), and "Continue" is disabled until a role is selected.
- [x] After "Continue", the user is on `/learn` and sees their role.
- [x] Signing out and in again takes the user to `/learn`, not `/welcome`, with the same role.
- [x] Opening `/welcome` again shows the current role selected, and choosing another role updates it.
- [x] A signed-out visitor opening `/learn` or `/welcome` is sent to `/`, and after sign-in ends up on the page they asked for.
- [x] A signed-in user opening `/` is redirected to `/learn` (or `/welcome` without a role).
- [x] A user can't read or change another user's role (row-level security is on).
- [x] The role cards are keyboard accessible and the layout works at 360px, 768px and 1280px.
- [x] `pnpm lint` and `pnpm typecheck` pass.

## Out of scope

- Courses, lessons and progress (specs 005 and 006).
- App navigation (bottom bar, sidebar) and the profile page (spec 004).
- Skill level selection or placement tests.
- Bulgarian translation of the UI.
- More than one role per user.

## Notes

- This changes spec 001's "all pages stay public": pages behind sign-in are now a deliberate part of this spec.
- Store the role in a `profiles` table (one row per auth user) with row-level security. Keep the SQL migration in the repo.
- Protect routes in `src/proxy.ts` / on the server; check the Next.js 16 docs in `node_modules/next/dist/docs/` first.
