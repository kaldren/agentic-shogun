// System builder exercises (spec 008): learners add service nodes to a canvas
// and connect them. Shared by the server (parsing) and the lesson player.

export type SystemNode = { id: string; label: string; role: string };

export type SystemBuilderContent = {
  question: string;
  scenario: string;
  // The palette, in a fixed order that doesn't give the answer away.
  nodes: SystemNode[];
};

// A directed connection from one node's output to another node's input.
export type Connection = { from: string; to: string };

export type Position = { x: number; y: number };

export function connectionKey({ from, to }: Connection): string {
  return `${from}->${to}`;
}

// A node can't connect to itself, and the same connection can't be drawn
// twice. The reverse direction is a different connection.
export function canConnect(
  connections: Connection[],
  from: string,
  to: string,
): boolean {
  return (
    from !== to && !connections.some((c) => c.from === from && c.to === to)
  );
}

export function canCheck(nodeIds: string[], connections: Connection[]) {
  return nodeIds.length >= 2 && connections.length >= 1;
}

export type ConnectionGrades = {
  correct: Connection[];
  wrong: Connection[];
  missing: Connection[];
};

// Sorts the learner's connections into correct and wrong, and lists the
// correct ones they didn't draw.
export function gradeConnections(
  answer: Connection[],
  solution: Connection[],
): ConnectionGrades {
  const solutionKeys = new Set(solution.map(connectionKey));
  const answerKeys = new Set(answer.map(connectionKey));
  return {
    correct: answer.filter((c) => solutionKeys.has(connectionKey(c))),
    wrong: answer.filter((c) => !solutionKeys.has(connectionKey(c))),
    missing: solution.filter((c) => !answerKeys.has(connectionKey(c))),
  };
}

// Where a node added without dragging (tap, keyboard) goes: the first cell
// of a 3-column grid that no node is close to.
export const GRID = { columns: 3, width: 260, height: 140 };

export function freePosition(taken: Position[]): Position {
  for (let cell = 0; ; cell++) {
    const position = {
      x: (cell % GRID.columns) * GRID.width,
      y: Math.floor(cell / GRID.columns) * GRID.height,
    };
    const free = taken.every(
      (p) =>
        Math.abs(p.x - position.x) >= GRID.width / 2 ||
        Math.abs(p.y - position.y) >= GRID.height / 2,
    );
    if (free) return position;
  }
}

export function isSystemBuilderContent(
  content: unknown,
): content is SystemBuilderContent {
  if (!isRecord(content)) return false;
  const { question, scenario, nodes } = content;
  if (
    typeof question !== "string" ||
    typeof scenario !== "string" ||
    !Array.isArray(nodes) ||
    nodes.length < 2
  ) {
    return false;
  }

  const ids = new Set<unknown>();
  return nodes.every((node) => {
    if (!isRecord(node)) return false;
    const { id, label, role } = node;
    if (
      typeof id !== "string" ||
      typeof label !== "string" ||
      typeof role !== "string" ||
      ids.has(id)
    ) {
      return false;
    }
    ids.add(id);
    return true;
  });
}

export function isConnectionList(value: unknown): value is Connection[] {
  return (
    Array.isArray(value) &&
    value.every(
      (c) =>
        isRecord(c) && typeof c.from === "string" && typeof c.to === "string",
    )
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
