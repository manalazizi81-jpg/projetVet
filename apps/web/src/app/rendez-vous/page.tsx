import { CalendarDays, Clock3, MapPin, Phone, ShieldCheck } from "lucide-react";
import { AppointmentForm } from "@/components/forms/appointment-form";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { clinic } from "@/lib/clinic";
import "./rendez-vous.css";

export const metadata = {
  title: "Prendre rendez-vous",
  description: "Demandez un rendez-vous au Cabinet Vétérinaire Atlas à Marrakech.",
};

export default function AppointmentPage() {
  return (
    <>
      <Header />
      <main className="appointment-page">

        {/* ── Hero Banner ── */}
        <section className="rdv-hero">
          <div className="site-container">
            <span className="rdv-hero-eyebrow">
              <CalendarDays size={15} />
              Cabinet Vétérinaire Atlas · Marrakech
            </span>
            <h1>Prendre rendez-vous</h1>
            <p className="hero-line-group"><span>Remplissez le formulaire ci-dessous ou contactez-nous directement.</span><span>Nous vous confirmons votre rendez-vous dans les plus brefs délais.</span></p>
          </div>
        </section>

        {/* ── Form Section ── */}
        <section className="form-page">
          <div className="site-container form-page-grid">

            {/* Left: Info sidebar */}
            <div className="form-intro">

              {/* Contact Info Cards */}
              <div className="rdv-contact-cards">
                <div className="rdv-contact-card rdv-card-teal">
                  <div className="rdv-card-icon"><Phone size={18} /></div>
                  <div className="rdv-card-content">
                    <span className="rdv-card-label">Téléphone</span>
                    <a href={`tel:${clinic.phoneE164}`} className="rdv-card-value">{clinic.phoneDisplay}</a>
                    <span className="rdv-card-sub">Urgences 24h/7j</span>
                  </div>
                </div>

                <div className="rdv-contact-card rdv-card-purple">
                  <div className="rdv-card-icon"><MapPin size={18} /></div>
                  <div className="rdv-card-content">
                    <span className="rdv-card-label">Adresse</span>
                    <span className="rdv-card-value">Marrakech, Maroc</span>
                    <span className="rdv-card-sub">Quartier Guéliz</span>
                  </div>
                </div>

                <div className="rdv-contact-card rdv-card-orange">
                  <div className="rdv-card-icon"><Clock3 size={18} /></div>
                  <div className="rdv-card-content">
                    <span className="rdv-card-label">Horaires</span>
                    <span className="rdv-card-value">9h–13h · 15h–19h</span>
                    <span className="rdv-card-sub">Ouvert tous les jours</span>
                  </div>
                </div>
              </div>

              {/* How to book */}
              <div className="booking-steps" aria-label="Comment réserver">
                <p className="booking-steps-title">Comment ça marche ?</p>
                <div>
                  <span><CalendarDays size={17} /></span>
                  <p><strong>1. Choisissez un créneau</strong>Consultez les disponibilités proposées.</p>
                </div>
                <div>
                  <span><ShieldCheck size={17} /></span>
                  <p><strong>2. Envoyez votre demande</strong>Renseignez les informations utiles pour votre visite.</p>
                </div>
                <div>
                  <span><Clock3 size={17} /></span>
                  <p><strong>3. Attendez la confirmation</strong>Le cabinet vous recontacte pour confirmer.</p>
                </div>
              </div>

              {/* Urgency note */}
              <div className="form-note">
                <Phone size={19} />
                <div>
                  <strong>Une urgence ?</strong>
                  <span>Appelez directement le <a href={`tel:${clinic.phoneE164}`}>{clinic.phoneDisplay}</a> avant de venir.</span>
                </div>
              </div>
            </div>

            {/* Right: Form */}
            <AppointmentForm />
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
