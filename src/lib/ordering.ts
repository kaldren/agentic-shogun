// Ordering exercises (spec 011): learners put steps in the right order.
// Shared by the server (parsing) and the lesson player (moves).

export type OrderingItem = { id: string; label: string };

export type OrderingContent = {
  question: string;
  // Optional context shown above the steps.
  scenario?: string;
  // The steps, in a fixed mixed order that is never the correct one.
  items: OrderingItem[];
};

// Moves an item to a new index; the other items keep their order.
export function moveItem(
  order: readonly string[],
  id: string,
  toIndex: number,
): string[] {
  const from = order.indexOf(id);
  const to = Math.max(0, Math.min(toIndex, order.length - 1));
  if (from === -1 || from === to) return [...order];

  const next = order.filter((other) => other !== id);
  next.splice(to, 0, id);
  return next;
}

// A random order that differs from `avoid` (e.g. the correct order, once it
// is known), when the items allow it. `random` returns a number in [0, 1).
export function shuffleAvoiding(
  ids: readonly string[],
  avoid: readonly string[] | null,
  random: () => number = Math.random,
): string[] {
  const shuffled = [...ids];
  for (let attempt = 0; attempt < 10; attempt++) {
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    if (!avoid || !sameOrder(shuffled, avoid)) return shuffled;
  }
  // Unlucky or a single item: rotating by one always changes the order of
  // two or more items.
  return [...shuffled.slice(1), shuffled[0]];
}

export function sameOrder(a: readonly string[], b: readonly string[]) {
  return a.length === b.length && a.every((id, i) => id === b[i]);
}

export function isOrderingContent(
  content: unknown,
): content is OrderingContent {
  if (!isRecord(content)) return false;
  const { question, scenario, items } = content;
  if (typeof question !== "string") return false;
  if (scenario !== undefined && typeof scenario !== "string") return false;
  if (!Array.isArray(items) || items.length < 3 || items.length > 7) {
    return false;
  }

  const ids = new Set<unknown>();
  return items.every((item) => {
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
