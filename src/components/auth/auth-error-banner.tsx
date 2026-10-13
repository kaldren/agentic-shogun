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
      className="border-danger/20 bg-danger/10 text-danger-text border-t-2 text-sm font-semibold"
    >
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-2 px-4 py-1 md:px-6">
        <p>Sign-in didn&apos;t complete. Please try again.</p>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Dismiss"
          onClick={dismiss}
          className="text-danger-text hover:bg-danger/10"
        >
          <XIcon />
        </Button>
      </div>
    </div>
  );
}
