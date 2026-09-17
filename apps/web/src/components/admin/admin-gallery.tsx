"use client";

import Image from "next/image";
import { CalendarDays, Eye, EyeOff, ImagePlus, Search, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AdminAlert } from "./admin-alert";

export type AdminPhoto = { id: string; alt: string; isPublished: boolean; sortOrder: number; createdAt: string };
type Props = {
  photos: AdminPhoto[];
  busy: boolean;
  onUpload: (file: File) => Promise<void>;
  onChange: (photo: AdminPhoto, patch: { alt?: string; isPublished?: boolean; sortOrder?: number }) => Promise<void>;
  onDelete: (photo: AdminPhoto) => Promise<void>;
  success: string;
  onDismissSuccess: () => void;
};

const api = process.env.NEXT_PUBLIC_API_URL ?? "/api";

function PhotoPreview({ photo, className = "" }: { photo: AdminPhoto; className?: string }) {
  const [privateSrc, setPrivateSrc] = useState<string | null>(null);
  useEffect(() => {
    if (photo.isPublished) return;
    const controller = new AbortController();
    let url: string | null = null;
    const token = sessionStorage.getItem("atlas_admin_token");
    if (token) {
      void fetch(`${api}/gallery/admin/${photo.id}/file`, { headers: { Authorization: `Bearer ${token}` }, signal: controller.signal })
        .then((response) => { if (!response.ok) throw new Error("Aperçu indisponible"); return response.blob(); })
        .then((blob) => { if (!controller.signal.aborted) { url = URL.createObjectURL(blob); setPrivateSrc(url); } })
        .catch(() => {});
    }
    return () => { controller.abort(); if (url) URL.revokeObjectURL(url); };
  }, [photo.id, photo.isPublished]);
  const src = photo.isPublished ? `${api}/gallery/${photo.id}/file` : privateSrc;
  return <div className={`admin-gallery-image ${className}`}>
    {src ? <Image src={src} alt={photo.alt} fill sizes="(max-width: 900px) 50vw, 300px" unoptimized /> : <div className="admin-gallery-image-empty"><EyeOff size={23} /><span>Aperçu privé</span></div>}
  </div>;
}

export function AdminGallery({ photos, busy, onUpload, onChange, onDelete, success, onDismissSuccess }: Props) {
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [orderOverrides, setOrderOverrides] = useState<Record<string, number>>({});
  const [publicationOverrides, setPublicationOverrides] = useState<Record<string, boolean>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [photos.length]);
  const displayedPhotos = photos.map((photo) => ({
    ...photo,
    sortOrder: orderOverrides[photo.id] ?? photo.sortOrder,
    isPublished: publicationOverrides[photo.id] ?? photo.isPublished,
  }));
  const query = search.trim().toLocaleLowerCase("fr");
  const publishedCount = displayedPhotos.filter((photo) => photo.isPublished).length;
  const filtered = displayedPhotos
    .filter((photo) => (filter === "ALL" || photo.isPublished === (filter === "PUBLISHED")) && (!query || photo.alt.toLocaleLowerCase("fr").includes(query)))
    .sort((first, second) => first.sortOrder - second.sortOrder || new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime());
  const selected = filtered.find((photo) => photo.id === selectedId) ?? filtered[0];
  const empty = photos.length === 0;

  return <section className="admin-gallery" aria-label="Gestion de la galerie">
    <div className="admin-appointments-heading"><div><span>MÉDIATHÈQUE</span><h1>Photos de la galerie</h1><p>Ajoutez et organisez les images visibles sur le site.</p></div><button type="button" className="admin-gallery-add" disabled={busy} onClick={() => fileInputRef.current?.click()}><ImagePlus size={17} />{busy ? "Ajout en cours…" : "Ajouter une photo"}</button></div>

    <input ref={fileInputRef} className="admin-gallery-native-file" type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => {
      const file = event.target.files?.[0];
      event.target.value = "";
      if (file) void onUpload(file);
    }} />
    {success && <AdminAlert variant="success" message={success} onClose={onDismissSuccess} />}

    {empty ? <div className="admin-gallery-empty">
      <ImagePlus size={32} aria-hidden="true" />
      <h2>Aucune photo pour le moment</h2>
      <p>Ajoutez votre première photo pour la voir ici et sur le site.</p>
    </div> : <>
      <div className="admin-gallery-summary" aria-label="Résumé des photos">
        <div><strong>{photos.length}</strong><span>Photo{photos.length > 1 ? "s" : ""} au total</span></div>
        <div><strong>{publishedCount}</strong><span>Publiée{publishedCount > 1 ? "s" : ""}</span></div>
        <div><strong>{photos.length - publishedCount}</strong><span>Masquée{photos.length - publishedCount > 1 ? "s" : ""}</span></div>
      </div>
      <div className="admin-appointment-tools">
        <div className="admin-appointment-filters" role="group" aria-label="Filtrer les photos">
          {[{ value: "ALL", label: "Toutes", count: photos.length }, { value: "PUBLISHED", label: "Publiées", count: publishedCount }, { value: "HIDDEN", label: "Masquées", count: photos.length - publishedCount }].map((item) => <button type="button" key={item.value} className={filter === item.value ? "is-active" : ""} aria-pressed={filter === item.value} onClick={() => setFilter(item.value)}>{item.label}<small>{item.count}</small></button>)}
        </div>
        <div className="admin-appointment-search"><label><Search size={18} /><span className="sr-only">Rechercher une photo</span><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Rechercher une photo…" /></label></div>
      </div>
      <div className="admin-gallery-workspace">
        <div className="admin-gallery-list">
          <div className="admin-appointment-list-title"><strong>{filtered.length} photo{filtered.length > 1 ? "s" : ""}</strong><span>Choisir une photo</span></div>
          {filtered.length ? <div className="admin-gallery-grid">{filtered.map((photo) => <button type="button" key={photo.id} className={`admin-gallery-tile${selected?.id === photo.id ? " is-selected" : ""}`} aria-pressed={selected?.id === photo.id} onClick={() => setSelectedId(photo.id)}><PhotoPreview photo={photo} /><span className="admin-gallery-tile-caption"><strong>{photo.alt}</strong><small>{photo.isPublished ? "Publiée" : "Masquée"} · Colonne {photo.sortOrder}</small></span></button>)}</div> : <p className="admin-appointment-no-results">Aucune photo ne correspond à ces filtres.</p>}
        </div>
        {selected && <article className="admin-gallery-detail" key={selected.id}>
          <PhotoPreview photo={selected} className="admin-gallery-detail-image" />
          <div className="admin-gallery-detail-body">
            <div className="admin-appointment-detail-head"><div><span>DÉTAIL DE LA PHOTO</span><h3>Modifier la photo</h3></div><span className={`admin-status-badge ${selected.isPublished ? "admin-message-status-read" : "admin-message-status-archived"}`}>{selected.isPublished ? "Publiée" : "Masquée"}</span></div>
            <p className="admin-gallery-date"><CalendarDays size={15} />Ajoutée le {new Date(selected.createdAt).toLocaleDateString("fr-MA", { dateStyle: "long" })}</p>
            <form className="admin-gallery-edit" key={`${selected.id}-${selected.sortOrder}`} onSubmit={(event) => { event.preventDefault(); const data = new FormData(event.currentTarget); const sortOrder = Number(data.get("sortOrder")); setOrderOverrides((current) => ({ ...current, [selected.id]: sortOrder })); void onChange(selected, { sortOrder }); }}>
              <label>Numéro de colonne<input name="sortOrder" type="number" min={0} max={10000} defaultValue={selected.sortOrder} required /></label>
              <button type="submit" disabled={busy}>Enregistrer les modifications</button>
            </form>
            <div className="admin-gallery-actions"><button type="button" disabled={busy} onClick={() => { const isPublished = !selected.isPublished; setPublicationOverrides((current) => ({ ...current, [selected.id]: isPublished })); void onChange(selected, { isPublished }); }}>{selected.isPublished ? <EyeOff size={17} /> : <Eye size={17} />}{selected.isPublished ? "Masquer" : "Publier"}</button><button type="button" className="admin-delete" disabled={busy} onClick={() => void onDelete(selected)}><Trash2 size={16} />Supprimer</button></div>
          </div>
        </article>}
      </div>
    </>}
  </section>;
}
