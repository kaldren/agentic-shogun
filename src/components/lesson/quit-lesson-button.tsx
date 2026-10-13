"use client";

import { XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef } from "react";

import { Button } from "@/components/ui/button";

// The "X" in the lesson header. Asks before leaving, because progress in
// the lesson isn't saved.
export function QuitLessonButton() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const router = useRouter();

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Quit lesson"
        onClick={() => dialogRef.current?.showModal()}
        className="text-muted-foreground"
      >
        <XIcon className="size-6" strokeWidth={2.5} />
      </Button>
      <dialog
        ref={dialogRef}
        aria-labelledby="quit-title"
        aria-describedby="quit-description"
        className="bg-card text-foreground backdrop:bg-foreground/30 motion-safe:open:animate-in motion-safe:open:fade-in motion-safe:open:zoom-in-95 m-auto w-[calc(100%-2rem)] max-w-sm rounded-2xl border-2 p-6 shadow-lg shadow-green-950/5"
      >
        <div className="flex flex-col gap-2 text-center">
          <h2 id="quit-title" className="text-2xl font-bold">
            Quit?
          </h2>
          <p id="quit-description" className="text-muted-foreground">
            Your progress in this lesson will be lost.
          </p>
        </div>
        <div className="mt-6 flex flex-col gap-3">
          <Button
            type="button"
            size="lg"
            autoFocus
            className="uppercase"
            onClick={() => dialogRef.current?.close()}
          >
            Keep learning
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="text-danger-text hover:bg-danger/10"
            onClick={() => router.push("/learn")}
          >
            Quit
          </Button>
        </div>
      </dialog>
    </>
  );
}
