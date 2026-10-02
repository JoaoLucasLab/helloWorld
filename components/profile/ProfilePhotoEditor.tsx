"use client";

import { useRef, useState } from "react";
import type { ChangeEvent } from "react";
import type { User } from "firebase/auth";
import { Avatar } from "@/components/ui/Avatar";
import { useAuth } from "@/context/AuthContext";
import { resizeImageToDataUrl } from "@/lib/image";

const maxFileSizeMB = 10;

export function ProfilePhotoEditor({ user }: { user: User }) {
  const { photoURL, setProfilePhoto } = useAuth();
  const fileInput = useRef<HTMLInputElement>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasUploadedPhoto = photoURL?.startsWith("data:") ?? false;

  async function save(getPhoto: () => Promise<string | null>) {
    setIsSaving(true);
    setError(null);
    try {
      await setProfilePhoto(await getPhoto());
    } catch (saveError) {
      console.error(saveError);
      setError(saveError instanceof Error && saveError.message.startsWith("This file") ? saveError.message : "Could not update your photo. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    // Reset so choosing the same file again still triggers a change.
    event.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file (JPG, PNG, WebP...).");
      return;
    }
    if (file.size > maxFileSizeMB * 1024 * 1024) {
      setError(`Please choose an image smaller than ${maxFileSizeMB} MB.`);
      return;
    }

    save(() => resizeImageToDataUrl(file));
  }

  return (
    <div className="photo-editor">
      <button type="button" onClick={() => fileInput.current?.click()} disabled={isSaving} className="photo-editor-avatar" aria-label="Change profile photo">
        <Avatar user={user} className="avatar-large" />
        <span className="photo-editor-overlay" aria-hidden="true">{isSaving ? "Saving..." : "Change"}</span>
      </button>
      <input ref={fileInput} type="file" accept="image/*" onChange={handleFileChange} hidden />
      <div className="photo-editor-actions">
        <button type="button" onClick={() => fileInput.current?.click()} disabled={isSaving} className="link-button">{hasUploadedPhoto ? "Change photo" : "Upload photo"}</button>
        {hasUploadedPhoto && <button type="button" onClick={() => save(async () => null)} disabled={isSaving} className="link-button link-button-muted">Remove</button>}
      </div>
      {error && <p role="alert" className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}
