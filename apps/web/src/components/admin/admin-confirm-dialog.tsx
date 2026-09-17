"use client";

import { Trash2, X } from "lucide-react";
import { useEffect, useRef } from "react";

type Props = {
  title: string;
  description: string;
  busy: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function AdminConfirmDialog({ title, description, busy, onCancel, onConfirm }: Props) {
  const cancelButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    cancelButton.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !busy) onCancel();
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [busy, onCancel]);

  return (
    <div className="admin-dialog-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget && !busy) onCancel(); }}>
      <div className="admin-dialog" role="alertdialog" aria-modal="true" aria-labelledby="admin-dialog-title" aria-describedby="admin-dialog-description">
        <button type="button" className="admin-dialog-close" onClick={onCancel} disabled={busy} aria-label="Fermer"><X size={19} /></button>
        <span className="admin-dialog-icon"><Trash2 size={25} aria-hidden="true" /></span>
        <h2 id="admin-dialog-title">{title}</h2>
        <p id="admin-dialog-description">{description}</p>
        <div className="admin-dialog-actions">
          <button type="button" className="admin-dialog-cancel" onClick={onCancel} disabled={busy} ref={cancelButton}>Annuler</button>
          <button type="button" className="admin-dialog-confirm" onClick={onConfirm} disabled={busy}><Trash2 size={17} aria-hidden="true" />{busy ? "Suppression…" : "Supprimer la photo"}</button>
        </div>
      </div>
    </div>
  );
}
