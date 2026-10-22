/* eslint-disable react-hooks/rules-of-hooks */
import { useRef, useState, useEffect } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { useNavigate } from "react-router-dom";

const allSlides = [
  {
    id: "gallery-1",
    src: "https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=1400&q=80",
    caption: "Photo shoot, look 1",
  },
  {
    id: "gallery-2",
    src: "https://raw.githubusercontent.com/Kbelony/DK-Shop/69c6d0c13ebebe357c9c64bef98080acc34f3aae/src/assets/scss/What_s%20the%20Art.jpg",
    caption: "Photo shoot, look 2",
  },
  {
    id: "gallery-3",
    src: "https://github.com/Kbelony/DK-Shop/blob/main/src/assets/scss/024_1U1A1138_DEBORA.jpg?raw=true",
    caption: "Photo shoot, look 3",
  },
  {
    id: "gallery-4",
    src: "https://github.com/Kbelony/DK-Shop/blob/main/src/assets/scss/Black%20and%20orange%20-2694.JPG?raw=true",
    caption: "Photo shoot, look 4",
  },
  {
    id: "gallery-5",
    src: "https://images.unsplash.com/photo-1481391032119-d89fee407e44?auto=format&fit=crop&w=1400&q=80",
    caption: "Photo shoot, look 5",
  },
];

const INITIAL_SLIDE = Math.floor(allSlides.length / 2);

interface OriginHeroSectionProps {
  onOverlayToggle?: (isTransparent: boolean) => void;
}

export function OriginHeroSection({ onOverlayToggle }: OriginHeroSectionProps) {
  const navigate = useNavigate();
  const stickyRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef(false);
  const carouselRef = useRef(false);
  const { scrollYProgress } = useScroll({
    target: stickyRef,
    offset: ["start start", "end end"],
  });

  const [carouselActive, setCarouselActive] = useState(false);
  const [activeSlide, setActiveSlide] = useState(INITIAL_SLIDE); // Start with middle slide
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const shouldOverlay = latest > 0.25 && latest < 0.98;
    if (overlayRef.current !== shouldOverlay) {
      overlayRef.current = shouldOverlay;
      onOverlayToggle?.(shouldOverlay);
    }

    const shouldShowCarousel = latest > 0.6;
    if (carouselRef.current !== shouldShowCarousel) {
      carouselRef.current = shouldShowCarousel;
      setCarouselActive(shouldShowCarousel);
    }

  });

  // Same motion as the reference's "The origin": the row of photos sits in the
  // middle, the centre photo grows (width + height) until it fills the screen,
  // the side photos are pushed out and fade, the photo darkens, then the text
  // rises over it. The section is sticky, so scrolling never stops.
  const ease = (t: number) => 1 - Math.pow(1 - t, 3);
  // The centre photo is always full-screen; a clip-path "window" opens up to
  // the whole screen. Only compositor-friendly properties animate (no layout).
  const insetY = mobile ? "30svh" : "25svh";
  const insetX = mobile ? "14vw" : "22vw";
  const clip = useTransform(scrollYProgress, [0.02, 0.35], [
    `inset(${insetY} ${insetX} ${insetY} ${insetX})`,
    "inset(0svh 0vw 0svh 0vw)",
  ], { ease });
  const leftX = useTransform(scrollYProgress, [0.02, 0.35], ["0vw", "-60vw"], { ease });
  const rightX = useTransform(scrollYProgress, [0.02, 0.35], ["0vw", "60vw"], { ease });
  const sideOpacity = useTransform(scrollYProgress, [0.02, 0.25], [1, 0]);
  const dark = useTransform(scrollYProgress, [0.3, 0.45], [0, 0.55]);
  const textY = useTransform(scrollYProgress, [0.36, 0.62], ["100svh", "0svh"]);
  const textOpacity = useTransform(scrollYProgress, [0.36, 0.5], [0, 1]);
  const controlsOpacity = useTransform(scrollYProgress, [0.6, 0.7], [0, 1]);

  const nextSlide = () =>
    setActiveSlide((prev) => Math.min(prev + 1, allSlides.length - 1));
  const prevSlide = () =>
    setActiveSlide((prev) => Math.max(prev - 1, 0));

  const handleOpenGallery = () => {
    const current = allSlides[activeSlide];
    navigate(`/gallery/${current.id}`);
  };

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
      id="about"
      ref={stickyRef}
      className="relative -mx-4 mt-0 h-[300svh] md:h-[420svh] md:-mx-6 lg:mt-[120px]"
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-sand">
        <motion.div
          onPanEnd={(_, info) => {
            if (info.offset.x < -40) nextSlide();
            else if (info.offset.x > 40) prevSlide();
          }}
          style={{ touchAction: "pan-y" }}
          className="absolute inset-0"
        >
          <motion.div
            style={{ clipPath: clip, willChange: "clip-path" }}
            onClick={() => carouselActive && handleOpenGallery()}
            className="absolute inset-0 cursor-pointer"
          >
            <img
              src={allSlides[activeSlide].src}
              alt={allSlides[activeSlide].caption}
              draggable={false}
              className="h-full w-full object-cover"
            />
            <motion.div
              style={{ opacity: dark }}
              className="absolute inset-0 bg-black"
            />
          </motion.div>
          <motion.div
            style={{ x: leftX, y: "-50%", top: "50%", opacity: sideOpacity, right: `calc(100% - ${insetX} + 1rem)`, willChange: "transform, opacity" }}
            className="pointer-events-none absolute flex gap-4"
          >
            {allSlides.slice(0, activeSlide).map((slide) => (
              <img
                key={slide.id}
                src={slide.src}
                alt={slide.caption}
                draggable={false}
                className="h-[40svh] w-[30vw] shrink-0 object-cover md:h-[50svh]"
              />
            ))}
          </motion.div>
          <motion.div
            style={{ x: rightX, y: "-50%", top: "50%", opacity: sideOpacity, left: `calc(100% - ${insetX} + 1rem)`, willChange: "transform, opacity" }}
            className="pointer-events-none absolute flex gap-4"
          >
            {allSlides.slice(activeSlide + 1).map((slide) => (
              <img
                key={slide.id}
                src={slide.src}
                alt={slide.caption}
                draggable={false}
                className="h-[40svh] w-[30vw] shrink-0 object-cover md:h-[50svh]"
              />
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          style={{ y: textY, opacity: textOpacity }}
          className="pointer-events-none absolute inset-0 flex items-center px-4 text-sand md:px-6 lg:pl-[744px]"
        >
          <div className="max-w-[672px]">
            <h2 className="font-display text-[56px] leading-[1] lg:text-[128px]">
              The origin
            </h2>
            <p className="font-dm mt-6 text-xl font-bold leading-[1.2] lg:text-2xl">
              {allSlides[activeSlide].caption}
            </p>
            <button
              onClick={handleOpenGallery}
              className="font-dm pointer-events-auto mt-6 rounded-full bg-sand px-6 py-3 text-base font-bold text-deep"
              data-cursor="focus"
            >
              View the shoot
            </button>
          </div>
        </motion.div>

        <motion.div
          style={{ opacity: controlsOpacity }}
          className="absolute bottom-6 left-4 right-4 flex items-center justify-between text-white md:left-6 md:right-6"
        >
          <button
            onClick={prevSlide}
            data-cursor="focus"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/40 bg-black/20 backdrop-blur transition hover:bg-black/40"
            aria-label="Previous slide"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <span className="font-dm text-sm font-bold">
            {activeSlide + 1} / {allSlides.length}
          </span>
          <button
            onClick={nextSlide}
            data-cursor="focus"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/40 bg-black/20 backdrop-blur transition hover:bg-black/40"
            aria-label="Next slide"
          >
            <ArrowRight className="h-5 w-5" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
