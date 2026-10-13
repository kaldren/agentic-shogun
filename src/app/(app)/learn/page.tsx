import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { CourseSwitcher } from "@/components/learn/course-switcher";
import { LessonNode } from "@/components/learn/lesson-node";
import { buttonVariants } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { getCurrentUser } from "@/lib/auth";
import {
  getCompletedLessonIds,
  getCurrentCourse,
  getInProgressLessonIds,
} from "@/lib/course";
import { lessonStates } from "@/lib/learning-path";
import { getCurrentRole } from "@/lib/profile";
import type { Role } from "@/lib/roles";

export default function LearnPage() {
  return (
    <main className="bg-gradient-soft flex flex-1 flex-col">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-10 px-4 py-8 md:px-6 md:py-12">
        <Suspense fallback={<PathSkeleton />}>
          <LearningPath />
        </Suspense>
      </div>
    </main>
  );
}

async function LearningPath() {
  const user = await getCurrentUser();
  if (!user) redirect("/?next=/learn");

  const role = await getCurrentRole();
  if (!role) redirect("/welcome");

  const [{ courses, course }, completed, inProgress] = await Promise.all([
    getCurrentCourse(role.id),
    getCompletedLessonIds(),
    getInProgressLessonIds(),
  ]);
  if (!course) return <ComingSoon role={role} />;

  const states = lessonStates(
    course.sections.flatMap((section) => section.lessons.map(({ id }) => id)),
    completed,
  );
  // The section with the current lesson, or the last one when all are done.
  const withCurrent = course.sections.findIndex((section) =>
    section.lessons.some(({ id }) => states.get(id) === "current"),
  );
  const sectionIndex =
    withCurrent === -1 ? course.sections.length - 1 : withCurrent;
  const currentSection = course.sections[sectionIndex];
  const doneInSection =
    currentSection?.lessons.filter(({ id }) => states.get(id) === "done")
      .length ?? 0;

  return (
    <>
      {courses.length > 1 && (
        <CourseSwitcher courses={courses} currentId={course.id} />
      )}

      <header className="flex flex-col gap-2">
        <p className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
          Your course
        </p>
        <h1 className="text-3xl leading-[1.15] font-extrabold tracking-tight md:text-[2.5rem]">
          {course.title}
        </h1>
      </header>

      {currentSection && (
        <section
          aria-label="Current section"
          className="bg-card flex flex-col gap-3 rounded-2xl border-2 p-5 md:p-6"
        >
          <p className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
            Section {sectionIndex + 1}
          </p>
          <h2 className="text-xl font-bold md:text-2xl">
            {currentSection.title}
          </h2>
          <div className="flex items-center gap-3">
            <ProgressBar
              value={doneInSection}
              max={currentSection.lessons.length}
              label="Lessons done in this section"
              className="flex-1"
            />
            <span className="text-muted-foreground shrink-0 text-sm font-semibold">
              {doneInSection} / {currentSection.lessons.length} lessons
            </span>
          </div>
        </section>
      )}

      {course.sections.map((section, i) => (
        <section
          key={section.id}
          aria-labelledby={`section-${section.id}`}
          className="flex flex-col gap-8"
        >
          <div className="flex items-center gap-4">
            <span className="bg-border h-0.5 flex-1" />
            <h2
              id={`section-${section.id}`}
              className="text-muted-foreground text-center text-sm font-semibold"
            >
              <span className="sr-only">Section {i + 1}: </span>
              {section.title}
            </h2>
            <span className="bg-border h-0.5 flex-1" />
          </div>
          <ol className="flex flex-col gap-6">
            {section.lessons.map((lesson, j) => (
              <LessonNode
                key={lesson.id}
                id={lesson.id}
                title={lesson.title}
                state={states.get(lesson.id) ?? "locked"}
                inProgress={inProgress.has(lesson.id)}
                index={j}
              />
            ))}
          </ol>
        </section>
      ))}
    </>
  );
}

function ComingSoon({ role }: { role: Role }) {
  const Icon = role.icon;
  return (
    <section className="flex flex-col items-center gap-4 py-8 text-center">
      <span className="grid size-16 place-items-center rounded-2xl bg-green-100 text-green-700">
        <Icon className="size-8" aria-hidden />
      </span>
      <h1 className="text-3xl leading-[1.15] font-extrabold tracking-tight md:text-[2.5rem]">
        Your course is coming soon
      </h1>
      <p className="text-muted-foreground max-w-prose text-lg">
        We&apos;re creating AI lessons for {role.name}. Check back soon, or pick
        another role to start learning now.
      </p>
      <Link
        href="/welcome"
        className={buttonVariants({ variant: "secondary" })}
      >
        Change role
      </Link>
    </section>
  );
}

function PathSkeleton() {
  return (
    <div aria-hidden className="flex flex-col gap-10">
      <div className="bg-muted h-12 w-2/3 rounded-xl motion-safe:animate-pulse" />
      <div className="bg-muted h-32 rounded-2xl motion-safe:animate-pulse" />
      <div className="flex flex-col items-center gap-8">
        {Array.from({ length: 3 }, (_, i) => (
          <div
            key={i}
            className="bg-muted size-18 rounded-full motion-safe:animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}
