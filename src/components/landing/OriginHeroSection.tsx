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
    const shouldOverlay = latest > 0.35 && latest < 0.98;
    if (overlayRef.current !== shouldOverlay) {
      overlayRef.current = shouldOverlay;
      onOverlayToggle?.(shouldOverlay);
    }

    const shouldShowCarousel = latest > 0.8;
    if (carouselRef.current !== shouldShowCarousel) {
      // When entering fullscreen carousel, reset to middle slide
      if (!carouselRef.current && shouldShowCarousel) {
        setActiveSlide(INITIAL_SLIDE);
      }
      carouselRef.current = shouldShowCarousel;
      setCarouselActive(shouldShowCarousel);
    }

  });

  // Same motion as the reference's "The origin": the row of photos sits in the
  // middle, the centre photo grows (width + height) until it fills the screen,
  // the side photos are pushed out and fade, the photo darkens, then the text
  // rises over it. The section is sticky, so scrolling never stops.
  const ease = (t: number) => 1 - Math.pow(1 - t, 3);
  const centerW = useTransform(
    scrollYProgress,
    [0.1, 0.4],
    [mobile ? "72vw" : "56vw", "100vw"],
    { ease }
  );
  const centerH = useTransform(
    scrollYProgress,
    [0.1, 0.4],
    [mobile ? "40vh" : "50vh", "100vh"],
    { ease }
  );
  const sideOpacity = useTransform(scrollYProgress, [0.1, 0.3], [1, 0]);
  const dark = useTransform(scrollYProgress, [0.4, 0.6], [0, 0.55]);
  const textY = useTransform(scrollYProgress, [0.55, 0.85], ["100vh", "0vh"]);
  const textOpacity = useTransform(scrollYProgress, [0.55, 0.72], [0, 1]);
  const controlsOpacity = useTransform(scrollYProgress, [0.8, 0.9], [0, 1]);

  const nextSlide = () =>
    setActiveSlide((prev) => (prev + 1) % allSlides.length);
  const prevSlide = () =>
    setActiveSlide((prev) => (prev - 1 + allSlides.length) % allSlides.length);

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
      className="relative -mx-4 mt-[100px] h-[500vh] md:-mx-6 lg:mt-[200px]"
    >
      <div className="sticky top-0 h-screen overflow-hidden bg-sand">
        <div className="flex h-full w-full items-center justify-center gap-4">
          {allSlides.map((slide, i) =>
            i === 2 ? (
              <motion.div
                key={slide.id}
                style={{ width: centerW, height: centerH }}
                className="relative shrink-0 cursor-pointer overflow-hidden"
                onClick={() => carouselActive && handleOpenGallery()}
              >
                <img
                  key={carouselActive ? allSlides[activeSlide].src : slide.src}
                  src={carouselActive ? allSlides[activeSlide].src : slide.src}
                  alt={slide.caption}
                  className="h-full w-full object-cover"
                />
                <motion.div
                  style={{ opacity: dark }}
                  className="absolute inset-0 bg-black"
                />
              </motion.div>
            ) : (
              <motion.img
                key={slide.id}
                src={slide.src}
                alt={slide.caption}
                style={{ opacity: sideOpacity }}
                className="h-[40vh] w-[30vw] shrink-0 object-cover md:h-[50vh]"
              />
            )
          )}
        </div>

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
