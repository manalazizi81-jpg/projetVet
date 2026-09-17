"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Menu, PhoneCall, X } from "lucide-react";
import { useEffect, useState } from "react";
import "./header.css";
import { clinic } from "@/lib/clinic";

type Language = "fr" | "en";
const words = {
  fr: { subtitle: "CABINET VÉTÉRINAIRE", nav: "Navigation principale", links: ["Accueil", "À propos", "Services", "Galerie", "Contact"], book: "Prendre RDV", open: "Ouvrir le menu", close: "Fermer le menu", language: "Choisir la langue" },
  en: { subtitle: "VETERINARY CLINIC", nav: "Main navigation", links: ["Home", "About", "Services", "Gallery", "Contact"], book: "Book appointment", open: "Open menu", close: "Close menu", language: "Choose language" },
} as const;
const destinations = ["/", "/a-propos", "/services", "/galerie", "/contact"];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [language, setLanguage] = useState<Language>("fr");
  const [scrolled, setScrolled] = useState(false);
  const [showEmergency, setShowEmergency] = useState(true);
  useEffect(() => {
    const saved = window.localStorage.getItem("atlas-language");
    if (saved === "fr" || saved === "en") setLanguage(saved);
    let frame = 0;
    let lastScrolled = window.scrollY > 40;
    setScrolled(lastScrolled);
    const updateScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const nextScrolled = window.scrollY > 40;
        if (nextScrolled !== lastScrolled) {
          lastScrolled = nextScrolled;
          setScrolled(nextScrolled);
        }
      });
    };
    updateScroll();
    window.addEventListener("scroll", updateScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", updateScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);
  const selectLanguage = (next: Language) => {
    setLanguage(next);
    window.localStorage.setItem("atlas-language", next);
    window.dispatchEvent(new CustomEvent("atlas-language-change", { detail: next }));
  };
  const t = words[language];
  const languagePicker = () => <div className="site-header__languages" role="group" aria-label={t.language}>
    {(["fr", "en"] as const).map(lang => <button type="button" key={lang} className={language === lang ? "is-active" : ""} aria-pressed={language === lang} onClick={() => selectLanguage(lang)}>{lang.toUpperCase()}</button>)}
  </div>;
  const navLinks = (mobile = false) => destinations.map((href, index) =>
    <Link key={href} href={href} onClick={mobile ? () => setOpen(false) : undefined} aria-current={pathname === href ? "page" : undefined}>{t.links[index]}</Link>);
  const photoHeader = pathname === "/" || pathname === "/contact" || pathname === "/services" || pathname === "/a-propos" || pathname === "/rendez-vous" || pathname === "/galerie";
  return <>
    {showEmergency && <div className="emergency-banner">
      <a href={`tel:${clinic.phoneE164}`}><PhoneCall size={14} aria-hidden="true" /><span>{language === "fr" ? "NUMÉRO D’URGENCE" : "EMERGENCY NUMBER"} : {clinic.phoneDisplay}</span></a>
      <button type="button" onClick={() => setShowEmergency(false)} aria-label={language === "fr" ? "Fermer la barre d’urgence" : "Close emergency banner"}><X size={15} /></button>
    </div>}
    <header className={`site-header${photoHeader ? " site-header--home" : ""}${scrolled ? " site-header--scrolled" : ""}${showEmergency ? " site-header--with-alert" : ""}`}>
    <div className="site-header__bar">
      <Link href="/" className="site-header__brand" aria-label="Cabinet Vétérinaire Atlas Marrakech">
        <span className="site-header__logo"><Image src="/images/logo-atlas-circle.svg" alt="" width={46} height={46} /></span>
        <span className="site-header__brand-copy"><strong>Atlas</strong><small>{t.subtitle}</small></span>
      </Link>
      <nav className="site-header__nav" aria-label={t.nav}>{navLinks()}</nav>
      <div className="site-header__actions">{languagePicker()}<Link href="/rendez-vous" className="site-header__appointment"><CalendarDays size={16} />{t.book}</Link></div>
      <button type="button" className="site-header__toggle" aria-label={open ? t.close : t.open} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X size={23} /> : <Menu size={23} />}</button>
    </div>
    {open && <nav className="site-header__mobile" aria-label={t.nav}>
      {navLinks(true)}
      {languagePicker()}
      <Link href="/rendez-vous" className="site-header__appointment" onClick={() => setOpen(false)}><CalendarDays size={16} />{t.book}</Link>
    </nav>}
  </header>{!photoHeader && <div className={`site-header__spacer${showEmergency ? " site-header__spacer--with-alert" : ""}`} aria-hidden="true" />}</>;
}
