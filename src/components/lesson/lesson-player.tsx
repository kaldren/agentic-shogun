"use client";

import { CheckIcon, XIcon } from "lucide-react";
import { useEffect, useRef, useState, useTransition } from "react";

import {
  checkAnswer,
  completeLesson,
  type AnswerResult,
} from "@/app/(lesson)/lesson/[id]/actions";
import { LessonComplete } from "@/components/lesson/lesson-complete";
import { QuitLessonButton } from "@/components/lesson/quit-lesson-button";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import type { Exercise } from "@/lib/lesson";
import { cn } from "@/lib/utils";

type Feedback = AnswerResult & { choice: number };

export function LessonPlayer({
  lessonId,
  title,
  exercises,
}: {
  lessonId: string;
  title: string;
  exercises: Exercise[];
}) {
  // Exercises still to answer, in order. A wrong answer goes to the end.
  const [queue, setQueue] = useState(() => exercises.map((_, i) => i));
  const [correctCount, setCorrectCount] = useState(0);
  const [choice, setChoice] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isChecking, startChecking] = useTransition();
  // Counts "Continue" presses, to move focus to each new question.
  const [step, setStep] = useState(0);
  const questionRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (step > 0) questionRef.current?.focus();
  }, [step]);

  const exercise = queue.length > 0 ? exercises[queue[0]!] : undefined;

  if (!exercise) {
    return (
      <LessonComplete title={title} save={() => completeLesson(lessonId)} />
    );
  }

  function check() {
    if (choice === null || !exercise) return;
    const answered = choice;
    setError(null);
    startChecking(async () => {
      try {
        const result = await checkAnswer(exercise.id, answered);
        setFeedback({ ...result, choice: answered });
        if (result.correct) setCorrectCount((count) => count + 1);
      } catch {
        setError("We couldn't check your answer. Please try again.");
      }
    });
  }

  function next() {
    setQueue(([current, ...rest]) =>
      feedback?.correct ? rest : [...rest, current!],
    );
    setChoice(null);
    setFeedback(null);
    setStep((n) => n + 1);
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="mx-auto flex w-full max-w-2xl items-center gap-4 px-4 pt-6 md:px-6">
        <QuitLessonButton />
        <ProgressBar
          value={correctCount}
          max={exercises.length}
          label="Lesson progress"
          className="flex-1"
        />
      </header>

      <form
        className="flex flex-1 flex-col"
        onSubmit={(event) => {
          event.preventDefault();
          if (!feedback) check();
        }}
      >
        <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-8 md:px-6 md:py-12">
          <h1
            id="question"
            ref={questionRef}
            tabIndex={-1}
            className="text-2xl leading-[1.2] font-bold outline-none md:text-3xl"
          >
            {exercise.question}
          </h1>
          <fieldset
            aria-labelledby="question"
            disabled={feedback !== null || isChecking}
            className="flex flex-col gap-3"
          >
            {exercise.options.map((option, i) => (
              <OptionCard
                key={i}
                name={exercise.id}
                label={option}
                checked={choice === i}
                onSelect={() => setChoice(i)}
                result={optionResult(i, feedback)}
              />
            ))}
          </fieldset>
          {error && (
            <p role="alert" className="text-danger-text font-semibold">
              {error}
            </p>
          )}
        </main>

        {feedback ? (
          <FeedbackPanel
            feedback={feedback}
            correctOption={exercise.options[feedback.correctChoice] ?? ""}
            onNext={next}
          />
        ) : (
          <footer className="border-t-2">
            <div className="mx-auto flex w-full max-w-2xl justify-end px-4 py-5 md:px-6">
              <Button
                type="submit"
                size="lg"
                disabled={choice === null || isChecking}
                className="w-full uppercase sm:w-auto sm:min-w-40"
              >
                Check
              </Button>
            </div>
          </footer>
        )}
      </form>
    </div>
  );
}

type OptionResult = "correct" | "wrong" | null;

function optionResult(i: number, feedback: Feedback | null): OptionResult {
  if (!feedback) return null;
  if (i === feedback.correctChoice) return "correct";
  if (i === feedback.choice) return "wrong";
  return null;
}

function OptionCard({
  name,
  label,
  checked,
  onSelect,
  result,
}: {
  name: string;
  label: string;
  checked: boolean;
  onSelect: () => void;
  result: OptionResult;
}) {
  return (
    <label
      className={cn(
        "bg-card shadow-edge-secondary has-focus-visible:ring-ring/50 flex min-h-14 cursor-pointer items-center gap-4 rounded-2xl border-2 px-4 py-3 transition-all duration-150 ease-out has-focus-visible:ring-3 has-disabled:cursor-default",
        result === null &&
          "not-has-checked:not-has-disabled:hover:border-green-200 not-has-checked:not-has-disabled:hover:bg-green-50 has-checked:border-green-500 has-checked:bg-green-50",
        result === "correct" && "border-green-500 bg-green-100",
        result === "wrong" && "border-danger bg-danger-soft",
      )}
    >
      <input
        type="radio"
        name={name}
        checked={checked}
        onChange={onSelect}
        className="sr-only"
      />
      <span className="flex-1 text-base">{label}</span>
      {result === "correct" && (
        <>
          <CheckIcon
            aria-hidden
            className="size-6 shrink-0 text-green-700"
            strokeWidth={2.5}
          />
          <span className="sr-only">(correct answer)</span>
        </>
      )}
      {result === "wrong" && (
        <>
          <XIcon
            aria-hidden
            className="text-danger-text size-6 shrink-0"
            strokeWidth={2.5}
          />
          <span className="sr-only">(your answer, wrong)</span>
        </>
      )}
    </label>
  );
}

function FeedbackPanel({
  feedback,
  correctOption,
  onNext,
}: {
  feedback: Feedback;
  correctOption: string;
  onNext: () => void;
}) {
  const { correct, explanation } = feedback;
  const Icon = correct ? CheckIcon : XIcon;

  return (
    <footer
      role="status"
      className={cn(
        "motion-safe:animate-in motion-safe:slide-in-from-bottom-4 motion-safe:fade-in",
        correct ? "bg-green-100" : "bg-danger-soft",
      )}
    >
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-end md:px-6">
        <div className="flex flex-1 gap-4">
          <span
            className={cn(
              "grid size-12 shrink-0 place-items-center rounded-full bg-white",
              correct ? "text-green-700" : "text-danger-text",
            )}
          >
            <Icon aria-hidden className="size-7" strokeWidth={3} />
          </span>
          <div
            className={cn(
              "flex flex-col gap-1",
              correct ? "text-green-800" : "text-danger-text",
            )}
          >
            <h2 className="text-xl font-bold md:text-2xl">
              {correct ? "Great job!" : "Not quite"}
            </h2>
            {!correct && (
              <p className="font-semibold">Correct answer: {correctOption}</p>
            )}
            <p>{explanation}</p>
          </div>
        </div>
        <Button
          type="button"
          size="lg"
          variant={correct ? "default" : "destructive"}
          onClick={onNext}
          autoFocus
          className="w-full uppercase sm:w-auto sm:min-w-40"
        >
          {correct ? "Continue" : "Got it"}
        </Button>
      </div>
    </footer>
  );
}
