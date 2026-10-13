# 009: Resume, replay and restart lessons

**Status:** Approved

## Goal

Let learners leave a lesson halfway and pick up where they left off, go over a finished lesson again, and start a lesson over whenever they want.

## Requirements

- Progress inside a lesson is saved for the signed-in user after each answered exercise: which exercises are done and which are still to do, in order (including ones asked again after a wrong answer).
- Opening a lesson that is in progress continues at the next exercise to do, with the progress bar at the saved position. The exercise itself starts empty; a half-built answer is not saved.
- On `/learn`, a lesson in progress shows "Continue" instead of "Start".
- A finished lesson can be opened from `/learn` and played again from the first exercise. Leaving a replay halfway saves its position like any other lesson.
- In the lesson player, a "Start over" button (next to the quit button) asks for confirmation in an in-app dialog, then clears the saved position and starts the lesson from the first exercise with an empty progress bar.
- When a lesson is finished, its saved position is cleared, so the next visit starts from the first exercise.
- Replaying or starting over never removes a lesson's completion and never locks lessons on the path.
- Saved progress is private: users can only read and change their own.
- If a lesson's exercises changed since the progress was saved, saved entries for exercises that no longer exist are ignored, and new exercises are still to do.
- All UI follows `DESIGN.md` and works at 360px.

## Acceptance criteria

- [ ] Answering two exercises of a lesson, quitting and opening it again continues at the third exercise with the progress bar at the same place.
- [ ] An exercise answered wrongly before quitting is still asked again later in the lesson after resuming.
- [ ] Saved progress survives a reload and a new sign-in on another browser.
- [ ] A lesson in progress shows "Continue" on `/learn`; a lesson not started shows "Start".
- [ ] A finished lesson opens from `/learn`, plays from the first exercise and can be completed again; it stays done on the path.
- [ ] "Start over" asks for confirmation; confirming restarts the lesson from the first exercise with an empty progress bar, and cancelling changes nothing.
- [ ] After finishing a lesson, opening it again starts from the first exercise.
- [ ] A user can't read or change another user's saved progress (checked with row-level security).
- [ ] Removing an exercise from a lesson in the database doesn't break resuming a lesson that had progress saved.
- [ ] Multiple-choice, architecture and system builder exercises all resume correctly.
- [ ] No horizontal scroll at 360px, 768px and 1280px.
- [ ] `pnpm lint` and `pnpm typecheck` pass.

## Out of scope

- Saving a half-built answer (selected option, placed cards, nodes or connections on a canvas).
- Resetting a whole course or all progress.
- A history of attempts, scores or answers per exercise.
- XP, streaks or any game rewards.
- Offline progress.

## Notes

- Depends on specs 005–008.
- The owner reported that reopening a finished lesson "opened but was wrong". Reproduce it first and fix it as part of this spec.
- Save progress on the server, in a table keyed by user and lesson with row-level security like `lesson_progress`. Only exercise ids and their order are stored, never solutions.
