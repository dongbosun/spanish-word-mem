import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from "react";

import {
  applySelfGrade,
  createDefaultProgress,
  markMastered as markProgressMastered,
  undoMastered as undoProgressMastered
} from "@/lib/mastery";
import {
  importProgress as importStoredProgress,
  loadProgress,
  saveProgress,
  validateProgressMap
} from "@/storage/progressStorage";
import type { GradeSource, ProgressMap, SelfGrade } from "@/types/deck";

type ProgressContextValue = {
  progressMap: ProgressMap;
  gradeWord: (wordId: string, grade: SelfGrade, source: GradeSource) => void;
  toggleFavorite: (wordId: string) => void;
  markWordMastered: (wordId: string) => void;
  undoWordMastered: (wordId: string) => void;
  resetWord: (wordId: string) => void;
  resetAllProgress: () => void;
  importProgress: (json: string) => { ok: true } | { ok: false; error: string };
  exportProgress: () => string;
};

const ProgressContext = createContext<ProgressContextValue | undefined>(undefined);

export function ProgressProvider({ children }: PropsWithChildren) {
  const [progressMap, setProgressMap] = useState<ProgressMap>(() => loadProgress());

  useEffect(() => {
    setProgressMap(loadProgress());
  }, []);

  const commit = useCallback((next: ProgressMap) => {
    setProgressMap(next);
    saveProgress(next);
  }, []);

  const gradeWord = useCallback(
    (wordId: string, grade: SelfGrade, source: GradeSource) => {
      const base = progressMap[wordId] ?? createDefaultProgress(wordId);
      const next = {
        ...progressMap,
        [wordId]: applySelfGrade(base, grade, source)
      };
      commit(next);
    },
    [commit, progressMap]
  );

  const toggleFavorite = useCallback(
    (wordId: string) => {
      const base = progressMap[wordId] ?? createDefaultProgress(wordId);
      const now = new Date().toISOString();
      const next = {
        ...progressMap,
        [wordId]: {
          ...base,
          favorite: !base.favorite,
          lastUpdatedAt: now
        }
      };
      commit(next);
    },
    [commit, progressMap]
  );

  const markWordMastered = useCallback(
    (wordId: string) => {
      const next = {
        ...progressMap,
        [wordId]: markProgressMastered(progressMap[wordId], wordId)
      };
      commit(next);
    },
    [commit, progressMap]
  );

  const undoWordMastered = useCallback(
    (wordId: string) => {
      const next = {
        ...progressMap,
        [wordId]: undoProgressMastered(progressMap[wordId], wordId)
      };
      commit(next);
    },
    [commit, progressMap]
  );

  const resetWord = useCallback(
    (wordId: string) => {
      const next = { ...progressMap };
      delete next[wordId];
      commit(next);
    },
    [commit, progressMap]
  );

  const resetAllProgress = useCallback(() => {
    commit({});
  }, [commit]);

  const importProgress = useCallback(
    (json: string) => {
      try {
        const next = importStoredProgress(json);
        setProgressMap(next);
        return { ok: true as const };
      } catch {
        return { ok: false as const, error: "导入失败：JSON 格式不正确或内容无法识别。" };
      }
    },
    []
  );

  const exportProgress = useCallback(() => {
    return JSON.stringify(validateProgressMap(progressMap), null, 2);
  }, [progressMap]);

  const value = useMemo(
    () => ({
      progressMap,
      gradeWord,
      toggleFavorite,
      markWordMastered,
      undoWordMastered,
      resetWord,
      resetAllProgress,
      importProgress,
      exportProgress
    }),
    [
      exportProgress,
      gradeWord,
      importProgress,
      markWordMastered,
      progressMap,
      resetAllProgress,
      resetWord,
      toggleFavorite,
      undoWordMastered
    ]
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error("useProgress must be used inside ProgressProvider");
  }
  return context;
}
