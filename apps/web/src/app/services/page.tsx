import Link from "next/link";
import {
  Ambulance,
  ArrowRight,
  Bed,
  Bone,
  Check,
  HeartPulse,
  FlaskConical,
  MoonStar,
  Phone,
  ScanLine,
  Scissors,
  ShieldCheck,
  Stethoscope,
  Sparkles,
  ArrowDown,
} from "lucide-react";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { clinic } from "@/lib/clinic";
import "./services.css";

export const metadata = {
  title: "Nos prestations et soins vétérinaires",
  description: "Consultations, hospitalisation, urgences, radiologie, analyses, chirurgie, toilettage médical et dentisterie vétérinaire à Marrakech.",
};

const services = [
  {
    icon: Stethoscope,
    title: "Consultation",
    intro: "Un examen clinique minutieux pour dépister, soigner et conseiller à chaque étape de vie.",
    details: ["Bilan de santé approfondi", "Vaccinations & antiparasitaires", "Conseils nutritionnels personnalisés"],
  },
  {
    icon: Ambulance,
    title: "Urgences",
    intro: "Si votre animal présente des symptômes inquiétants, appelez le cabinet avant de vous déplacer.",
    details: ["Premier contact par téléphone", "Évaluation de la situation", "Orientation selon les besoins"],
  },
  {
    icon: HeartPulse,
    title: "Chirurgie",
    intro: "Interventions programmées ou d'urgence selon l'évaluation du vétérinaire.",
    details: ["Stérilisations & castrations", "Chirurgies abdominales", "Surveillance du réveil en douceur"],
  },
  {
    icon: ScanLine,
    title: "Radiologie",
    intro: "Des examens d'imagerie pour aider à comprendre l'état de santé de votre animal.",
    details: ["Examens radiologiques", "Exploration selon les besoins de l'animal", "Interprétation vétérinaire"],
  },
  {
    icon: FlaskConical,
    title: "Analyses biologiques",
    intro: "Examens biochimiques et hématologiques pour adapter le traitement sans délai.",
    details: ["Bilan sanguin", "Analyses biologiques adaptées", "Interprétation des résultats"],
  },
  {
    icon: Bed,
    title: "Hospitalisation",
    intro: "Une prise en charge au cabinet lorsque l'état de votre compagnon nécessite des soins suivis.",
    details: ["Suivi de l'état de santé", "Soins prescrits par le vétérinaire", "Informations aux propriétaires"],
  },
  {
    icon: Bone,
    title: "Dentisterie",
    intro: "Prévention des affections bucco-dentaires et soulagement des douleurs gingivales.",
    details: ["Détartrage aux ultrasons", "Polissage protecteur", "Extractions dentaires ciblées"],
  },
  {
    icon: Scissors,
    title: "Toilettage",
    intro: "Des soins d'hygiène et d'entretien adaptés à votre compagnon.",
    details: ["Entretien du pelage", "Soins d'hygiène", "Conseils adaptés à l'animal"],
  },
  {
    icon: MoonStar,
    title: "Garde",
    intro: "Une solution de garde pour votre animal lorsque vous devez vous absenter.",
    details: ["Renseignements sur les disponibilités", "Prise en compte des besoins de l'animal", "Organisation avec le cabinet"],
  },
];

const careSteps = [
  {
    number: "01",
    title: "Accueil & Écoute attentive",
    text: "Vous nous partagez l'historique de votre animal, ses habitudes et les symptômes observés.",
  },
  {
    number: "02",
    title: "Examen clinique complet",
    text: "Le praticien examine minutieusement votre compagnon avec douceur et méthode.",
  },
  {
    number: "03",
    title: "Diagnostic & Décision partagée",
    text: "Nous vous expliquons les résultats et convenons ensemble du protocole de soin le plus adapté.",
  },
];

const serviceGroups = [
  { id: "diagnostic", number: "01", title: "Comprendre & prévenir", text: "Du premier examen aux analyses, pour orienter les soins de votre animal.", names: ["Consultation", "Radiologie", "Analyses biologiques"] },
  { id: "soins", number: "02", title: "Soigner & accompagner", text: "Une prise en charge adaptée lorsque votre compagnon a besoin de soins.", names: ["Urgences", "Chirurgie", "Hospitalisation"] },
  { id: "bien-etre", number: "03", title: "Prendre soin au quotidien", text: "Hygiène, confort et garde : des attentions pour chaque étape de sa vie.", names: ["Dentisterie", "Toilettage", "Garde"] },
];

const heroLinks = [
  { title: "Médecine", subtitle: "Consultation & suivi", icon: Stethoscope, href: "#diagnostic" },
  { title: "Diagnostic", subtitle: "Imagerie & analyses", icon: FlaskConical, href: "#diagnostic" },
  { title: "Chirurgie", subtitle: "Interventions & soins", icon: HeartPulse, href: "#soins" },
  { title: "Bien-être", subtitle: "Hygiène & confort", icon: Sparkles, href: "#bien-etre" },
];

export default function ServicesPage() {
  return (
    <>
      <Header />
      <main className="services-page">
        <section className="services-hero-header" aria-labelledby="services-title">
          <div className="site-container services-hero-content">
            <span className="eyebrow">
              <Sparkles size={16} /> Cabinet Vétérinaire Atlas Marrakech
            </span>
            <h1 id="services-title">Des soins complets.<br /><span>À chaque étape.</span></h1>
            <p className="services-hero-description hero-line-group">
              <span>Prévenir, comprendre, soigner. Une attention adaptée à votre compagnon,</span>
              <span>des premières consultations aux soins du quotidien.</span>
            </p>
            <a href="#prestations" className="services-discover">Découvrir nos prestations <ArrowDown size={18} aria-hidden="true" /></a>
            <nav className="services-hero-nav" aria-label="Accès aux catégories de soins">
              {heroLinks.map(({ title, subtitle, icon: Icon, href }) => (
                <a href={href} key={title}>
                  <Icon size={23} aria-hidden="true" />
                  <span><strong>{title}</strong><small>{subtitle}</small></span>
                  <ArrowDown className="services-nav-arrow" size={16} aria-hidden="true" />
                </a>
              ))}
            </nav>
          </div>
        </section>

        <section id="prestations" className="section services-catalog" aria-labelledby="catalog-title">
          <div className="site-container">
            <div className="section-header">
              <span className="eyebrow">Nos pôles de compétences</span>
              <h2 id="catalog-title">Le bon soin, au bon moment.</h2>
              <p>
                Découvrez l&apos;ensemble des prestations dispensées au Cabinet Vétérinaire Atlas.
              </p>
            </div>

            {serviceGroups.map((group) => (
              <section id={group.id} className="services-group" key={group.id} aria-labelledby={`${group.id}-title`}>
                <div className="services-group-heading">
                  <span className="services-group-number">{group.number}</span>
                  <div><h3 id={`${group.id}-title`}>{group.title}</h3><p>{group.text}</p></div>
                  <span className="services-group-count">3 prestations</span>
                </div>
                <div className="services-cards-grid">
              {services.filter(service => group.names.includes(service.title)).map((service) => {
                const Icon = service.icon;
                return (
                  <article key={service.title} className="service-full-card">
                    <div className="bento-icon-wrapper">
                      <Icon size={26} />
                    </div>
                    <h4>{service.title}</h4>
                    <p>{service.intro}</p>

                    <ul className="service-feature-bullets">
                      {service.details.map((detail) => (
                        <li key={detail}>
                          <Check size={16} />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>

                    {service.title === "Urgences" ? (
                      <a href={`tel:${clinic.phoneE164}`} className="button button-secondary service-booking"><Phone size={17} /> Appeler le cabinet</a>
                    ) : <Link
                      href="/rendez-vous"
                      className="button button-secondary service-booking"
                    >
                      <span>Prendre rendez-vous</span>
                      <ArrowRight size={17} />
                    </Link>}
                  </article>
                );
              })}
                </div>
              </section>
            ))}
          </div>
        </section>

        {/* PARCOURS DE SOIN */}
        <section className="section why-us-section">
          <div className="site-container why-us-grid">
            <div className="why-us-sticky">
              <span className="eyebrow">
                <ShieldCheck size={16} /> Déroulement d&apos;une visite
              </span>
              <h2>Comment se passe votre venue au cabinet ?</h2>
              <p>
                Nous prenons le temps nécessaire avec chaque animal afin de minimiser le stress et
                bâtir une relation de confiance durable.
              </p>
              <div className="cta-bullet" style={{ marginTop: "24px" }}>
                <ShieldCheck size={20} className="text-emerald-700" />
                <span style={{ fontWeight: 600, color: "var(--forest-dark)" }}>
                  Une décision de soin expliquée avec clarté
                </span>
              </div>
            </div>

            <div className="why-sequence-list">
              {careSteps.map((step) => (
                <div key={step.number} className="why-sequence-item">
                  <div className="step-numeral">{step.number}</div>
                  <div className="step-content">
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
