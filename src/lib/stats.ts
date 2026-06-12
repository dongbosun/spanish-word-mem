import type { MasteryStatus, ProgressMap, WordCard, WordProgress } from "@/types/deck";

export type WordStats = {
  total: number;
  mastered: number;
  familiar: number;
  fuzzy: number;
  unknown: number;
  favorites: number;
  weak: number;
  unmastered: number;
  tested: number;
  neverTested: number;
  averageMastery: number;
};

export function getWordStatus(_word: WordCard, progress?: WordProgress): MasteryStatus {
  if (progress?.manuallyMastered) {
    return "mastered";
  }

  const mastery = progress?.mastery ?? 0;

  if (mastery < 25) {
    return "unknown";
  }

  if (mastery < 60) {
    return "fuzzy";
  }

  if (mastery < 90) {
    return "familiar";
  }

  return "mastered";
}

export function getMasteryLabel(progress?: WordProgress): string {
  if (progress?.manuallyMastered) {
    return "完全会了";
  }

  const mastery = progress?.mastery ?? 0;
  if (mastery < 25) return "不认识";
  if (mastery < 60) return "模糊";
  if (mastery < 90) return "熟悉";
  return "完全会了";
}

export function isWeak(progress?: WordProgress): boolean {
  return !progress?.manuallyMastered && (progress?.mastery ?? 0) < 60;
}

export function isUnmastered(progress?: WordProgress): boolean {
  return !progress?.manuallyMastered && (progress?.mastery ?? 0) < 90;
}

export function computeStatsForWords(words: WordCard[], progressMap: ProgressMap): WordStats {
  const stats: WordStats = {
    total: words.length,
    mastered: 0,
    familiar: 0,
    fuzzy: 0,
    unknown: 0,
    favorites: 0,
    weak: 0,
    unmastered: 0,
    tested: 0,
    neverTested: 0,
    averageMastery: 0
  };

  let masterySum = 0;

  for (const word of words) {
    const progress = progressMap[word.id];
    const status = getWordStatus(word, progress);
    stats[status] += 1;

    if (progress?.favorite) stats.favorites += 1;
    if (isWeak(progress)) stats.weak += 1;
    if (isUnmastered(progress)) stats.unmastered += 1;
    if ((progress?.testCount ?? 0) > 0) stats.tested += 1;
    else stats.neverTested += 1;

    masterySum += progress?.manuallyMastered ? 100 : progress?.mastery ?? 0;
  }

  stats.averageMastery = stats.total === 0 ? 0 : Math.round(masterySum / stats.total);
  return stats;
}

export function computeOverallStats(words: WordCard[], progressMap: ProgressMap): WordStats {
  return computeStatsForWords(words, progressMap);
}

export function computeChapterStats(
  chapterId: string,
  words: WordCard[],
  progressMap: ProgressMap
): WordStats {
  return computeStatsForWords(
    words.filter((word) => word.chapterId === chapterId),
    progressMap
  );
}

export function computeSectionStats(
  sectionId: string,
  words: WordCard[],
  progressMap: ProgressMap
): WordStats {
  return computeStatsForWords(
    words.filter((word) => word.sectionId === sectionId),
    progressMap
  );
}
