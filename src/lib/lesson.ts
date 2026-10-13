import "server-only";

import { getCompletedLessonIds, getCourseForRole } from "@/lib/course";
import { lessonStates, type LessonState } from "@/lib/learning-path";
import { getCurrentRole } from "@/lib/profile";
import { createClient } from "@/lib/supabase/server";

// What the learner sees. Solutions stay in the database (see check_answer).
export type MultipleChoiceExercise = {
  id: string;
  type: "multiple_choice";
  question: string;
  options: string[];
};
export type Exercise = MultipleChoiceExercise;

export type PlayableLesson = {
  id: string;
  title: string;
  state: Exclude<LessonState, "locked">;
  exercises: Exercise[];
};

// Returns the lesson if it is in the signed-in user's course and unlocked,
// otherwise null.
export async function getPlayableLesson(
  lessonId: string,
): Promise<PlayableLesson | null> {
  const role = await getCurrentRole();
  if (!role) return null;

  const [course, completed] = await Promise.all([
    getCourseForRole(role.id),
    getCompletedLessonIds(),
  ]);
  if (!course) return null;

  const lessons = course.sections.flatMap((section) => section.lessons);
  const lesson = lessons.find(({ id }) => id === lessonId);
  const state = lessonStates(
    lessons.map(({ id }) => id),
    completed,
  ).get(lessonId);
  if (!lesson || !state || state === "locked") return null;

  return { ...lesson, state, exercises: await getExercises(lessonId) };
}

async function getExercises(lessonId: string): Promise<Exercise[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("exercises")
    .select("id, type, content")
    .eq("lesson_id", lessonId)
    .order("position");
  if (error) throw error;

  return data.map(({ id, type, content }) => {
    if (type !== "multiple_choice" || !isMultipleChoiceContent(content)) {
      throw new Error(`Exercise ${id} has invalid content for type ${type}`);
    }
    return { id, type, question: content.question, options: content.options };
  });
}

function isMultipleChoiceContent(
  content: unknown,
): content is { question: string; options: string[] } {
  if (typeof content !== "object" || content === null) return false;
  const { question, options } = content as Record<string, unknown>;
  return (
    typeof question === "string" &&
    Array.isArray(options) &&
    options.length >= 2 &&
    options.length <= 4 &&
    options.every((option) => typeof option === "string")
  );
}
