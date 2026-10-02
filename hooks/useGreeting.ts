"use client";

import { useSyncExternalStore } from "react";

function getGreeting(hour: number) {
  if (hour >= 5 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 18) return "Good afternoon";
  return "Good evening";
}

// Re-check every minute so the greeting updates if the tab stays open.
function subscribe(onChange: () => void) {
  const id = setInterval(onChange, 60_000);
  return () => clearInterval(id);
}

export function useGreeting() {
  return useSyncExternalStore(
    subscribe,
    () => getGreeting(new Date().getHours()),
    // The server doesn't know the user's local time, so render a neutral greeting first.
    () => "Welcome back"
  );
}
