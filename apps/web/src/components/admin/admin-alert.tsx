"use client";

import { CheckCircle2, CircleAlert, X } from "lucide-react";

type Props = {
  variant: "error" | "success";
  message: string;
  onClose: () => void;
};

export function AdminAlert({ variant, message, onClose }: Props) {
  const error = variant === "error";
  const Icon = error ? CircleAlert : CheckCircle2;
  return (
    <div className={`admin-alert admin-alert-${variant}`} role={error ? "alert" : "status"}>
      <span className="admin-alert-icon"><Icon size={20} aria-hidden="true" /></span>
      <div className="admin-alert-copy"><strong>{error ? "Une action est nécessaire" : "C'est enregistré"}</strong><span>{message}</span></div>
      <button type="button" className="admin-alert-close" onClick={onClose} aria-label="Fermer l’alerte"><X size={17} aria-hidden="true" /></button>
    </div>
  );
}
