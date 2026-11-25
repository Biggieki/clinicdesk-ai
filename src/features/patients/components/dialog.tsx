"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";

interface DialogProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}

/**
 * Accessible modal built on the native <dialog> element. The browser provides
 * focus trapping, focus restoration, Escape-to-close and the dimmed backdrop,
 * so no dependency is needed. React state (`open`) stays the source of truth.
 */
export function Dialog({ open, title, onClose, children }: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    else if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className="app-dialog"
      aria-labelledby={titleId}
      onCancel={(event) => {
        // Escape key: let React state close it instead of the browser.
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        // Clicks on the dimmed backdrop target the <dialog> element itself.
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="dialog-body">
        <h3 id={titleId}>{title}</h3>
        {children}
      </div>
    </dialog>
  );
}
