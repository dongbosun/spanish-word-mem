import { isUnmastered, isWeak } from "@/lib/stats";
import type {
  DirectionMode,
  ProgressMap,
  SamplingMode,
  TestCountOption,
  TestDirection,
  TestOptions,
  WordCard
} from "@/types/deck";

type RandomFn = () => number;

export function buildTestPool(
  options: TestOptions,
  words: WordCard[],
  progressMap: ProgressMap
): WordCard[] {
  return words.filter((word) => {
    const progress = progressMap[word.id];

    if (options.scope === "chapter") {
      return Boolean(options.chapterId) && word.chapterId === options.chapterId;
    }

    if (options.scope === "section") {
      return Boolean(options.sectionId) && word.sectionId === options.sectionId;
    }

    if (options.scope === "favorites") {
      return Boolean(progress?.favorite);
    }

    if (options.scope === "weak") {
      return isWeak(progress);
    }

    if (options.scope === "unmastered") {
      return isUnmastered(progress);
    }

    return true;
  });
}

function shuffled<T>(items: T[], random: RandomFn): T[] {
  const list = [...items];
  for (let index = list.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [list[index], list[swapIndex]] = [list[swapIndex], list[index]];
  }
  return list;
}

function countToNumber(count: TestCountOption, available: number): number {
  if (count === "all") return available;
  return Math.min(count, available);
}

export function sampleTestWords(
  pool: WordCard[],
  count: TestCountOption,
  samplingMode: SamplingMode,
  progressMap: ProgressMap,
  random: RandomFn = Math.random
): WordCard[] {
  const take = countToNumber(count, pool.length);
  if (take <= 0) return [];

  if (samplingMode === "weak-first") {
    return shuffled(pool, random)
      .sort((a, b) => {
        const masteryA = progressMap[a.id]?.manuallyMastered ? 100 : progressMap[a.id]?.mastery ?? 0;
        const masteryB = progressMap[b.id]?.manuallyMastered ? 100 : progressMap[b.id]?.mastery ?? 0;
        const unknownA = progressMap[a.id]?.selfGradeCounts.unknown ?? 0;
        const unknownB = progressMap[b.id]?.selfGradeCounts.unknown ?? 0;
        return masteryA - masteryB || unknownB - unknownA;
      })
      .slice(0, take);
  }

  return shuffled(pool, random).slice(0, take);
}

export function assignDirection(
  _word: WordCard,
  directionMode: DirectionMode,
  random: RandomFn = Math.random
): TestDirection {
  if (directionMode === "mixed") {
    return random() < 0.5 ? "es-en" : "en-es";
  }

  return directionMode;
}
