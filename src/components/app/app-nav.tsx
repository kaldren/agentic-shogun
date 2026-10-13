"use client";

import { BookOpenIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/learn", label: "Learn", icon: BookOpenIcon },
  { href: "/profile", label: "Profile", icon: UserIcon },
] as const;

// A bottom bar on mobile and a left sidebar from `lg` up.
export function AppNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main"
      className="bg-background fixed inset-x-0 bottom-0 z-10 border-t-2 pb-[env(safe-area-inset-bottom)] lg:sticky lg:top-0 lg:h-[calc(100dvh-4rem)] lg:w-64 lg:shrink-0 lg:border-t-0 lg:border-r-2 lg:pb-0"
    >
      <ul className="flex gap-2 p-2 lg:flex-col lg:p-4">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <li key={href} className="flex-1 lg:flex-none">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "focus-visible:ring-ring/50 flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl border-2 px-3 py-1.5 text-sm font-semibold transition-all duration-150 ease-out outline-none focus-visible:ring-3 lg:min-h-12 lg:flex-row lg:justify-start lg:gap-3 lg:px-4 lg:text-base",
                  active
                    ? "border-green-200 bg-green-50 text-green-800"
                    : "text-muted-foreground border-transparent hover:bg-green-50 hover:text-green-800",
                )}
              >
                <Icon
                  aria-hidden
                  className={cn("size-6", active && "text-green-700")}
                  strokeWidth={active ? 2.5 : 2}
                />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
