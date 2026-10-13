"use client";

import { CheckIcon, XIcon } from "lucide-react";
import { useState } from "react";

import type { Answer, AnswerResult } from "@/app/(lesson)/lesson/[id]/actions";
import type { MultipleChoiceExercise } from "@/lib/lesson";
import { cn } from "@/lib/utils";

type Result = Extract<AnswerResult, { type: "multiple_choice" }>;

export function MultipleChoice({
  exercise,
  result,
  disabled,
  onAnswerChange,
}: {
  exercise: MultipleChoiceExercise;
  result: Result | null;
  disabled: boolean;
  onAnswerChange: (answer: Answer) => void;
}) {
  const [choice, setChoice] = useState<number | null>(null);

  return (
    <fieldset
      aria-labelledby="question"
      disabled={disabled}
      className="flex flex-col gap-3"
    >
      {exercise.options.map((option, i) => (
        <OptionCard
          key={i}
          name={exercise.id}
          label={option}
          checked={choice === i}
          onSelect={() => {
            setChoice(i);
            onAnswerChange({ type: "multiple_choice", choice: i });
          }}
          result={optionResult(i, choice, result)}
        />
      ))}
    </fieldset>
  );
}

type OptionResult = "correct" | "wrong" | null;

function optionResult(
  i: number,
  choice: number | null,
  result: Result | null,
): OptionResult {
  if (!result) return null;
  if (i === result.correctChoice) return "correct";
  if (i === choice) return "wrong";
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
