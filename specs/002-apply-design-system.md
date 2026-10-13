# 002: Apply the design system

**Status:** Done

## Goal

Bring the existing app in line with `DESIGN.md`, so the green-and-white look, fonts and base components are in place before we build learning features on top of them.

## Requirements

- The theme colors in `src/app/globals.css` match `DESIGN.md` §2.5: the shadcn/ui variables, the brand green scale (`green-50` … `green-950`) and the feedback colors (`success`, `danger`, `danger-text`, `warning`, `info`) are available as Tailwind classes.
- The four gradients from `DESIGN.md` §2.4 are available as reusable utilities (e.g. `bg-gradient-brand`).
- Nunito (latin and cyrillic) is the font for the whole UI, and Geist Mono is the font for code. Geist Sans is removed.
- The base radius is `0.75rem`.
- The app is light only: the unused dark theme variables are removed.
- The `Button` component has the variants and sizes from `DESIGN.md` §6 (default, secondary, ghost, destructive, link), including the white bold text on the green gradient, the solid bottom edge and the press effect.
- The existing UI follows `DESIGN.md`: the site header (§6 Header), the account menu and avatar, the auth error banner, and the home page (white page with the soft green background gradient).

## Acceptance criteria

- [x] The "Sign in with Google" button has the green gradient, white bold text, a green-600 bottom edge, and moves down when pressed.
- [x] Classes such as `bg-green-100`, `text-green-800`, `bg-danger` and `bg-gradient-brand` work and produce the colors from `DESIGN.md`.
- [x] All text renders in Nunito, including Cyrillic text, and code renders in Geist Mono.
- [x] The header is white, 64px high, with a 2px bottom border, and shows the logo on the left and the sign-in button or account menu on the right.
- [x] The home page has the soft green-to-white background and uses the type scale from `DESIGN.md` §3.3.
- [x] Each `Button` variant is used or rendered once and matches its description in `DESIGN.md` §6.
- [x] Focus rings are visible and green on all interactive elements.
- [x] No hard-coded hex colors in components; they use theme classes.
- [x] The app looks right at 360px, 768px and 1280px widths, with no horizontal scroll.
- [x] The OS dark mode setting doesn't change the app's look.
- [x] `pnpm lint` and `pnpm typecheck` pass.

## Out of scope

- New components (cards, inputs, progress bar, quiz feedback panels). They follow `DESIGN.md` when a feature spec needs them.
- Dark mode or a theme switch.
- A logo, illustrations or icons beyond what already exists.
- New pages or landing page content.

## Notes

- Use Tailwind CSS 4 conventions (`@theme`, `@utility`) for tokens and gradients, and keep shadcn/ui variable names so future `shadcn add` components pick up the theme.
- Check the `next/font` docs in `node_modules/next/dist/docs/` before changing fonts.
