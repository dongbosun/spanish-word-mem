import { describe, expect, it } from "vitest";

import { createDefaultProgress } from "@/lib/mastery";
import {
  assignDirection,
  buildTestPool,
  sampleTestWords
} from "@/lib/testSelection";
import type { ProgressMap, TestOptions, WordCard } from "@/types/deck";

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
    sectionId: "s2",
    tags: []
  },
  {
    id: "w-c",
    spanish: "c",
    english: ["c"],
    partOfSpeech: "adjective",
    chapterId: "c2",
    sectionId: "s3",
    tags: []
  }
];

const baseOptions: TestOptions = {
  scope: "all",
  direction: "mixed",
  count: 10,
  sampling: "random"
};

describe("test selection", () => {
  it("builds pools by chapter, section, favorites, weak and unmastered", () => {
    const progressMap: ProgressMap = {
      "w-a": { ...createDefaultProgress("w-a"), favorite: true, mastery: 20 },
      "w-b": { ...createDefaultProgress("w-b"), mastery: 70 },
      "w-c": { ...createDefaultProgress("w-c"), mastery: 95 }
    };

    expect(buildTestPool({ ...baseOptions, scope: "chapter", chapterId: "c1" }, words, progressMap)).toHaveLength(2);
    expect(buildTestPool({ ...baseOptions, scope: "section", sectionId: "s3" }, words, progressMap)).toHaveLength(1);
    expect(buildTestPool({ ...baseOptions, scope: "favorites" }, words, progressMap).map((word) => word.id)).toEqual(["w-a"]);
    expect(buildTestPool({ ...baseOptions, scope: "weak" }, words, progressMap).map((word) => word.id)).toEqual(["w-a"]);
    expect(buildTestPool({ ...baseOptions, scope: "unmastered" }, words, progressMap).map((word) => word.id)).toEqual(["w-a", "w-b"]);
  });

  it("never samples more than available", () => {
    const progressMap: ProgressMap = {};
    const sampled = sampleTestWords(words, 50, "random", progressMap, () => 0.5);

    expect(sampled).toHaveLength(3);
  });

  it("prioritizes lower mastery in weak-first mode", () => {
    const progressMap: ProgressMap = {
      "w-a": { ...createDefaultProgress("w-a"), mastery: 80 },
      "w-b": { ...createDefaultProgress("w-b"), mastery: 10 },
      "w-c": { ...createDefaultProgress("w-c"), mastery: 40 }
    };

    const sampled = sampleTestWords(words, 10, "weak-first", progressMap, () => 0.5);
    expect(sampled.map((word) => word.id).slice(0, 2)).toEqual(["w-b", "w-c"]);
  });

  it("assigns mixed direction with randomness", () => {
    expect(assignDirection(words[0], "es-en")).toBe("es-en");
    expect(assignDirection(words[0], "en-es")).toBe("en-es");
    expect(assignDirection(words[0], "mixed", () => 0.2)).toBe("es-en");
    expect(assignDirection(words[0], "mixed", () => 0.8)).toBe("en-es");
  });
});
