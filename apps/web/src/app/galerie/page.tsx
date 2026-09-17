import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { galleryImages } from "@/components/home/gallery-data";
import { GalleryViewer } from "@/components/gallery/gallery-viewer";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import "./galerie.css";

export const metadata = {
  title: "Galerie",
  description: "Une galerie d'images autour des animaux et des soins vétérinaires du Cabinet Vétérinaire Atlas.",
};

export default function GaleriePage() {
  return (
    <>
      <Header />
      <main className="gallery-page">
        <div className="site-container">
          <Link href="/#galerie" className="gallery-back"><ArrowLeft size={17} /> Retour à l'accueil</Link>
          <div className="gallery-heading">
            <span>Galerie</span>
            <h1>L&apos;excellence en images.</h1>
            <p>Découvrez tous les moments présentés dans notre galerie.</p>
          </div>
          <GalleryViewer images={galleryImages} />
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
