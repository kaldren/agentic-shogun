import { describe, expect, it } from "vitest";

import { capitalize, isNoun } from "./exercise-noun";

describe("isNoun", () => {
  it("accepts a singular and plural form", () => {
    expect(isNoun({ one: "part", other: "parts" })).toBe(true);
  });

  it("rejects anything else", () => {
    expect(isNoun("parts")).toBe(false);
    expect(isNoun({ one: "part" })).toBe(false);
    expect(isNoun(null)).toBe(false);
  });
});

describe("capitalize", () => {
  it("uppercases the first letter only", () => {
    expect(capitalize("services")).toBe("Services");
    expect(capitalize("")).toBe("");
  });
});
