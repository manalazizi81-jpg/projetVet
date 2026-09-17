"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";

type GalleryImage = { src: string; alt: string; sortOrder?: number };
const api = process.env.NEXT_PUBLIC_API_URL ?? "/api";

export function GalleryViewer({ images }: { images: GalleryImage[] }) {
  const [uploaded, setUploaded] = useState<GalleryImage[]>([]);
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
  const allImages = [...uploaded, ...images];
  const imageGroups = Array.from(allImages.reduce((groups, image, index) => {
    const order = image.sortOrder ?? index;
    const group = groups.get(order) ?? [];
    group.push({ image, index });
    groups.set(order, group);
    return groups;
  }, new Map<number, { image: GalleryImage; index: number }[]>()).values());
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const activeIndexRef = useRef<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const tileRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const isOpen = activeIndex !== null;
  useEffect(() => { activeIndexRef.current = activeIndex; }, [activeIndex]);

  const close = () => {
    const lastIndex = activeIndex;
    setActiveIndex(null);
    if (lastIndex !== null) requestAnimationFrame(() => tileRefs.current[lastIndex]?.focus());
  };

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        const lastIndex = activeIndexRef.current;
        setActiveIndex(null);
        if (lastIndex !== null) requestAnimationFrame(() => tileRefs.current[lastIndex]?.focus());
      } else if (event.key === "ArrowRight") {
        setActiveIndex((index) => index === null ? null : (index + 1) % allImages.length);
      } else if (event.key === "ArrowLeft") {
        setActiveIndex((index) => index === null ? null : (index - 1 + allImages.length) % allImages.length);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, allImages.length]);

  return (
    <>
      <div className="gallery-images" style={{ "--gallery-columns": Math.max(imageGroups.length, 1) } as CSSProperties}>
        {imageGroups.map((group) => <div className="gallery-image-row" key={group[0].image.sortOrder ?? group[0].index}>
        {group.map(({ image, index }) => (
          <button
            ref={(element) => { tileRefs.current[index] = element; }}
            key={image.src}
            type="button"
            className="gallery-image-tile"
            aria-label={`Voir l'image ${index + 1} : ${image.alt}`}
            onClick={() => setActiveIndex(index)}
          >
            <Image src={image.src} alt="" fill unoptimized={image.src.startsWith("http")} sizes="(max-width: 620px) 45vw, (max-width: 900px) 30vw, 23vw" />
          </button>
        ))}
        </div>)}
      </div>

      {activeIndex !== null && (
        <div className="gallery-lightbox" role="dialog" aria-modal="true" aria-label={`Photo ${activeIndex + 1} sur ${allImages.length}`} onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}>
          <button ref={closeRef} type="button" className="gallery-lightbox-close" aria-label="Fermer la photo" onClick={close}><X size={22} /></button>
          <button type="button" className="gallery-lightbox-arrow gallery-lightbox-prev" aria-label="Photo précédente" onClick={() => setActiveIndex((activeIndex - 1 + allImages.length) % allImages.length)}><ChevronLeft size={23} /></button>
          <div className="gallery-lightbox-image">
            <Image src={allImages[activeIndex].src} alt={allImages[activeIndex].alt} fill unoptimized={allImages[activeIndex].src.startsWith("http")} sizes="90vw" priority />
          </div>
          <button type="button" className="gallery-lightbox-arrow gallery-lightbox-next" aria-label="Photo suivante" onClick={() => setActiveIndex((activeIndex + 1) % allImages.length)}><ChevronRight size={23} /></button>
          <span className="gallery-lightbox-counter" data-no-translate>{String(activeIndex + 1).padStart(2, "0")} / {String(allImages.length).padStart(2, "0")}</span>
        </div>
      )}
    </>
  );
}
