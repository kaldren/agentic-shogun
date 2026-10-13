"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";
import { getCoursesForRole } from "@/lib/course";
import { getCurrentRole } from "@/lib/profile";
import { createClient } from "@/lib/supabase/server";

// Makes a course of the user's role the one they are learning (spec 010).
// Courses of other roles are ignored; row-level security checks it too.
export async function selectCourse(formData: FormData): Promise<void> {
  const user = await getCurrentUser();
  if (!user) redirect("/?next=/learn");

  const role = await getCurrentRole();
  if (!role) redirect("/welcome");

  const courseId = formData.get("courseId")?.toString();
  const courses = await getCoursesForRole(role.id);
  if (!courses.some(({ id }) => id === courseId)) return;

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({
      current_course_id: courseId,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);
  if (error) throw error;

  revalidatePath("/learn");
}
