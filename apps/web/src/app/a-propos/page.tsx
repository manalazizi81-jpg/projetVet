import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Check, HeartHandshake, MapPin, MessageCircle, Stethoscope } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { clinic } from "@/lib/clinic";
import "./a-propos.css";

export const metadata: Metadata = {
  title: "À propos du cabinet",
  description: "Découvrez l'approche du Cabinet Vétérinaire Atlas à Marrakech : une écoute attentive, des soins adaptés et des explications claires pour chaque animal.",
};

const commitments = [
  { icon: HeartHandshake, title: "Écouter", text: "Vos observations et les habitudes de votre animal nous aident à comprendre ses besoins." },
  { icon: Stethoscope, title: "Examiner", text: "Chaque soin commence par une évaluation attentive de l'état de votre compagnon." },
  { icon: MessageCircle, title: "Expliquer", text: "Nous prenons le temps de répondre à vos questions et de vous présenter les prochaines étapes." },
];

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="about-page">
        <section className="about-hero" aria-labelledby="about-title">
          <div className="site-container">
            <span className="about-eyebrow">À propos du cabinet</span>
            <h1 id="about-title">À leurs côtés,<br /><em>à chaque étape.</em></h1>
            <p className="hero-line-group"><span>Au Cabinet Vétérinaire Atlas à Marrakech, nous accueillons votre</span><span>compagnon avec attention et vous accompagnons avec des soins</span><span>adaptés et des explications claires.</span></p>
            <Link href="/rendez-vous" className="about-button about-button-primary"><CalendarDays size={18} /> Prendre rendez-vous</Link>
          </div>
        </section>

        <section className="about-intro" aria-labelledby="about-approach-title">
          <div className="site-container about-intro-grid">
            <div className="about-intro-image">
              <Image src="/images/chat-notre-approche.png" alt="Chat persan roux assis sur un comptoir" fill sizes="(max-width: 900px) 100vw, 48vw" />
            </div>
            <div className="about-intro-copy">
              <span className="about-kicker">Notre approche</span>
              <h2 id="about-approach-title">Une visite attentive, du premier échange au suivi.</h2>
              <p>Chaque animal a son histoire. Nous commençons par écouter vos observations, puis nous examinons votre compagnon pour proposer les soins qui correspondent à son état.</p>
              <p>Nous vous expliquons ce que nous observons et les prochaines étapes, afin que vous puissiez prendre des décisions éclairées pour sa santé.</p>
              <ul>
                <li><Check size={18} /> Des échanges simples et directs avec l'équipe</li>
                <li><Check size={18} /> Une prise en charge adaptée aux besoins de l'animal</li>
                <li><Check size={18} /> Des réponses à vos questions avant de repartir</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="about-commitments" aria-labelledby="about-commitments-title">
          <div className="site-container">
            <div className="about-section-heading">
              <span className="about-kicker">Ce qui nous guide</span>
              <h2 id="about-commitments-title">Une relation de confiance, à chaque visite.</h2>
            </div>
            <div className="about-commitments-grid">
              {commitments.map(({ icon: Icon, title, text }) => (
                <article key={title} className="about-commitment">
                  <span className="about-commitment-icon"><Icon size={25} /></span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="about-visit">
          <div className="site-container about-visit-panel">
            <div>
              <span className="about-kicker"><MapPin size={15} /> À Marrakech</span>
              <h2>Nous sommes là pour vous et votre compagnon.</h2>
              <p>{clinic.address}</p>
            </div>
            <div className="about-visit-actions">
              <Link href="/rendez-vous" className="about-button about-button-light"><CalendarDays size={18} /> Prendre rendez-vous</Link>
              <Link href="/contact" className="about-button about-button-outline">Nous contacter <ArrowRight size={18} /></Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
