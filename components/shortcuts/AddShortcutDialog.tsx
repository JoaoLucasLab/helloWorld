"use client";

import { useId, useState } from "react";
import type { SyntheticEvent } from "react";
import { Modal } from "@/components/ui/Modal";
import { normalizeUrl, shortcutOptions } from "@/lib/shortcuts";
import { addShortcut } from "@/services/shortcutService";
import type { ShortcutType } from "@/types/shortcut";
import { ShortcutTypeSelect } from "./ShortcutTypeSelect";

type AddShortcutDialogProps = { userId: string; onClose: () => void };

export function AddShortcutDialog({ userId, onClose }: AddShortcutDialogProps) {
  const websiteLabelId = useId();
  const [type, setType] = useState<ShortcutType>("linkedin");
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const option = shortcutOptions.find((item) => item.type === type)!;
  const isOther = type === "other";

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
    <Modal onClose={onClose} labelledBy={websiteLabelId + "-title"}>
      <form onSubmit={handleSubmit} className="grid gap-4">
        <div>
          <p className="eyebrow">Shortcuts</p>
          <h2 id={websiteLabelId + "-title"} className="modal-title">Add a section</h2>
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
    </Modal>
  );
}
