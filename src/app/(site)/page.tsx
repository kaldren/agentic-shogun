import { Suspense } from "react";

import { GetStartedButton } from "@/components/onboarding/get-started-button";
import { Button } from "@/components/ui/button";
import { ROLES } from "@/lib/roles";

// Landing page for signed-out visitors. Signed-in users are sent into the
// app by the proxy (src/lib/supabase/proxy.ts).
export default function Home() {
  return (
    <main className="bg-gradient-soft flex flex-1 flex-col">
      <section className="bg-gradient-glow flex flex-col items-center gap-6 px-4 py-12 text-center md:py-20">
        <h1 className="text-4xl leading-[1.1] font-extrabold tracking-tight md:text-6xl">
          Learn AI for <span className="text-green-700">your</span> work
        </h1>
        <p className="text-muted-foreground max-w-prose text-lg leading-relaxed">
          Short, fun lessons about AI agents, made for what you do every day.
        </p>
        <Suspense
          fallback={
            <Button size="lg" className="uppercase" disabled>
              Get started
            </Button>
          }
        >
          <GetStartedButton />
        </Suspense>
      </section>

      <section
        aria-labelledby="roles-heading"
        className="mx-auto w-full max-w-5xl px-4 pb-12 md:px-6 md:pb-20"
      >
        <h2
          id="roles-heading"
          className="text-muted-foreground mb-4 text-center text-xs font-bold tracking-wider uppercase"
        >
          Courses for
        </h2>
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {ROLES.map(({ id, name, icon: Icon }) => (
            <li
              key={id}
              className="bg-card flex items-center gap-3 rounded-2xl border-2 p-4 lg:flex-col lg:text-center"
            >
              <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-green-100 text-green-700">
                <Icon className="size-6" aria-hidden />
              </span>
              <span className="font-bold">{name}</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
