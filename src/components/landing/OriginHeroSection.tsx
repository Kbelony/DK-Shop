import { useRef, useState, useEffect } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";

const allSlides = [
  {
    src: "https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=1400&q=80",
    caption: "Ancient grain fields at dawn",
  },
  {
    src: "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?auto=format&fit=crop&w=1400&q=80",
    caption: "Wood-fired ovens glowing late at night",
  },
  {
    src: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1400&q=80",
    caption: "The tasting room where stories are shared",
  },
  {
    src: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=1400&q=80",
    caption: "Hands mixing the finest ingredients",
  },
  {
    src: "https://images.unsplash.com/photo-1481391032119-d89fee407e44?auto=format&fit=crop&w=1400&q=80",
    caption: "Fresh loaves cooling on racks",
  },
];

interface OriginHeroSectionProps {
  onOverlayToggle?: (isTransparent: boolean) => void;
}

export function OriginHeroSection({ onOverlayToggle }: OriginHeroSectionProps) {
  const stickyRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef(false);
  const carouselRef = useRef(false);
  const galleryCollapseRef = useRef(false);
  const { scrollYProgress } = useScroll({
    target: stickyRef,
    offset: ["start end", "end start"],
  });

  const [carouselActive, setCarouselActive] = useState(false);
  const [activeSlide, setActiveSlide] = useState(2); // Start with middle slide (index 2)
  const [galleryCollapsed, setGalleryCollapsed] = useState(false);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const shouldOverlay = latest > 0.25 && latest < 0.98;
    if (overlayRef.current !== shouldOverlay) {
      overlayRef.current = shouldOverlay;
      onOverlayToggle?.(shouldOverlay);
    }

    const shouldShowCarousel = latest > 0.55;
    if (carouselRef.current !== shouldShowCarousel) {
      carouselRef.current = shouldShowCarousel;
      setCarouselActive(shouldShowCarousel);
    }

    const shouldCollapseGallery = latest > 0.55;
    if (galleryCollapseRef.current !== shouldCollapseGallery) {
      galleryCollapseRef.current = shouldCollapseGallery;
      setGalleryCollapsed(shouldCollapseGallery);
    }
  });

  // Gallery phase: cards slide outward while center grows
  const centerScale = useTransform(scrollYProgress, [0.12, 0.48], [1, 4.4]);
  const centerYOffset = useTransform(scrollYProgress, [0.12, 0.45], [0, -90]);
  const siblingsOpacity = useTransform(scrollYProgress, [0.35, 0.48], [1, 0]);

  const cardOffsets = allSlides.map((_, index) => {
    const relative = index - 2;
    return useTransform(scrollYProgress, [0.12, 0.48], [0, relative * 260]);
  });
  const cardScales = allSlides.map((_, index) =>
    index === 2
      ? centerScale
      : useTransform(scrollYProgress, [0.12, 0.48], [1, 0.75])
  );

  // Carousel phase: full screen
  const carouselOpacity = useTransform(scrollYProgress, [0.5, 0.57], [0, 1]);

  const nextSlide = () => setActiveSlide((prev) => (prev + 1) % allSlides.length);
  const prevSlide = () => setActiveSlide((prev) => (prev - 1 + allSlides.length) % allSlides.length);

  useEffect(() => {
    if (carouselActive) {
      const handleKeyPress = (e: KeyboardEvent) => {
        if (e.key === "ArrowLeft") prevSlide();
        if (e.key === "ArrowRight") nextSlide();
      };
      window.addEventListener("keydown", handleKeyPress);
      return () => window.removeEventListener("keydown", handleKeyPress);
    }
  }, [carouselActive]);

  return (
    <section ref={stickyRef} className="-mx-4 h-[330vh] sm:-mx-6 lg:-mx-10">
      <div className="sticky top-0 h-screen overflow-hidden bg-sand text-white">
        {/* Gallery phase: 5 images horizontal */}
        {!galleryCollapsed && (
          <motion.div className="absolute inset-0 flex items-center justify-center gap-4 px-6 text-deep">
            {allSlides.map((slide, index) => (
              <motion.div
                key={slide.src}
                className="relative h-[60vh] w-[240px] overflow-hidden rounded-none shadow-xl"
                style={{
                  translateX: cardOffsets[index],
                  scale: cardScales[index],
                  zIndex: index === 2 ? 30 : 10 + index,
                  borderRadius: 0,
                  y: index === 2 ? centerYOffset : 0,
                  opacity: index === 2 ? 1 : siblingsOpacity,
                }}
              >
                <img
                  src={slide.src}
                  alt={slide.caption}
                  className="h-full w-full object-cover"
                />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Carousel phase: full screen */}
        <motion.div
          style={{ opacity: carouselOpacity }}
          className="absolute inset-0"
        >
          <img
            key={allSlides[activeSlide].src}
            src={allSlides[activeSlide].src}
            alt={allSlides[activeSlide].caption}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/80" />

          {/* Text centered at bottom */}
          <div className="absolute inset-0 flex flex-col items-center justify-end px-6 pb-14 text-center space-y-3">
            <p className="text-xs uppercase tracking-[0.6em] text-white/70 font-bold">
              THE ORIGIN
            </p>
            <h3
              className="font-heading text-4xl lg:text-5xl font-extrabold leading-tight pb-10 lg:pb-4"
              style={{
                fontFamily:
                  '"Inter Display", "Inter Display Placeholder", sans-serif',
              }}
            >
              {allSlides[activeSlide].caption}
            </h3>
          </div>

          {/* Navigation arrows */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-6">
            <button
              onClick={prevSlide}
              data-cursor="focus"
              className="pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full border border-white/30 bg-black/30 text-white backdrop-blur transition hover:bg-black/50"
              aria-label="Previous slide"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <button
              onClick={nextSlide}
              data-cursor="focus"
              className="pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full border border-white/30 bg-black/30 text-white backdrop-blur transition hover:bg-black/50"
              aria-label="Next slide"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>

          {/* Status + pagination at bottom */}
          <div className="absolute bottom-8 left-6 right-6 flex items-center justify-between text-sm uppercase tracking-[0.4em] text-white/70 font-bold">
            <span>
              {activeSlide + 1}/{allSlides.length}
            </span>
            <span className="flex-1 text-center">
              SCROLL STOPPED — EXPLORE MANUALLY
            </span>
            <span className="w-12" />
          </div>
        </motion.div>

        {!carouselActive && (
          <div className="pointer-events-none absolute bottom-10 left-1/2 -translate-x-1/2 rounded-full bg-white/90 px-6 py-2 text-xs font-semibold uppercase tracking-[0.4em] text-deep z-50">
            Continue to scroll
          </div>
        )}
      </div>
    </section>
  );
}
