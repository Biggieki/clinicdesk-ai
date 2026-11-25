"use client";

import type { ReactNode } from "react";
import { Dialog } from "./dialog";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  children: ReactNode;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}

/** Destructive-action confirmation. Cancel comes first, so a stray Enter can't delete. */
export function ConfirmDialog({
  open, title, children, confirmLabel, onConfirm, onCancel,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} title={title} onClose={onCancel}>
      <div className="dialog-text">{children}</div>
      <div className="dialog-actions">
        <button type="button" className="btn-secondary" onClick={onCancel}>Cancel</button>
        <button type="button" className="btn-danger" onClick={onConfirm}>{confirmLabel}</button>
      </div>
    </Dialog>
  );
}
