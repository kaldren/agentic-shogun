"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";
import { getPlayableLesson } from "@/lib/lesson";
import { createClient } from "@/lib/supabase/server";

export type AnswerResult = {
  correct: boolean;
  correctChoice: number;
  explanation: string;
};

// Checks a multiple-choice answer in the database, so solutions never
// reach the browser before the learner answers.
export async function checkAnswer(
  exerciseId: string,
  choice: number,
): Promise<AnswerResult> {
  const user = await getCurrentUser();
  if (!user) redirect("/");

  const supabase = await createClient();
  const { data, error } = await supabase
    .rpc("check_answer", { exercise_id: exerciseId, answer: { choice } })
    .single();
  if (error) throw error;

  const solution = data.solution as { correct: number };
  return {
    correct: data.correct,
    correctChoice: solution.correct,
    explanation: data.explanation,
  };
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

  // /learn and /profile show progress, so drop their cached versions.
  revalidatePath("/", "layout");
}
