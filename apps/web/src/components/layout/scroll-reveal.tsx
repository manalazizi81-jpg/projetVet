"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect } from "react";

const pageSelector = ".home-page, .about-page, .services-page, .contact-page, .appointment-page, .gallery-page";
const itemSelector = [
  "h1", "h2", "h3", "h4",
  "p:not(.home-hero-description)",
  ".home-hero-description > span",
  "li",
  ".home-kicker", ".about-kicker", ".about-eyebrow", ".eyebrow", ".rdv-hero-eyebrow",
  ".home-button", ".about-button", ".button", ".home-text-link", ".home-gallery-link", ".services-discover",
  ".home-quick-grid > div",
  ".home-approach-image", ".about-intro-image",
  ".gallery-image-tile",
].join(", ");

export function ScrollReveal() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    const page = document.querySelector<HTMLElement>(pageSelector);
    if (!page || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.documentElement.classList.remove("atlas-reveal-pending");
      return;
    }

    const groups = Array.from(page.querySelectorAll<HTMLElement>("section, .gallery-page > .site-container"));
    if (!groups.length) groups.push(page);

    const elements: HTMLElement[] = [];
    for (const group of groups) {
      const groupItems = Array.from(group.querySelectorAll<HTMLElement>(itemSelector))
        .filter((item) => !item.closest("[data-no-reveal], .gallery-lightbox, .gallery-heading, .home-hero, .about-hero, .services-hero-header, .contact-hero, .rdv-hero"));
      groupItems.forEach((item, index) => {
        item.style.setProperty("--reveal-delay", `${Math.min(index * 65, 520)}ms`);
        item.classList.add("scroll-reveal");
        elements.push(item);
      });
    }
    document.documentElement.classList.remove("atlas-reveal-pending");

    if (!("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const element = entry.target as HTMLElement;
        element.classList.add("is-visible");
        observer.unobserve(element);
      }
    }, { threshold: 0.04, rootMargin: "0px 0px -10px 0px" });

    elements.forEach((element) => observer.observe(element));

    return () => {
      observer.disconnect();
      for (const element of elements) {
        element.classList.remove("scroll-reveal", "is-visible");
        element.style.removeProperty("--reveal-delay");
      }
    };
  }, [pathname]);

  return null;
}
