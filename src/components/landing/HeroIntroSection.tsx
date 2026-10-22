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
          Pour, make,
          <br /> bake, <span className="text-ember">share.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.1 }}
          className="font-dm text-xl font-bold leading-[1.2] text-deep lg:relative lg:top-[120px] lg:text-2xl lg:leading-[1.2]"
        >
          Nous travaillons en duo texte &amp; gestes : l&apos;un raconte
          l&apos;origine des grains, l&apos;autre surveille les flammes.
          Ensemble, on compose des moments simples, presque pauvres dans la
          forme, riches dans le goût.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease }}
        className="mt-10 overflow-hidden lg:mt-[64px]"
      >
        <img
          src="https://github.com/Kbelony/DK-Shop/blob/main/src/assets/scss/001_1U1A0815_DEBORA.jpg?raw=true"
          alt="Bakeat atelier"
          className="h-[218px] w-full object-cover sm:h-[400px] lg:h-[602px]"
        />
      </motion.div>
    </section>
  );
}
