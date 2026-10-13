import { redirect } from "next/navigation";
import { Suspense } from "react";

import { LessonPlayer } from "@/components/lesson/lesson-player";
import { getCurrentUser } from "@/lib/auth";
import { getPlayableLesson } from "@/lib/lesson";

// Full-screen lesson, outside the (app) group: no header, no navigation.
export default function LessonPage({ params }: PageProps<"/lesson/[id]">) {
  return (
    <Suspense fallback={<LessonSkeleton />}>
      <Lesson params={params} />
    </Suspense>
  );
}

async function Lesson({ params }: Pick<PageProps<"/lesson/[id]">, "params">) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) redirect(`/?next=/lesson/${encodeURIComponent(id)}`);

  const lesson = await getPlayableLesson(id);
  if (!lesson || lesson.exercises.length === 0) redirect("/learn");

  return (
    <LessonPlayer
      lessonId={lesson.id}
      title={lesson.title}
      exercises={lesson.exercises}
      initialProgress={lesson.progress}
    />
  );
}

function LessonSkeleton() {
  return (
    <div aria-hidden className="flex min-h-dvh flex-col">
      <div className="mx-auto flex w-full max-w-2xl items-center gap-4 px-4 pt-6 md:px-6">
        <div className="size-11" />
        <div className="h-4 flex-1 rounded-full bg-green-200" />
      </div>
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-3 px-4 py-8 md:px-6 md:py-12">
        <div className="bg-muted mb-3 h-9 w-3/4 rounded-xl motion-safe:animate-pulse" />
        {Array.from({ length: 4 }, (_, i) => (
          <div
            key={i}
            className="bg-muted h-14 rounded-2xl motion-safe:animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}
