"use client";

import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/adapter/element-adapter";
import { ArrowDownIcon, ArrowUpIcon, CheckIcon, XIcon } from "lucide-react";
import {
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  type KeyboardEvent,
  type RefObject,
} from "react";
import { flushSync } from "react-dom";

import type { Answer, AnswerResult } from "@/app/(lesson)/lesson/[id]/actions";
import { Button } from "@/components/ui/button";
import type { OrderingExercise } from "@/lib/lesson";
import { moveItem, shuffleAvoiding, type OrderingItem } from "@/lib/ordering";
import { cn } from "@/lib/utils";

type Result = Extract<AnswerResult, { type: "ordering" }>;

// Steps can be dragged to a new place (mouse, and touch where the browser
// supports native drag and drop) or moved with the up and down buttons or
// the arrow keys. All paths go through `move`.
export function OrderingList({
  exercise,
  result,
  disabled,
  avoidOrder,
  onAnswerChange,
}: {
  exercise: OrderingExercise;
  result: Result | null;
  disabled: boolean;
  // The correct order, when the learner has already seen it: a repeated
  // exercise is shuffled again so it never starts solved.
  avoidOrder: string[] | null;
  onAnswerChange: (answer: Answer | null) => void;
}) {
  const [order, setOrder] = useState(() => {
    const ids = exercise.items.map(({ id }) => id);
    return avoidOrder ? shuffleAvoiding(ids, avoidOrder) : ids;
  });
  const [announcement, setAnnouncement] = useState("");

  const label = (id: string) => labelOf(exercise.items, id);
  const domId = (id: string) => `${exercise.id}-step-${id}`;

  function move(id: string, toIndex: number, keepFocus = false) {
    const next = moveItem(order, id, toIndex);
    const index = next.indexOf(id);
    if (index === order.indexOf(id)) return;

    // Render first, so focus can follow the step to its new place.
    flushSync(() => setOrder(next));
    if (keepFocus) document.getElementById(domId(id))?.focus();
    onAnswerChange({ type: "ordering", order: next });
    setAnnouncement(
      `${label(id)} moved to position ${index + 1} of ${next.length}.`,
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        {exercise.scenario && (
          <p className="max-w-prose text-lg">{exercise.scenario}</p>
        )}
        <p className="text-muted-foreground text-sm">
          Drag the steps into order, or move them with the arrow buttons.
        </p>
      </div>

      <ol className="flex flex-col gap-3">
        {order.map((id, index) => (
          <Step
            key={id}
            domId={domId(id)}
            item={{ id, label: label(id) }}
            index={index}
            count={order.length}
            disabled={disabled}
            result={
              result
                ? result.correctOrder[index] === id
                  ? "correct"
                  : "wrong"
                : null
            }
            onMove={(toIndex, keepFocus) => move(id, toIndex, keepFocus)}
            onDropStep={(droppedId) => move(droppedId, index)}
          />
        ))}
      </ol>

      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>
    </div>
  );
}

function labelOf(items: OrderingItem[], id: string): string {
  return items.find((item) => item.id === id)?.label ?? id;
}

type StepResult = "correct" | "wrong" | null;

function Step({
  domId,
  item,
  index,
  count,
  disabled,
  result,
  onMove,
  onDropStep,
}: {
  domId: string;
  item: OrderingItem;
  index: number;
  count: number;
  disabled: boolean;
  result: StepResult;
  onMove: (toIndex: number, keepFocus: boolean) => void;
  onDropStep: (id: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { dragging, over } = useSortable(ref, item.id, !disabled, onDropStep);
  const position = `Position ${index + 1} of ${count}`;

  function onKeyDown(event: KeyboardEvent) {
    if (event.target !== event.currentTarget) return;
    if (event.key === "ArrowUp" && index > 0) {
      event.preventDefault();
      onMove(index - 1, true);
    } else if (event.key === "ArrowDown" && index < count - 1) {
      event.preventDefault();
      onMove(index + 1, true);
    }
  }

  return (
    <li>
      {/* A div, not a <button>: Firefox can't start a native drag on buttons. */}
      <div
        ref={ref}
        id={domId}
        tabIndex={disabled ? -1 : 0}
        aria-label={`${item.label}. ${position}.${disabled ? "" : " Use the up and down arrow keys to move it."}`}
        onKeyDown={disabled ? undefined : onKeyDown}
        className={cn(
          "bg-card shadow-edge-secondary focus-visible:ring-ring/50 flex min-h-14 items-center gap-3 rounded-2xl border-2 py-2 pr-2 pl-3 transition-all duration-150 ease-out outline-none focus-visible:ring-3",
          !disabled && "cursor-grab hover:border-green-200 hover:bg-green-50",
          over && "border-green-500 bg-green-50",
          dragging && "opacity-50",
          result === "correct" && "border-green-500 bg-green-100",
          result === "wrong" && "border-danger bg-danger-soft",
        )}
      >
        <span
          aria-hidden
          className="grid size-8 shrink-0 place-items-center rounded-full bg-green-100 text-sm font-bold text-green-800"
        >
          {index + 1}
        </span>
        <span className="flex-1 font-semibold">
          {item.label}
          {result === "correct" && <span className="sr-only"> (correct)</span>}
          {result === "wrong" && <span className="sr-only"> (wrong)</span>}
        </span>
        {result === "correct" && (
          <CheckIcon
            aria-hidden
            className="size-6 shrink-0 text-green-700"
            strokeWidth={2.5}
          />
        )}
        {result === "wrong" && (
          <XIcon
            aria-hidden
            className="text-danger-text size-6 shrink-0"
            strokeWidth={2.5}
          />
        )}
        {!result && (
          <span className="flex shrink-0">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={`Move ${item.label} up`}
              disabled={disabled || index === 0}
              onClick={() => onMove(index - 1, false)}
            >
              <ArrowUpIcon aria-hidden />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={`Move ${item.label} down`}
              disabled={disabled || index === count - 1}
              onClick={() => onMove(index + 1, false)}
            >
              <ArrowDownIcon aria-hidden />
            </Button>
          </span>
        )}
      </div>
    </li>
  );
}

// Makes a step draggable and a drop target for the other steps. Returns
// whether it is being dragged, and whether another step is over it.
function useSortable(
  ref: RefObject<HTMLElement | null>,
  id: string,
  enabled: boolean,
  onDropStep: (id: string) => void,
) {
  const [dragging, setDragging] = useState(false);
  const [over, setOver] = useState(false);
  const drop = useEffectEvent(onDropStep);

  useEffect(() => {
    const element = ref.current;
    if (!element || !enabled) return;
    const cleanDrag = draggable({
      element,
      getInitialData: () => ({ stepId: id }),
      onDragStart: () => setDragging(true),
      onDrop: () => setDragging(false),
    });
    const cleanDrop = dropTargetForElements({
      element,
      canDrop: ({ source }) =>
        typeof source.data.stepId === "string" && source.data.stepId !== id,
      onDragEnter: () => setOver(true),
      onDragLeave: () => setOver(false),
      onDrop: ({ source }) => {
        setOver(false);
        drop(source.data.stepId as string);
      },
    });
    return () => {
      cleanDrag();
      cleanDrop();
    };
  }, [ref, id, enabled]);

  return { dragging: dragging && enabled, over: over && enabled };
}
