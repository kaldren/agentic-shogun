"use client";

import { usePathname, useSearchParams } from "next/navigation";

import { signInWithGoogle } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";

export function SignInButton() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const params = new URLSearchParams(searchParams);
  params.delete("auth_error");
  const query = params.toString();
  const next = query ? `${pathname}?${query}` : pathname;

  return (
    <form action={signInWithGoogle}>
      <input type="hidden" name="next" value={next} />
      <Button
        type="submit"
        variant="secondary"
        aria-label="Sign in with Google"
      >
        Sign in<span className="max-sm:hidden">with Google</span>
      </Button>
    </form>
  );
}
