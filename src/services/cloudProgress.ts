import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

import { getCloudFirestore } from "@/services/firebase";
import { validateProgressMap } from "@/storage/progressStorage";
import type { ProgressMap } from "@/types/deck";

const PROGRESS_SCHEMA_VERSION = 1;

function getProgressDocRef(uid: string) {
  const firestore = getCloudFirestore();
  if (!firestore) {
    throw new Error("Firebase is not configured.");
  }

  return doc(firestore, "users", uid, "progress", "current");
}

function stripUndefinedFields<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export async function loadCloudProgress(uid: string): Promise<ProgressMap> {
  const snapshot = await getDoc(getProgressDocRef(uid));
  if (!snapshot.exists()) return {};

  const data = snapshot.data() as { progressMap?: unknown };
  return validateProgressMap(data.progressMap);
}

export async function saveCloudProgress(uid: string, progressMap: ProgressMap): Promise<void> {
  const cleanProgressMap = stripUndefinedFields(validateProgressMap(progressMap));

  await setDoc(
    getProgressDocRef(uid),
    {
      progressMap: cleanProgressMap,
      schemaVersion: PROGRESS_SCHEMA_VERSION,
      clientUpdatedAt: new Date().toISOString(),
      updatedAt: serverTimestamp()
    },
    { merge: true }
  );
}
