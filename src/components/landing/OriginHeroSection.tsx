/* eslint-disable react-hooks/rules-of-hooks */
import { useRef, useState, useEffect } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  AnimatePresence,
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

    const shouldShowCarousel = latest > 0.75;
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
  // The centre photo is always full-screen; a window opens up to
  // the whole screen. Only compositor-friendly properties animate (no layout).
  const sx0 = mobile ? 0.72 : 0.56;
  const sy0 = mobile ? 0.4 : 0.5;
  const insetX = mobile ? "14vw" : "22vw";
  const scaleX = useTransform(scrollYProgress, [0.02, 0.35], [sx0, 1], { ease });
  const scaleY = useTransform(scrollYProgress, [0.02, 0.35], [sy0, 1], { ease });
  const invX = useTransform(scaleX, (v) => 1 / v);
  const invY = useTransform(scaleY, (v) => 1 / v);
  const leftX = useTransform(scrollYProgress, [0.02, 0.35], ["0vw", "-60vw"], { ease });
  const rightX = useTransform(scrollYProgress, [0.02, 0.35], ["0vw", "60vw"], { ease });
  const sideOpacity = useTransform(scrollYProgress, [0.02, 0.25], [1, 0]);
  const dark = useTransform(scrollYProgress, [0.35, 0.55], [0, 0.55]);
  const textY = useTransform(scrollYProgress, [0.45, 0.8], ["100vh", "0vh"]);
  const textOpacity = useTransform(scrollYProgress, [0.45, 0.6], [0, 1]);
  const controlsOpacity = useTransform(scrollYProgress, [0.75, 0.88], [0, 1]);

  const [dir, setDir] = useState(1);
  const shift =
    (typeof window === "undefined" ? 390 : window.innerWidth) * 0.3 + 16;
  const nextSlide = () => {
    setDir(1);
    setActiveSlide((prev) => Math.min(prev + 1, allSlides.length - 1));
  };
  const prevSlide = () => {
    setDir(-1);
    setActiveSlide((prev) => Math.max(prev - 1, 0));
  };

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
      className="relative -mx-4 -mt-[28vh] h-[400vh] md:h-[500vh] md:-mx-6 md:mt-0 lg:mt-[120px]"
    >
      <div className="sticky top-0 h-[100vh] overflow-hidden">
        <motion.div
          onPanEnd={(_, info) => {
            if (info.offset.x < -40) nextSlide();
            else if (info.offset.x > 40) prevSlide();
          }}
          style={{ touchAction: "pan-y" }}
          className="absolute inset-0"
        >
          <motion.div
            style={{ scaleX, scaleY, willChange: "transform" }}
            onClick={() => carouselActive && handleOpenGallery()}
            className="absolute inset-0 cursor-pointer overflow-hidden"
          >
            <motion.div
              style={{ scaleX: invX, scaleY: invY, willChange: "transform" }}
              className="absolute inset-0"
            >
              <AnimatePresence initial={false} custom={dir}>
                <motion.img
                  key={allSlides[activeSlide].id}
                  src={allSlides[activeSlide].src}
                  alt={allSlides[activeSlide].caption}
                  draggable={false}
                  custom={dir}
                  variants={{
                    enter: (d: number) => ({ x: `${d * 100}%`, opacity: 1 }),
                    center: { x: "0%", opacity: 1 },
                    exit: (d: number) => ({ x: `${d * -30}%`, opacity: 0 }),
                  }}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  style={{ willChange: "transform" }}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </AnimatePresence>
              <motion.div
                style={{ opacity: dark }}
                className="absolute inset-0 bg-black"
              />
            </motion.div>
          </motion.div>
          <motion.div
            style={{ x: leftX, y: "-50%", top: "50%", opacity: sideOpacity, right: `calc(100% - ${insetX} + 1rem)`, willChange: "transform, opacity" }}
            className="pointer-events-none absolute flex w-max gap-4"
          >
            <motion.div
              key={activeSlide}
              initial={{ x: dir * shift }}
              animate={{ x: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="flex gap-4"
            >
              {allSlides.slice(0, activeSlide).map((slide) => (
              <img
                key={slide.id}
                src={slide.src}
                alt={slide.caption}
                draggable={false}
                className="h-[40vh] w-[30vw] shrink-0 object-cover md:h-[50vh]"
              />
            ))}
            </motion.div>
          </motion.div>
          <motion.div
            style={{ x: rightX, y: "-50%", top: "50%", opacity: sideOpacity, left: `calc(100% - ${insetX} + 1rem)`, willChange: "transform, opacity" }}
            className="pointer-events-none absolute flex w-max gap-4"
          >
            <motion.div
              key={activeSlide}
              initial={{ x: dir * shift }}
              animate={{ x: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="flex gap-4"
            >
              {allSlides.slice(activeSlide + 1).map((slide) => (
              <img
                key={slide.id}
                src={slide.src}
                alt={slide.caption}
                draggable={false}
                className="h-[40vh] w-[30vw] shrink-0 object-cover md:h-[50vh]"
              />
            ))}
            </motion.div>
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
