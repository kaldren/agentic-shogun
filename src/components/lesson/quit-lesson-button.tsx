"use client";

import { XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef } from "react";

import { ConfirmDialog } from "@/components/lesson/confirm-dialog";
import { Button } from "@/components/ui/button";

// The "X" in the lesson header. Asks before leaving; progress is saved, so
// the lesson can be continued later.
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
      <ConfirmDialog
        ref={dialogRef}
        id="quit"
        title="Quit?"
        description="Your progress is saved. You can continue this lesson later."
        stayLabel="Keep learning"
        actionLabel="Quit"
        onAction={() => router.push("/learn")}
      />
    </>
  );
}
