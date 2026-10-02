"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { MouseEvent, SyntheticEvent } from "react";
import { normalizeUrl, shortcutOptions } from "@/lib/shortcuts";
import { addShortcut } from "@/services/shortcutService";
import type { ShortcutType } from "@/types/shortcut";
import { ShortcutTypeSelect } from "./ShortcutTypeSelect";

type AddShortcutDialogProps = { userId: string; onClose: () => void };

export function AddShortcutDialog({ userId, onClose }: AddShortcutDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const websiteLabelId = useId();
  const [type, setType] = useState<ShortcutType>("linkedin");
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const option = shortcutOptions.find((item) => item.type === type)!;
  const isOther = type === "other";

  // showModal() gives us the backdrop, focus trapping and Escape-to-close for free.
  // No cleanup: the dialog is removed from the page when this component unmounts.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  // Clicks on the dialog's own padding also target the <dialog>, so check whether
  // the click actually landed outside the box (on the backdrop).
  function handleBackdropClick(event: MouseEvent<HTMLDialogElement>) {
    if (event.target !== dialogRef.current) return;
    const box = dialogRef.current.getBoundingClientRect();
    const isInside = event.clientX >= box.left && event.clientX <= box.right && event.clientY >= box.top && event.clientY <= box.bottom;
    if (!isInside) onClose();
  }

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedUrl = normalizeUrl(url);

    if (!normalizedUrl) {
      setError("Please enter a valid web address, like " + option.placeholder.replace("https://", "") + ".");
      return;
    }

    setIsSaving(true);
    setError(null);
    try {
      await addShortcut(userId, type, isOther ? name.trim() : option.label, normalizedUrl);
      onClose();
    } catch (saveError) {
      console.error(saveError);
      setError("Could not save the shortcut. Please try again.");
      setIsSaving(false);
    }
  }

  return (
    <dialog ref={dialogRef} onClose={onClose} onClick={handleBackdropClick} aria-labelledby={websiteLabelId + "-title"} className="shortcut-dialog">
      <form onSubmit={handleSubmit} className="grid gap-4">
        <div>
          <p className="eyebrow">Shortcuts</p>
          <h2 id={websiteLabelId + "-title"} className="shortcut-dialog-title">Add a section</h2>
        </div>
        <div className="field-label">
          <span id={websiteLabelId}>Website</span>
          <ShortcutTypeSelect labelId={websiteLabelId} value={type} onChange={(nextType) => { setType(nextType); setError(null); }} />
        </div>
        {isOther && <label className="field-label">Name<input required maxLength={40} value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Handshake" className="field-input" /></label>}
        <label className="field-label">Link<input required type="text" inputMode="url" autoComplete="url" value={url} onChange={(event) => setUrl(event.target.value)} placeholder={option.placeholder} className="field-input" /></label>
        {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
        <div className="flex justify-end gap-3">
          <button type="button" onClick={onClose} className="secondary-button">Cancel</button>
          <button type="submit" disabled={isSaving} className="primary-button disabled:opacity-60">{isSaving ? "Saving..." : "Add"}</button>
        </div>
      </form>
    </dialog>
  );
}
