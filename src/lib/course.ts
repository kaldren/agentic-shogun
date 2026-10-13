import "server-only";

import type { RoleId } from "@/lib/roles";
import { createClient } from "@/lib/supabase/server";

export type Lesson = { id: string; title: string };
export type Section = { id: string; title: string; lessons: Lesson[] };
export type Course = { id: string; title: string; sections: Section[] };

const byPosition = (a: { position: number }, b: { position: number }) =>
  a.position - b.position;

// Loads the course for a role, with sections and lessons in order.
// Returns null if the role has no course yet.
export async function getCourseForRole(role: RoleId): Promise<Course | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("courses")
    .select(
      "id, title, sections (id, title, position, lessons (id, title, position))",
    )
    .eq("role", role)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;

  return {
    id: data.id,
    title: data.title,
    sections: data.sections.toSorted(byPosition).map((section) => ({
      id: section.id,
      title: section.title,
      lessons: section.lessons
        .toSorted(byPosition)
        .map(({ id, title }) => ({ id, title })),
    })),
  };
}

// Ids of the lessons the signed-in user has completed. Progress is stored
// from spec 006; until then nobody has completed anything.
export async function getCompletedLessonIds(): Promise<Set<string>> {
  return new Set();
}
