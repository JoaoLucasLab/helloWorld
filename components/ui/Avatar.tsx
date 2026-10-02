"use client";

import type { User } from "firebase/auth";
import { useAuth } from "@/context/AuthContext";
import { getInitials } from "@/lib/user";

// Shows the user's photo, or their initials when they don't have one.
export function Avatar({ user, className }: { user: User; className: string }) {
  const { photoURL } = useAuth();

  if (!photoURL) return <span className={className}>{getInitials(user)}</span>;

  // eslint-disable-next-line @next/next/no-img-element -- photos are data URLs or Google-hosted, which next/image can't optimize.
  return <img src={photoURL} alt="" referrerPolicy="no-referrer" className={className + " avatar-photo"} />;
}
