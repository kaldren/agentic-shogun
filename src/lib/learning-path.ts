export type LessonState = "done" | "current" | "locked";

// Lessons are done in order: every lesson before the first one that isn't
// completed is done, that one is current, and the rest are locked.
export function lessonStates(
  lessonIds: readonly string[],
  completedIds: ReadonlySet<string>,
): Map<string, LessonState> {
  const states = new Map<string, LessonState>();
  let currentFound = false;
  for (const id of lessonIds) {
    if (currentFound) {
      states.set(id, "locked");
    } else if (completedIds.has(id)) {
      states.set(id, "done");
    } else {
      states.set(id, "current");
      currentFound = true;
    }
  }
  return states;
}

// The course a user is learning: the one they picked, if it is still one of
// their role's courses, otherwise the first course of the role.
export function currentCourseId(
  courseIds: readonly string[],
  pickedId: string | null | undefined,
): string | null {
  if (pickedId && courseIds.includes(pickedId)) return pickedId;
  return courseIds[0] ?? null;
}
