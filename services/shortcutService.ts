import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Shortcut, ShortcutType } from "@/types/shortcut";

// Shortcuts are stored per user at users/{userId}/shortcuts/{shortcutId}.
function shortcutsCollection(userId: string) {
  return collection(db, "users", userId, "shortcuts");
}

export function subscribeToShortcuts(
  userId: string,
  onShortcuts: (shortcuts: Shortcut[]) => void,
  onError: (error: Error) => void
) {
  return onSnapshot(
    shortcutsCollection(userId),
    (snapshot) => {
      const shortcuts = snapshot.docs.map((document) => {
        // "estimate" gives a just-added shortcut a createdAt before the server confirms it.
        const data = document.data({ serverTimestamps: "estimate" });

        return {
          id: document.id,
          type: data.type,
          label: data.label,
          url: data.url,
          createdAt: data.createdAt?.toMillis?.() ?? Date.now(),
        } satisfies Shortcut;
      });

      onShortcuts(shortcuts.sort((a, b) => a.createdAt - b.createdAt));
    },
    onError
  );
}

export async function addShortcut(userId: string, type: ShortcutType, label: string, url: string): Promise<void> {
  await addDoc(shortcutsCollection(userId), { type, label, url, createdAt: serverTimestamp() });
}

export async function deleteShortcut(userId: string, shortcutId: string): Promise<void> {
  await deleteDoc(doc(shortcutsCollection(userId), shortcutId));
}
