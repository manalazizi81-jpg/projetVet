"use client";

import { CalendarDays, CheckCircle2, Mail, ShieldCheck, UserRound } from "lucide-react";
import { FormEvent, useState } from "react";

export type AdminProfileData = {
  id: string;
  fullName: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  lastLoginAt: string | null;
};

export function AdminProfile({ profile, busy, onSave }: { profile: AdminProfileData; busy: boolean; onSave: (fullName: string) => Promise<void> }) {
  const [fullName, setFullName] = useState(profile.fullName);
  const changed = fullName.trim() !== profile.fullName;
  const date = (value: string) => new Date(value).toLocaleString("fr-MA", { dateStyle: "long", timeStyle: "short" });
  const save = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); if (changed) void onSave(fullName); };

  return <section className="admin-profile" aria-label="Mon profil">
    <div className="admin-appointments-heading"><div><span>MON COMPTE</span><h1>Mon profil</h1><p>Consultez vos informations et personnalisez votre nom d’affichage.</p></div></div>
    <div className="admin-profile-grid">
      <div className="admin-profile-card admin-profile-identity"><div className="admin-profile-avatar">{profile.fullName.trim().charAt(0).toUpperCase()}</div><h2>{profile.fullName}</h2><p>{profile.email}</p><span><ShieldCheck size={16} /> Administrateur</span></div>
      <div className="admin-profile-card"><div className="admin-profile-card-title"><UserRound size={20} /><div><h2>Informations personnelles</h2><p>Ces informations sont associées à votre compte administrateur.</p></div></div><form className="admin-profile-form" onSubmit={save}><label htmlFor="admin-profile-name">Nom complet</label><input id="admin-profile-name" value={fullName} onChange={(event) => setFullName(event.target.value)} minLength={2} maxLength={120} required /><label htmlFor="admin-profile-email">Adresse email</label><input id="admin-profile-email" type="email" value={profile.email} readOnly aria-readonly="true" /><button type="submit" disabled={busy || !changed}>{busy ? "Enregistrement…" : "Enregistrer les modifications"}</button></form></div>
      <div className="admin-profile-card admin-profile-account"><div className="admin-profile-card-title"><ShieldCheck size={20} /><div><h2>Compte administrateur</h2><p>Informations de votre accès au cabinet.</p></div></div><div className="admin-profile-facts"><div><CheckCircle2 size={18} /><span>Statut du compte<strong>{profile.isActive ? "Actif" : "Inactif"}</strong></span></div><div><CalendarDays size={18} /><span>Compte créé le<strong>{date(profile.createdAt)}</strong></span></div><div><Mail size={18} /><span>Dernière connexion<strong>{profile.lastLoginAt ? date(profile.lastLoginAt) : "Non disponible"}</strong></span></div></div></div>
    </div>
  </section>;
}
