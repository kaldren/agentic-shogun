import { describe, expect, it } from "vitest";

import {
  canCheck,
  canConnect,
  freePosition,
  GRID,
  gradeConnections,
  isConnectionList,
  isSystemBuilderContent,
} from "./system-builder";

describe("canConnect", () => {
  const connections = [{ from: "a", to: "b" }];

  it("allows a new connection", () => {
    expect(canConnect(connections, "b", "c")).toBe(true);
  });

  it("allows the reverse direction", () => {
    expect(canConnect(connections, "b", "a")).toBe(true);
  });

  it("rejects self-connections", () => {
    expect(canConnect(connections, "c", "c")).toBe(false);
  });

  it("rejects duplicates", () => {
    expect(canConnect(connections, "a", "b")).toBe(false);
  });
});

describe("canCheck", () => {
  it("needs two nodes and one connection", () => {
    expect(canCheck(["a"], [])).toBe(false);
    expect(canCheck(["a", "b"], [])).toBe(false);
    expect(canCheck(["a", "b"], [{ from: "a", to: "b" }])).toBe(true);
  });
});

describe("gradeConnections", () => {
  it("sorts connections into correct, wrong and missing", () => {
    const solution = [
      { from: "a", to: "b" },
      { from: "b", to: "c" },
    ];
    const answer = [
      { from: "a", to: "b" },
      { from: "c", to: "b" },
    ];
    expect(gradeConnections(answer, solution)).toEqual({
      correct: [{ from: "a", to: "b" }],
      wrong: [{ from: "c", to: "b" }],
      missing: [{ from: "b", to: "c" }],
    });
  });
});

describe("freePosition", () => {
  it("starts at the origin", () => {
    expect(freePosition([])).toEqual({ x: 0, y: 0 });
  });

  it("skips taken cells and wraps to the next row", () => {
    const taken = [
      { x: 0, y: 0 },
      { x: GRID.width + 10, y: 5 },
      { x: GRID.width * 2, y: 0 },
    ];
    expect(freePosition(taken)).toEqual({ x: 0, y: GRID.height });
  });

  it("reuses a cell a node was moved away from", () => {
    expect(freePosition([{ x: 500, y: 400 }])).toEqual({ x: 0, y: 0 });
  });
});

describe("isSystemBuilderContent", () => {
  const valid = {
    question: "Q",
    scenario: "S",
    nodes: [
      { id: "a", label: "A", role: "Frontend" },
      { id: "b", label: "B", role: "API" },
    ],
  };

  it("accepts valid content", () => {
    expect(isSystemBuilderContent(valid)).toBe(true);
  });

  it("rejects duplicate node ids", () => {
    expect(
      isSystemBuilderContent({
        ...valid,
        nodes: [valid.nodes[0], valid.nodes[0]],
      }),
    ).toBe(false);
  });

  it("rejects nodes without a role", () => {
    expect(
      isSystemBuilderContent({
        ...valid,
        nodes: [valid.nodes[0], { id: "b", label: "B" }],
      }),
    ).toBe(false);
  });

  it("rejects a missing scenario", () => {
    expect(isSystemBuilderContent({ ...valid, scenario: undefined })).toBe(
      false,
    );
  });
});

describe("isConnectionList", () => {
  it("accepts from/to pairs", () => {
    expect(isConnectionList([{ from: "a", to: "b" }])).toBe(true);
    expect(isConnectionList([])).toBe(true);
  });

  it("rejects anything else", () => {
    expect(isConnectionList([["a", "b"]])).toBe(false);
    expect(isConnectionList(null)).toBe(false);
  });
});
