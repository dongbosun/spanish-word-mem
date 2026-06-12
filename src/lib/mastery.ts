import type { GradeSource, SelfGrade, WordProgress } from "@/types/deck";

const targetScores: Record<SelfGrade, number> = {
  unknown: 10,
  fuzzy: 45,
  familiar: 75
};

const clamp = (value: number) => Math.max(0, Math.min(100, value));

export function createDefaultProgress(wordId: string): WordProgress {
  return {
    wordId,
    mastery: 0,
    favorite: false,
    manuallyMastered: false,
    selfGradeCounts: {
      unknown: 0,
      fuzzy: 0,
      familiar: 0
    },
    testCount: 0
  };
}

export function applySelfGrade(
  progress: WordProgress | undefined,
  grade: SelfGrade,
  source: GradeSource,
  now = new Date().toISOString()
): WordProgress {
  const base = progress ?? createDefaultProgress("");
  const wordId = base.wordId;
  const target = targetScores[grade];
  const oldMastery = clamp(base.mastery);
  const factor = source === "list" ? 0.35 : 0.5;
  const mastery = clamp(Math.round(oldMastery * (1 - factor) + target * factor));

  return {
    ...base,
    wordId,
    mastery,
    manuallyMastered: false,
    selfGradeCounts: {
      ...base.selfGradeCounts,
      [grade]: base.selfGradeCounts[grade] + 1
    },
    testCount: source === "test" ? base.testCount + 1 : base.testCount,
    lastTestedAt: source === "test" ? now : base.lastTestedAt,
    lastUpdatedAt: now
  };
}

export function markMastered(
  progress: WordProgress | undefined,
  wordId: string,
  now = new Date().toISOString()
): WordProgress {
  const base = progress ?? createDefaultProgress(wordId);

  return {
    ...base,
    wordId,
    mastery: 100,
    manuallyMastered: true,
    lastUpdatedAt: now
  };
}

export function undoMastered(
  progress: WordProgress | undefined,
  wordId: string,
  now = new Date().toISOString()
): WordProgress {
  const base = progress ?? createDefaultProgress(wordId);

  return {
    ...base,
    wordId,
    mastery: base.mastery === 100 ? 85 : base.mastery,
    manuallyMastered: false,
    lastUpdatedAt: now
  };
}
