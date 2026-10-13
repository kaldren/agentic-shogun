# 010: Multiple courses per role

**Status:** Draft

## Goal

Let one role have more than one course, so Software developers can take "Deep Dive into LLMs like ChatGPT" next to "AI apps on Azure" and pick which one they're learning.

## Requirements

- A role can have any number of courses, in a fixed order. Today a role can have only one.
- Each user has a current course. By default it's the first course of their role.
- `/learn` shows the current course exactly as it does today: header card, sections, lesson path and states.
- When the role has more than one course, `/learn` shows a course switcher at the top, with the course titles and the current one marked. Picking a course makes it current and shows its path. The choice is saved for the user, so it's the same after a reload or on another device.
- Progress is kept per lesson. Switching courses never loses or resets progress in any course.
- If the user changes role, their current course becomes the first course of the new role.
- Roles with one course look exactly as they do today, with no switcher. Roles with no course still show "Your course is coming soon".
- The existing "AI apps on Azure" course stays the Software developers course, with its sections and progress unchanged.
- All UI follows `DESIGN.md` and works at 360px.

## Acceptance criteria

- [ ] Applying the migrations to an empty Supabase project works, and existing courses, sections, lessons and progress are unchanged.
- [ ] With two courses for a role in the database, a user of that role sees the switcher on `/learn`, with the first course selected.
- [ ] Picking the other course shows its sections and lessons. After a reload, and on another browser, the same course is still selected.
- [ ] Lessons done in course A are still done after switching to course B and back.
- [ ] A role with one course shows no switcher. A role with no course shows the "coming soon" message.
- [ ] Changing role on `/profile` or `/welcome` shows the first course of the new role on `/learn`.
- [ ] A user can't read or change another user's current course (row-level security is on). They can't pick a course that belongs to a different role.
- [ ] The switcher works with the keyboard only, and its state is announced to screen readers.
- [ ] No horizontal scroll at 360px, 768px and 1280px.
- [ ] `pnpm lint` and `pnpm typecheck` pass.

## Out of scope

- The "Deep Dive into LLMs like ChatGPT" content itself (spec 013).
- Courses shared between roles, or taking courses from another role.
- A course catalog page, course descriptions, images or per-course progress stats.
- Unlocking rules between courses. Every course of the role can be picked at any time.

## Notes

- Today `courses.role` is `unique` (`supabase/migrations/20261013130000_courses.sql`). It needs a position per role instead.
- The current course can live on `profiles` (e.g. `current_course_id`, nullable, falling back to the first course).
- `getCourseForRole` in `src/lib/course.ts` is the main read path to change.
