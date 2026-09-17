"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FormAlert } from "./form-alert";

const schema = z.object({
  fullName: z.string().min(2, "Indiquez votre nom."),
  email: z.string().email("Email invalide."),
  phone: z.string().optional(),
  subject: z.string().min(3, "Indiquez un sujet."),
  message: z.string().min(10, "Votre message doit contenir au moins 10 caractères.").max(2000),
});
type Values = z.infer<typeof schema>;

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<Values>({ resolver: zodResolver(schema) });

  async function submit(data: Values) {
    setStatus("idle");
    setErrorMessage("");
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? "/api"}/contact`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        const message = Array.isArray(body.message) ? body.message[0] : body.message;
        throw new Error(typeof message === "string" ? message : "Le serveur n’a pas pu enregistrer le message.");
      }
      setStatus("success");
      reset();
    } catch (cause) {
      setErrorMessage(cause instanceof Error ? cause.message : "Le serveur est momentanément indisponible.");
      setStatus("error");
    }
  }

  return <form className="booking-form contact-form" onSubmit={handleSubmit(submit)} noValidate>
    <h2>Envoyer un message</h2>
    <div className="fields two">
      <label>Nom complet *<input {...register("fullName")} /><span className="field-error">{errors.fullName?.message}</span></label>
      <label>Email *<input type="email" {...register("email")} /><span className="field-error">{errors.email?.message}</span></label>
    </div>
    <label>Téléphone<input type="tel" {...register("phone")} /></label>
    <label>Sujet *<input {...register("subject")} /><span className="field-error">{errors.subject?.message}</span></label>
    <label>Votre message *<textarea rows={6} {...register("message")} /><span className="field-error">{errors.message?.message}</span></label>
    {status === "success" && <FormAlert variant="success">Votre message a bien été envoyé.</FormAlert>}
    {status === "error" && <FormAlert variant="error">{errorMessage} Vous pouvez aussi nous appeler au 06 62 12 08 78.</FormAlert>}
    <button type="submit" className="button button-primary" disabled={isSubmitting}><Send size={17} />{isSubmitting ? "Envoi…" : "Envoyer le message"}</button>
  </form>;
}
