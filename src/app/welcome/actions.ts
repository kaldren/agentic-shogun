"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";
import { findRole } from "@/lib/roles";
import { createClient } from "@/lib/supabase/server";

export type SaveRoleState = { error: string } | null;

export async function saveRole(
  _prev: SaveRoleState,
  formData: FormData,
): Promise<SaveRoleState> {
  const user = await getCurrentUser();
  if (!user) redirect("/?next=/welcome");

  const role = findRole(formData.get("role")?.toString());
  if (!role) return { error: "Please pick a role." };

  const supabase = await createClient();
  const { error } = await supabase.from("profiles").upsert({
    id: user.id,
    role: role.id,
    updated_at: new Date().toISOString(),
  });
  if (error) return { error: "We couldn't save your role. Please try again." };

  // Pages already visited show the role, so they must not come from the
  // client router cache.
  revalidatePath("/", "layout");
  redirect("/learn");
}
