import Link from "next/link";
import { Suspense } from "react";

import { AuthErrorBanner } from "@/components/auth/auth-error-banner";
import { SignInButton } from "@/components/auth/sign-in-button";
import { UserMenu } from "@/components/auth/user-menu";
import { getCurrentUser } from "@/lib/auth";

export function SiteHeader() {
  return (
    <header className="bg-background border-b-2">
      <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between gap-4 px-4 md:px-6">
        <Link
          href="/"
          className="focus-visible:ring-ring/50 rounded-lg text-xl font-extrabold tracking-tight whitespace-nowrap outline-none focus-visible:ring-3"
        >
          Agentic <span className="text-green-700">Shogun</span>
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
    <div
      aria-hidden
      className="bg-accent size-8 rounded-full motion-safe:animate-pulse"
    />
  );
}
