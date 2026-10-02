"use client";

import { useEffect, useRef } from "react";
import type { MouseEvent, ReactNode } from "react";

type ModalProps = {
  onClose: () => void;
  labelledBy: string;
  className?: string;
  children: ReactNode;
};

// A popup built on <dialog>. showModal() gives us the backdrop, focus trapping and
// Escape-to-close for free. Render it only while it should be open.
export function Modal({ onClose, labelledBy, className = "", children }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

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

  return (
    <dialog ref={dialogRef} onClose={onClose} onClick={handleBackdropClick} aria-labelledby={labelledBy} className={"modal " + className}>
      {children}
    </dialog>
  );
}
