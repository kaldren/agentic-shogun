import "server-only";

import {
  isArchitectureContent,
  type ArchitectureContent,
} from "@/lib/architecture";
import { isCategorizeContent, type CategorizeContent } from "@/lib/categorize";
import { getCompletedLessonIds, getCoursesForRole } from "@/lib/course";
import { lessonStates, type LessonState } from "@/lib/learning-path";
import { resumeProgress, type LessonProgress } from "@/lib/lesson-progress";
import { isOrderingContent, type OrderingContent } from "@/lib/ordering";
import { getCurrentRole } from "@/lib/profile";
import { createClient } from "@/lib/supabase/server";
import {
  isSystemBuilderContent,
  type SystemBuilderContent,
} from "@/lib/system-builder";

// What the learner sees. Solutions stay in the database (see check_answer).
export type MultipleChoiceExercise = {
  id: string;
  type: "multiple_choice";
  question: string;
  options: string[];
};
export type ArchitectureExercise = ArchitectureContent & {
  id: string;
  type: "architecture";
};
export type SystemBuilderExercise = SystemBuilderContent & {
  id: string;
  type: "system_builder";
};
export type OrderingExercise = OrderingContent & {
  id: string;
  type: "ordering";
};
export type CategorizeExercise = CategorizeContent & {
  id: string;
  type: "categorize";
};
export type Exercise =
  | MultipleChoiceExercise
  | ArchitectureExercise
  | SystemBuilderExercise
  | OrderingExercise
  | CategorizeExercise;

export type PlayableLesson = {
  id: string;
  title: string;
  state: Exclude<LessonState, "locked">;
  exercises: Exercise[];
  // Where to continue: saved progress, or the first exercise.
  progress: LessonProgress;
};

// Returns the lesson if it is in one of the signed-in user's courses and
// unlocked, otherwise null.
export async function getPlayableLesson(
  lessonId: string,
): Promise<PlayableLesson | null> {
  const role = await getCurrentRole();
  if (!role) return null;

  const [courses, completed] = await Promise.all([
    getCoursesForRole(role.id),
    getCompletedLessonIds(),
  ]);

  // Any course of the role can be played, not only the current one. Lessons
  // unlock in order within their own course.
  const lessons = courses
    .map((course) => course.sections.flatMap((section) => section.lessons))
    .find((lessons) => lessons.some(({ id }) => id === lessonId));
  if (!lessons) return null;

  const lesson = lessons.find(({ id }) => id === lessonId);
  const state = lessonStates(
    lessons.map(({ id }) => id),
    completed,
  ).get(lessonId);
  if (!lesson || !state || state === "locked") return null;

  const [exercises, saved] = await Promise.all([
    getExercises(lessonId),
    getSavedProgress(lessonId),
  ]);
  const progress = resumeProgress(
    exercises.map(({ id }) => id),
    saved,
  );
  return { ...lesson, state, exercises, progress };
}

// The signed-in user's saved place in a lesson. Row-level security only
// returns their own attempt.
async function getSavedProgress(
  lessonId: string,
): Promise<LessonProgress | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("lesson_attempts")
    .select("queue, done")
    .eq("lesson_id", lessonId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

async function getExercises(lessonId: string): Promise<Exercise[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("exercises")
    .select("id, type, content")
    .eq("lesson_id", lessonId)
    .order("position");
  if (error) throw error;

  return data.map(({ id, type, content }): Exercise => {
    if (type === "multiple_choice" && isMultipleChoiceContent(content)) {
      return { id, type, question: content.question, options: content.options };
    }
    if (type === "architecture" && isArchitectureContent(content)) {
      const { question, scenario, slots, cards, flows, noun } = content;
      return { id, type, question, scenario, slots, cards, flows, noun };
    }
    if (type === "system_builder" && isSystemBuilderContent(content)) {
      const { question, scenario, nodes, noun } = content;
      return { id, type, question, scenario, nodes, noun };
    }
    if (type === "ordering" && isOrderingContent(content)) {
      const { question, scenario, items } = content;
      return { id, type, question, scenario, items };
    }
    if (type === "categorize" && isCategorizeContent(content)) {
      const { question, buckets, items } = content;
      return { id, type, question, buckets, items };
    }
    throw new Error(`Exercise ${id} has invalid content for type ${type}`);
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
