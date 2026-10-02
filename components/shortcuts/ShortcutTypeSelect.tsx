"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { shortcutOptions } from "@/lib/shortcuts";
import type { ShortcutType } from "@/types/shortcut";
import { ShortcutIcon } from "./ShortcutIcon";

type ShortcutTypeSelectProps = {
  labelId: string;
  value: ShortcutType;
  onChange: (type: ShortcutType) => void;
};

// A dropdown that can show an icon next to each option (a native <select> can't).
export function ShortcutTypeSelect({ labelId, value, onChange }: ShortcutTypeSelectProps) {
  const id = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const selectedIndex = Math.max(0, shortcutOptions.findIndex((option) => option.type === value));
  const selected = shortcutOptions[selectedIndex];

  useEffect(() => {
    if (isOpen) listRef.current?.focus();
  }, [isOpen]);

  function open() {
    setActiveIndex(selectedIndex);
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
    buttonRef.current?.focus();
  }

  function choose(index: number) {
    onChange(shortcutOptions[index].type);
    close();
  }

  function handleButtonKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      open();
    }
  }

  function handleListKeyDown(event: KeyboardEvent<HTMLUListElement>) {
    const last = shortcutOptions.length - 1;
    const keyActions: Record<string, () => void> = {
      ArrowDown: () => setActiveIndex((index) => Math.min(index + 1, last)),
      ArrowUp: () => setActiveIndex((index) => Math.max(index - 1, 0)),
      Home: () => setActiveIndex(0),
      End: () => setActiveIndex(last),
      Enter: () => choose(activeIndex),
      " ": () => choose(activeIndex),
      // preventDefault below also stops Escape from closing the whole popup.
      Escape: close,
    };
    const action = keyActions[event.key];

    if (action) {
      event.preventDefault();
      action();
    } else if (event.key === "Tab") {
      setIsOpen(false);
    }
  }

  return (
    <div className="type-select">
      <button ref={buttonRef} type="button" id={id + "-button"} onClick={() => (isOpen ? close() : open())} onKeyDown={handleButtonKeyDown} aria-haspopup="listbox" aria-expanded={isOpen} aria-labelledby={labelId + " " + id + "-button"} className="field-input type-select-button">
        <span className="type-select-icon"><ShortcutIcon type={selected.type} /></span>
        <span className="flex-1 text-left">{selected.label}</span>
        <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
      </button>
      {isOpen && (
        <ul ref={listRef} role="listbox" tabIndex={-1} aria-labelledby={labelId} aria-activedescendant={id + "-option-" + activeIndex} onKeyDown={handleListKeyDown} onBlur={() => setIsOpen(false)} className="type-select-list">
          {shortcutOptions.map((option, index) => (
            <li key={option.type} id={id + "-option-" + index} role="option" aria-selected={option.type === value} onMouseDown={(event) => event.preventDefault()} onClick={() => choose(index)} onMouseEnter={() => setActiveIndex(index)} className={"type-select-option" + (index === activeIndex ? " active" : "")}>
              <span className="type-select-icon"><ShortcutIcon type={option.type} /></span>
              <span className="flex-1">{option.label}</span>
              {option.type === value && <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
