import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const steps = [
  {
    title: "Dresses",
    number: "01",
    label: "/Finest ingredients",
    copy: "At Bakeat, every creation starts with the finest ingredients and a passion for perfection. Our bakers carefully mix each batch with love, ensuring the perfect balance of flavors and textures. From the very first step, we pour our hearts into crafting something truly special.",
    image:
      "https://github.com/Kbelony/DK-Shop/blob/main/src/assets/scss/_DSC1423.jpg?raw=true",
  },
  {
    title: "Jackets",
    number: "02",
    label: "/Wood-fired balance",
    copy: "Les pains reposent sur pierre, les braises sont rassemblées d'un côté pour créer une chaleur douce qui caramélise la croûte sans brûler.",
    image:
      "https://github.com/Kbelony/DK-Shop/blob/main/src/assets/scss/009_1U1A0904_DEBORA_Original.jpg?raw=true",
  },
  {
    title: "Pants",
    number: "03",
    label: "/Savor together",
    copy: "On sert chaud sur des tables communes avec beurre battu maison et confitures fermentées. Chaque service raconte une histoire.",
    image:
      "https://github.com/Kbelony/DK-Shop/blob/main/src/assets/scss/IMG_7186.jpg?raw=true",
  },
];

export function BehindDoughSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);

  // Stable synchronisation image/titre : basé sur la proximité du centre de l'écran
  useEffect(() => {
    let frame: number | null = null;

    const updateActiveFromScroll = () => {
      frame = null;
      const viewportCenter = window.innerHeight / 2;
      let bestIndex = activeIndex;
      let bestDistance = Number.POSITIVE_INFINITY;

      itemRefs.current.forEach((el, idx) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const distance = Math.abs(center - viewportCenter);
        if (distance < bestDistance) {
          bestDistance = distance;
          bestIndex = idx;
        }
      });

      if (bestIndex !== activeIndex) {
        setActiveIndex(bestIndex);
      }
    };

    const onScrollOrResize = () => {
      if (frame === null) {
        frame = requestAnimationFrame(updateActiveFromScroll);
      }
    };

    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);
    // Première synchro
    updateActiveFromScroll();

    return () => {
      if (frame !== null) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [activeIndex]);

  return (
    <section className="space-y-12 lg:grid lg:grid-cols-[0.55fr_0.45fr] lg:gap-16">
      <div className="space-y-12 pl-2 sm:pl-4 lg:pl-8">
        <div className="space-y-3 pb-12">
          <p className="text-xs uppercase tracking-[0.5em] text-deep/50">
            Behind the dough
          </p>
          <p className="max-w-md text-base text-deep/70">
            Make, Bake, Eat — un triptyque qui reste pendant que les images se
            succèdent à droite.
          </p>
        </div>
        <div className="space-y-12 sm:space-y-20 lg:space-y-28">
          {steps.map((step, index) => (
            <motion.article
              key={step.title}
              data-index={index}
              ref={(el) => (itemRefs.current[index] = el)}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ amount: 0.2, once: false, margin: "-100px" }}
              transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
              className="space-y-4 sm:space-y-6"
            >
              <div className="flex items-end gap-2 sm:gap-4">
                <h3
                  className="font-heading text-[clamp(3rem,12vw,6.5rem)] font-extrabold leading-[0.9] break-words"
                  style={{
                    fontFamily:
                      '"Inter Display", "Inter Display Placeholder", sans-serif',
                  }}
                >
                  {step.title}
                </h3>
                <span className="text-sm sm:text-lg text-deep/50 flex-shrink-0">
                  {step.number}
                </span>
              </div>
              <p
                className="font-heading text-base uppercase tracking-[0.5em] text-deep/50"
                style={{
                  fontFamily: '"DM Sans","DM Sans Placeholder",sans-serif',
                }}
              >
                {step.label}
              </p>
              <p className="text-base sm:text-lg leading-relaxed text-deep/80 pb-4 sm:pb-6">
                {step.copy}
              </p>
              <button className="group inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-deep/70 transition-colors hover:text-deep mb-4 sm:mb-6">
                See more
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </button>
              <div className="overflow-hidden border border-[#e1d7c8] lg:hidden">
                <img
                  src={step.image}
                  alt={step.title}
                  className="w-full h-auto object-contain"
                />
              </div>
              <div className="pb-16 sm:pb-24 lg:pb-40"></div>
            </motion.article>
          ))}
        </div>
      </div>

      <div className="relative hidden lg:block">
        <div className="sticky top-32 overflow-hidden border border-[#e1d7c8] shadow-lg">
          {steps.map((step, index) => (
            <img
              key={step.title}
              src={step.image}
              alt={step.title}
              className={`w-full h-auto object-contain transition-opacity duration-0 ${
                index === activeIndex
                  ? "relative opacity-100"
                  : "absolute top-0 left-0 opacity-0"
              }`}
              style={{
                pointerEvents: index === activeIndex ? "auto" : "none",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
