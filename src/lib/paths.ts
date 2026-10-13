// Only allow same-site relative paths, to avoid open redirects.
export function safeNextPath(next: string | null | undefined): string {
  if (!next || !next.startsWith("/") || next.startsWith("//")) return "/";
  return next;
}

// Where to send a signed-out user after a failed sign-in. Only the landing
// page is public, so the error is shown there and `next` is kept.
export function signInErrorPath(next: string): string {
  const params = new URLSearchParams({ auth_error: "1" });
  if (next !== "/" && !next.startsWith("/?")) params.set("next", next);
  return `/?${params}`;
}
