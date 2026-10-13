"use client";

// Drag and drop shared by the lesson exercises (architecture, categorize):
// native drag with Pragmatic drag and drop, plus key handling for the
// tap-and-keyboard path.

import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/adapter/element-adapter";
import {
  useEffect,
  useEffectEvent,
  useState,
  type KeyboardEvent,
  type RefObject,
} from "react";

// Enter and Space activate role="button" elements, like real buttons.
export function pressOnKey(onPress: () => void) {
  return (event: KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onPress();
    }
  };
}

export function useDraggable(
  ref: RefObject<HTMLElement | null>,
  dragId: string | null,
  enabled: boolean,
): boolean {
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || !dragId || !enabled) return;
    return draggable({
      element,
      getInitialData: () => ({ dragId }),
      onDragStart: () => setDragging(true),
      onDrop: () => setDragging(false),
    });
  }, [ref, dragId, enabled]);

  return dragging && enabled;
}

// `target` names the drop area, e.g. a slot id, or null for the bank of
// items. Returns whether an item is being dragged over it.
export function useDropTarget(
  ref: RefObject<HTMLElement | null>,
  target: string | null,
  enabled: boolean,
  onDropItem: (dragId: string) => void,
): boolean {
  const [over, setOver] = useState(false);
  const drop = useEffectEvent(onDropItem);

  useEffect(() => {
    const element = ref.current;
    if (!element || !enabled) return;
    return dropTargetForElements({
      element,
      canDrop: ({ source }) => typeof source.data.dragId === "string",
      getData: () => ({ target }),
      onDragEnter: () => setOver(true),
      onDragLeave: () => setOver(false),
      onDrop: ({ source }) => {
        setOver(false);
        drop(source.data.dragId as string);
      },
    });
  }, [ref, target, enabled]);

  return over && enabled;
}
