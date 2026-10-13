// Where a learner is inside a lesson (spec 009). Shared by the server
// (resuming from the saved attempt) and the lesson player (moving on).

export type LessonProgress = {
  // Exercise ids still to do, in order. The first one is shown now.
  queue: string[];
  // Exercise ids answered correctly.
  done: string[];
};

export function freshProgress(exerciseIds: string[]): LessonProgress {
  return { queue: [...exerciseIds], done: [] };
}

// Progress after answering the first exercise in the queue: a correct answer
// is done, a wrong one is asked again at the end.
export function answerProgress(
  { queue, done }: LessonProgress,
  correct: boolean,
): LessonProgress {
  const [current, ...rest] = queue;
  if (current === undefined) return { queue, done };
  return correct
    ? { queue: rest, done: [...done, current] }
    : { queue: [...rest, current], done };
}

// Rebuilds saved progress against the lesson's current exercises: ids of
// removed exercises are dropped and new exercises are added to the end.
// Starts fresh when nothing is saved or nothing would be left to do.
export function resumeProgress(
  exerciseIds: string[],
  saved: LessonProgress | null,
): LessonProgress {
  if (!saved) return freshProgress(exerciseIds);

  const exists = new Set(exerciseIds);
  const done = unique(saved.done.filter((id) => exists.has(id)));
  const doneSet = new Set(done);
  const queue = unique(
    saved.queue.filter((id) => exists.has(id) && !doneSet.has(id)),
  );
  const queued = new Set(queue);
  const added = exerciseIds.filter((id) => !doneSet.has(id) && !queued.has(id));

  const next = { queue: [...queue, ...added], done };
  return next.queue.length > 0 ? next : freshProgress(exerciseIds);
}

function unique(ids: string[]): string[] {
  return [...new Set(ids)];
}
