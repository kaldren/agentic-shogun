"use client";

import { useSearchParams } from "next/navigation";

import { signInWithGoogle } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { safeNextPath } from "@/lib/paths";

// Starts Google sign-in. After sign-in the user goes to the page they
// originally asked for (?next=), or into the app.
export function GetStartedButton() {
  const searchParams = useSearchParams();
  const next = safeNextPath(searchParams.get("next"));

  return (
    <form action={signInWithGoogle}>
      <input type="hidden" name="next" value={next === "/" ? "/learn" : next} />
      <Button type="submit" size="lg" className="uppercase">
        Get started
      </Button>
    </form>
  );
}
