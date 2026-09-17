import { MessageCircle } from "lucide-react";
import { clinicWhatsAppUrl } from "@/lib/clinic";

export function WhatsAppButton() {
  return (
    <a
      className="whatsapp-float-fixed"
      href={clinicWhatsAppUrl("Bonjour Cabinet Vétérinaire Atlas, je souhaite prendre rendez-vous.")}
      target="_blank"
      rel="noreferrer"
      aria-label="Contacter le Cabinet Vétérinaire Atlas sur WhatsApp"
    >
      <MessageCircle size={22} fill="currentColor" />
      <span>Besoin d&apos;aide ? WhatsApp</span>
    </a>
  );
}
