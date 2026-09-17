"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarCheck, MessageCircle, Send } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { BookingSelect } from "./booking-select";
import { FormAlert } from "./form-alert";

const schema = z.object({
  ownerName: z.string().min(2, "Indiquez votre nom."),
  ownerPhone: z.string().min(9, "Numéro de téléphone invalide."),
  ownerEmail: z.string().email("Adresse email invalide."),
  animalName: z.string().min(1, "Indiquez le nom de l’animal."),
  species: z.string().min(1, "Choisissez une espèce."),
  breed: z.string().optional(), age: z.string().optional(),
  serviceSlug: z.string().min(1, "Choisissez un service."),
  date: z.string().min(1, "Choisissez une date."),
  slotId: z.string().min(1, "Choisissez une heure."),
  message: z.string().max(1500).optional(), website: z.string().max(0),
});
type Values = z.infer<typeof schema>;
type Slot = { id: string; startsAt: string; endsAt: string; isAvailable: boolean; status: "AVAILABLE" | "PENDING" | "RESERVED" };
const speciesOptions = [{ value: "DOG", label: "Chien" }, { value: "CAT", label: "Chat" }, { value: "BIRD", label: "Oiseau" }, { value: "RABBIT", label: "Lapin" }, { value: "RODENT", label: "Rongeur" }, { value: "REPTILE", label: "Reptile" }, { value: "OTHER", label: "Autre" }];
const services = ["Consultation", "Hospitalisation", "Urgences", "Radiologie", "Analyses biologiques", "Chirurgie", "Toilettage", "Garde", "Dentisterie"];
const serviceOptions = services.map((label) => ({ value: label.toLowerCase().replaceAll(" ", "-"), label }));
const api = process.env.NEXT_PUBLIC_API_URL ?? "/api";

export function AppointmentForm() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [result, setResult] = useState<"idle" | "success" | "error" | "conflict">("idle");
  const requestVersion = useRef(0);
  const { register, control, handleSubmit, watch, setValue, getValues, formState: { errors, isSubmitting } } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { website: "", species: "", serviceSlug: "", slotId: "" } });
  const date = watch("date");
  const values = watch();

  const refreshSlots = useCallback(async (showLoading = true) => {
    if (!date) return;
    const version = ++requestVersion.current;
    if (showLoading) setLoadingSlots(true);
    try {
      const response = await fetch(`${api}/available-slots?date=${encodeURIComponent(date)}`, { cache: "no-store" });
      if (!response.ok) throw new Error("Créneaux indisponibles");
      const nextSlots: Slot[] = await response.json();
      if (version !== requestVersion.current) return;
      setSlots(nextSlots);
      const selected = getValues("slotId");
      if (selected && !nextSlots.some((slot) => slot.id === selected && slot.isAvailable)) setValue("slotId", "");
    } catch { if (version === requestVersion.current) { setSlots([]); setValue("slotId", ""); } }
    finally { if (version === requestVersion.current) setLoadingSlots(false); }
  }, [date, getValues, setValue]);

  useEffect(() => {
    if (!date) { requestVersion.current++; setSlots([]); setLoadingSlots(false); return; }
    setSlots([]);
    setValue("slotId", "");
    void refreshSlots();
    const timer = window.setInterval(() => { if (document.visibilityState === "visible") void refreshSlots(false); }, 30000);
    const onFocus = () => { void refreshSlots(false); };
    window.addEventListener("focus", onFocus);
    return () => { window.clearInterval(timer); window.removeEventListener("focus", onFocus); };
  }, [date, refreshSlots, setValue]);

  const whatsapp = useMemo(() => {
    const text = `Bonjour Cabinet Vétérinaire Atlas, je souhaite un rendez-vous.\nPropriétaire : ${values.ownerName || ""}\nAnimal : ${values.animalName || ""} (${values.species || ""})\nService : ${values.serviceSlug || ""}\nDate souhaitée : ${values.date || ""}\nMessage : ${values.message || ""}`;
    return `https://wa.me/212662120878?text=${encodeURIComponent(text)}`;
  }, [values]);

  async function submit(data: Values) {
    setResult("idle");
    try {
      const response = await fetch(`${api}/appointments`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...data, requestKey: crypto.randomUUID() }) });
      if (response.status === 409) { setResult("conflict"); setValue("slotId", ""); await refreshSlots(); return; }
      if (!response.ok) throw new Error();
      setResult("success");
      await refreshSlots(false);
    } catch { setResult("error"); }
  }

  const field = (name: keyof Values) => errors[name] ? <span className="field-error">{errors[name]?.message}</span> : null;
  const availableCount = slots.filter((slot) => slot.isAvailable).length;
  const slotOptions = slots.map((slot) => ({
    value: slot.id,
    label: `${new Date(slot.startsAt).toLocaleTimeString("fr-MA", { hour: "2-digit", minute: "2-digit" })}${slot.isAvailable ? "" : slot.status === "PENDING" ? " · En attente" : " · Réservé"}`,
    disabled: !slot.isAvailable,
  }));

  return <form className="booking-form" onSubmit={handleSubmit(submit)} noValidate>
    <div className="form-title"><CalendarCheck /><div><h2>Votre demande</h2><p>Les champs marqués * sont obligatoires.</p></div></div>
    <input className="honeypot" tabIndex={-1} autoComplete="off" {...register("website")} />
    <fieldset><legend>Vos coordonnées</legend><div className="fields two"><label>Nom complet *<input {...register("ownerName")} />{field("ownerName")}</label><label>Téléphone *<input type="tel" {...register("ownerPhone")} />{field("ownerPhone")}</label></div><label>Email *<input type="email" {...register("ownerEmail")} />{field("ownerEmail")}</label></fieldset>
    <fieldset><legend>Votre animal</legend><div className="fields two"><label>Nom de l’animal *<input {...register("animalName")} />{field("animalName")}</label><div className="booking-select-wrap"><Controller name="species" control={control} render={({ field: speciesField }) => <BookingSelect label="Espèce *" value={speciesField.value ?? ""} options={speciesOptions} onChange={speciesField.onChange} />} />{field("species")}</div><label>Race<input {...register("breed")} /></label><label>Âge<input {...register("age")} placeholder="Ex. 3 ans" /></label></div></fieldset>
    <fieldset><legend>Le rendez-vous</legend><div className="booking-select-wrap"><Controller name="serviceSlug" control={control} render={({ field: serviceField }) => <BookingSelect label="Service *" value={serviceField.value ?? ""} options={serviceOptions} onChange={serviceField.onChange} />} />{field("serviceSlug")}</div><div className="fields two"><label>Date souhaitée *<input type="date" min={new Date().toISOString().slice(0, 10)} {...register("date")} />{field("date")}</label><div className="booking-select-wrap"><Controller name="slotId" control={control} render={({ field: slotField }) => <BookingSelect label="Heure *" value={slotField.value ?? ""} options={slotOptions} onChange={slotField.onChange} disabled={!date || loadingSlots || slots.length === 0} placeholder={loadingSlots ? "Chargement…" : availableCount ? "Choisir" : "Aucun créneau libre"} />} />{field("slotId")}</div></div><label>Message ou symptômes<textarea rows={4} {...register("message")} /></label></fieldset>
    {result === "success" && <FormAlert variant="success">Demande envoyée. Nous vous contacterons pour la confirmer.</FormAlert>}
    {result === "conflict" && <FormAlert variant="error">Cette heure vient d’être réservée. Choisissez un autre créneau disponible.</FormAlert>}
    {result === "error" && <FormAlert variant="error">Envoi impossible. Vous pouvez nous contacter directement par WhatsApp.</FormAlert>}
    <div className="form-actions"><button className="button button-primary" disabled={isSubmitting}><Send size={17} />{isSubmitting ? "Envoi…" : "Envoyer la demande"}</button><a className="button whatsapp-outline" href={whatsapp} target="_blank" rel="noreferrer"><MessageCircle size={18} /> Réserver via WhatsApp</a></div>
  </form>;
}
