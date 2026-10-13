# Agentic Shogun

**Website:** [AgenticShogun.com](https://AgenticShogun.com)

## What it is

Agentic Shogun is a new platform where people can learn about agentic AI.

## How people learn

The platform teaches through different types of learning, such as:

- Quizzes
- Use cases
- Drag and drop
- More to come

## Tech stack (MVP)

A responsive web app (works on desktop and mobile), built by one developer with AI agents.

| Layer                   | Choice                                |
| ----------------------- | ------------------------------------- |
| Language                | TypeScript                            |
| Framework               | Next.js (App Router)                  |
| UI                      | Tailwind CSS + shadcn/ui              |
| Drag and drop           | dnd-kit                               |
| Hosting                 | Vercel                                |
| Database, auth, storage | Supabase                              |
| Content                 | MDX/JSON files in the repo (to start) |
| Payments (later)        | Stripe                                |
| Email                   | Resend                                |
| Analytics               | PostHog                               |
| Errors                  | Sentry                                |
| Code + CI               | GitHub                                |

Native mobile apps (Expo) can come later, reusing the same Supabase backend.

## Status

Early development. This is the starting point for the MVP. Features are specified in `specs/` before implementation.

## Local setup

1. Install dependencies: `pnpm install`
2. Copy `.env.example` to `.env.local` and fill in the Supabase values (see below).
3. Start the dev server: `pnpm dev`

## Authentication (Google + Supabase)

Users sign in with Google through Supabase Auth.

### 1. Supabase keys

In the Supabase dashboard, open **Project Settings → API Keys** and copy these values into `.env.local`:

- `NEXT_PUBLIC_SUPABASE_URL`: the project URL
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: the publishable key (`sb_publishable_...`)

Set the same variables in Vercel for Production and Preview.

### 2. Google OAuth client

1. In Google Cloud Console, open **Google Auth Platform**. Configure the consent screen (app name, support email, scopes `openid`, `email` and `profile`).
2. Go to **Clients → Create client**, choose **Web application**, and add these settings:
   - **Authorized JavaScript origins:** `http://localhost:3000` and `https://agenticshogun.com`
   - **Authorized redirect URIs:** `https://<project-ref>.supabase.co/auth/v1/callback`. Copy the exact value from Supabase → **Authentication → Sign In / Providers → Google**.
3. Copy the client ID and client secret.

### 3. Enable Google in Supabase

1. In **Authentication → Sign In / Providers → Google**, enable the provider and paste the client ID and secret.
2. In **Authentication → URL Configuration**:
   - **Site URL:** `https://agenticshogun.com`
   - **Redirect URLs:** `http://localhost:3000/auth/callback` and `https://agenticshogun.com/auth/callback`. For Vercel previews, also add `https://*-<team>.vercel.app/auth/callback`.

### How it works

- `src/proxy.ts` refreshes the session cookie on every request.
- The "Sign in with Google" button starts the OAuth flow (PKCE). Google returns to `/auth/callback`, which exchanges the code for a session and redirects back to the original page.
- On the server, use `getCurrentUser()` from `@/lib/auth` to read the signed-in user.
