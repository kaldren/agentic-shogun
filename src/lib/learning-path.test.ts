import { describe, expect, it } from "vitest";

import { currentCourseId, lessonStates } from "./learning-path";

const lessons = ["a", "b", "c", "d"];

describe("lessonStates", () => {
  it("makes the first lesson current when nothing is completed", () => {
    expect([...lessonStates(lessons, new Set()).values()]).toEqual([
      "current",
      "locked",
      "locked",
      "locked",
    ]);
  });

  it("marks completed lessons done and the next one current", () => {
    expect([...lessonStates(lessons, new Set(["a", "b"])).values()]).toEqual([
      "done",
      "done",
      "current",
      "locked",
    ]);
  });

  it("has no current lesson when everything is completed", () => {
    expect([...lessonStates(lessons, new Set(lessons)).values()]).toEqual([
      "done",
      "done",
      "done",
      "done",
    ]);
  });

  it("ignores completions after the first gap", () => {
    expect([...lessonStates(lessons, new Set(["a", "c"])).values()]).toEqual([
      "done",
      "current",
      "locked",
      "locked",
    ]);
  });
});

describe("currentCourseId", () => {
  const courses = ["llm", "azure"];

  it("defaults to the first course of the role", () => {
    expect(currentCourseId(courses, null)).toBe("llm");
  });

  it("keeps the course the user picked", () => {
    expect(currentCourseId(courses, "azure")).toBe("azure");
  });

  it("ignores a picked course that isn't one of the role's courses", () => {
    expect(currentCourseId(courses, "other-role-course")).toBe("llm");
  });

  it("is null when the role has no course", () => {
    expect(currentCourseId([], "azure")).toBeNull();
  });
});
