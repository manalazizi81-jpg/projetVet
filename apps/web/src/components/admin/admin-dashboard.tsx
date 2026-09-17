"use client";

import Image from "next/image";
import { ArrowUpRight, CalendarDays, ImagePlus, LayoutDashboard, LogOut, Mail, RefreshCw, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { AdminOverview, type DashboardStats } from "./admin-overview";
import { AdminAppointments, type AdminAppointment } from "./admin-appointments";
import { AdminMessages, type AdminMessage } from "./admin-messages";
import { AdminGallery, type AdminPhoto } from "./admin-gallery";
import { AdminProfile, type AdminProfileData } from "./admin-profile";
import { AdminNotifications } from "./admin-notifications";
import { AdminAlert } from "./admin-alert";
import { AdminConfirmDialog } from "./admin-confirm-dialog";
import { AdminCalendar } from "./admin-calendar";

type Tab = "overview" | "calendar" | "appointments" | "contacts" | "photos" | "profile";
const sectionSlugs: Record<Tab, string> = { overview: "tableau-de-bord", calendar: "calendrier", appointments: "rendez-vous", contacts: "messages", photos: "galerie", profile: "profil" };
const sectionTitles: Record<Tab, string> = { overview: "Tableau de bord", calendar: "Calendrier", appointments: "Rendez-vous", contacts: "Messages", photos: "Galerie photos", profile: "Mon profil" };
const tabFromUrl = () => {
  const section = new URL(window.location.href).searchParams.get("section");
  return (Object.keys(sectionSlugs) as Tab[]).find((key) => sectionSlugs[key] === section) ?? "overview";
};

const api = process.env.NEXT_PUBLIC_API_URL ?? "/api";

export function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("overview");
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [appointments, setAppointments] = useState<AdminAppointment[]>([]);
  const [contacts, setContacts] = useState<AdminMessage[]>([]);
  const [photos, setPhotos] = useState<AdminPhoto[]>([]);
  const [profile, setProfile] = useState<AdminProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [photoToDelete, setPhotoToDelete] = useState<AdminPhoto | null>(null);
  const sectionTitle = sectionTitles[tab];
  const pendingAppointmentCount = appointments.filter((appointment) => appointment.status === "PENDING").length;
  const newMessageCount = contacts.filter((message) => message.status === "NEW").length;
  const liveStats = stats ? { ...stats, pending: pendingAppointmentCount, messages: newMessageCount } : null;

  useEffect(() => {
    const syncTab = () => { setTab(tabFromUrl()); setError(""); setSuccess(""); };
    syncTab();
    window.addEventListener("popstate", syncTab);
    return () => window.removeEventListener("popstate", syncTab);
  }, []);

  useEffect(() => { document.title = `${sectionTitle} | Administration Atlas`; }, [sectionTitle]);

  function navigate(next: Tab) {
    if (next === tab) return;
    setError("");
    setSuccess("");
    const url = new URL(window.location.href);
    if (next === "overview") url.searchParams.delete("section");
    else url.searchParams.set("section", sectionSlugs[next]);
    window.history.pushState(null, "", url);
    setTab(next);
  }

  const apiFetch = useCallback(async (path: string, init: RequestInit = {}) => {
    const token = sessionStorage.getItem("atlas_admin_token");
    if (!token) {
      router.replace("/admin/connexion");
      throw new Error("Session absente");
    }
    const headers = new Headers(init.headers);
    headers.set("Authorization", `Bearer ${token}`);
    const response = await fetch(`${api}${path}`, { ...init, headers, cache: "no-store" });
    if (response.status === 401) {
      sessionStorage.removeItem("atlas_admin_token");
      router.replace("/admin/connexion");
      throw new Error("Session expirée");
    }
    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw new Error(typeof body.message === "string" ? body.message : "Une erreur est survenue.");
    }
    return response.json();
  }, [router]);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [statsResult, appointmentsResult, contactsResult, photosResult, profileResult] = await Promise.allSettled([
        apiFetch("/dashboard/stats"), apiFetch("/appointments"), apiFetch("/contact"), apiFetch("/gallery/admin"), apiFetch("/auth/me"),
      ] as const);
      if (statsResult.status === "fulfilled") setStats({ ...statsResult.value, trend: statsResult.value.trend ?? [], statuses: statsResult.value.statuses ?? [], services: statsResult.value.services ?? [] });
      if (appointmentsResult.status === "fulfilled") setAppointments(appointmentsResult.value);
      if (contactsResult.status === "fulfilled") setContacts(contactsResult.value);
      if (photosResult.status === "fulfilled") setPhotos(photosResult.value);
      if (profileResult.status === "fulfilled") setProfile(profileResult.value);
      const failure = [statsResult, appointmentsResult, contactsResult, photosResult, profileResult].find((result) => result.status === "rejected");
      if (failure?.status === "rejected") throw failure.reason;
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Impossible de charger les données.");
    } finally {
      setLoading(false);
    }
  }, [apiFetch]);

  useEffect(() => { void load(); }, [load]);

  useEffect(() => {
    const now = Date.now();
    const nextEnd = appointments
      .filter((appointment) => appointment.status === "CONFIRMED")
      .map((appointment) => new Date(appointment.slot.endsAt).getTime())
      .filter((endsAt) => endsAt > now)
      .sort((a, b) => a - b)[0];
    if (!nextEnd) return;
    const timer = window.setTimeout(() => { void load(); }, Math.min(nextEnd - now + 250, 2_147_000_000));
    return () => window.clearTimeout(timer);
  }, [appointments, load]);

  useEffect(() => {
    let active = true;
    const refreshAlerts = async () => {
      if (document.visibilityState !== "visible") return;
      try {
        const [statsResult, appointmentsResult, contactsResult] = await Promise.allSettled([
          apiFetch("/dashboard/stats"), apiFetch("/appointments"), apiFetch("/contact"),
        ] as const);
        if (active) {
          if (statsResult.status === "fulfilled") setStats({ ...statsResult.value, trend: statsResult.value.trend ?? [], statuses: statsResult.value.statuses ?? [], services: statsResult.value.services ?? [] });
          if (appointmentsResult.status === "fulfilled") setAppointments(appointmentsResult.value);
          if (contactsResult.status === "fulfilled") setContacts(contactsResult.value);
        }
      } catch { /* Le prochain rafraîchissement ou l'action Actualiser réessaiera. */ }
    };
    const timer = window.setInterval(() => { void refreshAlerts(); }, 10000);
    window.addEventListener("focus", refreshAlerts);
    return () => { active = false; window.clearInterval(timer); window.removeEventListener("focus", refreshAlerts); };
  }, [apiFetch]);

  async function changeAppointment(id: string, patch: { status?: string; adminNotes?: string }) {
    setBusy(true); setError(""); setSuccess("");
    try {
      await apiFetch(`/appointments/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(patch) });
      setSuccess("Rendez-vous mis à jour.");
      await load();
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Mise à jour impossible."); }
    finally { setBusy(false); }
  }

  async function changeContact(id: string, status: string) {
    setBusy(true); setError(""); setSuccess("");
    try {
      await apiFetch(`/contact/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
      setSuccess("Message mis à jour.");
      await load();
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Mise à jour impossible."); }
    finally { setBusy(false); }
  }

  async function saveProfile(fullName: string) {
    setBusy(true); setError(""); setSuccess("");
    try {
      const updated = await apiFetch("/auth/me", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ fullName }) });
      setProfile(updated);
      setSuccess("Profil mis à jour.");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Mise à jour impossible."); }
    finally { setBusy(false); }
  }

  async function uploadPhoto(file: File) {
    if (!file.size) { setError("Choisissez une photo."); return; }
    if (file.size > 5 * 1024 * 1024) { setError("La photo doit faire 5 Mo maximum."); return; }
    const data = new FormData();
    data.append("file", file);
    data.append("alt", file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ") || "Photo de la galerie");
    setBusy(true); setError(""); setSuccess("");
    try {
      await apiFetch("/gallery", { method: "POST", body: data });
      setSuccess("Photo ajoutée à la galerie.");
      await load();
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Envoi impossible."); }
    finally { setBusy(false); }
  }

  async function changePhoto(photo: AdminPhoto, patch: { alt?: string; isPublished?: boolean; sortOrder?: number }) {
    setBusy(true); setError(""); setSuccess("");
    try {
      const response = await apiFetch(`/gallery/${photo.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(patch) }) as Partial<AdminPhoto>;
      const updated: AdminPhoto = { ...photo, ...response, ...patch };
      setPhotos((current) => current
        .map((item) => item.id === photo.id ? updated : item)
        .sort((first, second) => first.sortOrder - second.sortOrder || new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime()));
      setSuccess("Photo mise à jour.");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Mise à jour impossible."); }
    finally { setBusy(false); }
  }

  async function confirmDeletePhoto() {
    if (!photoToDelete) return;
    setBusy(true); setError(""); setSuccess("");
    try {
      await apiFetch(`/gallery/${photoToDelete.id}`, { method: "DELETE" });
      setSuccess("Photo supprimée.");
      setPhotoToDelete(null);
      await load();
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Suppression impossible."); }
    finally { setBusy(false); }
  }

  function logout() {
    sessionStorage.removeItem("atlas_admin_token");
    router.replace("/admin/connexion");
  }

  return <main className="admin-page">
    <aside className="admin-sidebar">
      <div className="admin-brand"><span className="admin-brand-mark"><Image src="/images/logo-atlas-circle.svg" alt="" width={46} height={46} /></span><span><strong>Atlas</strong><small>CABINET VÉTÉRINAIRE</small></span></div>
      <div className="admin-sidebar-group"><span className="admin-sidebar-label">ESPACE DE TRAVAIL</span>
        <nav className="admin-nav" aria-label="Sections de l'administration">
          <button type="button" className={tab === "overview" ? "is-active" : ""} aria-current={tab === "overview" ? "page" : undefined} onClick={() => navigate("overview")}><LayoutDashboard size={19} /> <span>Tableau de bord</span></button>
          <button type="button" className={tab === "calendar" ? "is-active" : ""} aria-current={tab === "calendar" ? "page" : undefined} onClick={() => navigate("calendar")}><CalendarDays size={19} /> <span>Calendrier</span></button>
          <button key={`appointments-${pendingAppointmentCount}`} type="button" className={tab === "appointments" ? "is-active" : ""} aria-current={tab === "appointments" ? "page" : undefined} onClick={() => navigate("appointments")}><CalendarDays size={19} /> <span>Rendez-vous</span><small className={pendingAppointmentCount > 0 ? "has-alerts" : ""} aria-live="polite" aria-label={`${pendingAppointmentCount} rendez-vous en attente`}>{pendingAppointmentCount}</small></button>
          <button key={`messages-${newMessageCount}`} type="button" className={tab === "contacts" ? "is-active" : ""} aria-current={tab === "contacts" ? "page" : undefined} onClick={() => navigate("contacts")}><Mail size={19} /> <span>Messages</span><small className={newMessageCount > 0 ? "has-alerts" : ""} aria-live="polite" aria-label={`${newMessageCount} nouveaux messages`}>{newMessageCount}</small></button>
          <button type="button" className={tab === "photos" ? "is-active" : ""} aria-current={tab === "photos" ? "page" : undefined} onClick={() => navigate("photos")}><ImagePlus size={19} /> <span>Galerie photos</span></button>
          <button type="button" className={tab === "profile" ? "is-active" : ""} aria-current={tab === "profile" ? "page" : undefined} onClick={() => navigate("profile")}><UserRound size={19} /> <span>Mon profil</span></button>
        </nav>
      </div>
      <div className="admin-sidebar-bottom"><a href="/" target="_blank" rel="noopener noreferrer">Voir le site <ArrowUpRight size={16} /></a><button type="button" onClick={logout}><LogOut size={17} /> Déconnexion</button></div>
    </aside>
    <div className="admin-main">
      <header className="admin-topbar" key={tab}><div>{tab === "overview" ? <LayoutDashboard size={18} /> : tab === "calendar" || tab === "appointments" ? <CalendarDays size={18} /> : tab === "contacts" ? <Mail size={18} /> : tab === "photos" ? <ImagePlus size={18} /> : <UserRound size={18} />}<span>Administration</span><span className="admin-topbar-separator">/</span><strong aria-live="polite">{sectionTitles[tab]}</strong></div><div className="admin-topbar-actions"><button type="button" className="admin-refresh" onClick={() => void load()} disabled={loading}><RefreshCw size={16} className={loading ? "admin-spinning" : ""} /> <span>Actualiser</span></button><AdminNotifications appointments={appointments} messages={contacts} pendingCount={pendingAppointmentCount} messageCount={newMessageCount} onNavigate={navigate} /><button type="button" className="admin-account-trigger" onClick={() => navigate("profile")} aria-label="Ouvrir mon profil">{profile?.fullName.trim().charAt(0).toUpperCase() ?? <UserRound size={17} />}</button></div></header>
      <div className="admin-content">
      {tab === "overview" && <div className="admin-title"><div><span>VUE D’ENSEMBLE</span><h1>Tableau de bord</h1><p>Suivez l’activité de votre cabinet en un coup d’œil.</p></div></div>}
      {error && <AdminAlert variant="error" message={error} onClose={() => setError("")} />}
      {success && !success.startsWith("Photo ") && <AdminAlert variant="success" message={success} onClose={() => setSuccess("")} />}
      {loading && !stats ? <p>Chargement…</p> : <>
        {tab === "overview" && liveStats && <AdminOverview stats={liveStats} onNavigate={navigate} />}
        {tab === "calendar" && <AdminCalendar appointments={appointments} />}
        {tab === "appointments" && <AdminAppointments appointments={appointments} busy={busy} onChange={changeAppointment} />}

        {tab === "contacts" && <AdminMessages messages={contacts} busy={busy} onChange={changeContact} />}

        {tab === "photos" && <AdminGallery photos={photos} busy={busy} onUpload={uploadPhoto} onChange={changePhoto} onDelete={async (photo) => setPhotoToDelete(photo)} success={success.startsWith("Photo ") ? success : ""} onDismissSuccess={() => setSuccess("")} />}
        {tab === "profile" && profile && <AdminProfile key={profile.fullName} profile={profile} busy={busy} onSave={saveProfile} />}
      </>}
      </div>
    </div>
    {photoToDelete && <AdminConfirmDialog title="Supprimer cette photo ?" description={`La photo « ${photoToDelete.alt} » sera supprimée définitivement de la galerie.`} busy={busy} onCancel={() => setPhotoToDelete(null)} onConfirm={() => void confirmDeletePhoto()} />}
  </main>;
}
