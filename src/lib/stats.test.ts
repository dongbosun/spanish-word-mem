import { describe, expect, it } from "vitest";

import { createDefaultProgress } from "@/lib/mastery";
import {
  computeOverallStats,
  getMasteryLabel,
  getWordStatus,
  isUnmastered,
  isWeak
} from "@/lib/stats";
import type { ProgressMap, WordCard } from "@/types/deck";

const words: WordCard[] = [
  {
    id: "w-a",
    spanish: "a",
    english: ["a"],
    partOfSpeech: "noun",
    chapterId: "c1",
    sectionId: "s1",
    tags: []
  },
  {
    id: "w-b",
    spanish: "b",
    english: ["b"],
    partOfSpeech: "verb",
    chapterId: "c1",
    sectionId: "s1",
    tags: []
  },
  {
    id: "w-c",
    spanish: "c",
    english: ["c"],
    partOfSpeech: "adjective",
    chapterId: "c2",
    sectionId: "s2",
    tags: []
  }
];

describe("stats", () => {
  it("labels mastery statuses", () => {
    expect(getWordStatus(words[0], undefined)).toBe("unknown");
    expect(getWordStatus(words[0], { ...createDefaultProgress("w-a"), mastery: 45 })).toBe("fuzzy");
    expect(getWordStatus(words[0], { ...createDefaultProgress("w-a"), mastery: 75 })).toBe("familiar");
    expect(getWordStatus(words[0], { ...createDefaultProgress("w-a"), manuallyMastered: true })).toBe("mastered");
    expect(getMasteryLabel({ ...createDefaultProgress("w-a"), mastery: 92 })).toBe("完全会了");
  });

  it("computes overall stats", () => {
    const progressMap: ProgressMap = {
      "w-a": { ...createDefaultProgress("w-a"), mastery: 10, favorite: true, testCount: 1 },
      "w-b": { ...createDefaultProgress("w-b"), mastery: 70 },
      "w-c": { ...createDefaultProgress("w-c"), mastery: 100, manuallyMastered: true }
    };

    const stats = computeOverallStats(words, progressMap);
    expect(stats.total).toBe(3);
    expect(stats.unknown).toBe(1);
    expect(stats.familiar).toBe(1);
    expect(stats.mastered).toBe(1);
    expect(stats.favorites).toBe(1);
    expect(stats.weak).toBe(1);
    expect(stats.unmastered).toBe(2);
    expect(stats.tested).toBe(1);
    expect(stats.neverTested).toBe(2);
  });

  it("detects weak and unmastered words", () => {
    expect(isWeak({ ...createDefaultProgress("w-a"), mastery: 59 })).toBe(true);
    expect(isWeak({ ...createDefaultProgress("w-a"), mastery: 60 })).toBe(false);
    expect(isUnmastered({ ...createDefaultProgress("w-a"), mastery: 89 })).toBe(true);
    expect(isUnmastered({ ...createDefaultProgress("w-a"), mastery: 90 })).toBe(false);
  });
});
