"use client";

import { TrophyIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Button, buttonVariants } from "@/components/ui/button";

type SaveState = "saving" | "saved" | "error";

// Shown when every exercise is answered correctly. Saves the completion
// once, then lets the learner go back to the path.
export function LessonComplete({
  title,
  save,
}: {
  title: string;
  save: () => Promise<void>;
}) {
  const [state, setState] = useState<SaveState>("saving");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    save().then(
      () => !cancelled && setState("saved"),
      () => !cancelled && setState("error"),
    );
    return () => {
      cancelled = true;
    };
    // `save` is stable for this screen; re-run only on retry.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attempt]);

  return (
    <main className="bg-gradient-soft flex min-h-dvh flex-col items-center justify-center gap-6 px-4 py-12 text-center">
      <span className="bg-gradient-brand motion-safe:animate-in motion-safe:zoom-in-50 grid size-28 place-items-center rounded-full text-white motion-safe:duration-500">
        <TrophyIcon aria-hidden className="size-14" strokeWidth={2.5} />
      </span>
      <h1 className="text-4xl leading-[1.1] font-extrabold tracking-tight md:text-6xl">
        Lesson complete!
      </h1>
      <p className="text-muted-foreground max-w-prose text-lg">
        You finished &ldquo;{title}&rdquo;. Keep going!
      </p>
      <div role="status" aria-live="polite">
        {state === "saving" && (
          <Button size="lg" disabled className="min-w-48 uppercase">
            Saving…
          </Button>
        )}
        {state === "saved" && (
          <Link
            href="/learn"
            autoFocus
            className={buttonVariants({
              size: "lg",
              className: "min-w-48 uppercase",
            })}
          >
            Continue
          </Link>
        )}
        {state === "error" && (
          <div className="flex flex-col items-center gap-3">
            <p className="text-danger-text font-semibold">
              We couldn&apos;t save your progress.
            </p>
            <Button
              size="lg"
              className="min-w-48 uppercase"
              onClick={() => {
                setState("saving");
                setAttempt((n) => n + 1);
              }}
            >
              Try again
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
