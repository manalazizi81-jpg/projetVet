"use client";

import { CalendarDays, Clock3, Mail, Phone, Search, UserRound } from "lucide-react";
import { useState } from "react";

export type AdminMessage = {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
};

type Props = {
  messages: AdminMessage[];
  busy: boolean;
  onChange: (id: string, status: string) => Promise<void>;
};

const filters = [
  { value: "ALL", label: "Tous" },
  { value: "NEW", label: "Nouveaux" },
  { value: "READ", label: "Lus" },
  { value: "ARCHIVED", label: "Archivés" },
];
const statusLabels: Record<string, string> = { NEW: "Nouveau", READ: "Lu", ARCHIVED: "Archivé" };
const dateTime = (value: string) => new Date(value).toLocaleString("fr-MA", { dateStyle: "long", timeStyle: "short" });
const localDate = (value: string) => {
  const date = new Date(value);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};

export function AdminMessages({ messages, busy, onChange }: Props) {
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const query = search.trim().toLocaleLowerCase("fr");
  const filtered = messages.filter((item) => {
    if (filter !== "ALL" && item.status !== filter) return false;
    if (date && localDate(item.createdAt) !== date) return false;
    return !query || [item.fullName, item.email, item.phone ?? "", item.subject, item.message]
      .some((value) => value.toLocaleLowerCase("fr").includes(query));
  });
  const selected = filtered.find((item) => item.id === selectedId) ?? filtered[0];

  return <section className="admin-appointments admin-messages" aria-label="Gestion des messages">
    <div className="admin-appointments-heading"><div><span>BOÎTE DE RÉCEPTION</span><h1>Messages de contact</h1><p>Retrouvez les demandes reçues depuis le formulaire du site.</p></div><strong>{messages.length} message{messages.length > 1 ? "s" : ""}</strong></div>
    <div className="admin-appointment-tools">
      <div className="admin-appointment-filters" role="group" aria-label="Filtrer les messages par statut">{filters.map((item) => <button type="button" key={item.value} className={filter === item.value ? "is-active" : ""} aria-pressed={filter === item.value} onClick={() => setFilter(item.value)}>{item.label}<small>{item.value === "ALL" ? messages.length : messages.filter((message) => message.status === item.value).length}</small></button>)}</div>
      <div className="admin-appointment-search"><label><Search size={17} /><span className="sr-only">Rechercher un message</span><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Nom, objet, email, message…" /></label><label className="admin-appointment-date"><CalendarDays size={17} /><span className="sr-only">Filtrer par date</span><input type="date" value={date} onChange={(event) => setDate(event.target.value)} aria-label="Filtrer par date" /></label></div>
    </div>
    <div className="admin-appointment-workspace">
      <div className="admin-appointment-list" aria-label="Résultats des messages">
        <div className="admin-appointment-list-title"><strong>{filtered.length} résultat{filtered.length > 1 ? "s" : ""}</strong><span>Choisir un message</span></div>
        {filtered.map((item) => <button type="button" key={item.id} className={`admin-appointment-item${selected?.id === item.id ? " is-selected" : ""}`} aria-pressed={selected?.id === item.id} onClick={() => setSelectedId(item.id)}>
          <span className="admin-appointment-avatar">{item.fullName.trim().charAt(0).toUpperCase()}</span>
          <span className="admin-appointment-item-copy"><strong>{item.subject}</strong><small>{item.fullName} · {item.message}</small><time dateTime={item.createdAt}>{dateTime(item.createdAt)}</time></span>
          <span className={`admin-status-dot admin-message-status-${item.status.toLowerCase()}`} title={statusLabels[item.status] ?? item.status} />
        </button>)}
        {!filtered.length && <p className="admin-appointment-no-results">Aucun message ne correspond à ces filtres.</p>}
        {messages.length >= 200 && <p className="admin-appointment-limit">Les 200 messages les plus récents sont affichés.</p>}
      </div>
      {selected ? <article className="admin-appointment-detail admin-message-detail" key={selected.id}>
        <div className="admin-appointment-detail-head"><div><span>MESSAGE REÇU</span><h3>{selected.subject}</h3><p>Envoyé le {dateTime(selected.createdAt)}</p></div><span className={`admin-status-badge admin-message-status-${selected.status.toLowerCase()}`}>{statusLabels[selected.status] ?? selected.status}</span></div>
        <div className="admin-appointment-info-grid">
          <div><UserRound size={18} /><span>Expéditeur<strong>{selected.fullName}</strong></span></div>
          <div><Mail size={18} /><span>Email<a href={`mailto:${selected.email}`}>{selected.email}</a></span></div>
          {selected.phone && <div><Phone size={18} /><span>Téléphone<a href={`tel:${selected.phone}`}>{selected.phone}</a></span></div>}
          <div><Clock3 size={18} /><span>Reçu le<strong>{dateTime(selected.createdAt)}</strong></span></div>
        </div>
        <div className="admin-appointment-message admin-message-body"><span>CONTENU DU MESSAGE</span><p>{selected.message}</p></div>
        <div className="admin-message-actions"><a href={`mailto:${selected.email}?subject=${encodeURIComponent(`Re: ${selected.subject}`)}`}><Mail size={16} /> Répondre par email</a>{selected.status === "NEW" && <button type="button" disabled={busy} onClick={() => void onChange(selected.id, "READ")}>Marquer comme lu</button>}</div>
      </article> : <div className="admin-appointment-detail admin-appointment-detail-empty"><Mail size={32} /><p>Sélectionnez un message pour le lire.</p></div>}
    </div>
  </section>;
}
