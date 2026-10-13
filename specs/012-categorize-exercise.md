# 012: Categorize exercise

**Status:** Draft

## Goal

Let learners sort items into groups, e.g. "knowledge in the parameters" vs "knowledge in the context window", or "verifiable" vs "unverifiable" tasks. The LLM course (spec 013) uses it often to test that learners can tell related concepts apart.

## Requirements

- A new exercise type, "categorize", in the lesson player from spec 006. It has:
  - A question, e.g. "Sort each task into the right group."
  - 2–3 buckets, each with a short label.
  - 4–8 item chips (short text). Every item belongs to exactly one bucket.
  - A short explanation shown after "Check".
- The learner places each item into a bucket:
  - Mouse and touch: drag a chip into a bucket.
  - Tap or keyboard: select a chip, then select a bucket.
  - A placed chip can be moved to another bucket or back to the pool.
  - Screen readers announce each placement (e.g. "Placed in Background worker").
- "Check" is enabled once every item is placed.
- After "Check", the answer is correct only if every item is in its correct bucket. Then:
  - Correct: green panel, "Great job!", the explanation and "Continue".
  - Wrong: each chip is marked right (green with a check icon) or wrong (red with an X icon), and each wrong chip shows its correct bucket. Red panel with the explanation and "Got it". The exercise is asked again at the end of the lesson, with all chips back in the pool.
- The answer is checked on the server, so the correct buckets aren't sent to the browser before "Check".
- Sample content: one categorize exercise added as exercise 2 of the lesson "Build an order pipeline" (Software developers, from spec 008). It asks which work belongs in the order API (answer the customer right away) and which in the background worker:
  - Order API: check that the order is valid, put the order on the queue, reply with an order number
  - Background worker: save the order in the database, send the confirmation email
- The content is written in `content/sample-course-event-driven.md` and added to the seed data in the database.
- All UI follows `DESIGN.md` (§6 learning feedback, §8 motion) and works at 360px. On small screens the buckets stack vertically.

## Acceptance criteria

- [ ] The order pipeline lesson shows the categorize exercise after the system builder exercise, with all 5 chips in the pool and 2 empty buckets.
- [ ] Chips can be dragged into buckets, moved between buckets and back to the pool with a mouse and on a touch screen.
- [ ] The same works by tapping and with the keyboard only, and screen readers announce each placement.
- [ ] "Check" is disabled until every chip is placed.
- [ ] Correct buckets show the green panel with the explanation; the progress bar moves forward and the lesson can be completed.
- [ ] A wrong placement marks each chip right or wrong (icon and color), shows the correct bucket for wrong chips and the red panel, and the exercise comes back with all chips in the pool before the lesson ends.
- [ ] The correct buckets are not sent to the browser before the user presses "Check".
- [ ] Changing an item or bucket label in the database shows the new text after a reload.
- [ ] Exercises from specs 006–008 still work unchanged, and resuming a lesson (spec 009) works with the new type.
- [ ] Motion respects `prefers-reduced-motion`.
- [ ] No horizontal page scroll at 360px, 768px and 1280px.
- [ ] `pnpm lint` and `pnpm typecheck` pass.

## Out of scope

- Items that belong in more than one bucket, or buckets that must stay empty.
- More than 3 buckets, ranking inside a bucket, or partial credit.
- Hints, timers, XP or any game rewards.
- An editor for creating categorize exercises in the app.

## Notes

- Depends on specs 006, 008 and 009. Add the type to the existing `type` + JSON exercise model and the server-side `check_answer` function.
- The answer has the same shape as the architecture exercise (spec 007): every item maps to one bucket. Its server check can likely be reused.
- Reuse the drag-and-drop library and the tap-to-place pattern of the architecture board (`src/components/lesson/architecture-board.tsx`).
