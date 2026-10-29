import { useRef, useState, useEffect } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  animate,
  motion,
  useMotionValue,
  type MotionValue,
  useTransform,
} from "framer-motion";
import { useNavigate } from "react-router-dom";
import { fetchAlbums, photoUrl } from "@/services/googlePhotos";

const staticSlides = [
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

const INITIAL_SLIDE = Math.floor(staticSlides.length / 2);

/**
 * The photo is always drawn at the "cover" size of the window it sits in, so
 * it is never magnified in the small state; it only grows with the window.
 */
// Where the face sits in the photo (0 = top edge, 1 = bottom edge), for photos
// whose face has to sit in the middle of the window instead of near the top.
const FACE_Y: Record<string, number> = {
  "gallery-4": 0.33, // Greg orange and black looks
  "gallery-5": 0.35, // Profile look
};

// Where the garment sits in each photo (0 = top edge, 1 = bottom edge). On
// large screens the window is centred on this point so the clothes show, not
// the face. Photos not listed use CLOTHES_Y_DEFAULT.
const CLOTHES_Y_DEFAULT = 0.58;
const CLOTHES_Y: Record<string, number> = {
  "gallery-1": 0.6, // Monica: pink dress, crouching
  "gallery-2": 0.5, // Orange and black looks: orange panel and skirt
  "gallery-3": 0.62, // Blue dress
  "gallery-4": 0.62, // Greg orange and black looks: jacket
  "gallery-5": 0.7, // Profile look: green tiered dress
  "gallery-6": 0.68, // Business looks: denim jacket and pink skirt
};

function SlideImage({
  faceY,
  clothesY,
  src,
  alt,
  scaleX,
  scaleY,
}: {
  faceY?: number;
  clothesY?: number;
  src: string;
  alt: string;
  scaleX: MotionValue<number>;
  scaleY: MotionValue<number>;
}) {
  const dims = useRef({ w: 0, h: 0 });
  const ref = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);
  // On large screens the window is wide and the photo is cropped top and
  // bottom: show the clothes (the middle of the photo), not the face.
  const wide = useRef(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => {
      wide.current = mq.matches;
      scaleX.set(scaleX.get() + 1e-6);
    };
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [scaleX]);
  const coverScale = (sx: number, sy: number) => {
    const box = ref.current?.closest<HTMLElement>("[data-origin-sticky]");
    if (!dims.current.w || !box) return null;
    const W = box.offsetWidth;
    const H = box.offsetHeight;
    // 1.02: a hair larger than "cover" so rounding never leaves a gap
    const s = 1.02 * Math.max((W * sx) / dims.current.w, (H * sy) / dims.current.h);
    return { s, H, sy };
  };
  const scale = useTransform([scaleX, scaleY], ([sx, sy]: number[]) => {
    return coverScale(sx, sy)?.s ?? 1;
  });
  // Tall photos in a wide window lose their top and bottom. People are near the
  // top of a portrait photo, so keep the top of the photo and crop the bottom.
  const y = useTransform([scaleX, scaleY], ([sx, sy]: number[]) => {
    const c = coverScale(sx, sy);
    if (!c) return "-50%";
    const { w, h } = dims.current;
    const overflow = h * c.s - c.H * c.sy;
    if (overflow <= 0 || h < w * 1.1) return "-50%";
    const centre = wide.current ? clothesY : faceY;
    if (centre !== undefined) {
      const want = (0.5 - centre) * h * c.s; // moves that point to the window centre
      return `calc(-50% + ${Math.max(-overflow / 2, Math.min(overflow / 2, want))}px)`;
    }
    const focus = 0.1; // 0 = top edge, 0.5 = centre
    return `calc(-50% + ${(0.5 - focus) * overflow}px)`;
  });
  return (
    <motion.img
      ref={ref}
      src={src}
      alt={alt}
      draggable={false}
      onLoad={(e) => {
        dims.current = {
          w: e.currentTarget.naturalWidth,
          h: e.currentTarget.naturalHeight,
        };
        setLoaded(true);
        scaleX.set(scaleX.get() + 1e-6);
      }}
      style={{
        scale,
        x: "-50%",
        y,
        width: dims.current.w || undefined,
        height: dims.current.h || undefined,
        opacity: loaded ? 1 : 0,
        willChange: "transform",
      }}
      className="absolute left-1/2 top-1/2 max-w-none"
    />
  );
}

/**
 * Every slide (centre and sides) uses this one component, so they always have
 * exactly the same size. Only the horizontal offset differs.
 */
function Slide({
  slide,
  offset,
  scaleX,
  scaleY,
  invX,
  invY,
  sideOpacity,
  dark,
  onOpen,
}: {
  slide: { id: string; src: string; caption: string };
  offset: number;
  scaleX: MotionValue<number>;
  scaleY: MotionValue<number>;
  invX: MotionValue<number>;
  invY: MotionValue<number>;
  sideOpacity: MotionValue<number>;
  dark: MotionValue<number>;
  onOpen: () => void;
}) {
  const down = useRef<{ x: number; y: number; t: number } | null>(null);
  const d = useMotionValue(offset);
  useEffect(() => {
    // A slide that wraps around from one end to the other jumps while it is
    // off screen, so the loop looks endless.
    if (Math.abs(offset - d.get()) > 1.5) {
      d.set(offset);
      return;
    }
    const c = animate(d, offset, { duration: 0.5, ease: [0.22, 1, 0.36, 1] });
    return () => c.stop();
  }, [offset, d]);
  const x = useTransform([d, scaleX], ([dd, sx]: number[]) => {
    const W = document.documentElement.clientWidth;
    return dd * (W * sx + 16);
  });
  const opacity = useTransform([d, sideOpacity], ([dd, so]: number[]) =>
    Math.abs(dd) < 1 ? 1 : so
  );
  return (
    <motion.div
      style={{ x, opacity, zIndex: offset === 0 ? 2 : 1, willChange: "transform" }}
      className="pointer-events-none absolute inset-0"
    >
      <motion.div
        style={{ scaleX, scaleY, willChange: "transform" }}
        onPointerDown={(e) => {
          down.current = { x: e.clientX, y: e.clientY, t: Date.now() };
        }}
        onPointerUp={(e) => {
          const d0 = down.current;
          down.current = null;
          // a tap: tiny move, short press. A swipe must never open the gallery.
          if (
            d0 &&
            Math.hypot(e.clientX - d0.x, e.clientY - d0.y) < 8 &&
            Date.now() - d0.t < 600
          )
            onOpen();
        }}
        className="img-shimmer pointer-events-auto absolute inset-0 cursor-pointer overflow-clip"
      >
        <motion.div
          style={{ scaleX: invX, scaleY: invY, willChange: "transform" }}
          className="absolute inset-0"
        >
          <SlideImage
            key={slide.src}
            faceY={FACE_Y[slide.id]}
            clothesY={CLOTHES_Y[slide.id] ?? CLOTHES_Y_DEFAULT}
            src={slide.src}
            alt={slide.caption}
            scaleX={scaleX}
            scaleY={scaleY}
          />
          <motion.div
            style={{ opacity: dark }}
            className="absolute inset-0 bg-black"
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/**
 * Plain carousel: no scroll-driven animation. The active slide fills the
 * section; arrows, swipe and keyboard move between shoots; tapping a photo
 * opens its gallery.
 */
export function OriginHeroSection() {
  const navigate = useNavigate();
  // Static photos first; swapped for the first photo of each shared album when they load.
  const [allSlides, setAllSlides] = useState(staticSlides);
  useEffect(() => {
    let cancelled = false;
    fetchAlbums().then((albums) => {
      if (cancelled || !albums) return;
      setAllSlides(
        albums.map((a) => ({
          id: a.id,
          src: photoUrl(a.images[0].src.split("=")[0], 1600),
          caption: a.title,
        }))
      );
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Unbounded position: the carousel loops, so it can keep going either way.
  const [pos, setPos] = useState(INITIAL_SLIDE); // Start with middle slide
  const count = allSlides.length;
  const activeSlide = ((pos % count) + count) % count;
  const slideOffset = (i: number) => {
    const half = count / 2;
    let o = (((i - pos) % count) + count) % count;
    if (o >= half) o -= count;
    return o;
  };

  // Fixed presentation values (no scroll effect): full-size active slide,
  // sides hidden, slight darkening so the text stays readable.
  const scaleX = useMotionValue(1);
  const scaleY = useMotionValue(1);
  const invX = useMotionValue(1);
  const invY = useMotionValue(1);
  const sideOpacity = useMotionValue(0);
  const dark = useMotionValue(0.45);

  const nextSlide = () => {
    setPos((prev) => prev + 1);
  };
  const prevSlide = () => {
    setPos((prev) => prev - 1);
  };

  const handleOpenGallery = () => {
    const current = allSlides[activeSlide];
    navigate(`/gallery/${current.id}`);
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "ArrowRight") nextSlide();
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  return (
    <section
      id="origin"
      className="relative -mx-4 mt-8 h-[85vh] min-h-[520px] md:-mx-6"
    >
      <div data-origin-sticky className="absolute inset-0 overflow-clip">
        <motion.div
          onPanEnd={(_, info) => {
            if (info.offset.x < -40) nextSlide();
            else if (info.offset.x > 40) prevSlide();
          }}
          style={{ touchAction: "pan-y" }}
          className="absolute inset-0"
        >
          {allSlides.map((slide, i) => (
            <Slide
              key={slide.id}
              slide={slide}
              offset={slideOffset(i)}
              scaleX={scaleX}
              scaleY={scaleY}
              invX={invX}
              invY={invY}
              sideOpacity={sideOpacity}
              dark={dark}
              onOpen={() => navigate(`/gallery/${slide.id}`)}
            />
          ))}
        </motion.div>

        <div className="pointer-events-none absolute inset-0 z-10 flex items-center px-4 text-sand md:px-6 lg:items-end lg:pb-28">
          <div className="max-w-[672px]">
            <h2 className="font-display text-[56px] leading-[1] lg:whitespace-nowrap lg:text-[128px]">
              The gallery
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
        </div>

        <div className="absolute bottom-6 left-4 right-4 z-10 flex items-center justify-between text-white md:left-6 md:right-6">
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
        </div>
      </div>
    </section>
  );
}
