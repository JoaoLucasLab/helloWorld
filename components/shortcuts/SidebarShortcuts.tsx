"use client";

import { useState } from "react";
import { useShortcuts } from "@/hooks/useShortcuts";
import { deleteShortcut } from "@/services/shortcutService";
import type { Shortcut } from "@/types/shortcut";
import { AddShortcutDialog } from "./AddShortcutDialog";
import { ShortcutIcon } from "./ShortcutIcon";

export function SidebarShortcuts({ userId }: { userId: string }) {
  const { shortcuts, error: loadError } = useShortcuts(userId);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRemove(shortcut: Shortcut) {
    if (!window.confirm(`Remove the ${shortcut.label} shortcut?`)) return;

    setError(null);
    try {
      await deleteShortcut(userId, shortcut.id);
    } catch (removeError) {
      console.error(removeError);
      setError("Could not remove the shortcut.");
    }
  }

  const message = error ?? loadError;

  return (
    <section className="shortcuts" aria-label="Shortcuts">
      <p className="shortcuts-heading">Shortcuts</p>
      <ul className="shortcuts-list">
        {shortcuts.map((shortcut) => (
          <li key={shortcut.id} className="shortcut-item">
            <a href={shortcut.url} target="_blank" rel="noopener noreferrer" className="shortcut-link" title={shortcut.url}>
              <ShortcutIcon type={shortcut.type} />
              <span className="truncate">{shortcut.label}</span>
            </a>
            <button type="button" onClick={() => handleRemove(shortcut)} aria-label={`Remove ${shortcut.label} shortcut`} className="shortcut-remove">
              <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
            </button>
          </li>
        ))}
      </ul>
      <button type="button" onClick={() => setIsAdding(true)} className="shortcut-add">
        <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
        Add section
      </button>
      {message && <p role="alert" className="shortcuts-error">{message}</p>}
      {isAdding && <AddShortcutDialog userId={userId} onClose={() => setIsAdding(false)} />}
    </section>
  );
}
