import "server-only";

import { getCurrentUser } from "@/lib/auth";
import { findRole, type Role } from "@/lib/roles";
import { createClient } from "@/lib/supabase/server";

// Returns the signed-in user's role, or null if they haven't picked one
// (or the stored id is no longer in ROLES).
export async function getCurrentRole(): Promise<Role | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle<{ role: string }>();
  if (error) throw error;

  return findRole(data?.role);
}
