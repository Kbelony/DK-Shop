import { ReactNode, useEffect } from "react";
import Lenis from "lenis";
import { useLocation } from "react-router-dom";
import { setLenis, scrollToId } from "@/lib/smoothScroll";

interface SmoothScrollProviderProps {
  children: ReactNode;
}

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Same setup as the reference: Lenis defaults, 1s duration, expo-out easing
    const lenis = new Lenis({ duration: 1 });
    setLenis(lenis);

    let frame: number;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  // New page -> start at top; deep link with #anchor -> glide to it
  useEffect(() => {
    if (hash) {
      const id = hash.slice(1);
      const t = window.setTimeout(() => scrollToId(id), 150);
      return () => window.clearTimeout(t);
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return <>{children}</>;
}
