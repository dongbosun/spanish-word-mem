import { describe, expect, it } from "vitest";

import { mergeProgressMaps } from "@/lib/progressMerge";
import type { WordProgress } from "@/types/deck";

function progress(overrides: Partial<WordProgress> & { wordId: string }): WordProgress {
  return {
    wordId: overrides.wordId,
    mastery: overrides.mastery ?? 0,
    favorite: overrides.favorite ?? false,
    manuallyMastered: overrides.manuallyMastered ?? false,
    selfGradeCounts: {
      unknown: overrides.selfGradeCounts?.unknown ?? 0,
      fuzzy: overrides.selfGradeCounts?.fuzzy ?? 0,
      familiar: overrides.selfGradeCounts?.familiar ?? 0
    },
    testCount: overrides.testCount ?? 0,
    lastTestedAt: overrides.lastTestedAt,
    lastUpdatedAt: overrides.lastUpdatedAt
  };
}

describe("mergeProgressMaps", () => {
  it("keeps words that exist on only one side", () => {
    const merged = mergeProgressMaps(
      { hola: progress({ wordId: "hola", mastery: 45 }) },
      { adios: progress({ wordId: "adios", mastery: 75 }) }
    );

    expect(merged.hola.mastery).toBe(45);
    expect(merged.adios.mastery).toBe(75);
  });

  it("prefers the latest per-word update", () => {
    const merged = mergeProgressMaps(
      {
        hola: progress({
          wordId: "hola",
          mastery: 10,
          lastUpdatedAt: "2026-01-01T00:00:00.000Z"
        })
      },
      {
        hola: progress({
          wordId: "hola",
          mastery: 75,
          lastUpdatedAt: "2026-01-02T00:00:00.000Z"
        })
      }
    );

    expect(merged.hola.mastery).toBe(75);
  });

  it("combines tied updates conservatively", () => {
    const merged = mergeProgressMaps(
      {
        hola: progress({
          wordId: "hola",
          mastery: 45,
          favorite: true,
          selfGradeCounts: { unknown: 2, fuzzy: 1, familiar: 0 },
          testCount: 1,
          lastUpdatedAt: "2026-01-01T00:00:00.000Z"
        })
      },
      {
        hola: progress({
          wordId: "hola",
          mastery: 75,
          manuallyMastered: true,
          selfGradeCounts: { unknown: 1, fuzzy: 2, familiar: 3 },
          testCount: 4,
          lastUpdatedAt: "2026-01-01T00:00:00.000Z"
        })
      }
    );

    expect(merged.hola).toMatchObject({
      mastery: 75,
      favorite: true,
      manuallyMastered: true,
      selfGradeCounts: { unknown: 2, fuzzy: 2, familiar: 3 },
      testCount: 4
    });
  });
});
