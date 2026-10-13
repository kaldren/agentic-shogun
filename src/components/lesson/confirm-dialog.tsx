"use client";

import type { RefObject } from "react";

import { Button } from "@/components/ui/button";

// A small modal that asks before a lesson action (quit, start over). The
// safe choice is the main button and has focus; the action is the red one.
export function ConfirmDialog({
  ref,
  id,
  title,
  description,
  stayLabel,
  actionLabel,
  onAction,
}: {
  ref: RefObject<HTMLDialogElement | null>;
  id: string;
  title: string;
  description: string;
  stayLabel: string;
  actionLabel: string;
  onAction: () => void;
}) {
  return (
    <dialog
      ref={ref}
      aria-labelledby={`${id}-title`}
      aria-describedby={`${id}-description`}
      className="bg-card text-foreground backdrop:bg-foreground/30 motion-safe:open:animate-in motion-safe:open:fade-in motion-safe:open:zoom-in-95 m-auto w-[calc(100%-2rem)] max-w-sm rounded-2xl border-2 p-6 shadow-lg shadow-green-950/5"
    >
      <div className="flex flex-col gap-2 text-center">
        <h2 id={`${id}-title`} className="text-2xl font-bold">
          {title}
        </h2>
        <p id={`${id}-description`} className="text-muted-foreground">
          {description}
        </p>
      </div>
      <div className="mt-6 flex flex-col gap-3">
        <Button
          type="button"
          size="lg"
          autoFocus
          className="uppercase"
          onClick={() => ref.current?.close()}
        >
          {stayLabel}
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="text-danger-text hover:bg-danger/10"
          onClick={() => {
            ref.current?.close();
            onAction();
          }}
        >
          {actionLabel}
        </Button>
      </div>
    </dialog>
  );
}
