import { NextResponse, type NextRequest } from "next/server";

import { safeNextPath, signInErrorPath } from "@/lib/paths";
import { createClient } from "@/lib/supabase/server";

// Google redirects here (through Supabase) after the consent screen.
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const next = safeNextPath(searchParams.get("next"));
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const flowId = searchParams.get("sb_flow_id");
    const { error } = await supabase.auth.exchangeCodeForSession(
      code,
      flowId ? { flowId } : undefined,
    );
    if (!error) {
      return NextResponse.redirect(new URL(next, request.url));
    }
  }

  // Missing code, cancelled consent or failed exchange.
  return NextResponse.redirect(new URL(signInErrorPath(next), request.url));
}
