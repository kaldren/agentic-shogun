import { describe, expect, it } from "vitest";

import {
  allSlotsFilled,
  isArchitectureContent,
  placeCard,
  slotOf,
} from "./architecture";

describe("placeCard", () => {
  it("places a card from the bank into an empty slot", () => {
    expect(placeCard({}, "a", "s1")).toEqual({ s1: "a" });
  });

  it("moves a placed card to another empty slot", () => {
    expect(placeCard({ s1: "a" }, "a", "s2")).toEqual({ s2: "a" });
  });

  it("swaps two placed cards", () => {
    expect(placeCard({ s1: "a", s2: "b" }, "a", "s2")).toEqual({
      s1: "b",
      s2: "a",
    });
  });

  it("sends the occupant back to the bank when a bank card replaces it", () => {
    const next = placeCard({ s1: "a" }, "b", "s1");
    expect(next).toEqual({ s1: "b" });
    expect(slotOf(next, "a")).toBeNull();
  });

  it("moves a placed card back to the bank", () => {
    expect(placeCard({ s1: "a", s2: "b" }, "a", null)).toEqual({ s2: "b" });
  });

  it("keeps the same object when nothing changes", () => {
    const placements = { s1: "a" };
    expect(placeCard(placements, "a", "s1")).toBe(placements);
    expect(placeCard({}, "a", null)).toEqual({});
  });
});

describe("allSlotsFilled", () => {
  const slots = [
    { id: "s1", label: "One" },
    { id: "s2", label: "Two" },
  ];

  it("is true only when every slot has a card", () => {
    expect(allSlotsFilled(slots, { s1: "a" })).toBe(false);
    expect(allSlotsFilled(slots, { s1: "a", s2: "b" })).toBe(true);
  });
});

describe("isArchitectureContent", () => {
  const valid = {
    question: "Q",
    scenario: "S",
    slots: [
      { id: "s1", label: "One" },
      { id: "s2", label: "Two" },
    ],
    cards: [
      { id: "a", label: "A" },
      { id: "b", label: "B" },
      { id: "c", label: "C" },
    ],
    flows: [{ title: "Flow", stages: [["s1"], ["s2", "s1"]] }],
  };

  it("accepts valid content, with a slot shown twice", () => {
    expect(isArchitectureContent(valid)).toBe(true);
  });

  it("rejects a slot that is missing from the diagram", () => {
    expect(
      isArchitectureContent({
        ...valid,
        flows: [{ title: "F", stages: [["s1"]] }],
      }),
    ).toBe(false);
  });

  it("rejects unknown slots, duplicate ids and too few cards", () => {
    expect(
      isArchitectureContent({
        ...valid,
        flows: [{ title: "F", stages: [["x"]] }],
      }),
    ).toBe(false);
    expect(
      isArchitectureContent({
        ...valid,
        cards: [valid.cards[0], valid.cards[0]],
      }),
    ).toBe(false);
    expect(isArchitectureContent({ ...valid, cards: [valid.cards[0]] })).toBe(
      false,
    );
  });
});
