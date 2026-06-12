import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";

import {
  applySelfGrade,
  createDefaultProgress,
  markMastered as markProgressMastered,
  undoMastered as undoProgressMastered
} from "@/lib/mastery";
import { mergeProgressMaps } from "@/lib/progressMerge";
import { signInWithGoogle, signOutFromCloud, subscribeToCloudAuth, type CloudUser } from "@/services/cloudAuth";
import { loadCloudProgress, saveCloudProgress } from "@/services/cloudProgress";
import { getMissingFirebaseConfig, isCloudSyncConfigured } from "@/services/firebase";
import {
  importProgress as importStoredProgress,
  loadProgress,
  saveProgress,
  validateProgressMap
} from "@/storage/progressStorage";
import type { GradeSource, ProgressMap, SelfGrade } from "@/types/deck";

type CloudSyncStatus = "disabled" | "signed-out" | "loading" | "syncing" | "synced" | "error";

type ProgressContextValue = {
  progressMap: ProgressMap;
  cloudUser: CloudUser | null;
  cloudSyncStatus: CloudSyncStatus;
  cloudSyncMessage: string;
  isCloudSyncReady: boolean;
  signInToCloud: () => Promise<void>;
  signOutOfCloud: () => Promise<void>;
  syncProgressNow: () => Promise<void>;
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

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "未知错误";
}

function getSyncedMessage(): string {
  return `已同步：${new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })}`;
}

export function ProgressProvider({ children }: PropsWithChildren) {
  const [progressMap, setProgressMap] = useState<ProgressMap>(() => loadProgress());
  const [cloudUser, setCloudUser] = useState<CloudUser | null>(null);
  const [cloudSyncStatus, setCloudSyncStatus] = useState<CloudSyncStatus>(() =>
    isCloudSyncConfigured() ? "loading" : "disabled"
  );
  const [cloudSyncMessage, setCloudSyncMessage] = useState(() => {
    const missingConfig = getMissingFirebaseConfig();
    return missingConfig.length > 0
      ? `缺少 Firebase 环境变量：${missingConfig.join(", ")}`
      : "正在检查 Google 登录状态。";
  });
  const latestProgressRef = useRef(progressMap);
  const cloudUserRef = useRef<CloudUser | null>(null);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const localProgress = loadProgress();
    latestProgressRef.current = localProgress;
    setProgressMap(localProgress);
  }, []);

  const flushCloudProgress = useCallback(async (nextProgress: ProgressMap) => {
    const user = cloudUserRef.current;
    if (!user || !isCloudSyncConfigured()) return;

    setCloudSyncStatus("syncing");
    setCloudSyncMessage("正在同步学习进度。");

    try {
      await saveCloudProgress(user.uid, nextProgress);
      setCloudSyncStatus("synced");
      setCloudSyncMessage(getSyncedMessage());
    } catch (error) {
      setCloudSyncStatus("error");
      setCloudSyncMessage(`同步失败：${getErrorMessage(error)}`);
    }
  }, []);

  const scheduleCloudProgressSave = useCallback(
    (nextProgress: ProgressMap) => {
      const user = cloudUserRef.current;
      if (!user || !isCloudSyncConfigured()) return;

      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      setCloudSyncStatus("syncing");
      setCloudSyncMessage("正在同步学习进度。");
      saveTimeoutRef.current = setTimeout(() => {
        void flushCloudProgress(nextProgress);
      }, 500);
    },
    [flushCloudProgress]
  );

  useEffect(() => {
    if (!isCloudSyncConfigured()) {
      return undefined;
    }

    return subscribeToCloudAuth(
      (user) => {
        cloudUserRef.current = user;
        setCloudUser(user);

        if (!user) {
          setCloudSyncStatus("signed-out");
          setCloudSyncMessage("未登录 Google，进度仅保存在本设备。");
          return;
        }

        setCloudSyncStatus("syncing");
        setCloudSyncMessage("正在合并本地和云端进度。");

        void (async () => {
          try {
            const localProgress = loadProgress();
            const cloudProgress = await loadCloudProgress(user.uid);
            const mergedProgress = mergeProgressMaps(localProgress, cloudProgress);

            latestProgressRef.current = mergedProgress;
            setProgressMap(mergedProgress);
            saveProgress(mergedProgress);
            await saveCloudProgress(user.uid, mergedProgress);

            setCloudSyncStatus("synced");
            setCloudSyncMessage(getSyncedMessage());
          } catch (error) {
            setCloudSyncStatus("error");
            setCloudSyncMessage(`同步失败：${getErrorMessage(error)}`);
          }
        })();
      },
      (error) => {
        setCloudSyncStatus("error");
        setCloudSyncMessage(`登录状态读取失败：${error.message}`);
      }
    );
  }, []);

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  const commit = useCallback((next: ProgressMap) => {
    latestProgressRef.current = next;
    setProgressMap(next);
    saveProgress(next);
    scheduleCloudProgressSave(next);
  }, [scheduleCloudProgressSave]);

  const signInToCloud = useCallback(async () => {
    if (!isCloudSyncConfigured()) {
      setCloudSyncStatus("disabled");
      setCloudSyncMessage(`缺少 Firebase 环境变量：${getMissingFirebaseConfig().join(", ")}`);
      return;
    }

    setCloudSyncStatus("loading");
    setCloudSyncMessage("正在打开 Google 登录。");

    try {
      await signInWithGoogle();
      setCloudSyncMessage("登录完成后会自动合并并同步进度。");
    } catch (error) {
      setCloudSyncStatus("error");
      setCloudSyncMessage(`登录失败：${getErrorMessage(error)}`);
    }
  }, []);

  const signOutOfCloud = useCallback(async () => {
    try {
      await signOutFromCloud();
      cloudUserRef.current = null;
      setCloudUser(null);
      setCloudSyncStatus("signed-out");
      setCloudSyncMessage("已退出 Google，进度仍保留在本设备。");
    } catch (error) {
      setCloudSyncStatus("error");
      setCloudSyncMessage(`退出失败：${getErrorMessage(error)}`);
    }
  }, []);

  const syncProgressNow = useCallback(async () => {
    await flushCloudProgress(latestProgressRef.current);
  }, [flushCloudProgress]);

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
        latestProgressRef.current = next;
        setProgressMap(next);
        scheduleCloudProgressSave(next);
        return { ok: true as const };
      } catch {
        return { ok: false as const, error: "导入失败：JSON 格式不正确或内容无法识别。" };
      }
    },
    [scheduleCloudProgressSave]
  );

  const exportProgress = useCallback(() => {
    return JSON.stringify(validateProgressMap(progressMap), null, 2);
  }, [progressMap]);

  const value = useMemo(
    () => ({
      progressMap,
      cloudUser,
      cloudSyncStatus,
      cloudSyncMessage,
      isCloudSyncReady: isCloudSyncConfigured(),
      signInToCloud,
      signOutOfCloud,
      syncProgressNow,
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
      cloudSyncMessage,
      cloudSyncStatus,
      cloudUser,
      exportProgress,
      gradeWord,
      importProgress,
      markWordMastered,
      progressMap,
      resetAllProgress,
      resetWord,
      signInToCloud,
      signOutOfCloud,
      syncProgressNow,
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
