import { redirect } from "next/navigation";
import { Suspense } from "react";

import { RolePicker } from "@/components/onboarding/role-picker";
import { getCurrentUser } from "@/lib/auth";
import { getCurrentRole } from "@/lib/profile";

export default function WelcomePage() {
  return (
    <main className="bg-gradient-soft flex flex-1 flex-col">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-4 py-12 md:px-6 md:py-20">
        <header className="flex flex-col gap-2 text-center">
          <h1 className="text-3xl leading-[1.15] font-extrabold tracking-tight md:text-[2.5rem]">
            What do you do?
          </h1>
          <p className="text-muted-foreground text-lg">
            We&apos;ll build your AI course around your work.
          </p>
        </header>
        <Suspense fallback={<RolePickerSkeleton />}>
          <CurrentRolePicker />
        </Suspense>
      </div>
    </main>
  );
}

async function CurrentRolePicker() {
  const user = await getCurrentUser();
  if (!user) redirect("/?next=/welcome");

  const role = await getCurrentRole();
  return <RolePicker currentRole={role?.id ?? null} />;
}

function RolePickerSkeleton() {
  return (
    <div aria-hidden className="grid gap-3 sm:grid-cols-2">
      {Array.from({ length: 5 }, (_, i) => (
        <div
          key={i}
          className="bg-muted h-22 rounded-2xl border-2 motion-safe:animate-pulse"
        />
      ))}
    </div>
  );
}
