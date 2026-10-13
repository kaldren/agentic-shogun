"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { Placements } from "@/lib/architecture";
import { getCurrentUser } from "@/lib/auth";
import { getPlayableLesson } from "@/lib/lesson";
import type { LessonProgress } from "@/lib/lesson-progress";
import { createClient } from "@/lib/supabase/server";
import type { Connection } from "@/lib/system-builder";

export type Answer =
  | { type: "multiple_choice"; choice: number }
  | { type: "architecture"; placements: Placements }
  | { type: "system_builder"; nodes: string[]; connections: Connection[] };

export type AnswerResult = { correct: boolean; explanation: string } & (
  | { type: "multiple_choice"; correctChoice: number }
  | { type: "architecture"; correctPlacements: Placements }
  | {
      type: "system_builder";
      correctNodes: string[];
      correctConnections: Connection[];
    }
);

// Checks an answer in the database, so solutions never reach the browser
// before the learner answers.
export async function checkAnswer(
  exerciseId: string,
  answer: Answer,
): Promise<AnswerResult> {
  const user = await getCurrentUser();
  if (!user) redirect("/");

  const supabase = await createClient();
  const { data, error } = await supabase
    .rpc("check_answer", {
      exercise_id: exerciseId,
      answer: toRpcAnswer(answer),
    })
    .single();
  if (error) throw error;

  const { correct, explanation } = data;
  if (answer.type === "multiple_choice") {
    const solution = data.solution as { correct: number };
    return {
      type: answer.type,
      correct,
      explanation,
      correctChoice: solution.correct,
    };
  }
  if (answer.type === "architecture") {
    const solution = data.solution as { slots: Placements };
    return {
      type: answer.type,
      correct,
      explanation,
      correctPlacements: solution.slots,
    };
  }
  const solution = data.solution as {
    nodes: string[];
    connections: Connection[];
  };
  return {
    type: answer.type,
    correct,
    explanation,
    correctNodes: solution.nodes,
    correctConnections: solution.connections,
  };
}

// The answer as check_answer expects it, without the type tag.
function toRpcAnswer(answer: Answer) {
  switch (answer.type) {
    case "multiple_choice":
      return { choice: answer.choice };
    case "architecture":
      return { placements: answer.placements };
    case "system_builder":
      return { nodes: answer.nodes, connections: answer.connections };
  }
}

// Saves the lesson as completed. Repeating a done lesson keeps the first
// completion.
export async function completeLesson(lessonId: string): Promise<void> {
  const user = await getCurrentUser();
  if (!user) redirect("/");

  const lesson = await getPlayableLesson(lessonId);
  if (!lesson) throw new Error("Lesson is locked or unknown");

  const supabase = await createClient();
  const { error } = await supabase
    .from("lesson_progress")
    .upsert(
      { user_id: user.id, lesson_id: lessonId },
      { onConflict: "user_id,lesson_id", ignoreDuplicates: true },
    );
  if (error) throw error;

  // The next visit starts from the first exercise.
  await deleteAttempt(user.id, lessonId);

  // /learn and /profile show progress, so drop their cached versions.
  revalidatePath("/", "layout");
}

// Saves where the learner is in a lesson, so they can resume it later.
// Ids that aren't exercises of this lesson are dropped.
export async function saveLessonProgress(
  lessonId: string,
  progress: LessonProgress,
): Promise<void> {
  const user = await getCurrentUser();
  if (!user) redirect("/");

  const supabase = await createClient();
  const { data: exercises, error: exercisesError } = await supabase
    .from("exercises")
    .select("id")
    .eq("lesson_id", lessonId);
  if (exercisesError) throw exercisesError;

  const ids = new Set(exercises.map(({ id }) => id));
  const ofLesson = (list: unknown) =>
    Array.isArray(list) ? list.filter((id) => ids.has(id)) : [];

  const { error } = await supabase.from("lesson_attempts").upsert(
    {
      user_id: user.id,
      lesson_id: lessonId,
      queue: ofLesson(progress.queue),
      done: ofLesson(progress.done),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,lesson_id" },
  );
  if (error) throw error;

  // /learn shows "Continue" for lessons in progress.
  revalidatePath("/learn");
}

// Forgets where the learner is, so the lesson starts from the first
// exercise. Completion on the path is kept.
export async function restartLesson(lessonId: string): Promise<void> {
  const user = await getCurrentUser();
  if (!user) redirect("/");

  await deleteAttempt(user.id, lessonId);
  revalidatePath("/learn");
}

async function deleteAttempt(userId: string, lessonId: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("lesson_attempts")
    .delete()
    .eq("user_id", userId)
    .eq("lesson_id", lessonId);
  if (error) throw error;
}
