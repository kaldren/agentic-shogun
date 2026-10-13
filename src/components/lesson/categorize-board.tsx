"use client";

import { CheckIcon, XIcon } from "lucide-react";
import { useRef, useState, type ReactNode } from "react";

import type { Answer, AnswerResult } from "@/app/(lesson)/lesson/[id]/actions";
import {
  pressOnKey,
  useDraggable,
  useDropTarget,
} from "@/components/lesson/drag-and-drop";
import {
  allItemsPlaced,
  placeItem,
  type BucketPlacements,
  type CategorizeItem,
} from "@/lib/categorize";
import type { CategorizeExercise } from "@/lib/lesson";
import { cn } from "@/lib/utils";

type Result = Extract<AnswerResult, { type: "categorize" }>;

// Items can be dragged into a bucket (mouse, and touch where the browser
// supports native drag and drop) or placed by selecting an item and then a
// bucket (tap, keyboard). Both paths go through `move`.
export function CategorizeBoard({
  exercise,
  result,
  disabled,
  onAnswerChange,
}: {
  exercise: CategorizeExercise;
  result: Result | null;
  disabled: boolean;
  onAnswerChange: (answer: Answer | null) => void;
}) {
  const [placements, setPlacements] = useState<BucketPlacements>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState("");

  const itemLabel = (id: string) => labelOf(exercise.items, id);
  const bucketLabel = (id: string) => labelOf(exercise.buckets, id);

  function move(itemId: string, bucketId: string | null) {
    const next = placeItem(placements, itemId, bucketId);
    setSelected(null);
    if (next === placements) return;

    setPlacements(next);
    onAnswerChange(
      allItemsPlaced(exercise.items, next)
        ? { type: "categorize", placements: next }
        : null,
    );
    setAnnouncement(
      bucketId
        ? `${itemLabel(itemId)} placed in ${bucketLabel(bucketId)}.`
        : `${itemLabel(itemId)} moved back to the items.`,
    );
  }

  function pressItem(itemId: string) {
    const next = selected === itemId ? null : itemId;
    setSelected(next);
    if (next) {
      setAnnouncement(`${itemLabel(next)} selected. Now choose a group.`);
    }
  }

  function pressArea(bucketId: string | null) {
    if (selected) move(selected, bucketId);
  }

  const inPool = exercise.items.filter(({ id }) => !placements[id]);

  return (
    <div className="flex flex-col gap-6">
      <p className="text-muted-foreground text-sm">
        Drag each item into a group, or tap an item and then a group.
      </p>

      <Area
        target={null}
        label="Items"
        emptyText={
          result ? null : "All items are placed. Tap one to move it again."
        }
        selected={selected}
        disabled={disabled}
        onPress={() => pressArea(null)}
        onDropItem={(itemId) => move(itemId, null)}
        className="bg-muted border-dashed"
      >
        {inPool.map((item) => (
          <Chip
            key={item.id}
            item={item}
            selected={selected === item.id}
            disabled={disabled}
            onPress={() => pressItem(item.id)}
          />
        ))}
      </Area>

      <div
        className={cn(
          "grid gap-4",
          exercise.buckets.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3",
        )}
      >
        {exercise.buckets.map((bucket) => (
          <Area
            key={bucket.id}
            target={bucket.id}
            label={bucket.label}
            emptyText="Empty, drop items here"
            selected={selected}
            disabled={disabled}
            onPress={() => pressArea(bucket.id)}
            onDropItem={(itemId) => move(itemId, bucket.id)}
          >
            {exercise.items
              .filter(({ id }) => placements[id] === bucket.id)
              .map((item) => {
                const correctBucket = result?.correctPlacements[item.id];
                return (
                  <Chip
                    key={item.id}
                    item={item}
                    selected={selected === item.id}
                    disabled={disabled}
                    onPress={() => pressItem(item.id)}
                    result={
                      result
                        ? correctBucket === bucket.id
                          ? "correct"
                          : "wrong"
                        : null
                    }
                    belongsIn={
                      correctBucket && correctBucket !== bucket.id
                        ? bucketLabel(correctBucket)
                        : null
                    }
                  />
                );
              })}
          </Area>
        ))}
      </div>

      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>
    </div>
  );
}

function labelOf(items: CategorizeItem[], id: string): string {
  return items.find((item) => item.id === id)?.label ?? id;
}

// The pool of items or a bucket. While an item is selected, the area itself
// is a button that moves the item there.
function Area({
  target,
  label,
  emptyText,
  selected,
  disabled,
  onPress,
  onDropItem,
  className,
  children,
}: {
  target: string | null;
  label: string;
  emptyText: string | null;
  selected: string | null;
  disabled: boolean;
  onPress: () => void;
  onDropItem: (itemId: string) => void;
  className?: string;
  children: ReactNode[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const over = useDropTarget(ref, target, !disabled, onDropItem);
  const labelId = `area-${target ?? "pool"}-label`;
  const canPlace = !!selected && !disabled;

  return (
    <section
      ref={ref}
      aria-labelledby={labelId}
      className={cn(
        "flex min-h-28 flex-col gap-3 rounded-2xl border-2 p-4 transition-all duration-150 ease-out",
        className,
        canPlace && "border-green-200",
        over && "border-green-500 bg-green-50",
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <h2 id={labelId} className="font-bold">
          {label}
        </h2>
        {canPlace && (
          <button
            type="button"
            onClick={onPress}
            className="focus-visible:ring-ring/50 min-h-11 shrink-0 rounded-xl px-3 text-sm font-semibold text-green-800 transition-all duration-150 ease-out outline-none hover:bg-green-50 focus-visible:ring-3"
          >
            {target === null ? "Move back here" : "Place here"}
            <span className="sr-only">: {label}</span>
          </button>
        )}
      </div>
      {children.length > 0 ? (
        <ul className="flex flex-wrap gap-2">{children}</ul>
      ) : (
        emptyText && (
          <p className="text-muted-foreground text-sm">{emptyText}</p>
        )
      )}
    </section>
  );
}

function Chip({
  item,
  selected,
  disabled,
  onPress,
  result = null,
  belongsIn = null,
}: {
  item: CategorizeItem;
  selected: boolean;
  disabled: boolean;
  onPress: () => void;
  result?: "correct" | "wrong" | null;
  // The bucket a wrongly placed item belongs in, after "Check".
  belongsIn?: string | null;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useDraggable(ref, item.id, !disabled);

  return (
    <li>
      {/* A div, not a <button>: Firefox can't start a native drag on buttons. */}
      <div
        ref={ref}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-pressed={selected}
        aria-disabled={disabled || undefined}
        onClick={disabled ? undefined : onPress}
        onKeyDown={disabled ? undefined : pressOnKey(onPress)}
        className={cn(
          "bg-card shadow-edge-secondary focus-visible:ring-ring/50 flex min-h-11 items-center gap-2 rounded-xl border-2 px-4 py-2 font-semibold transition-all duration-150 ease-out outline-none focus-visible:ring-3",
          !disabled &&
            "cursor-grab hover:border-green-200 hover:bg-green-50 active:shadow-none motion-safe:active:translate-y-1",
          selected && "border-green-500 bg-green-50 hover:border-green-500",
          dragging && "opacity-50",
          result === "correct" && "border-green-500 bg-green-100",
          result === "wrong" && "border-danger bg-danger-soft",
        )}
      >
        {result === "correct" && (
          <CheckIcon
            aria-hidden
            className="size-5 shrink-0 text-green-700"
            strokeWidth={2.5}
          />
        )}
        {result === "wrong" && (
          <XIcon
            aria-hidden
            className="text-danger-text size-5 shrink-0"
            strokeWidth={2.5}
          />
        )}
        <span className="flex flex-col">
          <span>
            {item.label}
            {result === "correct" && (
              <span className="sr-only"> (correct)</span>
            )}
            {result === "wrong" && <span className="sr-only"> (wrong)</span>}
          </span>
          {belongsIn && (
            <span className="text-danger-text text-sm font-normal">
              Belongs in: {belongsIn}
            </span>
          )}
        </span>
      </div>
    </li>
  );
}
