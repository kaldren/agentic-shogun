# 001: Google sign-in with Supabase

**Status:** Done

## Goal

Let visitors sign in to Agentic Shogun with their Google (Gmail) account, so later features can save progress per user. Auth is handled by Supabase.

## Requirements

- A visitor can sign in with Google. Google is the only sign-in method.
- The sign-in button is visible in the site header on every page when the user is signed out.
- After a successful sign-in the user returns to the page they started from.
- When signed in, the header shows the user's name and Google avatar (or initials if there is no avatar) and a "Sign out" action.
- The session persists across page reloads and browser restarts until the user signs out or it expires.
- Sign-out ends the session and returns the user to the home page in a signed-out state.
- The signed-in user is available on the server (Server Components, Route Handlers, Server Actions), not only in the browser.
- If sign-in fails or is cancelled, the user lands back on the site with a short, friendly error message and can try again.
- Supabase URL and keys come from environment variables; nothing secret is committed. An `.env.example` lists the required variables.
- The README explains how to configure the Google provider in Supabase and Google Cloud for local and production URLs.

## Acceptance criteria

- [x] Clicking "Sign in with Google" in the header starts the Google consent screen.
- [x] After approving, the user is back on the page they started from and the header shows their name, avatar and "Sign out".
- [x] Reloading the page keeps the user signed in, with no flash of the signed-out header.
- [x] A Server Component can read the current user (verified on at least one page/component that renders server-side).
- [x] Clicking "Sign out" signs the user out and shows the signed-out header on the home page.
- [x] Cancelling the Google consent screen returns the user to the site with an error message, and signing in again works.
- [x] A new user appears in Supabase Auth → Users after first sign-in.
- [x] `.env.example` exists with the required variables, and no keys are committed.
- [x] The layout works on mobile and desktop widths.
- [x] `pnpm lint` and `pnpm typecheck` pass.

## Out of scope

- Other sign-in methods (email/password, magic link, GitHub, Apple, etc.).
- User profile page, editing profile data, account deletion.
- A custom `profiles` table or any app-specific user data in the database.
- Protecting pages or content behind sign-in (all pages stay public for now).
- Roles, admin access, payments/subscriptions.
- Native mobile apps.

## Notes

- Use the current, officially recommended Supabase packages for Next.js App Router with cookie-based SSR sessions (`@supabase/supabase-js` + `@supabase/ssr`). Check the Next.js 16 docs in `node_modules/next/dist/docs/` for middleware/proxy and cookie APIs before implementing.
- OAuth uses a callback route that exchanges the code for a session (PKCE flow).
- Use shadcn/ui components for the header button and user menu.
- Owner must create the Supabase project and the Google OAuth client and provide the env values before the end-to-end criteria can be checked.
