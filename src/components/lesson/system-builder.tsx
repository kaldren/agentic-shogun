"use client";

import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/adapter/element-adapter";
import {
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  BackgroundVariant,
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  Handle,
  MarkerType,
  Panel,
  Position,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  type Edge,
  type EdgeProps,
  type Node,
  type NodeProps,
  type OnDelete,
} from "@xyflow/react";
import {
  ArrowRightIcon,
  CheckIcon,
  Maximize2Icon,
  Minimize2Icon,
  LocateFixedIcon,
  Trash2Icon,
  XIcon,
  ZoomInIcon,
  ZoomOutIcon,
} from "lucide-react";
import {
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent,
  type RefObject,
} from "react";
import { flushSync } from "react-dom";

import type { Answer, AnswerResult } from "@/app/(lesson)/lesson/[id]/actions";
import { Button } from "@/components/ui/button";
import { capitalize, DEFAULT_NOUN, type Noun } from "@/lib/exercise-noun";
import type { SystemBuilderExercise } from "@/lib/lesson";
import {
  canCheck,
  canConnect,
  connectionKey,
  freePosition,
  gradeConnections,
  type Connection,
  type Position as Point,
} from "@/lib/system-builder";
import { cn } from "@/lib/utils";

type Result = Extract<AnswerResult, { type: "system_builder" }>;
type Mark = "correct" | "wrong" | null;

type ServiceNode = Node<{ label: string; role: string; mark: Mark }, "service">;
type ConnectionEdge = Edge<{ mark: Mark | "missing" }, "connection">;

// Size of a node on the canvas, used to center a dropped node on the pointer.
const NODE_WIDTH = 208;
const NODE_HEIGHT = 72;

const nodeTypes = { service: ServiceNodeView };
const edgeTypes = { connection: ConnectionEdgeView };

// Nodes are added by dragging from the palette (mouse) or by pressing a
// palette item (tap, keyboard). They are connected by dragging or tapping
// from an output to an input, or with "Connect to…" below the canvas.
export function SystemBuilder(props: {
  exercise: SystemBuilderExercise;
  result: Result | null;
  disabled: boolean;
  onAnswerChange: (answer: Answer | null) => void;
}) {
  return (
    <ReactFlowProvider>
      <Builder {...props} />
    </ReactFlowProvider>
  );
}

function Builder({
  exercise,
  result,
  disabled,
  onAnswerChange,
}: {
  exercise: SystemBuilderExercise;
  result: Result | null;
  disabled: boolean;
  onAnswerChange: (answer: Answer | null) => void;
}) {
  const { screenToFlowPosition, fitView, zoomIn, zoomOut, deleteElements } =
    useReactFlow<ServiceNode, ConnectionEdge>();
  const [nodes, setNodes] = useState<ServiceNode[]>([]);
  const [edges, setEdges] = useState<ConnectionEdge[]>([]);
  // The "Connect to…" choice, kept per selected node.
  const [pick, setPick] = useState({ from: "", to: "" });
  const [announcement, setAnnouncement] = useState("");
  const fitPending = useRef(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const workspaceRef = useRef<HTMLDivElement>(null);
  const duration = useReducedMotion() ? 0 : 200;
  const [fullscreen, setFullscreen] = useFullscreen(workspaceRef);

  // What the nodes are called, e.g. "services" or "parts" (spec 013).
  const noun = exercise.noun ?? DEFAULT_NOUN;
  const name = (id: string) =>
    exercise.nodes.find((node) => node.id === id)?.label ?? id;
  const paletteDomId = (id: string) => `${exercise.id}-palette-${id}`;

  const onCanvas = new Set(nodes.map(({ id }) => id));
  const palette = exercise.nodes.filter(({ id }) => !onCanvas.has(id));
  const connections: Connection[] = edges.map(({ source, target }) => ({
    from: source,
    to: target,
  }));

  // Report the answer whenever the nodes on the canvas or the connections
  // change (not when a node is only moved).
  const nodeIdsKey = nodes.map(({ id }) => id).join(" ");
  const report = useEffectEvent((nodeIds: string[]) => {
    onAnswerChange(
      canCheck(nodeIds, connections)
        ? { type: "system_builder", nodes: nodeIds, connections }
        : null,
    );
  });
  useEffect(() => {
    report(nodeIdsKey ? nodeIdsKey.split(" ") : []);
  }, [nodeIdsKey, edges]);

  // Nodes added without a pointer go to a free grid cell; show them.
  useEffect(() => {
    if (!fitPending.current) return;
    fitPending.current = false;
    void fitView({ padding: 0.2, maxZoom: 1, duration });
  }, [nodes.length, fitView, duration]);

  // The canvas changes size when full screen opens or closes.
  useEffect(() => {
    const frame = requestAnimationFrame(
      () => void fitView({ padding: 0.2, maxZoom: 1, duration }),
    );
    return () => cancelAnimationFrame(frame);
  }, [fullscreen, fitView, duration]);

  function addNode(id: string, position?: Point) {
    const info = exercise.nodes.find((node) => node.id === id);
    if (disabled || !info || onCanvas.has(id)) return;
    if (!position) fitPending.current = true;
    const node: ServiceNode = {
      id,
      type: "service",
      position: position ?? freePosition(nodes.map((n) => n.position)),
      data: { label: info.label, role: info.role, mark: null },
      ariaLabel: `${info.label}, ${info.role}`,
    };
    setNodes((current) => [...current, node]);
    setAnnouncement(`${info.label} added to the canvas.`);
  }

  // Adds a palette item by tap or keyboard and keeps focus in the palette.
  function pressPaletteItem(id: string) {
    const index = palette.findIndex((node) => node.id === id);
    flushSync(() => addNode(id));
    const rest = palette.filter((node) => node.id !== id);
    const next = rest[Math.min(index, rest.length - 1)];
    if (next) document.getElementById(paletteDomId(next.id))?.focus();
    else canvasRef.current?.focus();
  }

  function connect(from: string, to: string) {
    if (disabled || !canConnect(connections, from, to)) return;
    const edge: ConnectionEdge = {
      id: connectionKey({ from, to }),
      source: from,
      target: to,
      type: "connection",
      ariaLabel: `Connection from ${name(from)} to ${name(to)}`,
    };
    setEdges((current) => [...current, edge]);
    setAnnouncement(`${name(from)} connected to ${name(to)}.`);
  }

  const onDelete: OnDelete<ServiceNode, ConnectionEdge> = ({
    nodes: removedNodes,
    edges: removedEdges,
  }) => {
    if (removedNodes.length > 0) {
      const names = removedNodes.map(({ id }) => name(id)).join(", ");
      setAnnouncement(`${names} moved back to the ${noun.other}.`);
    } else if (removedEdges[0]) {
      const { source, target } = removedEdges[0];
      setAnnouncement(
        `Connection from ${name(source)} to ${name(target)} removed.`,
      );
    }
  };

  const over = useDropTarget(canvasRef, !disabled, (id, clientX, clientY) => {
    const point = screenToFlowPosition({ x: clientX, y: clientY });
    addNode(id, {
      x: point.x - NODE_WIDTH / 2,
      y: point.y - NODE_HEIGHT / 2,
    });
  });

  // After "Check": mark nodes and connections, and draw the missing ones.
  const grades = result
    ? gradeConnections(connections, result.correctConnections)
    : null;
  const correctKeys = new Set(grades?.correct.map(connectionKey));
  const missing =
    grades?.missing.filter(
      ({ from, to }) => onCanvas.has(from) && onCanvas.has(to),
    ) ?? [];
  const missingNodes = result
    ? result.correctNodes.filter((id) => !onCanvas.has(id))
    : [];
  const shownNodes: ServiceNode[] = result
    ? nodes.map((node) => {
        const mark = result.correctNodes.includes(node.id)
          ? "correct"
          : "wrong";
        return {
          ...node,
          selected: false,
          data: { ...node.data, mark },
          ariaLabel: `${node.ariaLabel} (${mark})`,
        };
      })
    : nodes;
  const shownEdges: ConnectionEdge[] = [
    ...edges.map((edge) => {
      const mark: Mark = result
        ? correctKeys.has(edge.id)
          ? "correct"
          : "wrong"
        : null;
      return {
        ...edge,
        selected: result ? false : edge.selected,
        data: { mark },
        markerEnd: marker(mark, !!edge.selected && !result),
        ariaLabel: mark ? `${edge.ariaLabel} (${mark})` : edge.ariaLabel,
      };
    }),
    ...missing.map(({ from, to }): ConnectionEdge => ({
      id: `missing-${connectionKey({ from, to })}`,
      source: from,
      target: to,
      type: "connection",
      data: { mark: "missing" },
      markerEnd: marker("missing", false),
      selectable: false,
      ariaLabel: `Missing connection from ${name(from)} to ${name(to)}`,
    })),
  ];

  const selected = disabled
    ? undefined
    : nodes.filter((node) => node.selected).at(0);
  const targets = selected
    ? nodes.filter(({ id }) => canConnect(connections, selected.id, id))
    : [];
  const target =
    selected && pick.from === selected.id && onCanvas.has(pick.to)
      ? pick.to
      : "";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="max-w-prose text-lg">{exercise.scenario}</p>
        <p className="text-muted-foreground text-sm">
          Drag the {noun.other} you need onto the canvas, or tap one to add it.
          Then connect a {noun.one}&apos;s output (right dot) to another{" "}
          {noun.one}&apos;s input (left dot).
        </p>
      </div>

      {/* Services, canvas and the selected-service panel: the part that
          opens full screen. */}
      <div
        ref={workspaceRef}
        role={fullscreen ? "dialog" : undefined}
        aria-modal={fullscreen || undefined}
        aria-label={fullscreen ? "Canvas, full screen" : undefined}
        onKeyDown={(event) => {
          // Escape first clears a selection (React Flow), then closes.
          if (event.key === "Escape" && fullscreen && !selected) {
            setFullscreen(false);
          }
        }}
        className={cn(
          "flex flex-col gap-6",
          fullscreen &&
            "fixed inset-0 z-50 gap-4 overflow-y-auto bg-white p-4 md:p-6",
        )}
      >
        {fullscreen && (
          <div className="flex items-center gap-3">
            <p className="flex-1 font-bold">{exercise.question}</p>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setFullscreen(false)}
            >
              <Minimize2Icon aria-hidden />
              Exit full screen
            </Button>
          </div>
        )}

        <section
          aria-labelledby={`${exercise.id}-palette`}
          className="flex flex-col gap-3"
        >
          <h2
            id={`${exercise.id}-palette`}
            className="text-muted-foreground text-xs font-bold tracking-wider uppercase"
          >
            {capitalize(noun.other)}
          </h2>
          {palette.length > 0 ? (
            <ul
              className={cn(
                "flex gap-2",
                // Full screen keeps the services to one scrolling row, so the
                // canvas gets the space.
                fullscreen ? "-mx-1 overflow-x-auto px-1 pb-2" : "flex-wrap",
              )}
            >
              {palette.map((node) => (
                <li key={node.id} className="shrink-0">
                  <PaletteItem
                    id={paletteDomId(node.id)}
                    nodeId={node.id}
                    label={node.label}
                    role={node.role}
                    disabled={disabled}
                    onPress={() => pressPaletteItem(node.id)}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">
              All {noun.other} are on the canvas.
            </p>
          )}
        </section>

        <div
          ref={canvasRef}
          tabIndex={-1}
          role="group"
          aria-label="Canvas"
          className={cn(
            "relative overflow-hidden rounded-2xl border-2 bg-white transition-all duration-150 ease-out outline-none",
            fullscreen ? "min-h-80 flex-1" : "h-96 md:h-[28rem]",
            over && "border-green-500 bg-green-50",
          )}
        >
          <ReactFlow<ServiceNode, ConnectionEdge>
            nodes={shownNodes}
            edges={shownEdges}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            onNodesChange={(changes) =>
              setNodes((current) => applyNodeChanges(changes, current))
            }
            onEdgesChange={(changes) =>
              setEdges((current) => applyEdgeChanges(changes, current))
            }
            onConnect={({ source, target }) => connect(source, target)}
            isValidConnection={({ source, target }) =>
              canConnect(connections, source, target)
            }
            onDelete={onDelete}
            nodesDraggable={!disabled}
            nodesConnectable={!disabled}
            elementsSelectable={!disabled}
            deleteKeyCode={disabled ? null : ["Backspace", "Delete"]}
            multiSelectionKeyCode={null}
            selectionKeyCode={null}
            zoomOnScroll={false}
            zoomOnDoubleClick={false}
            preventScrolling={false}
            minZoom={0.3}
            maxZoom={1.5}
            defaultViewport={{ x: 24, y: 24, zoom: 1 }}
            colorMode="light"
            ariaLabelConfig={ariaLabels(noun)}
          >
            <Background
              variant={BackgroundVariant.Dots}
              gap={20}
              size={2}
              color="var(--color-green-200)"
            />
            <Panel position="top-right" className="flex flex-col gap-2">
              <Button
                type="button"
                variant="secondary"
                size="icon"
                aria-label="Zoom in"
                onClick={() => void zoomIn({ duration })}
              >
                <ZoomInIcon aria-hidden />
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="icon"
                aria-label="Zoom out"
                onClick={() => void zoomOut({ duration })}
              >
                <ZoomOutIcon aria-hidden />
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="icon"
                aria-label={`Fit all ${noun.other} in view`}
                onClick={() =>
                  void fitView({ padding: 0.2, maxZoom: 1, duration })
                }
              >
                <LocateFixedIcon aria-hidden />
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="icon"
                aria-label={fullscreen ? "Exit full screen" : "Full screen"}
                aria-pressed={fullscreen}
                onClick={() => setFullscreen(!fullscreen)}
              >
                {fullscreen ? (
                  <Minimize2Icon aria-hidden />
                ) : (
                  <Maximize2Icon aria-hidden />
                )}
              </Button>
            </Panel>
          </ReactFlow>
          {nodes.length === 0 && (
            <p className="text-muted-foreground pointer-events-none absolute inset-0 grid place-items-center p-16 text-center">
              Drag {noun.other} here, or tap one to add it.
            </p>
          )}
        </div>

        {selected && (
          <section
            aria-label={`Selected: ${selected.data.label}`}
            className="flex flex-col gap-3 rounded-2xl border-2 border-green-200 bg-green-50 p-4 md:p-5"
          >
            <p className="font-semibold">
              {selected.data.label}{" "}
              <span className="text-muted-foreground font-normal">
                ({selected.data.role})
              </span>
            </p>
            <div className="flex flex-wrap items-end gap-3">
              <label className="flex min-w-48 flex-1 flex-col gap-1.5">
                <span className="text-sm font-semibold">Connect to…</span>
                <select
                  value={target}
                  disabled={targets.length === 0}
                  onChange={(event) =>
                    setPick({ from: selected.id, to: event.target.value })
                  }
                  className="border-input bg-muted focus-visible:ring-ring/50 h-11 rounded-xl border-2 px-4 transition-all duration-150 ease-out outline-none focus:border-green-500 focus:bg-white focus-visible:ring-3 disabled:opacity-50"
                >
                  <option value="">
                    {targets.length > 0
                      ? `Choose a ${noun.one}`
                      : `No other ${noun.other} to connect`}
                  </option>
                  {targets.map((node) => (
                    <option key={node.id} value={node.id}>
                      {node.data.label} ({node.data.role})
                    </option>
                  ))}
                </select>
              </label>
              <Button
                type="button"
                variant="secondary"
                disabled={!target}
                onClick={() => {
                  connect(selected.id, target);
                  setPick({ from: "", to: "" });
                }}
              >
                Connect
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() =>
                  // The panel disappears, so focus the service back in the
                  // palette once it is rendered there.
                  void deleteElements({ nodes: [{ id: selected.id }] }).then(
                    () =>
                      requestAnimationFrame(() =>
                        document
                          .getElementById(paletteDomId(selected.id))
                          ?.focus(),
                      ),
                  )
                }
              >
                <Trash2Icon aria-hidden />
                Remove from canvas
              </Button>
            </div>
          </section>
        )}
      </div>

      {(edges.length > 0 || missing.length > 0 || missingNodes.length > 0) && (
        <section
          aria-labelledby={`${exercise.id}-connections`}
          className="flex flex-col gap-3"
        >
          <h2
            id={`${exercise.id}-connections`}
            className="text-muted-foreground text-xs font-bold tracking-wider uppercase"
          >
            Connections
          </h2>
          <ul className="flex flex-col gap-2">
            {edges.map((edge) => {
              const mark: Mark = result
                ? correctKeys.has(edge.id)
                  ? "correct"
                  : "wrong"
                : null;
              return (
                <ConnectionRow
                  key={edge.id}
                  from={name(edge.source)}
                  to={name(edge.target)}
                  mark={mark}
                  onRemove={
                    disabled
                      ? undefined
                      : () => {
                          // The row disappears, so keep focus on the canvas.
                          canvasRef.current?.focus();
                          void deleteElements({ edges: [{ id: edge.id }] });
                        }
                  }
                />
              );
            })}
            {grades?.missing.map((connection) => (
              <ConnectionRow
                key={`missing-${connectionKey(connection)}`}
                from={name(connection.from)}
                to={name(connection.to)}
                mark="missing"
              />
            ))}
          </ul>
          {missingNodes.length > 0 && (
            <p className="text-muted-foreground">
              Missing {noun.other}:{" "}
              {missingNodes.map((id) => name(id)).join(", ")}
            </p>
          )}
        </section>
      )}

      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>
    </div>
  );
}

// React Flow's screen reader texts, in the words of this exercise.
const ariaLabels = ({ one, other }: Noun) => ({
  "node.a11yDescription.default": `Press Enter to select this ${one}. Then use Connect to below the canvas, or press Delete to move it back to the ${other}.`,
  "node.a11yDescription.keyboardDisabled": `Press Enter to select this ${one}. Then use the arrow keys to move it, Connect to below the canvas to connect it, or Delete to move it back to the ${other}.`,
  "edge.a11yDescription.default":
    "Press Enter to select this connection, then Delete to remove it.",
  "handle.ariaLabel": "Connection point",
});

function marker(mark: Mark | "missing", selected: boolean) {
  return { type: MarkerType.ArrowClosed, color: strokeColor(mark, selected) };
}

function strokeColor(mark: Mark | "missing", selected: boolean): string {
  if (mark === "correct" || selected) return "var(--color-green-500)";
  if (mark === "wrong") return "var(--color-danger)";
  if (mark === "missing") return "var(--color-green-700)";
  return "var(--muted-foreground)";
}

// Shared look of service cards (DESIGN.md §6 Cards: clickable and selected).
const cardStyles =
  "bg-card shadow-edge-secondary rounded-xl border-2 transition-all duration-150 ease-out";
const interactiveStyles =
  "cursor-grab hover:border-green-200 hover:bg-green-50 motion-safe:active:translate-y-1 active:shadow-none";
const selectedStyles = "border-green-500 bg-green-50 hover:border-green-500";
const markStyles = {
  correct: "border-green-500 bg-green-100",
  wrong: "border-danger bg-danger-soft",
};

function MarkIcon({ mark }: { mark: Mark }) {
  if (mark === "correct") {
    return (
      <CheckIcon
        aria-hidden
        className="size-5 shrink-0 text-green-700"
        strokeWidth={2.5}
      />
    );
  }
  if (mark === "wrong") {
    return (
      <XIcon
        aria-hidden
        className="text-danger-text size-5 shrink-0"
        strokeWidth={2.5}
      />
    );
  }
  return null;
}

function PaletteItem({
  id,
  nodeId,
  label,
  role,
  disabled,
  onPress,
}: {
  id: string;
  nodeId: string;
  label: string;
  role: string;
  disabled: boolean;
  onPress: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useDraggable(ref, nodeId, !disabled);

  return (
    // A div, not a <button>: Firefox can't start a native drag on buttons.
    <div
      ref={ref}
      id={id}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label={`Add ${label}, ${role}, to the canvas`}
      aria-disabled={disabled || undefined}
      onClick={disabled ? undefined : onPress}
      onKeyDown={disabled ? undefined : pressOnKey(onPress)}
      className={cn(
        cardStyles,
        "focus-visible:ring-ring/50 flex min-h-11 flex-col px-4 py-2 outline-none focus-visible:ring-3",
        !disabled && interactiveStyles,
        disabled && "opacity-50",
        dragging && "opacity-50",
      )}
    >
      <span className="font-semibold">{label}</span>
      <span className="text-muted-foreground text-sm">{role}</span>
    </div>
  );
}

const handleStyles =
  "size-4 rounded-full border-2 border-green-500 bg-white transition-all duration-150 ease-out before:absolute before:-inset-3.5 before:content-[''] hover:bg-green-100 [&.connectingfrom]:bg-green-500 [&.valid]:bg-green-500";

function ServiceNodeView({
  data,
  selected,
  isConnectable,
}: NodeProps<ServiceNode>) {
  const { label, role, mark } = data;
  return (
    <div
      style={{ width: NODE_WIDTH, minHeight: NODE_HEIGHT }}
      className={cn(
        cardStyles,
        "in-focus-visible:ring-ring/50 flex items-center gap-2 px-4 py-3 in-focus-visible:ring-3",
        isConnectable && interactiveStyles,
        selected && selectedStyles,
        mark && markStyles[mark],
      )}
    >
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        className={handleStyles}
      />
      <span className="flex flex-1 flex-col">
        <span className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
          {role}
        </span>
        <span className="font-semibold">{label}</span>
      </span>
      <MarkIcon mark={mark} />
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        className={handleStyles}
      />
    </div>
  );
}

function ConnectionEdgeView({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
  selected,
  data,
}: EdgeProps<ConnectionEdge>) {
  const [path, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });
  const mark = data?.mark ?? null;

  return (
    <>
      <BaseEdge
        id={id}
        path={path}
        markerEnd={markerEnd}
        className={cn(
          "stroke-muted-foreground stroke-2",
          selected && "stroke-green-500 stroke-3",
          mark === "correct" && "stroke-green-500",
          mark === "wrong" && "stroke-danger",
          mark === "missing" && "stroke-green-700 [stroke-dasharray:6_6]",
        )}
      />
      {(mark === "correct" || mark === "wrong") && (
        <EdgeLabelRenderer>
          <span
            aria-hidden
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            }}
            className={cn(
              "absolute grid size-7 place-items-center rounded-full border-2 bg-white",
              mark === "correct" ? "border-green-500" : "border-danger",
            )}
          >
            <MarkIcon mark={mark} />
          </span>
        </EdgeLabelRenderer>
      )}
    </>
  );
}

function ConnectionRow({
  from,
  to,
  mark,
  onRemove,
}: {
  from: string;
  to: string;
  mark: Mark | "missing";
  onRemove?: () => void;
}) {
  return (
    <li
      className={cn(
        "flex min-h-11 items-center gap-2 rounded-xl border-2 py-1 pr-1 pl-4",
        mark === "correct" && markStyles.correct,
        mark === "wrong" && markStyles.wrong,
        mark === "missing" && "border-dashed border-green-500",
      )}
    >
      <span className="flex flex-1 flex-wrap items-center gap-x-2 font-semibold">
        {mark === "missing" && <span className="text-green-800">Missing:</span>}
        {from}
        <ArrowRightIcon aria-hidden className="size-5 text-green-700" />
        <span className="sr-only">to</span>
        {to}
        {(mark === "correct" || mark === "wrong") && (
          <span className="sr-only">({mark})</span>
        )}
      </span>
      {mark === "missing" ? null : mark ? (
        <span className="grid size-11 place-items-center">
          <MarkIcon mark={mark} />
        </span>
      ) : (
        onRemove && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={`Remove connection from ${from} to ${to}`}
            onClick={onRemove}
          >
            <Trash2Icon aria-hidden />
          </Button>
        )
      )}
    </li>
  );
}

// Enter and Space activate role="button" elements, like real buttons.
function pressOnKey(onPress: () => void) {
  return (event: KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onPress();
    }
  };
}

function useDraggable(
  ref: RefObject<HTMLElement | null>,
  nodeId: string,
  enabled: boolean,
): boolean {
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || !enabled) return;
    return draggable({
      element,
      getInitialData: () => ({ nodeId }),
      onDragStart: () => setDragging(true),
      onDrop: () => setDragging(false),
    });
  }, [ref, nodeId, enabled]);

  return dragging && enabled;
}

// Lets palette items be dropped on the canvas. Returns whether one is being
// dragged over it.
function useDropTarget(
  ref: RefObject<HTMLElement | null>,
  enabled: boolean,
  onDrop: (nodeId: string, clientX: number, clientY: number) => void,
): boolean {
  const [over, setOver] = useState(false);
  const drop = useEffectEvent(onDrop);

  useEffect(() => {
    const element = ref.current;
    if (!element || !enabled) return;
    return dropTargetForElements({
      element,
      canDrop: ({ source }) => typeof source.data.nodeId === "string",
      onDragEnter: () => setOver(true),
      onDragLeave: () => setOver(false),
      onDrop: ({ source, location }) => {
        setOver(false);
        const { clientX, clientY } = location.current.input;
        drop(source.data.nodeId as string, clientX, clientY);
      },
    });
  }, [ref, enabled]);

  return over && enabled;
}

// Shows `ref` full screen. Uses the browser's Fullscreen API where it can
// (desktop, Android, iPad); elsewhere (iPhone) the element just covers the
// page with CSS. Returns whether it is open, and a setter.
function useFullscreen(
  ref: RefObject<HTMLElement | null>,
): [boolean, (open: boolean) => void] {
  const [open, setOpen] = useState(false);

  // The browser can close full screen on its own (Escape, back gesture).
  useEffect(() => {
    const onChange = () => {
      if (!document.fullscreenElement) setOpen(false);
    };
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  // Without the Fullscreen API, stop the page behind from scrolling.
  useEffect(() => {
    if (!open || document.fullscreenElement) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [open]);

  function set(next: boolean) {
    setOpen(next);
    const element = ref.current;
    if (next && element && document.fullscreenEnabled) {
      element.requestFullscreen().catch(() => {});
    } else if (!next && document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
  }

  return [open, set];
}

const reducedMotion = "(prefers-reduced-motion: reduce)";

function useReducedMotion(): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const query = window.matchMedia(reducedMotion);
      query.addEventListener("change", onChange);
      return () => query.removeEventListener("change", onChange);
    },
    () => window.matchMedia(reducedMotion).matches,
    () => false,
  );
}
