// Architecture exercises (spec 007): cards are placed into the slots of a
// diagram. Shared by the server (parsing) and the lesson player (moves).

import { isNoun, type Noun } from "./exercise-noun";

export type ArchitectureItem = { id: string; label: string };

// A flow is a chain of stages shown top to bottom with arrows between them.
// A stage holds one or more slot ids side by side. A slot that already
// appeared earlier is shown as a reference, not as a second drop target.
export type ArchitectureFlow = { title: string; stages: string[][] };

export type ArchitectureContent = {
  question: string;
  scenario: string;
  slots: ArchitectureItem[];
  cards: ArchitectureItem[];
  flows: ArchitectureFlow[];
  // What the cards are called; "services" if missing.
  noun?: Noun;
};

// Slot id → card id.
export type Placements = Record<string, string>;

// Moves a card into a slot, or back to the bank when `slotId` is null.
// Dropping on a filled slot swaps the two cards; if the moved card came
// from the bank, the card that was there goes back to the bank.
export function placeCard(
  placements: Placements,
  cardId: string,
  slotId: string | null,
): Placements {
  const from = slotOf(placements, cardId);
  if (from === slotId) return placements;

  const next = { ...placements };
  if (from !== null) delete next[from];
  if (slotId === null) return next;

  const occupant = placements[slotId];
  next[slotId] = cardId;
  if (occupant !== undefined && from !== null) next[from] = occupant;
  return next;
}

// The slot that holds a card, or null if the card is in the bank.
export function slotOf(placements: Placements, cardId: string): string | null {
  for (const [slotId, placed] of Object.entries(placements)) {
    if (placed === cardId) return slotId;
  }
  return null;
}

export function allSlotsFilled(
  slots: ArchitectureItem[],
  placements: Placements,
): boolean {
  return slots.every(({ id }) => placements[id] !== undefined);
}

export function isArchitectureContent(
  content: unknown,
): content is ArchitectureContent {
  if (!isRecord(content)) return false;
  const { question, scenario, slots, cards, flows, noun } = content;
  if (
    (noun !== undefined && !isNoun(noun)) ||
    typeof question !== "string" ||
    typeof scenario !== "string" ||
    !isItemList(slots) ||
    !isItemList(cards) ||
    cards.length < slots.length ||
    !Array.isArray(flows)
  ) {
    return false;
  }

  const slotIds = new Set(slots.map(({ id }) => id));
  const shown = new Set<string>();
  const flowsValid = flows.every(
    (flow) =>
      isRecord(flow) &&
      typeof flow.title === "string" &&
      Array.isArray(flow.stages) &&
      flow.stages.every(
        (stage) =>
          Array.isArray(stage) &&
          stage.length > 0 &&
          stage.every((id) => {
            if (typeof id !== "string" || !slotIds.has(id)) return false;
            shown.add(id);
            return true;
          }),
      ),
  );
  // Every slot must appear in the diagram, or it could never be filled.
  return flowsValid && shown.size === slotIds.size;
}

function isItemList(value: unknown): value is ArchitectureItem[] {
  if (!Array.isArray(value) || value.length === 0) return false;
  const ids = new Set<unknown>();
  return value.every((item) => {
    if (!isRecord(item)) return false;
    const { id, label } = item;
    if (typeof id !== "string" || typeof label !== "string" || ids.has(id)) {
      return false;
    }
    ids.add(id);
    return true;
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
