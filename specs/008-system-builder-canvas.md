# 008: System builder canvas

**Status:** Approved

## Goal

Let learners build a system themselves, like in n8n: they read a use case, drag the services they need onto a canvas and wire them together. The first use case is an event-driven order pipeline on Azure, for the Software developers role.

## Requirements

- A new exercise type, "system builder", in the lesson player from spec 006. It has:
  - A short scenario (2–3 sentences), e.g. "Your online shop must accept orders even when traffic spikes…".
  - A palette of service nodes: the correct nodes plus 2–3 distractors. Each node has a name and a short role label (e.g. "Order queue").
  - An empty canvas.
  - A short explanation shown after "Check".
- The learner drags a node from the palette onto the canvas, where it can be moved freely. A node can be on the canvas only once and can be removed back to the palette (its connections are removed too).
- Each node on the canvas has an input port and an output port. The learner draws a connection by dragging from one node's output to another node's input. Connections are directed arrows. A connection can be deleted. A node can't connect to itself and the same connection can't be drawn twice.
- It also works without a mouse:
  - Touch: tap a palette node to add it; tap a node's output and then another node's input to connect.
  - Keyboard: add a node from the palette, select a node, choose "Connect to…" and pick the target node, delete a selected node or connection.
- "Check" is enabled when at least two nodes are on the canvas and at least one connection exists.
- After "Check", the answer is correct only if the canvas holds exactly the correct nodes and exactly the correct connections (direction matters, node positions don't). Then:
  - Correct: green panel, "Great job!", the explanation and "Continue".
  - Wrong: wrong connections and distractor nodes are marked red with an X icon, correct ones green with a check icon, missing connections are shown as dashed arrows. Red panel with the explanation and "Got it". The exercise is asked again at the end of the lesson, starting with an empty canvas.
- The canvas fits its frame on load and can be panned and zoomed inside the frame; the page itself never scrolls horizontally.
- Sample content: a new section 2 "Event-driven systems" in the Software developers course ("AI apps on Azure", from spec 007), with one lesson "Build an order pipeline" and one system builder exercise. The course allows one course per role, so this is a section, not a new course:
  - Nodes: Azure Static Web Apps (Shop frontend), Azure Container Apps (Order API), Azure Service Bus (Order queue), Azure Functions (Order processor), Azure Cosmos DB (Orders database), Azure Communication Services (Confirmation email)
  - Connections: Static Web Apps → Container Apps, Container Apps → Service Bus, Service Bus → Functions, Functions → Cosmos DB, Functions → Communication Services
  - Distractors: Azure Virtual Desktop, Azure IoT Hub, Microsoft Sentinel
- The content is written in `content/sample-course-event-driven.md` (like `content/sample-course-developers.md`) and added to the seed data in the database.
- All UI follows `DESIGN.md` (§6 learning feedback, §8 motion) and works at 360px. On small screens the palette sits above the canvas.

## Acceptance criteria

- [ ] A user with role Software developers sees the new section on `/learn`; after the RAG lesson, its lesson opens the system builder with the scenario, an empty canvas and all 9 palette nodes.
- [ ] A node can be dragged onto the canvas, moved, and removed back to the palette (its connections go with it); a node can't be added twice.
- [ ] Connections can be drawn from an output to an input and deleted; self-connections and duplicates are not possible.
- [ ] The same can be done by tapping on a touch screen and with the keyboard only; screen readers announce added nodes and connections.
- [ ] "Check" is disabled until at least two nodes and one connection are on the canvas.
- [ ] The correct nodes and connections show the green panel with the explanation; the progress bar moves forward and the lesson can be completed.
- [ ] A distractor node, a wrong connection, a reversed connection or a missing connection shows the red panel, marks nodes and connections correct or wrong (icon and color), shows missing connections dashed, and the exercise comes back with an empty canvas before the lesson ends.
- [ ] The correct nodes and connections are not sent to the browser before the user presses "Check" (checked on the server).
- [ ] Changing a node name or the scenario in the database shows the new text after a reload.
- [ ] Multiple-choice and architecture lessons from specs 006 and 007 still work unchanged.
- [ ] Motion respects `prefers-reduced-motion`.
- [ ] No horizontal page scroll at 360px, 768px and 1280px.
- [ ] `pnpm lint` and `pnpm typecheck` pass.

## Out of scope

- Configuring nodes (settings, parameters) or running/simulating the built system.
- More than one input or output port per node, typed ports, or labels on connections.
- Several valid answers, partial credit or scoring per node or connection.
- Hints, timers, XP or any game rewards.
- Saving an unfinished canvas between visits, undo/redo.
- Other cloud providers and other use cases (only the order pipeline sample now).
- An editor for creating system builder exercises in the app.

## Notes

- Depends on specs 006 and 007. Uses the `type` + JSON data exercise model; add the new type there instead of a new table, and reuse the server-side check pattern from spec 007.
- Pick an actively maintained, accessible node-graph library (e.g. React Flow, `@xyflow/react`) in its current stable version, per `AGENTS.md`. Check that it can coexist with or replace dnd-kit for the palette drag.
- Store the palette in a fixed non-answer order so it doesn't give the answer away.
- Service names follow current Microsoft naming; double-check them when writing the seed content.
