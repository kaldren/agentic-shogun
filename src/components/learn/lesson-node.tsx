import { CheckIcon, LockIcon, StarIcon } from "lucide-react";
import Link from "next/link";

import type { LessonState } from "@/lib/learning-path";
import { cn } from "@/lib/utils";

// Zig-zag offsets for the path, repeating every 8 lessons.
const OFFSETS = [
  "translate-x-0",
  "translate-x-10",
  "translate-x-20",
  "translate-x-10",
  "translate-x-0",
  "-translate-x-10",
  "-translate-x-20",
  "-translate-x-10",
];

const circle =
  "grid place-items-center rounded-full border-2 transition-all duration-150 ease-out";
const pressable =
  "motion-safe:group-active:translate-y-1 group-active:shadow-none";

export function LessonNode({
  id,
  title,
  state,
  inProgress = false,
  index,
}: {
  id: string;
  title: string;
  state: LessonState;
  // Started but not finished (spec 009): the badge says "Continue".
  inProgress?: boolean;
  index: number;
}) {
  const offset = OFFSETS[index % OFFSETS.length];
  const label = (
    <span
      className={cn(
        "w-40 text-center text-sm font-semibold",
        state === "locked" ? "text-muted-foreground" : "text-foreground",
      )}
    >
      {title}
    </span>
  );

  return (
    <li className="flex justify-center">
      {state === "locked" ? (
        <div className={cn("flex flex-col items-center gap-2", offset)}>
          <span
            className={cn(circle, "bg-muted text-muted-foreground size-18")}
          >
            <LockIcon aria-hidden className="size-7" />
          </span>
          {label}
          <span className="sr-only">Locked</span>
        </div>
      ) : (
        <Link
          href={`/lesson/${id}`}
          className={cn(
            "group focus-visible:ring-ring/50 flex flex-col items-center gap-2 rounded-2xl p-1 outline-none focus-visible:ring-3",
            offset,
          )}
        >
          {state === "current" ? (
            <>
              <span className="relative rounded-xl border-2 bg-white px-3 py-1 text-sm font-bold text-green-800 uppercase">
                {inProgress ? "Continue" : "Start"}
                <span
                  aria-hidden
                  className="absolute -bottom-1.5 left-1/2 size-2.5 -translate-x-1/2 rotate-45 border-r-2 border-b-2 bg-white"
                />
              </span>
              <span
                className={cn(
                  circle,
                  pressable,
                  "bg-gradient-button shadow-edge-primary size-20 border-green-500 text-white group-hover:brightness-105",
                )}
              >
                <StarIcon aria-hidden className="size-9 fill-current" />
              </span>
            </>
          ) : (
            <span
              className={cn(
                circle,
                pressable,
                "size-18 border-green-200 bg-green-100 text-green-700 shadow-[0_4px_0_var(--color-green-200)] group-hover:bg-green-50",
              )}
            >
              <CheckIcon aria-hidden className="size-8" strokeWidth={3} />
            </span>
          )}
          {label}
          {state === "done" && <span className="sr-only">Done</span>}
        </Link>
      )}
    </li>
  );
}
