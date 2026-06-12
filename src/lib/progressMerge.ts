import { validateProgressMap } from "@/storage/progressStorage";
import type { ProgressMap, WordProgress } from "@/types/deck";

function getProgressTime(progress: WordProgress): number {
  const value = progress.lastUpdatedAt ?? progress.lastTestedAt;
  const time = value ? Date.parse(value) : Number.NaN;
  return Number.isFinite(time) ? time : 0;
}

function latestDate(first?: string, second?: string): string | undefined {
  if (!first) return second;
  if (!second) return first;
  return Date.parse(first) >= Date.parse(second) ? first : second;
}

function mergeTiedProgress(wordId: string, local: WordProgress, cloud: WordProgress): WordProgress {
  return {
    wordId,
    mastery: Math.max(local.mastery, cloud.mastery),
    favorite: local.favorite || cloud.favorite,
    manuallyMastered: local.manuallyMastered || cloud.manuallyMastered,
    selfGradeCounts: {
      unknown: Math.max(local.selfGradeCounts.unknown, cloud.selfGradeCounts.unknown),
      fuzzy: Math.max(local.selfGradeCounts.fuzzy, cloud.selfGradeCounts.fuzzy),
      familiar: Math.max(local.selfGradeCounts.familiar, cloud.selfGradeCounts.familiar)
    },
    testCount: Math.max(local.testCount, cloud.testCount),
    lastTestedAt: latestDate(local.lastTestedAt, cloud.lastTestedAt),
    lastUpdatedAt: latestDate(local.lastUpdatedAt, cloud.lastUpdatedAt)
  };
}

export function mergeProgressMaps(localProgress: ProgressMap, cloudProgress: ProgressMap): ProgressMap {
  const local = validateProgressMap(localProgress);
  const cloud = validateProgressMap(cloudProgress);
  const ids = new Set([...Object.keys(local), ...Object.keys(cloud)]);
  const merged: ProgressMap = {};

  for (const id of ids) {
    const localWordProgress = local[id];
    const cloudWordProgress = cloud[id];

    if (!localWordProgress && cloudWordProgress) {
      merged[id] = cloudWordProgress;
      continue;
    }

    if (localWordProgress && !cloudWordProgress) {
      merged[id] = localWordProgress;
      continue;
    }

    if (!localWordProgress || !cloudWordProgress) {
      continue;
    }

    const localTime = getProgressTime(localWordProgress);
    const cloudTime = getProgressTime(cloudWordProgress);

    if (localTime > cloudTime) {
      merged[id] = localWordProgress;
      continue;
    }

    if (cloudTime > localTime) {
      merged[id] = cloudWordProgress;
      continue;
    }

    merged[id] = mergeTiedProgress(id, localWordProgress, cloudWordProgress);
  }

  return validateProgressMap(merged);
}
