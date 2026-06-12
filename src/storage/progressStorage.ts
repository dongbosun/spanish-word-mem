import { createDefaultProgress } from "@/lib/mastery";
import type { ProgressMap, WordProgress } from "@/types/deck";

export const STORAGE_KEY = "spanish-vocab-list-progress-v1";

function getLocalStorage(): Storage | undefined {
  if (typeof window === "undefined" || !window.localStorage) {
    return undefined;
  }

  return window.localStorage;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeProgress(value: unknown, fallbackWordId?: string): WordProgress | undefined {
  if (!isObject(value)) return undefined;
  const wordId = typeof value.wordId === "string" ? value.wordId : fallbackWordId;
  if (!wordId) return undefined;

  const defaultProgress = createDefaultProgress(wordId);
  const counts = isObject(value.selfGradeCounts) ? value.selfGradeCounts : {};
  const mastery = typeof value.mastery === "number" ? value.mastery : defaultProgress.mastery;

  return {
    wordId,
    mastery: Math.max(0, Math.min(100, Math.round(mastery))),
    favorite: typeof value.favorite === "boolean" ? value.favorite : defaultProgress.favorite,
    manuallyMastered:
      typeof value.manuallyMastered === "boolean"
        ? value.manuallyMastered
        : defaultProgress.manuallyMastered,
    selfGradeCounts: {
      unknown: typeof counts.unknown === "number" ? Math.max(0, Math.round(counts.unknown)) : 0,
      fuzzy: typeof counts.fuzzy === "number" ? Math.max(0, Math.round(counts.fuzzy)) : 0,
      familiar: typeof counts.familiar === "number" ? Math.max(0, Math.round(counts.familiar)) : 0
    },
    testCount: typeof value.testCount === "number" ? Math.max(0, Math.round(value.testCount)) : 0,
    lastTestedAt: typeof value.lastTestedAt === "string" ? value.lastTestedAt : undefined,
    lastUpdatedAt: typeof value.lastUpdatedAt === "string" ? value.lastUpdatedAt : undefined
  };
}

export function validateProgressMap(value: unknown): ProgressMap {
  if (!isObject(value)) return {};

  return Object.entries(value).reduce<ProgressMap>((map, [key, rawProgress]) => {
    const progress = normalizeProgress(rawProgress, key);
    if (progress) {
      map[progress.wordId] = progress;
    }
    return map;
  }, {});
}

export function loadProgress(): ProgressMap {
  const storage = getLocalStorage();
  if (!storage) return {};

  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return validateProgressMap(JSON.parse(raw));
  } catch {
    return {};
  }
}

export function saveProgress(progressMap: ProgressMap): void {
  const storage = getLocalStorage();
  if (!storage) return;

  storage.setItem(STORAGE_KEY, JSON.stringify(validateProgressMap(progressMap)));
}

export function updateWordProgress(wordId: string, patch: Partial<WordProgress>): ProgressMap {
  const progressMap = loadProgress();
  const current = progressMap[wordId] ?? createDefaultProgress(wordId);
  const next = validateProgressMap({
    ...progressMap,
    [wordId]: {
      ...current,
      ...patch,
      wordId
    }
  });
  saveProgress(next);
  return next;
}

export function resetWordProgress(wordId: string): ProgressMap {
  const progressMap = loadProgress();
  const next = { ...progressMap };
  delete next[wordId];
  saveProgress(next);
  return next;
}

export function exportProgress(): string {
  return JSON.stringify(loadProgress(), null, 2);
}

export function importProgress(json: string): ProgressMap {
  const parsed = JSON.parse(json);
  const progressMap = validateProgressMap(parsed);
  saveProgress(progressMap);
  return progressMap;
}
