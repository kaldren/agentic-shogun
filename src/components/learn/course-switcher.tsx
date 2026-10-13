import { CheckIcon } from "lucide-react";

import { selectCourse } from "@/app/(app)/learn/actions";
import { cn } from "@/lib/utils";

// Lets the learner pick which of their role's courses to learn (spec 010).
// Each course is a submit button, so it works without JavaScript too.
export function CourseSwitcher({
  courses,
  currentId,
}: {
  courses: { id: string; title: string }[];
  currentId: string;
}) {
  return (
    <form action={selectCourse} aria-labelledby="course-switcher-label">
      <p
        id="course-switcher-label"
        className="text-muted-foreground mb-3 text-xs font-bold tracking-wider uppercase"
      >
        Your courses
      </p>
      <ul className="grid gap-3 sm:grid-cols-2">
        {courses.map(({ id, title }) => {
          const current = id === currentId;
          return (
            <li key={id} className="flex">
              <button
                type="submit"
                name="courseId"
                value={id}
                aria-pressed={current}
                className={cn(
                  "bg-card focus-visible:ring-ring/50 flex min-h-14 w-full items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left font-bold transition-all duration-150 ease-out outline-none focus-visible:ring-3",
                  current
                    ? "border-green-500 bg-green-50"
                    : "shadow-edge-secondary hover:border-green-200 hover:bg-green-50 active:shadow-none motion-safe:active:translate-y-1",
                )}
              >
                <span className="flex-1">{title}</span>
                {current && (
                  <span
                    aria-hidden
                    className="text-primary-foreground grid size-7 shrink-0 place-items-center rounded-full bg-green-500"
                  >
                    <CheckIcon className="size-4" strokeWidth={2.5} />
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </form>
  );
}
