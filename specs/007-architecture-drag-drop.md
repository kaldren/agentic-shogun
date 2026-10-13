# 007: Architecture drag and drop

**Status:** Draft

## Goal

Let learners practise real system design with a use-case exercise: they read a short scenario and drag cloud services into the right places of an architecture diagram. The first use case is a RAG chat app on Azure, for the Software developers role.

## Requirements

- A new exercise type, "architecture", in the lesson player from spec 006. It has:
  - A short scenario (2–3 sentences), e.g. "Your company wants a chat app that answers employee questions using internal PDF documents…".
  - A diagram of labeled empty slots connected by arrows that show the data flow.
  - A bank of service cards: one correct card per slot plus 2–3 distractors.
  - A short explanation shown after "Check".
- The learner drags a card from the bank into a slot. A card can be moved to another slot or back to the bank; dropping it on a filled slot swaps the two cards. Each card can be used only once.
- Drag and drop also works without a mouse: on touch by tapping a card and then a slot, and with the keyboard (select a card, choose a slot, confirm).
- "Check" is enabled only when every slot is filled.
- After "Check", the answer is correct only if every slot holds its correct card. Each slot is marked correct (green, check icon) or wrong (red, X icon). The panels follow spec 006:
  - Correct: green panel, "Great job!", the explanation and "Continue".
  - Wrong: red panel, the explanation, the correct card for each wrong slot and "Got it". The exercise is asked again at the end of the lesson, starting empty.
- Sample content: a new course for the Software developers role ("AI apps on Azure", one section, one lesson "Design a RAG app on Azure") with one architecture exercise. Its slots and correct cards:
  - Web frontend → Azure Static Web Apps
  - Backend API → Azure Container Apps
  - Document storage → Azure Blob Storage
  - Document processing → Azure AI Document Intelligence
  - Vector and keyword search → Azure AI Search
  - LLM and embeddings → Azure OpenAI in Microsoft Foundry
  - Distractors: Azure IoT Hub, Azure Virtual Desktop, Azure Notification Hubs
- The content is written in `content/sample-course-developers.md` (like `content/sample-course.md`) and added to the seed data in the database.
- All UI follows `DESIGN.md` (§6 learning feedback, §8 motion) and works at 360px. The diagram stacks vertically on small screens.

## Acceptance criteria

- [ ] A user with role Software developers sees the new course on `/learn`, and its lesson opens the architecture exercise with the scenario, the empty diagram and all 9 cards.
- [ ] A card can be dragged into a slot, moved to another slot, swapped with a card in a filled slot and dragged back to the bank.
- [ ] The same can be done by tapping on a touch screen and with the keyboard only; screen readers announce where a card was placed.
- [ ] "Check" is disabled until all 6 slots are filled.
- [ ] All cards in the right slots shows the green panel with the explanation; the progress bar moves forward and the lesson can be completed.
- [ ] At least one wrong card shows the red panel, marks each slot correct or wrong (icon and color), shows the correct card for the wrong slots, and the exercise comes back empty before the lesson ends.
- [ ] The correct slot for each card is not sent to the browser before the user presses "Check" (checked on the server).
- [ ] Changing a card name or the scenario in the database shows the new text after a reload.
- [ ] Multiple-choice lessons from spec 006 still work unchanged.
- [ ] Motion respects `prefers-reduced-motion`.
- [ ] No horizontal scroll at 360px, 768px and 1280px.
- [ ] `pnpm lint` and `pnpm typecheck` pass.

## Out of scope

- Drawing or editing arrows, adding or removing slots, free-form diagrams.
- Partial credit or scoring per slot (an answer is fully right or wrong).
- More than one correct card per slot or several valid architectures.
- Other cloud providers and other use cases (only the RAG on Azure sample now).
- Hints, timers, XP or any game rewards.
- An editor for creating architecture exercises in the app.

## Notes

- Depends on specs 005 and 006. Uses the `type` + JSON data exercise model from spec 006; add the new type there instead of a new table.
- Pick an actively maintained, accessible drag-and-drop library (e.g. dnd-kit) in its current stable version, per `AGENTS.md`.
- Store the card order shuffled or in a fixed non-answer order so the bank doesn't give the answer away.
- Service names follow current Microsoft naming (e.g. Microsoft Foundry, Azure AI Search); double-check them when writing the seed content.
