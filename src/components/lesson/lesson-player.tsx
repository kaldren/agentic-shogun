"use client";

import { CheckIcon, XIcon } from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  useTransition,
  type ReactNode,
} from "react";

import {
  checkAnswer,
  completeLesson,
  type Answer,
  type AnswerResult,
} from "@/app/(lesson)/lesson/[id]/actions";
import { ArchitectureBoard } from "@/components/lesson/architecture-board";
import { LessonComplete } from "@/components/lesson/lesson-complete";
import { MultipleChoice } from "@/components/lesson/multiple-choice";
import { QuitLessonButton } from "@/components/lesson/quit-lesson-button";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import type { Exercise } from "@/lib/lesson";
import { cn } from "@/lib/utils";

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
  // The learner's answer, or null while it is incomplete.
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [feedback, setFeedback] = useState<AnswerResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isChecking, startChecking] = useTransition();
  // Counts "Continue" presses, to move focus to each new question and to
  // start a repeated exercise empty.
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
    if (answer === null || !exercise) return;
    const answered = answer;
    setError(null);
    startChecking(async () => {
      try {
        const result = await checkAnswer(exercise.id, answered);
        setFeedback(result);
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
    setAnswer(null);
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
          {exercise.type === "multiple_choice" ? (
            <MultipleChoice
              key={step}
              exercise={exercise}
              result={feedback?.type === "multiple_choice" ? feedback : null}
              disabled={feedback !== null || isChecking}
              onAnswerChange={setAnswer}
            />
          ) : (
            <ArchitectureBoard
              key={step}
              exercise={exercise}
              result={feedback?.type === "architecture" ? feedback : null}
              disabled={feedback !== null || isChecking}
              onAnswerChange={setAnswer}
            />
          )}
          {error && (
            <p role="alert" className="text-danger-text font-semibold">
              {error}
            </p>
          )}
        </main>

        {feedback ? (
          <FeedbackPanel
            feedback={feedback}
            correction={
              <Correction
                exercise={exercise}
                answer={answer}
                result={feedback}
              />
            }
            onNext={next}
          />
        ) : (
          <footer className="border-t-2">
            <div className="mx-auto flex w-full max-w-2xl justify-end px-4 py-5 md:px-6">
              <Button
                type="submit"
                size="lg"
                disabled={answer === null || isChecking}
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

function FeedbackPanel({
  feedback,
  correction,
  onNext,
}: {
  feedback: AnswerResult;
  correction: ReactNode;
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
            {!correct && correction}
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

// What the learner should have answered, shown in the red panel.
function Correction({
  exercise,
  answer,
  result,
}: {
  exercise: Exercise;
  answer: Answer | null;
  result: AnswerResult;
}) {
  if (
    exercise.type === "multiple_choice" &&
    result.type === "multiple_choice"
  ) {
    return (
      <p className="font-semibold">
        Correct answer: {exercise.options[result.correctChoice]}
      </p>
    );
  }
  if (
    exercise.type === "architecture" &&
    answer?.type === "architecture" &&
    result.type === "architecture"
  ) {
    const card = (id: string | undefined) =>
      exercise.cards.find((c) => c.id === id)?.label;
    return (
      <div className="font-semibold">
        <p>Correct answers:</p>
        <ul className="list-disc pl-5">
          {exercise.slots
            .filter(
              ({ id }) =>
                answer.placements[id] !== result.correctPlacements[id],
            )
            .map((slot) => (
              <li key={slot.id}>
                {slot.label}: {card(result.correctPlacements[slot.id])}
              </li>
            ))}
        </ul>
      </div>
    );
  }
  return null;
}
