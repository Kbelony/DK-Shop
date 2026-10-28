import { useEffect, useState } from "react";
import { fetchSlots } from "@/services/googlePhotos";

/**
 * The photo for a fixed spot on the page. Starts with the built-in photo and
 * switches to the first photo of the Google Photos album with the same name
 * only once that photo has loaded, so a missing or broken album never leaves a
 * hole.
 */
export function useSlotImage(slot: string, fallback: string) {
  const [src, setSrc] = useState(fallback);
  useEffect(() => {
    let cancelled = false;
    fetchSlots().then((slots) => {
      const url = slots?.[slot];
      if (!url || cancelled) return;
      const probe = new Image();
      probe.onload = () => {
        if (!cancelled) setSrc(url);
      };
      probe.src = url;
    });
    return () => {
      cancelled = true;
    };
  }, [slot]);
  return src;
}
