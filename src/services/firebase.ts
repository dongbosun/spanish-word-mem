import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID
};

const firebaseEnvKeys = [
  ["EXPO_PUBLIC_FIREBASE_API_KEY", firebaseConfig.apiKey],
  ["EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN", firebaseConfig.authDomain],
  ["EXPO_PUBLIC_FIREBASE_PROJECT_ID", firebaseConfig.projectId],
  ["EXPO_PUBLIC_FIREBASE_APP_ID", firebaseConfig.appId]
] as const;

export function getMissingFirebaseConfig(): string[] {
  return firebaseEnvKeys.flatMap(([key, value]) => (value ? [] : [key]));
}

export function isCloudSyncConfigured(): boolean {
  return getMissingFirebaseConfig().length === 0;
}

function getFirebaseApp(): FirebaseApp | undefined {
  if (!isCloudSyncConfigured() || typeof window === "undefined") {
    return undefined;
  }

  return getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
}

export function getCloudAuth(): Auth | undefined {
  const app = getFirebaseApp();
  return app ? getAuth(app) : undefined;
}

export function getCloudFirestore(): Firestore | undefined {
  const app = getFirebaseApp();
  return app ? getFirestore(app) : undefined;
}
