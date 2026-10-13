import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { buttonVariants } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth";
import { getCurrentRole } from "@/lib/profile";

// Placeholder until the learning path (spec 005).
export default function LearnPage() {
  return (
    <main className="bg-gradient-soft flex flex-1 flex-col">
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-6 px-4 py-12 text-center md:px-6 md:py-20">
        <Suspense
          fallback={
            <div
              aria-hidden
              className="bg-muted h-40 w-full rounded-2xl motion-safe:animate-pulse"
            />
          }
        >
          <CurrentRole />
        </Suspense>
      </div>
    </main>
  );
}

async function CurrentRole() {
  const user = await getCurrentUser();
  if (!user) redirect("/?next=/learn");

  const role = await getCurrentRole();
  if (!role) redirect("/welcome");

  const Icon = role.icon;
  return (
    <>
      <span className="grid size-16 place-items-center rounded-2xl bg-green-100 text-green-700">
        <Icon className="size-8" aria-hidden />
      </span>
      <p className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
        Your course
      </p>
      <h1 className="text-3xl leading-[1.15] font-extrabold tracking-tight md:text-[2.5rem]">
        AI for {role.name}
      </h1>
      <p className="text-muted-foreground max-w-prose text-lg">
        Your lessons are on the way.
      </p>
      <Link
        href="/welcome"
        className={buttonVariants({ variant: "secondary" })}
      >
        Change role
      </Link>
    </>
  );
}
