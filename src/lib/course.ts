import "server-only";

import { getCurrentUser } from "@/lib/auth";
import { currentCourseId } from "@/lib/learning-path";
import type { RoleId } from "@/lib/roles";
import { createClient } from "@/lib/supabase/server";

export type Lesson = { id: string; title: string };
export type Section = { id: string; title: string; lessons: Lesson[] };
export type Course = { id: string; title: string; sections: Section[] };

const byPosition = (a: { position: number }, b: { position: number }) =>
  a.position - b.position;

// Loads the courses of a role in order (spec 010), each with its sections
// and lessons in order. Empty if the role has no course yet.
export async function getCoursesForRole(role: RoleId): Promise<Course[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("courses")
    .select(
      "id, title, position, sections (id, title, position, lessons (id, title, position))",
    )
    .eq("role", role)
    .order("position");
  if (error) throw error;

  return data.map((course) => ({
    id: course.id,
    title: course.title,
    sections: course.sections.toSorted(byPosition).map((section) => ({
      id: section.id,
      title: section.title,
      lessons: section.lessons
        .toSorted(byPosition)
        .map(({ id, title }) => ({ id, title })),
    })),
  }));
}

// The courses of a role and the one the signed-in user is learning, which
// is null if the role has no course yet.
export async function getCurrentCourse(
  role: RoleId,
): Promise<{ courses: Course[]; course: Course | null }> {
  const [courses, picked] = await Promise.all([
    getCoursesForRole(role),
    getPickedCourseId(),
  ]);
  const id = currentCourseId(
    courses.map(({ id }) => id),
    picked,
  );
  return {
    courses,
    course: courses.find((course) => course.id === id) ?? null,
  };
}

// The course the signed-in user picked, or null if they never did.
async function getPickedCourseId(): Promise<string | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("current_course_id")
    .eq("id", user.id)
    .maybeSingle();
  if (error) throw error;
  return data?.current_course_id ?? null;
}

// Ids of the lessons the signed-in user has completed.
export async function getCompletedLessonIds(): Promise<Set<string>> {
  const user = await getCurrentUser();
  if (!user) return new Set();

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("lesson_progress")
    .select("lesson_id")
    .eq("user_id", user.id);
  if (error) throw error;

  return new Set(data.map(({ lesson_id }) => lesson_id));
}

// Ids of the lessons the signed-in user has started but not finished
// (spec 009). Row-level security only returns their own attempts.
export async function getInProgressLessonIds(): Promise<Set<string>> {
  const user = await getCurrentUser();
  if (!user) return new Set();

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("lesson_attempts")
    .select("lesson_id");
  if (error) throw error;

  return new Set(data.map(({ lesson_id }) => lesson_id));
}

// Number of lessons the signed-in user has completed.
export async function getCompletedLessonCount(): Promise<number> {
  return (await getCompletedLessonIds()).size;
}
