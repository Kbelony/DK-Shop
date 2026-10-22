import type Lenis from "lenis";

let instance: Lenis | null = null;

export function setLenis(l: Lenis | null) {
  instance = l;
}

// The header is fixed (about 64px tall on mobile): stop a little below it.
const HEADER_OFFSET = 72;

function targetTop(id: string): number | null {
  if (id === "top") return 0;
  const el = document.getElementById(id);
  if (!el) return null;
  // The footer is at the bottom of the page: no offset so it can sit flush.
  const offset = id === "contact" ? 0 : HEADER_OFFSET;
  return Math.max(0, el.getBoundingClientRect().top + window.scrollY - offset);
}

/**
 * Smooth-scroll to a section id with the same Lenis easing as every other
 * scroll. Photos load late and move the page, so after the glide ends we
 * measure again and correct once or twice if the section is not where it
 * should be.
 */
export function scrollToId(id: string, attempt = 0): boolean {
  const top = targetTop(id);
  if (top === null) return false;
  const verify = () => {
    const now = targetTop(id);
    if (now !== null && Math.abs(now - window.scrollY) > 6 && attempt < 2) {
      scrollToId(id, attempt + 1);
    }
  };
  if (instance) {
    instance.scrollTo(top, { duration: attempt ? 0.6 : 1.2, force: true, onComplete: verify });
  } else {
    window.scrollTo({ top, behavior: "smooth" });
    window.setTimeout(verify, 700);
  }
  return true;
}

/** From any page: go to the landing page if needed, then glide to the section. */
export function goToSection(id: string, navigate: (to: string) => void) {
  if (window.location.pathname === "/") {
    scrollToId(id);
    return;
  }
  navigate("/");
  let tries = 0;
  const wait = window.setInterval(() => {
    tries += 1;
    if (document.getElementById(id) || id === "top" || tries > 20) {
      window.clearInterval(wait);
      window.setTimeout(() => scrollToId(id), 350);
    }
  }, 100);
}
