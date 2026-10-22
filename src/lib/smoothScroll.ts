import type Lenis from "lenis";

let instance: Lenis | null = null;

export function setLenis(l: Lenis | null) {
  instance = l;
}

/** Smooth-scroll to a section id (same Lenis easing as every other scroll). */
export function scrollToId(id: string) {
  const target =
    id === "top" ? 0 : (document.getElementById(id) as HTMLElement | null);
  if (target === null) return false;
  if (instance) {
    instance.scrollTo(target, { offset: 0 });
  } else if (typeof target === "number") {
    window.scrollTo({ top: 0, behavior: "smooth" });
  } else {
    target.scrollIntoView({ behavior: "smooth" });
  }
  return true;
}
