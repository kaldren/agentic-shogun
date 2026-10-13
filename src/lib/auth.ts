import "server-only";

import { connection } from "next/server";

import { createClient } from "@/lib/supabase/server";

export type CurrentUser = {
  id: string;
  email: string | null;
  name: string;
  avatarUrl: string | null;
};

// Returns the signed-in user, or null. Works in Server Components,
// Route Handlers and Server Actions.
export async function getCurrentUser(): Promise<CurrentUser | null> {
  // getClaims() compares the token expiry with Date.now(), so this must
  // run at request time, not while prerendering.
  await connection();
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data) return null;

  const { sub, email, user_metadata: meta = {} } = data.claims;
  const name =
    (meta.full_name as string | undefined) ??
    (meta.name as string | undefined) ??
    email ??
    "User";

  return {
    id: sub,
    email: email ?? null,
    name,
    avatarUrl:
      (meta.avatar_url as string | undefined) ??
      (meta.picture as string | undefined) ??
      null,
  };
}
