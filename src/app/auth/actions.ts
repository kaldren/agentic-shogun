"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { safeNextPath } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export async function signInWithGoogle(formData: FormData) {
  const next = safeNextPath(formData.get("next")?.toString());
  const requestHeaders = await headers();
  const origin =
    requestHeaders.get("origin") ?? `https://${requestHeaders.get("host")}`;

  const callbackUrl = new URL("/auth/callback", origin);
  callbackUrl.searchParams.set("next", next);

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: callbackUrl.toString() },
  });

  if (error || !data.url) {
    redirect(withAuthError(next));
  }

  redirect(data.url);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

function withAuthError(path: string) {
  const url = new URL(path, "http://localhost");
  url.searchParams.set("auth_error", "1");
  return `${url.pathname}${url.search}`;
}
