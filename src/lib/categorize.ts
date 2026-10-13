// Categorize exercises (spec 012): learners sort items into buckets.
// Shared by the server (parsing) and the lesson player (moves).

export type CategorizeItem = { id: string; label: string };

export type CategorizeContent = {
  question: string;
  // 2–3 groups to sort into.
  buckets: CategorizeItem[];
  // 4–8 items, in a fixed mixed order. Each belongs to exactly one bucket.
  items: CategorizeItem[];
};

// Item id → bucket id. Items that aren't in it are still in the pool.
export type BucketPlacements = Record<string, string>;

// Puts an item into a bucket, or back into the pool when `bucketId` is null.
export function placeItem(
  placements: BucketPlacements,
  itemId: string,
  bucketId: string | null,
): BucketPlacements {
  if ((placements[itemId] ?? null) === bucketId) return placements;
  const next = { ...placements };
  if (bucketId === null) delete next[itemId];
  else next[itemId] = bucketId;
  return next;
}

export function allItemsPlaced(
  items: CategorizeItem[],
  placements: BucketPlacements,
): boolean {
  return items.every(({ id }) => placements[id] !== undefined);
}

export function isCategorizeContent(
  content: unknown,
): content is CategorizeContent {
  if (!isRecord(content)) return false;
  const { question, buckets, items } = content;
  return (
    typeof question === "string" &&
    isItemList(buckets, 2, 3) &&
    isItemList(items, 4, 8)
  );
}

function isItemList(
  value: unknown,
  min: number,
  max: number,
): value is CategorizeItem[] {
  if (!Array.isArray(value) || value.length < min || value.length > max) {
    return false;
  }
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
