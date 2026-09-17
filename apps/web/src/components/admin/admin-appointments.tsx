"use client";

import { CalendarDays, Clock3, Mail, Phone, Search, UserRound } from "lucide-react";
import { useState } from "react";

export type AdminAppointment = {
  id: string;
  createdAt: string;
  status: string;
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;
  serviceLabel: string;
  message: string | null;
  adminNotes: string | null;
  animal: { name: string; species: string; breed: string | null };
  slot: { startsAt: string; endsAt: string };
};

type Props = {
  appointments: AdminAppointment[];
  busy: boolean;
  onChange: (id: string, patch: { status?: string; adminNotes?: string }) => Promise<void>;
};

const filters = [
  { value: "ALL", label: "Tous" },
  { value: "PENDING", label: "En attente" },
  { value: "CONFIRMED", label: "Confirmés" },
  { value: "COMPLETED", label: "Terminés" },
  { value: "CANCELLED", label: "Annulés" },
];
const statusLabels: Record<string, string> = { PENDING: "En attente", CONFIRMED: "Confirmé", COMPLETED: "Terminé", CANCELLED: "Annulé" };
const speciesLabels: Record<string, string> = { DOG: "Chien", CAT: "Chat", BIRD: "Oiseau", RABBIT: "Lapin", RODENT: "Rongeur", REPTILE: "Reptile", OTHER: "Autre" };
const dateTime = (value: string) => new Date(value).toLocaleString("fr-MA", { dateStyle: "long", timeStyle: "short" });
const localDate = (value: string) => {
  const date = new Date(value);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};

export function AdminAppointments({ appointments, busy, onChange }: Props) {
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const query = search.trim().toLocaleLowerCase("fr");
  const filtered = appointments.filter((item) => {
    if (filter !== "ALL" && item.status !== filter) return false;
    if (date && localDate(item.slot.startsAt) !== date) return false;
    return !query || [item.ownerName, item.ownerPhone, item.ownerEmail, item.animal.name, item.serviceLabel]
      .some((value) => value.toLocaleLowerCase("fr").includes(query));
  });
  const selected = filtered.find((item) => item.id === selectedId) ?? filtered[0];

  return <section className="admin-appointments" aria-label="Gestion des rendez-vous">
    <div className="admin-appointments-heading"><div><span>AGENDA DU CABINET</span><h1>Demandes de rendez-vous</h1><p>Consultez les demandes et mettez à jour leur suivi.</p></div><strong>{appointments.length} demande{appointments.length > 1 ? "s" : ""}</strong></div>
    <div className="admin-appointment-tools">
      <div className="admin-appointment-filters" role="group" aria-label="Filtrer par statut">{filters.map((item) => <button type="button" key={item.value} className={filter === item.value ? "is-active" : ""} aria-pressed={filter === item.value} onClick={() => setFilter(item.value)}>{item.label}<small>{item.value === "ALL" ? appointments.length : appointments.filter((appointment) => appointment.status === item.value).length}</small></button>)}</div>
      <div className="admin-appointment-search"><label><Search size={17} /><span className="sr-only">Rechercher un rendez-vous</span><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Nom, animal, téléphone, service…" /></label><label className="admin-appointment-date"><CalendarDays size={17} /><span className="sr-only">Filtrer par date</span><input type="date" value={date} onChange={(event) => setDate(event.target.value)} aria-label="Filtrer par date" /></label></div>
    </div>
    <div className="admin-appointment-workspace">
      <div className="admin-appointment-list" aria-label="Résultats des rendez-vous">
        <div className="admin-appointment-list-title"><strong>{filtered.length} résultat{filtered.length > 1 ? "s" : ""}</strong><span>Choisir une demande</span></div>
        {filtered.map((item) => <button type="button" key={item.id} className={`admin-appointment-item${selected?.id === item.id ? " is-selected" : ""}`} aria-pressed={selected?.id === item.id} onClick={() => setSelectedId(item.id)}>
          <span className="admin-appointment-avatar">{item.ownerName.trim().charAt(0).toUpperCase()}</span>
          <span className="admin-appointment-item-copy"><strong>{item.ownerName}</strong><small>{item.animal.name} · {item.serviceLabel}</small><time dateTime={item.slot.startsAt}>{dateTime(item.slot.startsAt)}</time></span>
          <span className={`admin-status-dot admin-status-${item.status.toLowerCase()}`} title={statusLabels[item.status] ?? item.status} />
        </button>)}
        {!filtered.length && <p className="admin-appointment-no-results">Aucun rendez-vous ne correspond à ces filtres.</p>}
        {appointments.length >= 200 && <p className="admin-appointment-limit">Les 200 rendez-vous les plus récents sont affichés.</p>}
      </div>
      {selected ? <article className="admin-appointment-detail" key={selected.id}>
        <div className="admin-appointment-detail-head"><div><span>DÉTAIL DU RENDEZ-VOUS</span><h3>{selected.ownerName}</h3><p>{selected.serviceLabel}</p></div><span className={`admin-status-badge admin-status-${selected.status.toLowerCase()}`}>{statusLabels[selected.status] ?? selected.status}</span></div>
        <div className="admin-appointment-info-grid">
          <div><CalendarDays size={18} /><span>Date et heure<strong>{dateTime(selected.slot.startsAt)}</strong></span></div>
          <div><UserRound size={18} /><span>Animal<strong>{selected.animal.name} · {speciesLabels[selected.animal.species] ?? selected.animal.species}{selected.animal.breed ? ` · ${selected.animal.breed}` : ""}</strong></span></div>
          <div><Phone size={18} /><span>Téléphone<a href={`tel:${selected.ownerPhone}`}>{selected.ownerPhone}</a></span></div>
          <div><Mail size={18} /><span>Email<a href={`mailto:${selected.ownerEmail}`}>{selected.ownerEmail}</a></span></div>
        </div>
        {selected.message && <div className="admin-appointment-message"><span>MESSAGE DU CLIENT</span><p>{selected.message}</p></div>}
        <div className="admin-appointment-edit"><label htmlFor={`appointment-status-${selected.id}`}>Statut du rendez-vous</label><select id={`appointment-status-${selected.id}`} value={selected.status} disabled={busy} onChange={(event) => void onChange(selected.id, { status: event.target.value })}>{filters.slice(1).map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></div>
        <div className="admin-appointment-notes"><label htmlFor={`appointment-notes-${selected.id}`}>Notes internes</label><p>Ces notes ne sont visibles que par l’équipe du cabinet.</p><textarea id={`appointment-notes-${selected.id}`} rows={4} maxLength={2000} value={notes[selected.id] ?? selected.adminNotes ?? ""} onChange={(event) => setNotes((current) => ({ ...current, [selected.id]: event.target.value }))} placeholder="Ajouter une information utile pour le suivi…" /><button type="button" disabled={busy || (notes[selected.id] ?? selected.adminNotes ?? "") === (selected.adminNotes ?? "")} onClick={() => void onChange(selected.id, { adminNotes: notes[selected.id] ?? selected.adminNotes ?? "" })}>{busy ? "Enregistrement…" : "Enregistrer la note"}</button></div>
      </article> : <div className="admin-appointment-detail admin-appointment-detail-empty"><Clock3 size={32} /><p>Sélectionnez un rendez-vous pour voir ses détails.</p></div>}
    </div>
  </section>;
}
