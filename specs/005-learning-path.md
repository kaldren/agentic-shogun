# 005: Learning path

**Status:** Done

## Goal

Show each learner their role's course as a Duolingo-style path of lessons on `/learn`, so they always see where they are and what to do next.

## Requirements

- Courses, sections and lessons are stored in the Supabase database. A course belongs to one role; a course has ordered sections; a section has a title and ordered lessons; a lesson has an id and a title. Exercises are added in spec 006.
- Signed-in users can read course content. Nobody can change it from the app; content is only changed through migrations or seed data.
- The database schema and seed data live in the repo, so a fresh Supabase project can be set up with the same content.
- Sample content for testing: the course in `content/sample-course.md` (role Marketing, 1 section, 2 lessons) is added to the seed data. Other roles have no course yet.
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

- [x] A user with role Marketing sees the sample course from the database: one section with two lessons.
- [x] Changing a lesson title in the database (e.g. in the Supabase dashboard) shows the new title on `/learn` after a reload, without a deploy.
- [x] Applying the migrations and seed data to an empty Supabase project creates the tables and the sample courses.
- [x] A signed-in user can read content but can't insert, update or delete it (row-level security is on); a signed-out request can't read it.
- [x] With no progress, the first lesson is "current" and all others are "locked".
- [x] The path-state logic gives the correct states for a given set of completed ids (checked with at least one example where some lessons are done).
- [x] Clicking the current lesson goes to `/lesson/[id]`; locked lessons do nothing and are announced as locked to screen readers.
- [x] A user with any other role (e.g. Software developers) sees the "coming soon" message.
- [x] The path looks right and has no horizontal scroll at 360px, 768px and 1280px.
- [x] `pnpm lint` and `pnpm typecheck` pass.

## Out of scope

- The lesson page itself, exercises and saving progress (spec 006).
- XP, streaks, hearts, crowns, chests or any other game rewards.
- Section tests, skipping ahead, or unlocking lessons manually.
- An admin page or CMS for editing content in the app.

## Notes

- Depends on spec 003 (role) and spec 004 (app layout).
- The README currently says content lives in MDX/JSON files in the repo; update it to say content is stored in Supabase.
- Keep the role list from spec 003 in code; courses reference a role by its id.
