import { SkeletonImage } from "@/components/ui/skeleton-image";
import { useEffect, useRef, useState } from "react";

const steps = [
  {
    title: "Dresses",
    number: "01",
    label: "/Chosen fabrics",
    copy: "Every piece starts with the fabric. Each one is chosen for how it hangs, moves and feels, then cut by hand to a pattern drawn for this piece only.",
    image:
      "https://github.com/Kbelony/DK-Shop/blob/main/src/assets/scss/_DSC1423.jpg?raw=true",
  },
  {
    title: "Jackets",
    number: "02",
    label: "/Careful construction",
    copy: "Each seam is sewn and pressed slowly. Fittings and small adjustments keep the shape exactly as the sketch intended.",
    image:
      "https://github.com/Kbelony/DK-Shop/blob/main/src/assets/scss/009_1U1A0904_DEBORA_Original.jpg?raw=true",
  },
  {
    title: "Pants",
    number: "03",
    label: "/Worn by real people",
    copy: "Each finished piece is shown on a model in a photo shoot. Every shoot tells a small story about the clothes.",
    image:
      "https://github.com/Kbelony/DK-Shop/blob/main/src/assets/scss/IMG_7186.jpg?raw=true",
  },
];

export function BehindDoughSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);

  // Keep image and title in sync: closest step to the screen centre wins
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
    // Initial sync
    updateActiveFromScroll();

    return () => {
      if (frame !== null) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [activeIndex]);

  return (
    <section
      id="bakes"
      className="relative mt-[120px] lg:mt-[309px]"
    >
      <div className="mt-0 lg:grid lg:grid-cols-[233px_351px_1fr]">
        <div className="mb-6 lg:mb-0">
          <p className="font-dm text-xs uppercase text-greyLabel lg:sticky lg:top-[84px]">
            Behind the seams
          </p>
        </div>
        <div>
          {steps.map((step, index) => (
            <article
              key={step.title}
              ref={(el) => (itemRefs.current[index] = el)}
              className="pb-6 lg:pb-[316px]"
            >
              <h3 className="font-display relative inline-block text-[56px] leading-[1] lg:text-[128px]">
                {step.title}
                <sup className="absolute left-full top-0 ml-px text-xl leading-6">
                  {step.number}
                </sup>
              </h3>
              <p className="font-dm mt-10 text-2xl font-bold leading-[1.2] text-deep lg:mt-20">
                {step.label}
              </p>
              <p className="font-dm mt-3 text-base leading-[1.2] text-greyText">
                {step.copy}
              </p>
              <div className="mt-10 overflow-hidden lg:hidden">
                <SkeletonImage
                  src={step.image}
                  alt={step.title}
                  wrapperClassName="h-[218px] w-full sm:h-[360px]"
                  className="h-full w-full object-cover"
                />
              </div>
            </article>
          ))}
        </div>

        <div className="relative hidden pl-[112px] lg:block">
          <div className="sticky top-[104px] aspect-[696/422] w-full overflow-hidden">
            {steps.map((step, index) => (
              <SkeletonImage
                key={step.title}
                src={step.image}
                alt={step.title}
                wrapperClassName={`absolute inset-0 transition-opacity duration-300 ${
                  index === activeIndex ? "opacity-100" : "opacity-0"
                }`}
                className="h-full w-full object-cover object-[50%_30%]"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
