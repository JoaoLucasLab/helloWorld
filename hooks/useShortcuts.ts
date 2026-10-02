"use client";

import { useEffect, useState } from "react";
import type { Shortcut } from "@/types/shortcut";
import { subscribeToShortcuts } from "@/services/shortcutService";

type ShortcutsState = { userId: string; shortcuts: Shortcut[]; error: string | null };

// Live list of the user's shortcuts; updates as soon as one is added or removed.
export function useShortcuts(userId: string) {
  const [state, setState] = useState<ShortcutsState | null>(null);

  useEffect(() => {
    return subscribeToShortcuts(
      userId,
      (shortcuts) => setState({ userId, shortcuts, error: null }),
      (error) => {
        console.error(error);
        setState({ userId, shortcuts: [], error: "Could not load your shortcuts." });
      }
    );
  }, [userId]);

  // Ignore results that belong to a previous user.
  const current = state?.userId === userId ? state : null;

  return {
    shortcuts: current?.shortcuts ?? [],
    isLoading: !current,
    error: current?.error ?? null,
  };
}
