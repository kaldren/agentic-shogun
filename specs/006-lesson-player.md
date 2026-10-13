# 006: Lesson player

**Status:** Draft

## Goal

Let learners take a short lesson one exercise at a time, with instant feedback like Duolingo, and save their progress so the next lesson unlocks.

## Requirements

- `/lesson/[id]` is a full-screen page without the app navigation or site header. At the top: an "X" button to leave and a progress bar showing how many exercises are done.
- The first exercise type is a multiple-choice quiz: a question, 2–4 answer options as selectable cards, and exactly one correct answer with a short explanation. Exercises are stored in the Supabase database with their lesson (ordered, read-only for users like the rest of the content from spec 005), and the sample lessons get real quiz content (3–5 exercises each) in the seed data.
- One exercise per screen. A "Check" button at the bottom is enabled once an option is selected.
- After "Check":
  - Correct: a green bottom panel with a check icon, "Great job!", the explanation and a "Continue" button.
  - Wrong: a red bottom panel with an X icon, the correct answer, the explanation and a "Got it" button. The exercise is asked again at the end of the lesson.
- The lesson ends when every exercise has been answered correctly. A "Lesson complete!" screen shows a short celebration and a "Continue" button back to `/learn`.
- Completing a lesson saves it for the user in the Supabase database. On `/learn`, the lesson then shows as done and the next one becomes current.
- Leaving with "X" asks for confirmation ("Quit? Your progress in this lesson will be lost.") and returns to `/learn` without saving.
- Opening a locked lesson or an unknown id sends the user to `/learn`. Done lessons can be repeated.
- `/profile` shows the number of completed lessons.
- All UI follows `DESIGN.md` §6 (learning feedback, progress bar, buttons) and works at 360px.

## Acceptance criteria

- [ ] Starting the current lesson from `/learn` opens `/lesson/[id]` with the "X" button, an empty progress bar and the first exercise.
- [ ] "Check" is disabled until an option is selected.
- [ ] A correct answer shows the green panel with icon, text and explanation; the progress bar moves forward.
- [ ] A wrong answer shows the red panel with the correct answer; that exercise appears again before the lesson ends.
- [ ] After the last correct answer, the "Lesson complete!" screen appears, and "Continue" returns to `/learn`, where the lesson is done and the next one is current.
- [ ] Progress survives reloads and signing out and in, and is the same on another device or browser.
- [ ] The exercises shown come from the database: changing a question there shows the new text after a reload.
- [ ] The correct answers are not sent to the browser before the user presses "Check".
- [ ] "X" asks for confirmation; confirming returns to `/learn` and the lesson is not marked done.
- [ ] Opening a locked lesson URL directly redirects to `/learn`.
- [ ] `/profile` shows the correct number of completed lessons.
- [ ] A user can't read or change another user's progress (row-level security is on).
- [ ] The whole lesson works with the keyboard only, and motion respects `prefers-reduced-motion`.
- [ ] No horizontal scroll at 360px, 768px and 1280px.
- [ ] `pnpm lint` and `pnpm typecheck` pass.

## Out of scope

- Other exercise types (drag and drop, use cases, free text). Each gets its own spec.
- XP, streaks, hearts, sounds and leaderboards.
- Saving progress in the middle of a lesson.
- Per-answer analytics.

## Notes

- Depends on specs 003, 004 and 005.
- Store completions in a `lesson_progress` table (user id, lesson id, completed at) with row-level security. Keep the SQL migration in the repo.
- The exercise model should make it easy to add new types later (e.g. a `type` column plus the type-specific data as JSON).
- Check answers on the server, so the correct option isn't visible in the page source.
