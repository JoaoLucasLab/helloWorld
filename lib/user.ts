import type { User } from "firebase/auth";

export function getDisplayName(user: User) {
  return user.displayName || user.email?.split("@")[0] || "there";
}

export function getInitials(user: User) {
  const source = user.displayName || user.email || "?";
  const parts = source.split(/[\s@._-]+/).filter(Boolean);

  return parts.slice(0, 2).map((part) => part[0]!.toUpperCase()).join("") || "?";
}
