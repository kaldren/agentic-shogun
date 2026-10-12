import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-4 text-center">
      <h1 className="text-4xl font-semibold tracking-tight">Agentic Shogun</h1>
      <p className="text-muted-foreground max-w-md">
        Learn agentic AI through quizzes, use cases and hands-on exercises.
      </p>
      <Button>Coming soon</Button>
    </main>
  );
}
