import Link from "next/link";
import { Suspense } from "react";

import { AuthErrorBanner } from "@/components/auth/auth-error-banner";
import { SignInButton } from "@/components/auth/sign-in-button";
import { UserMenu } from "@/components/auth/user-menu";
import { getCurrentUser } from "@/lib/auth";

export function SiteHeader() {
  return (
    <header className="border-b">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4">
        <Link href="/" className="font-semibold tracking-tight">
          Agentic Shogun
        </Link>
        <Suspense fallback={<AuthSlotSkeleton />}>
          <AuthSlot />
        </Suspense>
      </div>
      <Suspense>
        <AuthErrorBanner />
      </Suspense>
    </header>
  );
}

async function AuthSlot() {
  const user = await getCurrentUser();
  return user ? <UserMenu user={user} /> : <SignInButton />;
}

// Neutral placeholder so the signed-out button never flashes for a
// signed-in user while the session is read.
function AuthSlotSkeleton() {
  return (
    <div aria-hidden className="bg-muted size-8 animate-pulse rounded-full" />
  );
}
