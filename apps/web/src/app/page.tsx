import Image from "next/image";
import { GoogleReviews } from "@/components/home/google-reviews";
import { AnimalGallery } from "@/components/home/animal-gallery";
import Link from "next/link";
import {
  Ambulance, ArrowRight, Bed, Bone, CalendarDays, Check,
  FlaskConical, HeartPulse, MapPin, MessageCircle, MoonStar,
  ScanLine, Scissors, Stethoscope,
} from "lucide-react";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { clinic, clinicWhatsAppUrl } from "@/lib/clinic";
import "./home.css";

const serviceCards = [
  { name: "Consultation", icon: Stethoscope, text: "Un examen et des conseils adaptés à votre animal." },
  { name: "Hospitalisation", icon: Bed, text: "Des soins suivis lorsque son état le nécessite." },
  { name: "Urgences", icon: Ambulance, text: "Appelez le cabinet avant de vous déplacer." },
  { name: "Radiologie", icon: ScanLine, text: "Des examens d'imagerie pour orienter le diagnostic." },
  { name: "Analyses biologiques", icon: FlaskConical, text: "Des analyses pour éclairer les décisions de soin." },
  { name: "Chirurgie", icon: HeartPulse, text: "Une prise en charge selon l'évaluation vétérinaire." },
  { name: "Toilettage", icon: Scissors, text: "Des soins d'hygiène pour votre compagnon." },
  { name: "Garde", icon: MoonStar, text: "Une solution pendant vos absences, selon disponibilité." },
  { name: "Dentisterie", icon: Bone, text: "Des soins pour préserver sa santé bucco-dentaire." },
] as const;

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="home-page">
        <section className="home-hero" aria-labelledby="home-title">
          <div className="site-container home-hero-grid">
            <div className="home-hero-copy">
              <span className="home-kicker"><MapPin size={17} /> Cabinet vétérinaire à Marrakech</span>
              <h1 id="home-title">Pour eux,<br /><em>chaque attention compte.</em></h1>
              <p className="home-hero-description hero-line-group">
                <span>Au <strong>Cabinet Vétérinaire Atlas</strong>, nous accompagnons la santé de votre animal</span>{" "}
                <span>avec écoute, des soins adaptés et un contact simple avec notre équipe.</span>
              </p>
              <div className="home-hero-actions">
                <Link href="/rendez-vous" className="home-button home-button-primary"><CalendarDays size={19} /> Prendre rendez-vous</Link>
                <a href={clinicWhatsAppUrl("Bonjour Cabinet Vétérinaire Atlas, je souhaite un renseignement ou un rendez-vous.")} className="home-button home-button-light" target="_blank" rel="noreferrer"><MessageCircle size={19} /> Écrire sur WhatsApp</a>
              </div>
            </div>
          </div>
          <div className="home-quick" role="group" aria-label="Informations essentielles">
          <div className="site-container home-quick-grid">
            <div><span className="home-quick-icon"><Stethoscope size={23} /></span><strong>9 prestations</strong><span>Du bilan de santé à la garde</span></div>
            <div><span className="home-quick-icon"><MapPin size={23} /></span><strong>À Marrakech</strong><span>Près de SINKO, avenue Mouzdalifa</span></div>
            <div><span className="home-quick-icon"><CalendarDays size={23} /></span><strong>Rendez-vous en ligne</strong><span>Demande simple, confirmation par le cabinet</span></div>
          </div>
          </div>
        </section>

        <section id="services" className="home-section home-services" aria-labelledby="services-title">
          <div className="site-container">
            <div className="home-section-heading">
              <div><span className="home-kicker">Nos prestations</span><h2 id="services-title">Les soins dont votre animal a besoin.</h2></div>
              <Link href="/services" className="home-text-link">Voir les 9 services <ArrowRight size={18} /></Link>
            </div>
            <div className="home-service-grid">
              {serviceCards.slice(0, 6).map(({ name, icon: Icon, text }) => (
                <article key={name} className="home-service-card">
                  <span className="home-service-icon"><Icon size={25} /></span>
                  <h3>{name}</h3><p>{text}</p>
                  <Link href="/services" aria-label={`En savoir plus sur ${name}`} className="home-card-link"><ArrowRight size={19} /></Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="pourquoi-nous" className="home-section home-approach" aria-labelledby="approach-title">
          <div className="site-container home-approach-grid">
            <div className="home-approach-image"><Image src="/images/chat-notre-approche.png" alt="Chat persan roux assis sur un comptoir" fill sizes="(max-width: 900px) 100vw, 45vw" /></div>
            <div className="home-approach-copy">
              <span className="home-kicker">Notre approche</span>
              <h2 id="approach-title">Une visite claire et attentive, pour vous comme pour lui.</h2>
              <p>Chaque animal a son histoire. Nous prenons le temps d'écouter vos observations, d'examiner votre compagnon et de vous expliquer les prochaines étapes.</p>
              <ul>
                <li><Check size={18} /> Un échange sur les besoins de votre animal</li>
                <li><Check size={18} /> Des soins proposés selon son état</li>
                <li><Check size={18} /> Des réponses à vos questions avant de repartir</li>
              </ul>
              <div className="home-approach-actions">
                <Link href="/a-propos" className="home-button home-button-primary">Découvrir le cabinet <ArrowRight size={18} /></Link>
                <Link href="/rendez-vous" className="home-text-link">Demander un rendez-vous</Link>
              </div>
            </div>
          </div>
        </section>

        <AnimalGallery />

        <section id="temoignages" className="home-section home-testimonials" aria-labelledby="testimonials-title">
          <div className="site-container">
            <div className="home-section-heading">
              <div>
                <span className="home-kicker">Témoignages</span>
                <h2 id="testimonials-title">Ils nous confient leurs compagnons.</h2>
                <p className="home-testimonials-intro">Votre expérience compte. Partagez votre avis sur Google après votre visite au cabinet.</p>
              </div>
              <div className="home-testimonials-actions">
                <a href={clinic.googleReviewUrl} className="home-button home-button-primary" target="_blank" rel="noopener noreferrer">
                  <MessageCircle size={19} aria-hidden="true" /> Laisser un avis sur Google <ArrowRight size={18} aria-hidden="true" />
                </a>
                <a href={clinic.googleMapsUrl} className="home-text-link" target="_blank" rel="noopener noreferrer">
                  Lire les avis sur Google Maps <ArrowRight size={18} aria-hidden="true" />
                </a>
              </div>
            </div>
            <GoogleReviews />
          </div>
        </section>

      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
