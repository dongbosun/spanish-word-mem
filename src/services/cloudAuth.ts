import {
  browserLocalPersistence,
  getRedirectResult,
  GoogleAuthProvider,
  onAuthStateChanged,
  setPersistence,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  type User
} from "firebase/auth";

import { getCloudAuth } from "@/services/firebase";

export type CloudUser = {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
};

function toCloudUser(user: User): CloudUser {
  return {
    uid: user.uid,
    displayName: user.displayName,
    email: user.email,
    photoURL: user.photoURL
  };
}

function getGoogleProvider(): GoogleAuthProvider {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  return provider;
}

function shouldUseRedirectSignIn(): boolean {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return true;
  }

  const isNarrowViewport = window.matchMedia?.("(max-width: 820px)").matches ?? false;
  const isTouchDevice = navigator.maxTouchPoints > 1;
  const isStandalone =
    window.matchMedia?.("(display-mode: standalone)").matches ||
    ("standalone" in navigator && Boolean(navigator.standalone));

  return isNarrowViewport || isTouchDevice || Boolean(isStandalone);
}

function isPopupFailure(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string" &&
    error.code.includes("popup")
  );
}

export function subscribeToCloudAuth(
  onUser: (user: CloudUser | null) => void,
  onError: (error: Error) => void
): () => void {
  const auth = getCloudAuth();
  if (!auth) {
    onUser(null);
    return () => undefined;
  }

  void setPersistence(auth, browserLocalPersistence).catch(onError);
  void getRedirectResult(auth).catch(onError);

  return onAuthStateChanged(auth, (user) => onUser(user ? toCloudUser(user) : null), onError);
}

export async function signInWithGoogle(): Promise<void> {
  const auth = getCloudAuth();
  if (!auth) {
    throw new Error("Firebase is not configured.");
  }

  const provider = getGoogleProvider();
  if (shouldUseRedirectSignIn()) {
    await signInWithRedirect(auth, provider);
    return;
  }

  try {
    await signInWithPopup(auth, provider);
  } catch (error) {
    if (isPopupFailure(error)) {
      await signInWithRedirect(auth, provider);
      return;
    }
    throw error;
  }
}

export async function signOutFromCloud(): Promise<void> {
  const auth = getCloudAuth();
  if (!auth) return;
  await signOut(auth);
}
