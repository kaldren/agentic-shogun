import { describe, expect, it } from "vitest";

import {
  isOrderingContent,
  moveItem,
  sameOrder,
  shuffleAvoiding,
} from "./ordering";

describe("moveItem", () => {
  const order = ["a", "b", "c", "d"];

  it("moves an item down", () => {
    expect(moveItem(order, "a", 2)).toEqual(["b", "c", "a", "d"]);
  });

  it("moves an item up", () => {
    expect(moveItem(order, "d", 0)).toEqual(["d", "a", "b", "c"]);
  });

  it("keeps the order when the index doesn't change", () => {
    expect(moveItem(order, "b", 1)).toEqual(order);
  });

  it("clamps the index to the list", () => {
    expect(moveItem(order, "a", 9)).toEqual(["b", "c", "d", "a"]);
    expect(moveItem(order, "d", -1)).toEqual(["d", "a", "b", "c"]);
  });

  it("ignores unknown items", () => {
    expect(moveItem(order, "x", 0)).toEqual(order);
  });
});

describe("shuffleAvoiding", () => {
  it("keeps every item exactly once", () => {
    expect(shuffleAvoiding(["a", "b", "c"], null).toSorted()).toEqual([
      "a",
      "b",
      "c",
    ]);
  });

  it("never returns the order to avoid", () => {
    // A random function that never moves anything.
    const noop = () => 0.999;
    const ids = ["a", "b", "c"];
    expect(shuffleAvoiding(ids, ids, noop)).not.toEqual(ids);
  });

  it("can return the order to avoid only when nothing else exists", () => {
    expect(shuffleAvoiding(["a"], ["a"])).toEqual(["a"]);
  });
});

describe("sameOrder", () => {
  it("compares orders", () => {
    expect(sameOrder(["a", "b"], ["a", "b"])).toBe(true);
    expect(sameOrder(["a", "b"], ["b", "a"])).toBe(false);
    expect(sameOrder(["a"], ["a", "b"])).toBe(false);
  });
});

describe("isOrderingContent", () => {
  const items = [
    { id: "a", label: "A" },
    { id: "b", label: "B" },
    { id: "c", label: "C" },
  ];

  it("accepts a question with 3–7 items and an optional scenario", () => {
    expect(isOrderingContent({ question: "Q", items })).toBe(true);
    expect(isOrderingContent({ question: "Q", scenario: "S", items })).toBe(
      true,
    );
  });

  it("rejects too few or duplicate items", () => {
    expect(isOrderingContent({ question: "Q", items: items.slice(0, 2) })).toBe(
      false,
    );
    expect(
      isOrderingContent({ question: "Q", items: [...items, items[0]] }),
    ).toBe(false);
  });

  it("rejects malformed content", () => {
    expect(isOrderingContent(null)).toBe(false);
    expect(isOrderingContent({ question: 1, items })).toBe(false);
    expect(isOrderingContent({ question: "Q", scenario: 1, items })).toBe(
      false,
    );
  });
});
