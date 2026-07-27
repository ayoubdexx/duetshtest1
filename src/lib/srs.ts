/**
 * Spaced-repetition scheduling (SM-2 variant, Anki-style ratings).
 * Ratings: 0 = Again, 1 = Hard, 2 = Good, 3 = Easy
 */

export type SrsRating = 0 | 1 | 2 | 3;

export interface SrsState {
  easeFactor: number;
  intervalDays: number;
  repetitions: number;
  lapses: number;
}

export interface SrsResult extends SrsState {
  dueAt: Date;
}

const MIN_EASE = 1.3;
const MAX_EASE = 2.8;

export function scheduleCard(state: SrsState, rating: SrsRating, now: Date = new Date()): SrsResult {
  let { easeFactor, intervalDays, repetitions, lapses } = state;

  if (rating === 0) {
    // Again — relearn in 10 minutes
    lapses += 1;
    repetitions = 0;
    intervalDays = 10 / (60 * 24);
    easeFactor = Math.max(MIN_EASE, easeFactor - 0.2);
  } else if (rating === 1) {
    // Hard
    easeFactor = Math.max(MIN_EASE, easeFactor - 0.15);
    intervalDays = Math.max(1, intervalDays * 1.2);
    repetitions += 1;
  } else if (rating === 2) {
    // Good
    repetitions += 1;
    if (repetitions === 1) intervalDays = 1;
    else if (repetitions === 2) intervalDays = 3;
    else intervalDays = Math.round(intervalDays * easeFactor * 10) / 10;
  } else {
    // Easy
    easeFactor = Math.min(MAX_EASE, easeFactor + 0.15);
    repetitions += 1;
    if (repetitions === 1) intervalDays = 3;
    else intervalDays = Math.round(intervalDays * easeFactor * 1.3 * 10) / 10;
  }

  intervalDays = Math.min(intervalDays, 365);
  const dueAt = new Date(now.getTime() + intervalDays * 24 * 60 * 60 * 1000);
  return { easeFactor: Math.round(easeFactor * 100) / 100, intervalDays, repetitions, lapses, dueAt };
}

/** Human label for the next interval per rating — shown on review buttons */
export function previewIntervals(state: SrsState): Record<SrsRating, string> {
  const fmt = (d: number) => {
    if (d < 1 / 24) return `${Math.round(d * 24 * 60)}m`;
    if (d < 1) return `${Math.round(d * 24)}h`;
    if (d < 30) return `${Math.round(d)}d`;
    return `${Math.round(d / 30)}mo`;
  };
  return {
    0: fmt(scheduleCard(state, 0).intervalDays),
    1: fmt(scheduleCard(state, 1).intervalDays),
    2: fmt(scheduleCard(state, 2).intervalDays),
    3: fmt(scheduleCard(state, 3).intervalDays),
  };
}
