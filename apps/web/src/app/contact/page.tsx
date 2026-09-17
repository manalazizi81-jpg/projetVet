import { Clock3, MapPin, Phone, MessageCircle } from "lucide-react";
import { ContactForm } from "@/components/forms/contact-form";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { clinic, clinicWhatsAppUrl } from "@/lib/clinic";
import "./contact.css";

export const metadata = {
  title: "Contact & Accès",
  description: "Contactez le Cabinet Vétérinaire Atlas, avenue Mouzdalifa à Marrakech. Téléphone, WhatsApp et plan d'accès.",
};

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="contact-page">
        <section className="contact-hero">
          <div className="site-container">
            <span className="eyebrow">Contact & Localisation</span>
            <h1>Nous sommes à votre écoute à Marrakech</h1>
            <p className="hero-line-group">
              <span>Une question sur la santé de votre animal, un besoin de conseil préventif ou une</span>
              <span>demande de renseignements ? Écrivez-nous ou rendez-nous visite.</span>
            </p>
          </div>
        </section>

        <section className="section contact-section">
          <div className="site-container contact-grid">
            <div className="contact-details-box">
              <h2>Nos coordonnées directes</h2>
              <p>
                Pour toute urgence vitale, privilégiez toujours un appel direct avant de vous déplacer.
              </p>

              <div className="contact-info-list">
                <div className="contact-card-item">
                  <Phone size={22} />
                  <div>
                    <small>Téléphone & Urgences</small>
                    <a href={`tel:${clinic.phoneE164}`}>{clinic.phoneDisplay}</a>
                  </div>
                </div>

                <div className="contact-card-item">
                  <MessageCircle size={22} />
                  <div>
                    <small>Canal WhatsApp</small>
                    <a
                      href={clinicWhatsAppUrl()}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Écrire directement sur WhatsApp
                    </a>
                  </div>
                </div>

                <div className="contact-card-item">
                  <MapPin size={22} />
                  <div>
                    <small>Adresse de la clinique</small>
                    <span>{clinic.address}</span>
                  </div>
                </div>

                <div className="contact-card-item">
                  <Clock3 size={22} />
                  <div>
                    <small>Horaires d&apos;ouverture</small>
                    <span>Horaires à confirmer par téléphone. En cas d&apos;urgence, appelez avant de venir.</span>
                  </div>
                </div>
              </div>
              <div className="map-container-frame">
                <iframe
                  title="Carte du Cabinet Vétérinaire Atlas Marrakech"
                  src="https://www.google.com/maps?q=Sinko%20Avenue%20Mouzdalifa%20Rue%20Bir%20Ami%20Marrakech%2040000&output=embed"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <a href={clinic.googleMapsUrl} target="_blank" rel="noopener noreferrer">Ouvrir l’itinéraire sur Google Maps</a>
              </div>
            </div>

            <div>
              <ContactForm />
            </div>
          </div>

        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
