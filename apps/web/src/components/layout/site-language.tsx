"use client";

import { useEffect } from "react";
import { english } from "@/lib/english";

type Language = "fr" | "en";
const originalText = new WeakMap<Text, string>();
const originalAttributes = new WeakMap<Element, Map<string, string>>();
const attributes = ["aria-label", "alt", "placeholder", "title"];

function englishFor(source: string) {
  const direct = english[source] ?? english[source.replace(/\s+/g, " ")];
  if (direct) return direct;

  const galleryImage = source.match(/^Voir l'image (\d+) : (.+)$/);
  if (galleryImage) return `View image ${galleryImage[1]}: ${english[galleryImage[2]] ?? galleryImage[2]}`;

  const galleryPosition = source.match(/^Photo (\d+) sur (\d+)$/);
  if (galleryPosition) return `Photo ${galleryPosition[1]} of ${galleryPosition[2]}`;

  return source;
}

function translate(root: ParentNode, language: Language) {
  document.documentElement.lang = language;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node: Node | null;
  while ((node = walker.nextNode())) {
    const textNode = node as Text;
    const parent = textNode.parentElement;
    if (!parent || parent.closest("script, style, noscript, [data-no-translate], .elfsight-app-c7588631-5223-4ef5-b750-1e54fb6f7780")) continue;
    if (!originalText.has(textNode)) originalText.set(textNode, textNode.nodeValue ?? "");
    const original = originalText.get(textNode) ?? "";
    const trimmed = original.trim();
    const replacement = language === "en" ? englishFor(trimmed) : undefined;
    const result = replacement ? original.replace(trimmed, replacement) : original;
    if (textNode.nodeValue !== result) textNode.nodeValue = result;
  }
  const elements = root instanceof Element ? [root, ...root.querySelectorAll("*")] : root.querySelectorAll("*");
  for (const element of elements) {
    if (element.closest("[data-no-translate]")) continue;
    let originals = originalAttributes.get(element);
    if (!originals) {
      originals = new Map();
      originalAttributes.set(element, originals);
    }
    for (const attribute of attributes) {
      const current = element.getAttribute(attribute);
      if (current === null) continue;
      if (!originals.has(attribute)) originals.set(attribute, current);
      const source = originals.get(attribute) ?? current;
      const result = language === "en" ? englishFor(source) : source;
      if (current !== result) element.setAttribute(attribute, result);
    }
  }
}

export function SiteLanguage() {
  useEffect(() => {
    let language: Language = localStorage.getItem("atlas-language") === "en" ? "en" : "fr";
    let pending = false;
    const queuedRoots = new Set<ParentNode>();
    const apply = (root: ParentNode = document.body) => {
      pending = false;
      translate(root, language);
      delete document.documentElement.dataset.languagePending;
    };
    const schedule = (root: ParentNode = document.body) => {
      queuedRoots.add(root);
      if (pending) return;
      pending = true;
      requestAnimationFrame(() => {
        pending = false;
        const roots = Array.from(queuedRoots);
        queuedRoots.clear();
        const topLevelRoots = roots.filter((root) => !roots.some((other) => other !== root && other instanceof Element && root instanceof Node && other.contains(root)));
        for (const queuedRoot of topLevelRoots) translate(queuedRoot, language);
        delete document.documentElement.dataset.languagePending;
      });
    };
    const onLanguage = (event: Event) => {
      language = (event as CustomEvent<Language>).detail === "en" ? "en" : "fr";
      schedule(document.body);
    };
    const onStorage = (event: StorageEvent) => {
      if (event.key === "atlas-language") {
        language = event.newValue === "en" ? "en" : "fr";
        schedule(document.body);
      }
    };
    const observer = new MutationObserver((mutations) => {
      if (language !== "en") return;
      const mutationRoots = new Set<ParentNode>();
      for (const mutation of mutations) {
        if (mutation.type === "characterData") {
          if (mutation.target.parentElement) mutationRoots.add(mutation.target.parentElement);
          continue;
        }
        for (const node of mutation.addedNodes) {
          if (node instanceof Element) mutationRoots.add(node);
          else if (node.parentElement) mutationRoots.add(node.parentElement);
        }
      }
      const roots = Array.from(mutationRoots);
      const topLevelRoots = roots.filter((root) => !roots.some((other) => other !== root && other instanceof Element && root instanceof Node && other.contains(root)));
      for (const root of topLevelRoots) translate(root, language);
    });
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    window.addEventListener("atlas-language-change", onLanguage);
    window.addEventListener("storage", onStorage);
    apply(document.body);
    return () => {
      observer.disconnect();
      window.removeEventListener("atlas-language-change", onLanguage);
      window.removeEventListener("storage", onStorage);
    };
  }, []);
  return null;
}
