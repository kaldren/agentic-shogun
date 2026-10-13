import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { safeNextPath } from "@/lib/paths";

import type { Database } from "./database.types";
import { supabasePublishableKey, supabaseUrl } from "./env";

// Pages that signed-out visitors can open. Everything else needs sign-in.
function isPublicPath(pathname: string) {
  return pathname === "/" || pathname.startsWith("/auth/");
}

// Refreshes the auth session on every request and writes the updated
// cookies to both the request (for Server Components) and the response.
// Also sends signed-out visitors from private pages to the landing page,
// and signed-in users from the landing page into the app. Pages still
// check the user themselves; this is only the optimistic first check.
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    supabaseUrl,
    supabasePublishableKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
          Object.entries(headers).forEach(([key, value]) =>
            response.headers.set(key, value),
          );
        },
      },
    },
  );

  // Don't run code between createServerClient and getClaims: it refreshes
  // the session if needed.
  const { data } = await supabase.auth.getClaims();
  const signedIn = Boolean(data?.claims);
  const { pathname, search, searchParams } = request.nextUrl;

  if (!signedIn && !isPublicPath(pathname)) {
    const target = new URL("/", request.url);
    target.searchParams.set("next", `${pathname}${search}`);
    return redirectKeepingCookies(target, response);
  }

  if (signedIn && pathname === "/") {
    const next = safeNextPath(searchParams.get("next"));
    const target = next === "/" || next.startsWith("/?") ? "/learn" : next;
    return redirectKeepingCookies(new URL(target, request.url), response);
  }

  return response;
}

// A redirect must carry the refreshed session cookies too, or the user
// would be signed out on the next request.
function redirectKeepingCookies(url: URL, response: NextResponse) {
  const redirect = NextResponse.redirect(url);
  response.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
  response.headers.forEach((value, key) => {
    if (key === "cache-control" || key === "expires" || key === "pragma") {
      redirect.headers.set(key, value);
    }
  });
  return redirect;
}
