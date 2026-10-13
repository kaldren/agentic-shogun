# Agentic Shogun Design System

This file is the single source of truth for how Agentic Shogun looks and feels. Every agent and every contributor follows it when building UI. If code and this file disagree, this file wins. Change the code, or change this file first with the owner's OK.

## 1. Principles

1. **Green and white.** White is the canvas and green is the brand. Everything else is a neutral or a feedback color.
2. **Light and friendly.** Use fresh, bright, light greens. Never use dark, muddy or "forest" greens for large areas. The app should feel playful and encouraging, like a learning game, not a corporate dashboard.
3. **Clear over clever.** Each screen has one obvious main action. Use big tap targets, short text and lots of white space.
4. **Accessible by default.** Text meets WCAG AA contrast. Everything works with a keyboard and at a 360px phone width.

## 2. Color

### 2.1 Brand green scale

Use these exact values. Hex is for reference; the CSS uses OKLCH.

| Token       | Hex       | OKLCH                      | Use                                               |
| ----------- | --------- | -------------------------- | ------------------------------------------------- |
| `green-50`  | `#F1FCE9` | `oklch(0.978 0.028 131.8)` | Tinted page sections, hover on white              |
| `green-100` | `#DFF7CD` | `oklch(0.948 0.061 131.8)` | Selected / accent backgrounds, badges             |
| `green-200` | `#C0EE9E` | `oklch(0.898 0.115 132.6)` | Borders on green surfaces, progress track         |
| `green-300` | `#97E065` | `oklch(0.832 0.173 134.3)` | Gradient start, illustrations                     |
| `green-400` | `#74D33A` | `oklch(0.779 0.205 136.2)` | Gradient middle, primary button top               |
| `green-500` | `#58CC02` | `oklch(0.748 0.229 137.6)` | **Brand green.** Primary buttons, progress, focus |
| `green-600` | `#48A802` | `oklch(0.648 0.198 137.5)` | Button "3D" edge, pressed state, gradient end     |
| `green-700` | `#3B8A08` | `oklch(0.561 0.169 137.6)` | Icons and large text (≥ 24px) on white            |
| `green-800` | `#306C0E` | `oklch(0.473 0.136 137.4)` | Green body text and links on white                |
| `green-950` | `#123308` | `oklch(0.286 0.079 139.4)` | Shadow tint for popovers and menus                |

Rules:

- Large surfaces use `white`, `green-50` or `green-100` only. Darker greens appear only in small amounts (buttons, icons, text).
- Text on bright green (`green-400`…`green-600`, `gradient-button`, `gradient-brand`) is **white**, bold (700 or more) and at least 16px. Regular-weight, small or long text never goes on bright green; put it on white instead.
- Green text on white must be `green-800` (body size) or `green-700` (≥ 24px or bold ≥ 19px).

### 2.2 Neutrals

Neutrals have a slight green tint so they sit well with the brand.

| Token          | Hex       | OKLCH                      | Use                       |
| -------------- | --------- | -------------------------- | ------------------------- |
| `white`        | `#FFFFFF` | `oklch(1 0 0)`             | Page and card background  |
| `surface-soft` | `#F7FBF3` | `oklch(0.983 0.011 128.6)` | Muted panels, input fill  |
| `border`       | `#E3EBDD` | `oklch(0.930 0.020 131.5)` | Borders, dividers, inputs |
| `ink-muted`    | `#5C6B57` | `oklch(0.509 0.036 137.9)` | Secondary text, captions  |
| `ink`          | `#1F2A1B` | `oklch(0.270 0.031 137.5)` | Main text and headings    |

Do not use pure black (`#000`) or cold grays.

### 2.3 Feedback and accent colors

Use them only for their meaning, never for decoration.

| Token         | Hex       | OKLCH                      | Meaning                                  |
| ------------- | --------- | -------------------------- | ---------------------------------------- |
| `success`     | `#58CC02` | `oklch(0.748 0.229 137.6)` | Correct answer (same as brand green)     |
| `danger`      | `#E5484D` | `oklch(0.626 0.193 23.0)`  | Wrong answer fill, destructive buttons   |
| `danger-text` | `#C62A2F` | `oklch(0.541 0.192 25.1)`  | Error text on white                      |
| `warning`     | `#FFC800` | `oklch(0.857 0.175 88.5)`  | Streaks, stars, highlights (dark text)   |
| `info`        | `#1CB0F6` | `oklch(0.718 0.151 237.1)` | Tips and hints (dark text or as an icon) |

### 2.4 Gradients

Gradients are always green to green. They flow from light (top/left) to the brand green (bottom/right). Never mix green with other hues in a gradient.

| Name              | CSS                                                                         | Use                                      |
| ----------------- | --------------------------------------------------------------------------- | ---------------------------------------- |
| `gradient-brand`  | `linear-gradient(135deg, #97E065 0%, #58CC02 60%, #48A802 100%)`            | Hero blocks, logo mark, large highlights |
| `gradient-button` | `linear-gradient(180deg, #74D33A 0%, #58CC02 100%)`                         | Primary button fill                      |
| `gradient-soft`   | `linear-gradient(180deg, #F1FCE9 0%, #FFFFFF 100%)`                         | Page and section backgrounds             |
| `gradient-glow`   | `radial-gradient(60% 60% at 50% 0%, #DFF7CD 0%, rgb(255 255 255 / 0) 100%)` | Soft glow behind hero titles and cards   |

Use at most one strong gradient (`gradient-brand` or `gradient-button`) per area of the screen, besides buttons.

### 2.5 Theme mapping (shadcn/ui variables)

`src/app/globals.css` maps the tokens to shadcn/ui variables like this. Components use the semantic classes (`bg-primary`, `text-muted-foreground`, …), never raw hex values.

```css
:root {
  --background: oklch(1 0 0); /* white */
  --foreground: oklch(0.27 0.031 137.5); /* ink */
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.27 0.031 137.5);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.27 0.031 137.5);
  --primary: oklch(0.748 0.229 137.6); /* green-500 */
  --primary-foreground: oklch(1 0 0); /* white */
  --secondary: oklch(0.978 0.028 131.8); /* green-50 */
  --secondary-foreground: oklch(0.473 0.136 137.4); /* green-800 */
  --muted: oklch(0.983 0.011 128.6); /* surface-soft */
  --muted-foreground: oklch(0.509 0.036 137.9); /* ink-muted */
  --accent: oklch(0.948 0.061 131.8); /* green-100 */
  --accent-foreground: oklch(0.473 0.136 137.4); /* green-800 */
  --destructive: oklch(0.541 0.192 25.1); /* danger-text */
  --border: oklch(0.93 0.02 131.5);
  --input: oklch(0.93 0.02 131.5);
  --ring: oklch(0.748 0.229 137.6); /* green-500 */
  --chart-1: oklch(0.748 0.229 137.6);
  --chart-2: oklch(0.473 0.136 137.4);
  --chart-3: oklch(0.832 0.173 134.3);
  --chart-4: oklch(0.718 0.151 237.1);
  --chart-5: oklch(0.857 0.175 88.5);
  --radius: 0.75rem;
}
```

Also add the brand scale as Tailwind colors (`--color-green-50` … `--color-green-950` in `@theme`), so classes like `bg-green-100` use our greens instead of the Tailwind defaults. Add the feedback colors the same way (`--color-success`, `--color-danger`, `--color-danger-text`, `--color-warning`, `--color-info`).

### 2.6 Dark mode

There is no dark mode for now. The app is light only. Don't add `dark:` styles or a theme switch until a spec asks for it.

## 3. Typography

### 3.1 Fonts

| Role               | Font           | Loaded with                                                         |
| ------------------ | -------------- | ------------------------------------------------------------------- |
| Everything (UI)    | **Nunito**     | `next/font/google`, variable weight, subsets `latin` and `cyrillic` |
| Code and terminals | **Geist Mono** | `next/font/google`, subset `latin`                                  |

Nunito is rounded and friendly, and it supports Cyrillic for a future Bulgarian version. Don't add other fonts.

### 3.2 Weights

- `400` regular: body text
- `600` semibold: labels, nav, secondary buttons
- `700` bold: headings, primary buttons
- `800` extra bold: hero and page titles only

### 3.3 Type scale

Mobile first. The second size applies from the `md` breakpoint up.

| Style    | Size (mobile → md)       | Weight | Line height | Tailwind                                     |
| -------- | ------------------------ | ------ | ----------- | -------------------------------------------- |
| Display  | 36px → 56px              | 800    | 1.1         | `text-4xl md:text-6xl font-extrabold`        |
| H1       | 30px → 40px              | 800    | 1.15        | `text-3xl md:text-[2.5rem] font-extrabold`   |
| H2       | 24px → 30px              | 700    | 1.2         | `text-2xl md:text-3xl font-bold`             |
| H3       | 20px → 24px              | 700    | 1.3         | `text-xl md:text-2xl font-bold`              |
| Body L   | 18px                     | 400    | 1.6         | `text-lg`                                    |
| Body     | 16px                     | 400    | 1.6         | `text-base`                                  |
| Small    | 14px                     | 400    | 1.5         | `text-sm`                                    |
| Label    | 14px                     | 600    | 1.4         | `text-sm font-semibold`                      |
| Overline | 12px, uppercase, +0.08em | 700    | 1.4         | `text-xs font-bold uppercase tracking-wider` |

Rules:

- Body text is never smaller than 16px on mobile. Long text is at most `max-w-prose` (about 65 characters per line).
- Headings use `text-foreground` (ink). Use green for headings only for one short highlighted word, never the whole heading.
- Use sentence case everywhere. Exception: primary buttons may use uppercase bold labels.

## 4. Layout and spacing

- Use the Tailwind 4px grid. Common steps: `2, 3, 4, 6, 8, 12, 16, 24`.
- Page container: `mx-auto w-full max-w-5xl px-4 md:px-6`. Reading and lesson pages: `max-w-2xl`.
- Space between page sections: `py-12 md:py-20`. Gap inside cards: `gap-4`. Card padding: `p-5 md:p-6`.
- Design for 360px wide first, then `md` (768px) and `lg` (1024px). No horizontal scroll at any width.
- Tap targets are at least 44×44px.

## 5. Shape and depth

- Radius: `--radius: 0.75rem` (12px). Buttons and inputs `rounded-xl`, cards `rounded-2xl`, avatars and pills `rounded-full`.
- Depth comes from a solid bottom edge, not soft blurry shadows. This is the "tactile button" look:
  - Primary button: `shadow-[0_4px_0_#48A802]` (green-600 edge).
  - Secondary button and interactive card: `border-2 border-border shadow-[0_4px_0_#E3EBDD]`.
  - On press (`active:`): move down by 4px and remove the edge: `active:translate-y-1 active:shadow-none`.
- Static cards: `border-2 border-border` with no shadow.
- Popovers and menus may use one soft shadow: `shadow-lg shadow-green-950/5`.

## 6. Components

Build on shadcn/ui components in `src/components/ui`. Adjust their variants to match this section, instead of styling each usage by hand.

### Buttons

| Variant       | Look                                                                      | When                              |
| ------------- | ------------------------------------------------------------------------- | --------------------------------- |
| `default`     | `gradient-button` fill, white bold text, green-600 bottom edge            | The one main action on the screen |
| `secondary`   | White fill, `border-2 border-border`, `green-800` text, light bottom edge | Other actions                     |
| `ghost`       | No fill, `green-800` text, `hover:bg-green-50`                            | Toolbar and menu actions          |
| `destructive` | `danger` fill, white bold text, darker red bottom edge                    | Delete, irreversible actions      |
| `link`        | `green-800` text, underline on hover                                      | Inline links                      |

- Sizes: default height 44px (`h-11 px-5`), large 52px (`h-13 px-6 text-base`) for hero and lesson "Continue" buttons.
- Only one `default` (green) button per view.
- Disabled: `opacity-50`, no bottom edge, no hover change.

### Cards

White, `rounded-2xl border-2 border-border`. Clickable cards get the bottom edge and `hover:border-green-200 hover:bg-green-50`. The selected state is `border-green-500 bg-green-50`.

### Inputs

`h-11 rounded-xl border-2 border-input bg-muted px-4`. On focus: `border-green-500 bg-white` with the focus ring. Errors: `border-danger` and an error message in `danger-text` below.

### Header

White background, `border-b-2 border-border`, height 64px. The logo is on the left. The account menu or "Sign in" button is on the right. It is not sticky on mobile lesson screens.

### Learning feedback (quizzes, drag and drop)

- Correct: a bottom panel in `green-100` with a `green-800` title like "Great job!" and a green "Continue" button.
- Wrong: a bottom panel in `#FFDFE0` with a `danger-text` title and a red "Got it" button.
- Progress bar: a `green-200` track with a `gradient-button` fill, `h-4 rounded-full`.

## 7. Icons and imagery

- Icons: `lucide-react` only. Size 20px in buttons and 24px standalone, stroke width 2 (2.5 for small icons on green).
- Icon color follows the text color. Use `green-700` for decorative icons on white.
- Illustrations are simple and flat, built from the green scale plus white, with an occasional `warning` or `info` accent.

## 8. Motion

- Default transition: `transition-all duration-150 ease-out`.
- Allowed: button press (translate-y), small scale on hover (`hover:scale-[1.02]` on cards), fade-in or slide-in panels (`tw-animate-css`), a celebration bounce on correct answers.
- Respect `prefers-reduced-motion`: use `motion-safe:` for anything that moves.

## 9. Accessibility checklist

- Text contrast ≥ 4.5:1 (≥ 3:1 for text ≥ 24px or bold ≥ 19px). The color rules above follow this, with one deliberate brand exception: white bold text on bright green (about 2.1:1). Keep that exception to short, bold labels such as buttons and badges.
- Visible focus on everything interactive: `focus-visible:ring-3 focus-visible:ring-ring/50`.
- Never use color alone for meaning. Correct and wrong states also get an icon (`Check` or `X`) and text.
- Images have `alt` text. Decorative images use `alt=""`.

## 10. Do and don't

| Do                                                       | Don't                                       |
| -------------------------------------------------------- | ------------------------------------------- |
| White pages with green accents and soft green sections   | Dark green or black backgrounds             |
| One bright green main button per view                    | Several green buttons competing             |
| Green-to-green gradients, light to brand                 | Rainbow or green-to-blue/purple gradients   |
| White bold, short labels on bright green                 | Small, regular or long text on bright green |
| Semantic classes (`bg-primary`, `text-muted-foreground`) | Hard-coded hex values in components         |
| Nunito for everything, Geist Mono for code               | Extra fonts, or Geist Sans for UI           |
