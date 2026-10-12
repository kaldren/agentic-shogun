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
