"use client";

import { Bell, CalendarDays, Mail } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { AdminAppointment } from "./admin-appointments";
import type { AdminMessage } from "./admin-messages";

type Section = "appointments" | "contacts";

export function AdminNotifications({ appointments, messages, pendingCount, messageCount, onNavigate }: {
  appointments: AdminAppointment[];
  messages: AdminMessage[];
  pendingCount: number;
  messageCount: number;
  onNavigate: (section: Section) => void;
}) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const total = pendingCount + messageCount;
  const items = [
    ...appointments.filter((item) => item.status === "PENDING").map((item) => ({ id: item.id, section: "appointments" as const, title: `Rendez-vous de ${item.ownerName}`, detail: `${item.animal.name} · ${item.serviceLabel}`, date: item.createdAt ?? item.slot.startsAt })),
    ...messages.filter((item) => item.status === "NEW").map((item) => ({ id: item.id, section: "contacts" as const, title: item.subject, detail: `Message de ${item.fullName}`, date: item.createdAt })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  useEffect(() => {
    if (!open) return;
    const closeOutside = (event: MouseEvent) => { if (root.current && !root.current.contains(event.target as Node)) setOpen(false); };
    const closeEscape = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", closeOutside);
    document.addEventListener("keydown", closeEscape);
    return () => { document.removeEventListener("mousedown", closeOutside); document.removeEventListener("keydown", closeEscape); };
  }, [open]);

  function go(section: Section) { setOpen(false); onNavigate(section); }

  return <div className="admin-notifications" ref={root}><button type="button" className="admin-notification-trigger" onClick={() => setOpen((current) => !current)} aria-label={`Notifications : ${total} élément${total > 1 ? "s" : ""} à traiter`} aria-expanded={open} aria-haspopup="dialog"><Bell size={19} />{total > 0 && <span>{total > 99 ? "99+" : total}</span>}</button>
    {open && <div className="admin-notification-popover" role="dialog" aria-label="Notifications"><div className="admin-notification-head"><strong>Notifications</strong><span>{total} à traiter</span></div>{items.length ? <div className="admin-notification-list">{items.map((item) => <button type="button" key={`${item.section}-${item.id}`} onClick={() => go(item.section)}>{item.section === "appointments" ? <CalendarDays size={17} /> : <Mail size={17} />}<span><strong>{item.title}</strong><small>{item.detail}</small></span></button>)}</div> : <p className="admin-notification-empty">Aucune demande en attente pour le moment.</p>}{total > items.length && <div className="admin-notification-links"><button type="button" onClick={() => go("appointments")}>Voir les rendez-vous</button><button type="button" onClick={() => go("contacts")}>Voir les messages</button></div>}</div>}
  </div>;
}
