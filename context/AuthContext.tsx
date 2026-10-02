"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  updateProfile,
} from "firebase/auth";
import type { User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { ensureUserProfile, subscribeToProfilePhoto, updateProfilePhoto } from "@/services/userService";

type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
  // The photo the user uploaded, falling back to their Google photo.
  photoURL: string | null;
  setProfilePhoto: (photoData: string | null) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [, setProfileVersion] = useState(0);
  const [uploadedPhoto, setUploadedPhoto] = useState<{ uid: string; photoData: string | null } | null>(null);

  useEffect(() => {
    return onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });
  }, []);

  const userId = user?.uid;

  useEffect(() => {
    if (!userId) return;

    return subscribeToProfilePhoto(userId, (photoData) => setUploadedPhoto({ uid: userId, photoData }));
  }, [userId]);

  // Ignore a photo loaded for a previous user until the new user's photo arrives.
  const currentUploadedPhoto = uploadedPhoto && uploadedPhoto.uid === userId ? uploadedPhoto.photoData : null;
  const photoURL = currentUploadedPhoto ?? user?.photoURL ?? null;

  async function setProfilePhoto(photoData: string | null) {
    if (!user) throw new Error("You need to be signed in to change your photo.");

    await updateProfilePhoto(user.uid, photoData);
  }

  async function signUp(name: string, email: string, password: string) {
    const credential = await createUserWithEmailAndPassword(auth, email, password);

    await updateProfile(credential.user, { displayName: name });
    // updateProfile changes the existing user object without notifying onAuthStateChanged,
    // so force a re-render to show the new name.
    setProfileVersion((version) => version + 1);
    await ensureUserProfile(credential.user, name);
  }

  async function signIn(email: string, password: string) {
    await signInWithEmailAndPassword(auth, email, password);
  }

  async function signInWithGoogle() {
    const credential = await signInWithPopup(auth, new GoogleAuthProvider());

    await ensureUserProfile(credential.user);
  }

  async function signOut() {
    await firebaseSignOut(auth);
  }

  async function resetPassword(email: string) {
    await sendPasswordResetEmail(auth, email);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, photoURL, setProfilePhoto, signUp, signIn, signInWithGoogle, signOut, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) throw new Error("useAuth must be used inside an AuthProvider.");

  return context;
}

// Turns Firebase error codes into messages that make sense to the user.
export function getAuthErrorMessage(error: unknown) {
  const code = typeof error === "object" && error && "code" in error ? String(error.code) : "";

  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Incorrect email or password.";
    case "auth/email-already-in-use":
      return "An account with this email already exists. Try logging in instead.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/weak-password":
      return "Password must be at least 6 characters.";
    case "auth/too-many-requests":
      return "Too many attempts. Please wait a moment and try again.";
    case "auth/popup-closed-by-user":
    case "auth/cancelled-popup-request":
      return "";
    case "auth/operation-not-allowed":
    case "auth/configuration-not-found":
      return "This sign-in method is not enabled yet. Turn it on in Firebase console → Authentication → Sign-in method.";
    case "auth/network-request-failed":
      return "Network error. Check your connection and try again.";
    default:
      return "Something went wrong. Please try again.";
  }
}
