import type { User } from "firebase/auth";
import { doc, getDoc, onSnapshot, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Every user gets a profile document at users/{uid}. Data that belongs to the
// user (applications, and anything added later) lives in subcollections under it.
function userDocument(userId: string) {
  return doc(db, "users", userId);
}

export async function ensureUserProfile(user: User, name?: string): Promise<void> {
  const reference = userDocument(user.uid);
  const snapshot = await getDoc(reference);

  if (snapshot.exists()) return;

  await setDoc(reference, {
    name: name ?? user.displayName ?? "",
    email: user.email ?? "",
    photoURL: user.photoURL ?? null,
    createdAt: serverTimestamp(),
  });
}

// Calls onPhoto with the user's uploaded photo (or null) now and whenever it changes.
export function subscribeToProfilePhoto(userId: string, onPhoto: (photoData: string | null) => void) {
  return onSnapshot(
    userDocument(userId),
    (snapshot) => onPhoto(snapshot.get("photoData") ?? null),
    (error) => console.error(error)
  );
}

// Pass null to remove the uploaded photo.
export async function updateProfilePhoto(userId: string, photoData: string | null): Promise<void> {
  await setDoc(userDocument(userId), { photoData, updatedAt: serverTimestamp() }, { merge: true });
}
