"use client";

import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/adapter/element-adapter";
import { ArrowDownIcon, CheckIcon, XIcon } from "lucide-react";
import {
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
  type RefObject,
} from "react";
import { flushSync } from "react-dom";

import type { Answer, AnswerResult } from "@/app/(lesson)/lesson/[id]/actions";
import { Button } from "@/components/ui/button";
import {
  allSlotsFilled,
  placeCard,
  slotOf,
  type ArchitectureItem,
  type Placements,
} from "@/lib/architecture";
import type { ArchitectureExercise } from "@/lib/lesson";
import { cn } from "@/lib/utils";

type Result = Extract<AnswerResult, { type: "architecture" }>;

// Cards can be dragged (mouse, and touch where the browser supports native
// drag and drop) or placed by selecting a card and then a slot (tap,
// keyboard). Both paths go through `move`.
export function ArchitectureBoard({
  exercise,
  result,
  disabled,
  onAnswerChange,
}: {
  exercise: ArchitectureExercise;
  result: Result | null;
  disabled: boolean;
  onAnswerChange: (answer: Answer | null) => void;
}) {
  const [placements, setPlacements] = useState<Placements>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState("");

  const cardLabel = (id: string) => labelOf(exercise.cards, id);
  const slotLabel = (id: string) => labelOf(exercise.slots, id);
  const cardDomId = (id: string) => `${exercise.id}-card-${id}`;

  function move(cardId: string, slotId: string | null) {
    const next = placeCard(placements, cardId, slotId);
    setSelected(null);
    if (next === placements) return;

    setPlacements(next);
    onAnswerChange(
      allSlotsFilled(exercise.slots, next)
        ? { type: "architecture", placements: next }
        : null,
    );

    const swapped = slotId ? placements[slotId] : undefined;
    const from = slotOf(placements, cardId);
    if (slotId === null) {
      setAnnouncement(`${cardLabel(cardId)} moved back to the services.`);
    } else if (swapped && from) {
      setAnnouncement(
        `${cardLabel(cardId)} placed in ${slotLabel(slotId)}. ${cardLabel(swapped)} moved to ${slotLabel(from)}.`,
      );
    } else if (swapped) {
      setAnnouncement(
        `${cardLabel(cardId)} placed in ${slotLabel(slotId)}. ${cardLabel(swapped)} moved back to the services.`,
      );
    } else {
      setAnnouncement(`${cardLabel(cardId)} placed in ${slotLabel(slotId)}.`);
    }
  }

  function select(cardId: string | null) {
    setSelected(cardId);
    if (cardId) {
      setAnnouncement(`${cardLabel(cardId)} selected. Now choose a slot.`);
    }
  }

  function pressSlot(slotId: string) {
    const placed = placements[slotId];
    if (selected) {
      if (selected === placed) select(null);
      else move(selected, slotId);
    } else if (placed) {
      select(placed);
    }
  }

  function pressBankCard(cardId: string) {
    select(selected === cardId ? null : cardId);
  }

  const selectedSlot = selected ? slotOf(placements, selected) : null;
  const bank = exercise.cards.filter(
    ({ id }) => slotOf(placements, id) === null,
  );
  const shownSlots = new Set<string>();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="max-w-prose text-lg">{exercise.scenario}</p>
        <p className="text-muted-foreground text-sm">
          Drag each service into a slot, or tap a service and then a slot.
        </p>
      </div>

      <DropArea
        target={null}
        enabled={!disabled}
        onDropCard={(cardId) => move(cardId, null)}
        className="flex flex-col gap-3 rounded-2xl"
        overClassName="bg-green-50 ring-3 ring-green-200"
      >
        <h2 className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
          Services
        </h2>
        <ul className="flex flex-wrap gap-2">
          {bank.map((card) => (
            <li key={card.id}>
              <ServiceCard
                id={cardDomId(card.id)}
                card={card}
                selected={selected === card.id}
                disabled={disabled}
                onPress={() => pressBankCard(card.id)}
              />
            </li>
          ))}
        </ul>
        {selectedSlot && selected && !disabled && (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="self-start"
            onClick={() => {
              // The button disappears, so focus the card back in the bank.
              flushSync(() => move(selected, null));
              document.getElementById(cardDomId(selected))?.focus();
            }}
          >
            Move {cardLabel(selected)} back
          </Button>
        )}
      </DropArea>

      <div className="flex flex-col gap-4">
        {exercise.flows.map((flow, flowIndex) => (
          <section
            key={flowIndex}
            aria-labelledby={`${exercise.id}-flow-${flowIndex}`}
            className="flex flex-col gap-3 rounded-2xl border-2 p-4 md:p-5"
          >
            <h2
              id={`${exercise.id}-flow-${flowIndex}`}
              className="text-muted-foreground text-xs font-bold tracking-wider uppercase"
            >
              {flow.title}
            </h2>
            <ol className="flex flex-col gap-2">
              {flow.stages.map((stage, stageIndex) => (
                <li key={stageIndex} className="flex flex-col gap-2">
                  {stageIndex > 0 && (
                    <ArrowDownIcon
                      aria-hidden
                      className="mx-auto size-6 text-green-700"
                    />
                  )}
                  <div
                    className={cn(
                      "grid gap-3",
                      stage.length > 1 && "sm:grid-cols-2",
                    )}
                  >
                    {stage.map((slotId) => {
                      const placed = placements[slotId];
                      if (shownSlots.has(slotId)) {
                        return (
                          <SlotReference
                            key={slotId}
                            label={slotLabel(slotId)}
                            card={placed ? cardLabel(placed) : null}
                          />
                        );
                      }
                      shownSlots.add(slotId);
                      return (
                        <Slot
                          key={slotId}
                          slotId={slotId}
                          label={slotLabel(slotId)}
                          card={
                            placed
                              ? { id: placed, label: cardLabel(placed) }
                              : null
                          }
                          selected={!!placed && selected === placed}
                          disabled={disabled}
                          result={slotResult(slotId, placements, result)}
                          onPress={() => pressSlot(slotId)}
                          onDropCard={(cardId) => move(cardId, slotId)}
                        />
                      );
                    })}
                  </div>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>

      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>
    </div>
  );
}

type SlotResult = "correct" | "wrong" | null;

function slotResult(
  slotId: string,
  placements: Placements,
  result: Result | null,
): SlotResult {
  if (!result) return null;
  return placements[slotId] === result.correctPlacements[slotId]
    ? "correct"
    : "wrong";
}

function labelOf(items: ArchitectureItem[], id: string): string {
  return items.find((item) => item.id === id)?.label ?? id;
}

// Shared look of service cards (DESIGN.md §6 Cards: clickable and selected).
const cardStyles =
  "bg-card shadow-edge-secondary flex items-center gap-3 rounded-xl border-2 font-semibold transition-all duration-150 ease-out outline-none focus-visible:ring-3 focus-visible:ring-ring/50";
const interactiveStyles =
  "cursor-grab hover:border-green-200 hover:bg-green-50 motion-safe:active:translate-y-1 active:shadow-none";
const selectedStyles = "border-green-500 bg-green-50 hover:border-green-500";

function ServiceCard({
  id,
  card,
  selected,
  disabled,
  onPress,
}: {
  id: string;
  card: ArchitectureItem;
  selected: boolean;
  disabled: boolean;
  onPress: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useDraggable(ref, card.id, !disabled);

  return (
    // A div, not a <button>: Firefox can't start a native drag on buttons.
    <div
      ref={ref}
      id={id}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-pressed={selected}
      aria-disabled={disabled || undefined}
      onClick={disabled ? undefined : onPress}
      onKeyDown={disabled ? undefined : pressOnKey(onPress)}
      className={cn(
        cardStyles,
        "min-h-11 px-4 py-2 text-base",
        !disabled && interactiveStyles,
        selected && selectedStyles,
        dragging && "opacity-50",
      )}
    >
      {card.label}
    </div>
  );
}

function Slot({
  slotId,
  label,
  card,
  selected,
  disabled,
  result,
  onPress,
  onDropCard,
}: {
  slotId: string;
  label: string;
  card: ArchitectureItem | null;
  selected: boolean;
  disabled: boolean;
  result: SlotResult;
  onPress: () => void;
  onDropCard: (cardId: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useDraggable(ref, card?.id ?? null, !disabled);
  const over = useDropTarget(ref, slotId, !disabled, onDropCard);
  const labelId = `slot-${slotId}-label`;

  return (
    <div className="flex flex-col gap-1.5">
      <span id={labelId} className="text-sm font-semibold">
        {label}
      </span>
      {/* One element for empty and filled states, so focus stays put. */}
      <div
        ref={ref}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-labelledby={`${labelId} slot-${slotId}-content`}
        aria-pressed={card ? selected : undefined}
        aria-disabled={disabled || undefined}
        onClick={disabled ? undefined : onPress}
        onKeyDown={disabled ? undefined : pressOnKey(onPress)}
        className={cn(
          cardStyles,
          "min-h-14 px-4 py-3",
          !card &&
            "bg-muted text-muted-foreground border-dashed font-normal shadow-none",
          !disabled && card && interactiveStyles,
          !disabled && !card && "cursor-pointer hover:border-green-200",
          selected && selectedStyles,
          over && "border-green-500 bg-green-50",
          dragging && "opacity-50",
          result === "correct" && "border-solid border-green-500 bg-green-100",
          result === "wrong" && "border-danger bg-danger-soft border-solid",
        )}
      >
        <span id={`slot-${slotId}-content`} className="flex-1">
          {card ? card.label : "Empty, drop a service here"}
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
      </div>
    </div>
  );
}

// A slot that already appears earlier in the diagram.
function SlotReference({
  label,
  card,
}: {
  label: string;
  card: string | null;
}) {
  return (
    <div className="bg-muted text-muted-foreground flex min-h-14 flex-col justify-center rounded-xl border-2 border-dashed px-4 py-2 text-sm">
      <span className="font-semibold">{label}</span>
      <span>{card ?? "Same slot as above"}</span>
    </div>
  );
}

function DropArea({
  target,
  enabled,
  onDropCard,
  className,
  overClassName,
  children,
}: {
  target: string | null;
  enabled: boolean;
  onDropCard: (cardId: string) => void;
  className?: string;
  overClassName?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const over = useDropTarget(ref, target, enabled, onDropCard);
  return (
    <div
      ref={ref}
      className={cn(
        className,
        "transition-all duration-150 ease-out",
        over && overClassName,
      )}
    >
      {children}
    </div>
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
  cardId: string | null,
  enabled: boolean,
): boolean {
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || !cardId || !enabled) return;
    return draggable({
      element,
      getInitialData: () => ({ cardId }),
      onDragStart: () => setDragging(true),
      onDrop: () => setDragging(false),
    });
  }, [ref, cardId, enabled]);

  return dragging && enabled;
}

// `target` is a slot id, or null for the services bank. Returns whether a
// card is being dragged over it.
function useDropTarget(
  ref: RefObject<HTMLElement | null>,
  target: string | null,
  enabled: boolean,
  onDropCard: (cardId: string) => void,
): boolean {
  const [over, setOver] = useState(false);
  const drop = useEffectEvent(onDropCard);

  useEffect(() => {
    const element = ref.current;
    if (!element || !enabled) return;
    return dropTargetForElements({
      element,
      canDrop: ({ source }) => typeof source.data.cardId === "string",
      getData: () => ({ target }),
      onDragEnter: () => setOver(true),
      onDragLeave: () => setOver(false),
      onDrop: ({ source }) => {
        setOver(false);
        drop(source.data.cardId as string);
      },
    });
  }, [ref, target, enabled]);

  return over && enabled;
}
