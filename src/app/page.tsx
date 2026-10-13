import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="bg-gradient-soft flex flex-1 flex-col">
      <section className="bg-gradient-glow flex flex-1 flex-col items-center justify-center gap-6 px-4 py-12 text-center md:py-20">
        <h1 className="text-4xl leading-[1.1] font-extrabold tracking-tight md:text-6xl">
          Agentic <span className="text-green-700">Shogun</span>
        </h1>
        <p className="text-muted-foreground max-w-prose text-lg leading-relaxed">
          Learn agentic AI through quizzes, use cases and hands-on exercises.
        </p>
        <Button size="lg">Coming soon</Button>
      </section>
    </main>
  );
}
