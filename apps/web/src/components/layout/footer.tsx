import Link from "next/link";
import Image from "next/image";
import { Clock3, MapPin, Phone, MessageCircle } from "lucide-react";
import { clinic, clinicWhatsAppUrl } from "@/lib/clinic";

export function Footer() {
  return (
    <footer
      style={{
        background: "#103f4a",
        color: "#FFFFFF",
        paddingTop: "72px",
        paddingBottom: "36px",
        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
      }}
    >
      <div className="site-container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "48px",
            marginBottom: "56px",
          }}
        >
          {/* Column 1: Brand & Bio */}
          <div>
            <Link
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "12px",
                textDecoration: "none",
                marginBottom: "20px",
              }}
            >
              <Image src="/images/logo-atlas.svg" alt="" width={48} height={43} style={{ borderRadius: "10px" }} />
              <div>
                <div style={{ fontSize: "20px", fontWeight: 800, color: "#FFFFFF", lineHeight: 1.1 }}>
                  Atlas
                </div>
                <div style={{ fontSize: "12.5px", color: "#b8dce1" }}>
                  Cabinet Vétérinaire · Marrakech
                </div>
              </div>
            </Link>

            <p style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "14.5px", lineHeight: 1.7, margin: "0 0 24px" }}>
              Médecine vétérinaire moderne, préventive et bienveillante à Marrakech. Plateau
              médical proposant consultation, radiologie, chirurgie et prise en charge des urgences.
            </p>

            <a
              href={clinicWhatsAppUrl()}
              target="_blank"
              rel="noreferrer"
              className="btn-whatsapp"
              style={{ padding: "10px 18px", fontSize: "13.5px" }}
            >
              <MessageCircle size={16} />
              WhatsApp Direct
            </a>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <div style={{ fontSize: "16px", fontWeight: 700, color: "#FFFFFF", marginBottom: "20px" }}>
              Navigation Rapide
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "12px" }}>
              {[
                { href: "/", label: "Accueil" },
                { href: "/services", label: "Tous nos services & soins" },
                { href: "/a-propos", label: "À propos du cabinet" },
                { href: "/rendez-vous", label: "Prendre rendez-vous en ligne" },
                { href: "/contact", label: "Plan d'accès & contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    style={{
                      color: "rgba(255, 255, 255, 0.8)",
                      fontSize: "14.5px",
                      textDecoration: "none",
                      transition: "color 0.2s ease",
                    }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact & Hours */}
          <div>
            <div style={{ fontSize: "16px", fontWeight: 700, color: "#FFFFFF", marginBottom: "20px" }}>
              Coordonnées & Urgences
            </div>

            <div style={{ display: "grid", gap: "16px" }}>
              <div style={{ display: "flex", gap: "12px", alignItems: "flex-start", color: "rgba(255, 255, 255, 0.85)", fontSize: "14px" }}>
                <MapPin size={18} style={{ color: "#69b4c0", flexShrink: 0, marginTop: "2px" }} />
                <span>{clinic.address}</span>
              </div>

              <div style={{ display: "flex", gap: "12px", alignItems: "flex-start", color: "rgba(255, 255, 255, 0.85)", fontSize: "14px" }}>
                <Clock3 size={18} style={{ color: "#69b4c0", flexShrink: 0, marginTop: "2px" }} />
                <div>
                  <div>Lun - Sam : Sur rendez-vous</div>
                  <div style={{ color: "#acd9df", fontWeight: 600 }}>En cas d’urgence, appelez avant de venir</div>
                </div>
              </div>

              <div style={{ display: "flex", gap: "12px", alignItems: "flex-start", color: "rgba(255, 255, 255, 0.85)", fontSize: "14px" }}>
                <Phone size={18} style={{ color: "#69b4c0", flexShrink: 0, marginTop: "2px" }} />
                <div>
                  <a href={`tel:${clinic.phoneE164}`} style={{ color: "#FFFFFF", fontWeight: 700, textDecoration: "none", fontSize: "15px" }}>
                    {clinic.phoneDisplay}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div
          style={{
            paddingTop: "28px",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
            fontSize: "13.5px",
            color: "rgba(255, 255, 255, 0.6)",
          }}
        >
          <span>© {new Date().getFullYear()} Cabinet Vétérinaire Atlas Marrakech. Tous droits réservés.</span>
          <span>Soigner avec science, écoute et bienveillance.</span>
        </div>
      </div>
    </footer>
  );
}
