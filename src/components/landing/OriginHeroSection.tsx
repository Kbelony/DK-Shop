/* eslint-disable react-hooks/rules-of-hooks */
import { useRef, useState, useEffect } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";

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
    src: "https://github.com/Kbelony/DK-Shop/blob/main/src/assets/scss/024_1U1A1138_DEBORA.jpg?raw=true",
    caption: "The tasting room where stories are shared",
  },
  {
    src: "https://github.com/Kbelony/DK-Shop/blob/main/src/assets/scss/012_1U1A0932_DEBORA.jpg?raw=true",
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

    const shouldShowCarousel = latest > 0.48;
    if (carouselRef.current !== shouldShowCarousel) {
      carouselRef.current = shouldShowCarousel;
      setCarouselActive(shouldShowCarousel);
    }

    const shouldCollapseGallery = latest > 0.52;
    if (galleryCollapseRef.current !== shouldCollapseGallery) {
      galleryCollapseRef.current = shouldCollapseGallery;
      setGalleryCollapsed(shouldCollapseGallery);
    }
  });

  // Phase 1 (0 to 0.2): Center all 5 images on screen
  // Phase 2 (0.2 to 0.48): Create gap ONLY around center image and start zoom

  // Image size adapts to viewport - 70vh height, 0.75 aspect ratio (52.5vh width)
  // Zoom starts only after images are centered (after 0.2)
  const centerScale = useTransform(scrollYProgress, [0.2, 0.48], [1, 4.4]);
  const centerYOffset = useTransform(scrollYProgress, [0.2, 0.45], [0, -40]);

  // Calculate base spacing using viewport units that scale with screen
  // Image width is 52.5vh, we'll use vh units for responsive spacing
  // Base spacing = image width (52.5vh) + small gap (2vh) = 54.5vh
  const baseSpacingVh = 54.5; // Base spacing in vh units (responsive to screen height)
  const gapExpansionVh = 20; // Additional gap expansion in vh units

  const cardOffsets = allSlides.map((_, index) => {
    const relative = index - 2;

    // Center image (index 2) - ALWAYS at 0, truly centered
    if (relative === 0) {
      return useTransform(scrollYProgress, [0, 0.48], [0, 0]);
    }

    // Phase 1 (0 to 0.2): Images are already centered, stay in position
    // Phase 2 (0.2 to 0.48): Gap expands ONLY between center and its neighbors

    // Left neighbor (index 1) - positioned to the left of center
    if (relative === -1) {
      return useTransform(
        scrollYProgress,
        [0, 0.2, 0.48], // Already at position, then expand gap
        [-baseSpacingVh, -baseSpacingVh, -baseSpacingVh - gapExpansionVh]
      );
    }

    // Right neighbor (index 3) - positioned to the right of center
    if (relative === 1) {
      return useTransform(
        scrollYProgress,
        [0, 0.2, 0.48], // Already at position, then expand gap
        [baseSpacingVh, baseSpacingVh, baseSpacingVh + gapExpansionVh]
      );
    }

    // Far left (index 0) - positioned to the left of index 1
    // Moves with index 1 but maintains constant gap (NO expansion between 0 and 1)
    if (relative === -2) {
      return useTransform(
        scrollYProgress,
        [0, 0.2, 0.48], // Already at position, then move with neighbor
        [
          -baseSpacingVh * 2,
          -baseSpacingVh * 2,
          -baseSpacingVh * 2 - gapExpansionVh,
        ]
      );
    }

    // Far right (index 4) - positioned to the right of index 3
    // Moves with index 3 but maintains constant gap (NO expansion between 3 and 4)
    if (relative === 2) {
      return useTransform(
        scrollYProgress,
        [0, 0.2, 0.48], // Already at position, then move with neighbor
        [
          baseSpacingVh * 2,
          baseSpacingVh * 2,
          baseSpacingVh * 2 + gapExpansionVh,
        ]
      );
    }

    return useTransform(scrollYProgress, [0, 0.48], [0, 0]);
  });

  // All images are visible from the start, only fade out later
  const imageOpacity = allSlides.map((_, index) => {
    if (index === 2) return useTransform(scrollYProgress, [0, 0.48], [1, 1]);
    return useTransform(scrollYProgress, [0, 0.35, 0.48], [1, 1, 0]);
  });

  // Only the center image (index 2) zooms, others stay same size or shrink slightly
  // Zoom starts only after images are centered (after 0.2)
  const cardScales = allSlides.map((_, index) =>
    index === 2
      ? centerScale
      : useTransform(scrollYProgress, [0.2, 0.48], [1, 0.75])
  );

  // Convert offsets to vh units for responsive x transform
  const cardOffsetsVh = cardOffsets.map((offset) =>
    useTransform(offset, (val) => `${val}vh`)
  );

  // Carousel phase: full screen - appears when gallery fades out
  const carouselOpacity = useTransform(scrollYProgress, [0.48, 0.55], [0, 1]);

  const nextSlide = () =>
    setActiveSlide((prev) => (prev + 1) % allSlides.length);
  const prevSlide = () =>
    setActiveSlide((prev) => (prev - 1 + allSlides.length) % allSlides.length);

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
    <section
      ref={stickyRef}
      className="-mx-4 h-[330vh] sm:-mx-6 lg:-mx-10 relative"
    >
      <div className="sticky top-0 h-screen overflow-hidden bg-sand text-white">
        {/* Gallery phase: 5 images horizontal */}
        {!galleryCollapsed && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            {allSlides.map((slide, index) => (
              <motion.div
                key={slide.src}
                className="absolute overflow-hidden rounded-none shadow-xl"
                style={{
                  width: "52.5vh", // 70vh * 0.75 aspect ratio
                  height: "70vh", // Takes 70% of viewport height
                  left: "50%",
                  top: "50%",
                  x: cardOffsetsVh[index],
                  y: index === 2 ? centerYOffset : 0,
                  scale: cardScales[index],
                  zIndex: index === 2 ? 50 : 20 - Math.abs(index - 2), // Center image always on top
                  borderRadius: 0,
                  opacity: imageOpacity[index],
                  marginLeft: "-26.25vh", // Center horizontally: -50% of width (52.5vh / 2)
                  marginTop: "-35vh", // Center vertically: -50% of height (70vh / 2)
                  transformOrigin: "center center", // Ensure scaling happens from center
                }}
              >
                <img
                  src={slide.src}
                  alt={slide.caption}
                  className="h-full w-full object-cover"
                />
              </motion.div>
            ))}
          </div>
        )}

        {/* Carousel phase: full screen */}
        <motion.div
          style={{
            opacity: carouselOpacity,
            zIndex: 100,
          }}
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