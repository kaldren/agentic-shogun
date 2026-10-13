import { LogOutIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { signOut } from "@/app/auth/actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth";
import { getCurrentRole } from "@/lib/profile";
import { initials } from "@/lib/utils";

export default function ProfilePage() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-12 md:px-6">
      <h1 className="text-3xl leading-[1.15] font-extrabold tracking-tight md:text-[2.5rem]">
        Profile
      </h1>
      <Suspense fallback={<ProfileSkeleton />}>
        <ProfileDetails />
      </Suspense>
    </main>
  );
}

async function ProfileDetails() {
  const user = await getCurrentUser();
  if (!user) redirect("/?next=/profile");

  const role = await getCurrentRole();
  if (!role) redirect("/welcome");

  const RoleIcon = role.icon;
  return (
    <>
      <section className="flex items-center gap-4">
        <Avatar className="size-20">
          {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt="" />}
          <AvatarFallback className="text-2xl font-bold">
            {initials(user.name)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate text-xl font-bold md:text-2xl">{user.name}</p>
          {user.email && (
            <p className="text-muted-foreground truncate">{user.email}</p>
          )}
        </div>
      </section>

      <section
        aria-labelledby="role-heading"
        className="bg-card flex flex-col gap-4 rounded-2xl border-2 p-5 sm:flex-row sm:items-center md:p-6"
      >
        <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-green-100 text-green-700">
          <RoleIcon className="size-6" aria-hidden />
        </span>
        <div className="flex-1">
          <h2
            id="role-heading"
            className="text-muted-foreground text-xs font-bold tracking-wider uppercase"
          >
            Your role
          </h2>
          <p className="text-lg font-bold">{role.name}</p>
        </div>
        <Link
          href="/welcome"
          className={buttonVariants({ variant: "secondary" })}
        >
          Change role
        </Link>
      </section>

      <form action={signOut}>
        <Button type="submit" variant="ghost">
          <LogOutIcon />
          Sign out
        </Button>
      </form>
    </>
  );
}

function ProfileSkeleton() {
  return (
    <div aria-hidden className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <div className="bg-muted size-20 rounded-full motion-safe:animate-pulse" />
        <div className="bg-muted h-6 w-40 rounded-lg motion-safe:animate-pulse" />
      </div>
      <div className="bg-muted h-24 rounded-2xl motion-safe:animate-pulse" />
    </div>
  );
}
