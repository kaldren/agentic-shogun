"use client";

import { LogOutIcon } from "lucide-react";
import { useTransition } from "react";

import { signOut } from "@/app/auth/actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { CurrentUser } from "@/lib/auth";
import { initials } from "@/lib/utils";

export function UserMenu({ user }: { user: CurrentUser }) {
  const [isPending, startTransition] = useTransition();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="hover:bg-secondary aria-expanded:bg-secondary focus-visible:ring-ring/50 flex h-11 items-center gap-2 rounded-xl p-1.5 transition-all duration-150 ease-out outline-none focus-visible:ring-3 sm:pr-3"
        aria-label="Account menu"
      >
        <Avatar>
          {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt="" />}
          <AvatarFallback>{initials(user.name)}</AvatarFallback>
        </Avatar>
        <span className="max-w-40 truncate text-sm font-semibold max-sm:hidden">
          {user.name}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-48">
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            <div className="text-foreground truncate font-bold">
              {user.name}
            </div>
            {user.email && (
              <div className="text-muted-foreground truncate font-normal">
                {user.email}
              </div>
            )}
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          disabled={isPending}
          onClick={() => startTransition(() => signOut())}
        >
          <LogOutIcon />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
