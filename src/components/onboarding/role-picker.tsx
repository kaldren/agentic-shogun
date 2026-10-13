"use client";

import { CheckIcon } from "lucide-react";
import { useActionState, useState } from "react";

import { saveRole } from "@/app/welcome/actions";
import { Button } from "@/components/ui/button";
import { ROLES, type RoleId } from "@/lib/roles";

export function RolePicker({ currentRole }: { currentRole: RoleId | null }) {
  const [selected, setSelected] = useState<RoleId | null>(currentRole);
  const [state, formAction, isPending] = useActionState(saveRole, null);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <fieldset className="grid gap-3 sm:grid-cols-2">
        <legend className="sr-only">Your role</legend>
        {ROLES.map(({ id, name, description, icon: Icon }) => (
          <label
            key={id}
            className="group bg-card shadow-edge-secondary has-focus-visible:ring-ring/50 flex min-h-11 cursor-pointer items-center gap-4 rounded-2xl border-2 p-4 transition-all duration-150 ease-out not-has-checked:hover:border-green-200 not-has-checked:hover:bg-green-50 has-checked:border-green-500 has-checked:bg-green-50 has-focus-visible:ring-3 motion-safe:hover:scale-[1.02]"
          >
            <input
              type="radio"
              name="role"
              value={id}
              checked={selected === id}
              onChange={() => setSelected(id)}
              className="sr-only"
            />
            <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-green-100 text-green-700">
              <Icon className="size-6" aria-hidden />
            </span>
            <span className="flex flex-1 flex-col">
              <span className="font-bold">{name}</span>
              <span className="text-muted-foreground text-sm">
                {description}
              </span>
            </span>
            <span
              aria-hidden
              className="text-primary-foreground hidden size-7 shrink-0 place-items-center rounded-full bg-green-500 group-has-checked:grid"
            >
              <CheckIcon className="size-4" strokeWidth={2.5} />
            </span>
          </label>
        ))}
      </fieldset>

      {state?.error && (
        <p role="alert" className="text-danger-text text-center font-semibold">
          {state.error}
        </p>
      )}

      <Button
        type="submit"
        size="lg"
        disabled={!selected || isPending}
        className="w-full uppercase sm:mx-auto sm:w-auto sm:min-w-60"
      >
        Continue
      </Button>
    </form>
  );
}
