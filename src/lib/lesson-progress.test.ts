import { describe, expect, it } from "vitest";

import {
  answerProgress,
  freshProgress,
  resumeProgress,
} from "./lesson-progress";

describe("answerProgress", () => {
  const progress = { queue: ["a", "b", "c"], done: [] };

  it("marks a correct answer as done", () => {
    expect(answerProgress(progress, true)).toEqual({
      queue: ["b", "c"],
      done: ["a"],
    });
  });

  it("asks a wrong answer again at the end", () => {
    expect(answerProgress(progress, false)).toEqual({
      queue: ["b", "c", "a"],
      done: [],
    });
  });

  it("leaves an empty queue alone", () => {
    const finished = { queue: [], done: ["a"] };
    expect(answerProgress(finished, true)).toEqual(finished);
  });
});

describe("resumeProgress", () => {
  const ids = ["a", "b", "c", "d"];

  it("starts fresh without saved progress", () => {
    expect(resumeProgress(ids, null)).toEqual(freshProgress(ids));
  });

  it("continues where the learner left off, keeping retries in order", () => {
    expect(
      resumeProgress(ids, { queue: ["c", "d", "a"], done: ["b"] }),
    ).toEqual({ queue: ["c", "d", "a"], done: ["b"] });
  });

  it("drops removed exercises and adds new ones at the end", () => {
    expect(
      resumeProgress(["a", "c", "e"], { queue: ["c", "x"], done: ["a", "y"] }),
    ).toEqual({ queue: ["c", "e"], done: ["a"] });
  });

  it("ignores duplicates and ids that are both done and queued", () => {
    expect(
      resumeProgress(ids, { queue: ["b", "c", "c", "d"], done: ["a", "b"] }),
    ).toEqual({ queue: ["c", "d"], done: ["a", "b"] });
  });

  it("starts fresh when nothing would be left to do", () => {
    expect(resumeProgress(ids, { queue: [], done: ids })).toEqual(
      freshProgress(ids),
    );
  });
});
