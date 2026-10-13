# 011: Ordering exercise

**Status:** Draft

## Goal

Let learners show they understand a process by putting its steps in the right order. Pipelines, loops and life cycles come up all through the LLM course (spec 013), and they're hard to test with multiple choice.

## Requirements

- A new exercise type, "ordering", in the lesson player from spec 006. It has:
  - A question, e.g. "Put the steps in order, from first to last."
  - An optional short scenario (1–3 sentences).
  - 3–7 step cards, shown in a mixed order that is never already the correct one.
  - A short explanation shown after "Check".
- The learner reorders the cards in a vertical list:
  - Mouse and touch: drag a card to a new position.
  - Keyboard: move the focused card up or down with buttons on the card (and the arrow keys). Screen readers announce the new position (e.g. "Moved to position 2 of 5").
- "Check" is enabled once the learner has moved at least one card.
- After "Check", the answer is correct only if every card is in its correct position. Then:
  - Correct: green panel, "Great job!", the explanation and "Continue".
  - Wrong: each card shows whether it's in the right place (green with a check icon) or the wrong place (red with an X icon), and the correct order is shown. Red panel with the explanation and "Got it". The exercise is asked again at the end of the lesson, shuffled again.
- The answer is checked on the server, so the correct order isn't sent to the browser before "Check".
- Sample content: one ordering exercise added as exercise 2 of the lesson "Design a RAG app on Azure" (Software developers, from spec 007). It asks for the order of what happens when an employee asks a question:
  1. The employee sends a question from the web app
  2. The backend turns the question into an embedding
  3. AI Search finds the most relevant document chunks
  4. The backend sends the question and the chunks to the LLM
  5. The LLM writes an answer based on the chunks
- The content is written in `content/sample-course-developers.md` and added to the seed data in the database.
- All UI follows `DESIGN.md` (§6 learning feedback, §8 motion) and works at 360px.

## Acceptance criteria

- [ ] The RAG lesson shows the ordering exercise after the architecture exercise, with the 5 cards in a mixed order.
- [ ] Cards can be reordered by dragging with a mouse and on a touch screen.
- [ ] Cards can be reordered with the keyboard only, and screen readers announce each move.
- [ ] "Check" is disabled until a card has been moved.
- [ ] The correct order shows the green panel with the explanation; the progress bar moves forward and the lesson can be completed.
- [ ] A wrong order marks each card right or wrong (icon and color), shows the correct order and the red panel, and the exercise comes back reshuffled before the lesson ends.
- [ ] The correct order is not sent to the browser before the user presses "Check".
- [ ] Changing a step's text in the database shows the new text after a reload.
- [ ] Multiple-choice, architecture and system builder exercises from specs 006–008 still work unchanged, and resuming a lesson (spec 009) works with the new type.
- [ ] Motion respects `prefers-reduced-motion`.
- [ ] No horizontal page scroll at 360px, 768px and 1280px.
- [ ] `pnpm lint` and `pnpm typecheck` pass.

## Out of scope

- Partial credit or scoring per card.
- Several valid orders, nested steps or ordering in two dimensions.
- Hints, timers, XP or any game rewards.
- An editor for creating ordering exercises in the app.

## Notes

- Depends on specs 006, 007 and 009. Add the type to the existing `type` + JSON exercise model and the server-side `check_answer` function, as specs 007 and 008 did.
- Reuse the drag-and-drop library already used by the architecture board (`src/components/lesson/architecture-board.tsx`) instead of adding a new one.
- Store the cards in a fixed mixed order in `content`, as the architecture and system builder exercises do.
