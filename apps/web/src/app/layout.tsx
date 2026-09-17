import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { SiteLanguage } from "@/components/layout/site-language";
import { ScrollReveal } from "@/components/layout/scroll-reveal";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Cabinet Vétérinaire Atlas Marrakech", template: "%s | Cabinet Vétérinaire Atlas" },
  description: "Cabinet Vétérinaire Atlas à Marrakech : consultations, urgences, chirurgie, radiologie, analyses, hospitalisation et soins attentifs pour vos animaux."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${fraunces.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add("atlas-reveal-pending");try{if(localStorage.getItem("atlas-language")==="en"){document.documentElement.lang="en";document.documentElement.dataset.languagePending="en"}}catch(e){}`,
          }}
        />
      </head>
      <body>
        {children}
        <SiteLanguage />
        <ScrollReveal />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "VeterinaryCare",
              name: "Cabinet Vétérinaire Atlas Marrakech",
              telephone: "+212662120878",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Près de SINKO, avenue Mouzdalifa, rue Bir Ami",
                addressLocality: "Marrakech",
                postalCode: "40000",
                addressCountry: "MA"
              },
              url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
            }).replace(/</g, "\\u003c")
          }}
        />
      </body>
    </html>
  );
}
