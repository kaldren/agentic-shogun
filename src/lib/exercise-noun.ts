// What the draggable cards of an exercise are called (spec 013), e.g.
// "service" in the Azure lessons and "part" in the LLM course. Exercises
// without one use "service".
export type Noun = { one: string; other: string };

export const DEFAULT_NOUN: Noun = { one: "service", other: "services" };

export function isNoun(value: unknown): value is Noun {
  if (typeof value !== "object" || value === null) return false;
  const { one, other } = value as Record<string, unknown>;
  return typeof one === "string" && typeof other === "string";
}

export function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1);
}
