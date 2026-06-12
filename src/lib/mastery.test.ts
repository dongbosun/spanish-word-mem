import { describe, expect, it } from "vitest";

import {
  applySelfGrade,
  createDefaultProgress,
  markMastered,
  undoMastered
} from "@/lib/mastery";

describe("mastery", () => {
  it("creates default progress", () => {
    expect(createDefaultProgress("w-test")).toMatchObject({
      wordId: "w-test",
      mastery: 0,
      favorite: false,
      manuallyMastered: false,
      testCount: 0
    });
  });

  it("updates list grades with the list weighting", () => {
    const progress = createDefaultProgress("w-test");
    const next = applySelfGrade(progress, "familiar", "list", "2026-01-01T00:00:00.000Z");

    expect(next.mastery).toBe(26);
    expect(next.selfGradeCounts.familiar).toBe(1);
    expect(next.testCount).toBe(0);
    expect(next.lastTestedAt).toBeUndefined();
    expect(next.lastUpdatedAt).toBe("2026-01-01T00:00:00.000Z");
  });

  it("updates test grades with the test weighting", () => {
    const progress = { ...createDefaultProgress("w-test"), mastery: 80 };
    const next = applySelfGrade(progress, "unknown", "test", "2026-01-01T00:00:00.000Z");

    expect(next.mastery).toBe(45);
    expect(next.selfGradeCounts.unknown).toBe(1);
    expect(next.testCount).toBe(1);
    expect(next.lastTestedAt).toBe("2026-01-01T00:00:00.000Z");
  });

  it("marks and undoes manual mastery", () => {
    const mastered = markMastered(undefined, "w-test", "2026-01-01T00:00:00.000Z");
    expect(mastered.mastery).toBe(100);
    expect(mastered.manuallyMastered).toBe(true);

    const undone = undoMastered(mastered, "w-test", "2026-01-02T00:00:00.000Z");
    expect(undone.mastery).toBe(85);
    expect(undone.manuallyMastered).toBe(false);
  });
});
