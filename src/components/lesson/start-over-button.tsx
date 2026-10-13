"use client";

import { RotateCcwIcon } from "lucide-react";
import { useRef } from "react";

import { ConfirmDialog } from "@/components/lesson/confirm-dialog";
import { Button } from "@/components/ui/button";

// Next to the quit button. Asks, then restarts the lesson from the first
// exercise.
export function StartOverButton({
  disabled,
  onStartOver,
}: {
  disabled?: boolean;
  onStartOver: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Start over"
        disabled={disabled}
        onClick={() => dialogRef.current?.showModal()}
        className="text-muted-foreground"
      >
        <RotateCcwIcon className="size-6" strokeWidth={2.5} />
      </Button>
      <ConfirmDialog
        ref={dialogRef}
        id="start-over"
        title="Start over?"
        description="You'll go back to the first exercise, and your progress in this lesson will be cleared."
        stayLabel="Keep going"
        actionLabel="Start over"
        onAction={onStartOver}
      />
    </>
  );
}
