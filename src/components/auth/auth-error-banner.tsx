"use client";

import { XIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";

export function AuthErrorBanner() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  if (!searchParams.has("auth_error")) return null;

  function dismiss() {
    const params = new URLSearchParams(searchParams);
    params.delete("auth_error");
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  }

  return (
    <div
      role="alert"
      className="bg-destructive/10 text-destructive flex items-center justify-between gap-2 px-4 py-2 text-sm"
    >
      <p>Sign-in didn&apos;t complete. Please try again.</p>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Dismiss"
        onClick={dismiss}
      >
        <XIcon />
      </Button>
    </div>
  );
}
