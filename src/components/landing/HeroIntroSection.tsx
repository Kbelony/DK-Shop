import { SkeletonImage } from "@/components/ui/skeleton-image";
import { motion } from "framer-motion";

const ease = [0.23, 1, 0.32, 1] as const;

export function HeroIntroSection() {
  return (
    <section id="top" className="pt-[88px] md:pt-[100px]">
      <div className="grid gap-6 lg:grid-cols-[1fr_348px] lg:items-start lg:gap-0">
        <motion.h1
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease }}
          className="font-display text-[68px] leading-[1] tracking-[-4px] text-deep sm:text-[110px] lg:text-[150px]"
        >
          Cut it, sew it,
          <br /> <span className="text-ember">wear it.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.1 }}
          className="font-dm text-xl font-bold leading-[1.2] text-deep lg:relative lg:top-[120px] lg:text-2xl lg:leading-[1.2]"
        >
          Every piece is designed, cut and sewn by one maker. Simple shapes, careful finishing, and photo shoots where real models wear the clothes.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease }}
        className="mt-10 overflow-hidden lg:mt-[64px]"
      >
        <SkeletonImage
          src="https://github.com/Kbelony/DK-Shop/blob/main/src/assets/scss/001_1U1A0815_DEBORA.jpg?raw=true"
          alt="Model wearing a handmade piece"
          wrapperClassName="h-[218px] w-full sm:h-[400px] lg:h-[602px]"
          className="h-full w-full object-cover"
        />
      </motion.div>
    </section>
  );
}
