import { describe, expect, it } from "vitest";

import { allItemsPlaced, isCategorizeContent, placeItem } from "./categorize";

describe("placeItem", () => {
  it("puts an item from the pool into a bucket", () => {
    expect(placeItem({}, "a", "b1")).toEqual({ a: "b1" });
  });

  it("moves an item to another bucket", () => {
    expect(placeItem({ a: "b1" }, "a", "b2")).toEqual({ a: "b2" });
  });

  it("sends an item back to the pool", () => {
    expect(placeItem({ a: "b1", c: "b2" }, "a", null)).toEqual({ c: "b2" });
  });

  it("returns the same object when nothing changes", () => {
    const placements = { a: "b1" };
    expect(placeItem(placements, "a", "b1")).toBe(placements);
    expect(placeItem(placements, "c", null)).toBe(placements);
  });
});

describe("allItemsPlaced", () => {
  const items = [
    { id: "a", label: "A" },
    { id: "c", label: "C" },
  ];

  it("is true only when every item is in a bucket", () => {
    expect(allItemsPlaced(items, { a: "b1" })).toBe(false);
    expect(allItemsPlaced(items, { a: "b1", c: "b1" })).toBe(true);
  });
});

describe("isCategorizeContent", () => {
  const buckets = [
    { id: "b1", label: "One" },
    { id: "b2", label: "Two" },
  ];
  const items = ["a", "b", "c", "d"].map((id) => ({ id, label: id }));

  it("accepts 2–3 buckets and 4–8 items", () => {
    expect(isCategorizeContent({ question: "Q", buckets, items })).toBe(true);
  });

  it("rejects too few buckets or items", () => {
    expect(
      isCategorizeContent({ question: "Q", buckets: buckets.slice(1), items }),
    ).toBe(false);
    expect(
      isCategorizeContent({ question: "Q", buckets, items: items.slice(1) }),
    ).toBe(false);
  });

  it("rejects duplicate ids and malformed content", () => {
    expect(
      isCategorizeContent({
        question: "Q",
        buckets,
        items: [...items, items[0]],
      }),
    ).toBe(false);
    expect(isCategorizeContent({ question: 1, buckets, items })).toBe(false);
    expect(isCategorizeContent(null)).toBe(false);
  });
});
