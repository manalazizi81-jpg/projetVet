"use client";

import { CalendarCheck, ChevronLeft, ChevronRight, Clock3, Mail, PawPrint, Phone, UserRound } from "lucide-react";
import { useMemo, useState } from "react";
import type { AdminAppointment } from "./admin-appointments";

const weekDays = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const monthLabel = new Intl.DateTimeFormat("fr-MA", { month: "long", year: "numeric" });
const fullDateLabel = new Intl.DateTimeFormat("fr-MA", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
const timeLabel = new Intl.DateTimeFormat("fr-MA", { hour: "2-digit", minute: "2-digit" });

function dayKey(value: Date | string) {
  const date = typeof value === "string" ? new Date(value) : value;
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function AdminCalendar({ appointments }: { appointments: AdminAppointment[] }) {
  const today = startOfDay(new Date());
  const [visibleMonth, setVisibleMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState(() => dayKey(today));

  const confirmed = useMemo(() => appointments
    .filter((appointment) => appointment.status === "CONFIRMED")
    .sort((a, b) => new Date(a.slot.startsAt).getTime() - new Date(b.slot.startsAt).getTime()), [appointments]);

  const appointmentsByDay = useMemo(() => confirmed.reduce<Record<string, AdminAppointment[]>>((days, appointment) => {
    const key = dayKey(appointment.slot.startsAt);
    (days[key] ??= []).push(appointment);
    return days;
  }, {}), [confirmed]);

  const firstDay = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1);
  const gridStart = new Date(firstDay);
  gridStart.setDate(firstDay.getDate() - ((firstDay.getDay() + 6) % 7));
  const days = Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + index);
    return date;
  });
  const selectedAppointments = appointmentsByDay[selectedDate] ?? [];
  const selectedDateValue = new Date(`${selectedDate}T12:00:00`);
  const upcomingCount = confirmed.filter((appointment) => new Date(appointment.slot.startsAt) >= today).length;

  function moveMonth(offset: number) {
    const next = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + offset, 1);
    setVisibleMonth(next);
    setSelectedDate(dayKey(next));
  }

  function goToday() {
    setVisibleMonth(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDate(dayKey(today));
  }

  return <section className="admin-calendar" aria-label="Calendrier des rendez-vous confirmés">
    <div className="admin-calendar-heading">
      <div><span>AGENDA DU CABINET</span><h1>Calendrier</h1><p>Visualisez tous les rendez-vous confirmés de votre cabinet.</p></div>
      <div className="admin-calendar-summary"><CalendarCheck size={20} /><span><strong>{upcomingCount}</strong> rendez-vous à venir</span></div>
    </div>

    <div className="admin-calendar-workspace">
      <div className="admin-calendar-card">
        <div className="admin-calendar-toolbar">
          <h2>{monthLabel.format(visibleMonth)}</h2>
          <div><button type="button" onClick={goToday}>Aujourd’hui</button><button type="button" onClick={() => moveMonth(-1)} aria-label="Mois précédent"><ChevronLeft size={18} /></button><button type="button" onClick={() => moveMonth(1)} aria-label="Mois suivant"><ChevronRight size={18} /></button></div>
        </div>
        <div className="admin-calendar-weekdays" aria-hidden="true">{weekDays.map((day) => <span key={day}>{day}</span>)}</div>
        <div className="admin-calendar-grid">
          {days.map((date) => {
            const key = dayKey(date);
            const dayAppointments = appointmentsByDay[key] ?? [];
            const outside = date.getMonth() !== visibleMonth.getMonth();
            const isToday = key === dayKey(today);
            const isSelected = key === selectedDate;
            return <button type="button" key={key} className={`${outside ? "is-outside " : ""}${isToday ? "is-today " : ""}${isSelected ? "is-selected" : ""}`} onClick={() => setSelectedDate(key)} aria-label={`${fullDateLabel.format(date)}, ${dayAppointments.length} rendez-vous`} aria-pressed={isSelected}>
              <time dateTime={key}>{date.getDate()}</time>
              {dayAppointments.length > 0 && <span className="admin-calendar-events"><i />{dayAppointments.length}<em> RDV</em></span>}
            </button>;
          })}
        </div>
      </div>

      <aside className="admin-calendar-day" aria-live="polite">
        <div className="admin-calendar-day-head"><span>JOURNÉE SÉLECTIONNÉE</span><h2>{fullDateLabel.format(selectedDateValue)}</h2><p>{selectedAppointments.length} rendez-vous confirmé{selectedAppointments.length > 1 ? "s" : ""}</p></div>
        <div className="admin-calendar-agenda">
          {selectedAppointments.map((appointment) => <article key={appointment.id}>
            <div className="admin-calendar-time"><Clock3 size={15} /><time dateTime={appointment.slot.startsAt}>{timeLabel.format(new Date(appointment.slot.startsAt))}–{timeLabel.format(new Date(appointment.slot.endsAt))}</time></div>
            <div className="admin-calendar-event-copy"><h3>{appointment.animal.name}</h3><p><PawPrint size={14} /> {appointment.serviceLabel}</p><p><UserRound size={14} /> {appointment.ownerName}</p><div><a href={`tel:${appointment.ownerPhone}`}><Phone size={13} /> {appointment.ownerPhone}</a><a href={`mailto:${appointment.ownerEmail}`}><Mail size={13} /> E-mail</a></div></div>
          </article>)}
          {!selectedAppointments.length && <div className="admin-calendar-empty"><CalendarCheck size={34} /><strong>Aucun rendez-vous confirmé</strong><p>Cette journée est libre pour le moment.</p></div>}
        </div>
      </aside>
    </div>
  </section>;
}
