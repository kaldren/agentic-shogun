# 005: Learning path

**Status:** Draft

## Goal

Show each learner their role's course as a Duolingo-style path of lessons on `/learn`, so they always see where they are and what to do next.

## Requirements

- Courses are content files in the repo, one per role (e.g. `content/<role>/course.json`). A course has sections; a section has a title and ordered lessons; a lesson has an id, a title and its exercises (exercise format is defined in spec 006).
- The course format is typed and validated when loaded, so a broken content file fails clearly in development and CI.
- Sample content: a short course for at least two roles (Marketing and Software developers), 2 sections with 3–4 lessons each. Exercises can be placeholders until spec 006.
- `/learn` shows the course for the user's role:
  - At the top, a card with the current section's title and its progress (e.g. "1 / 4 lessons").
  - Below, each section with its title, followed by its lessons as round buttons laid out in a vertical zig-zag path.
- Each lesson has one of three states, shown by color, icon and label (never color alone):
  - **Done:** green with a check icon.
  - **Current:** green, slightly larger, with a "Start" bubble. It is the only main green action on the screen and links to `/lesson/[id]`.
  - **Locked:** grey with a lock icon, not clickable.
- The state comes from the set of completed lesson ids: the first not-completed lesson is current, lessons before it are done, the rest are locked. Until spec 006 stores progress, the set is empty.
- If the user's role has no course yet, `/learn` shows a friendly "Your course is coming soon" message with a link to change role.
- All UI follows `DESIGN.md` and works at 360px.

## Acceptance criteria

- [ ] A user with role Marketing sees the Marketing course; a user with role Software developers sees theirs.
- [ ] With no progress, the first lesson is "current" and all others are "locked".
- [ ] The path-state logic gives the correct states for a given set of completed ids (checked with at least one example where some lessons are done).
- [ ] Clicking the current lesson goes to `/lesson/[id]`; locked lessons do nothing and are announced as locked to screen readers.
- [ ] A role without a course shows the "coming soon" message.
- [ ] An invalid course file produces a clear error naming the file and the problem.
- [ ] The path looks right and has no horizontal scroll at 360px, 768px and 1280px.
- [ ] `pnpm lint` and `pnpm typecheck` pass.

## Out of scope

- The lesson page itself, exercises and saving progress (spec 006).
- XP, streaks, hearts, crowns, chests or any other game rewards.
- Section tests, skipping ahead, or unlocking lessons manually.
- An admin or CMS for editing content.

## Notes

- Depends on spec 003 (role) and spec 004 (app layout).
- Use `content/` as described in the README ("MDX/JSON files in the repo").
