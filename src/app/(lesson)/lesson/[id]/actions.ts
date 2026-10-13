"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { Placements } from "@/lib/architecture";
import { getCurrentUser } from "@/lib/auth";
import { getPlayableLesson } from "@/lib/lesson";
import { createClient } from "@/lib/supabase/server";

export type Answer =
  | { type: "multiple_choice"; choice: number }
  | { type: "architecture"; placements: Placements };

export type AnswerResult = { correct: boolean; explanation: string } & (
  | { type: "multiple_choice"; correctChoice: number }
  | { type: "architecture"; correctPlacements: Placements }
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
      answer:
        answer.type === "multiple_choice"
          ? { choice: answer.choice }
          : { placements: answer.placements },
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
  const solution = data.solution as { slots: Placements };
  return {
    type: answer.type,
    correct,
    explanation,
    correctPlacements: solution.slots,
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
