"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { CSSProperties } from "react";
import { useEffect, useState } from "react";

const api = process.env.NEXT_PUBLIC_API_URL ?? "/api";
type GalleryItem = { src: string; alt: string; sortOrder: number };

export function AnimalGallery() {
  const [uploaded, setUploaded] = useState<GalleryItem[]>([]);
  useEffect(() => {
    let active = true;
    fetch(`${api}/gallery`, { cache: "no-store" })
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((photos: { id: string; alt: string; sortOrder: number }[]) => {
        if (active) setUploaded(photos.map((photo) => ({ src: `${api}/gallery/${photo.id}/file`, alt: photo.alt, sortOrder: photo.sortOrder })));
      })
      .catch(() => {});
    return () => { active = false; };
  }, []);
  const columnCount = uploaded.length ? Math.max(...uploaded.map((photo) => photo.sortOrder), 0) + 1 : 0;
  const displayColumns = Array.from({ length: columnCount }, (_, index) => uploaded.filter((photo) => photo.sortOrder === index));
  return (
    <section id="galerie" className="home-gallery" aria-labelledby="gallery-title">
      <div className="site-container">
        <div className="home-gallery-heading">
          <span className="home-kicker">Galerie</span>
          <h2 id="gallery-title">L&apos;excellence en images.</h2>
          <p>Des instants de douceur et de complicité avec les animaux qui nous inspirent chaque jour.</p>
        </div>
        {uploaded.length > 0 && <div className="home-gallery-grid" style={{ "--gallery-columns": columnCount } as CSSProperties}>
          {displayColumns.map((images, columnIndex) => (
            <div className="home-gallery-column" key={columnIndex}>
              <div className="home-gallery-track">
                {[0, 1].map((copy) => (
                  <div className="home-gallery-sequence" key={copy} aria-hidden={copy === 1}>
                    {images.map((image) => (
                      <div className="home-gallery-card" key={image.src}>
                        <Image
                          src={image.src}
                          alt={copy === 0 ? image.alt : ""}
                          fill
                          unoptimized={image.src.startsWith("http")}
                          sizes="(max-width: 620px) 45vw, (max-width: 900px) 30vw, 23vw"
                        />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>}
        <Link href="/galerie" className="home-gallery-link">
          Explorer la Galerie <ArrowRight size={17} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
