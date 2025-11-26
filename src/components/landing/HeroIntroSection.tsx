import { motion } from "framer-motion";

const heroVariants = {
  hidden: { opacity: 0, y: 32 },
  show: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: custom * 0.1, duration: 0.6, ease: [0.23, 1, 0.32, 1] },
  }),
};

export function HeroIntroSection() {
  return (
    <section className="space-y-16 pt-24">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,0.4fr)] lg:items-start">
        <div className="space-y-6">
          <motion.p
            variants={heroVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.7 }}
            custom={0}
            className="text-xs uppercase tracking-[0.65em] text-deep/60"
          >
            Behind the dough
          </motion.p>
          <motion.h1
            variants={heroVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.7 }}
            custom={1}
            className="text-[clamp(3.5rem,8vw,8rem)] font-extrabold leading-[0.95] tracking-[-4px] text-deep"
            style={{
              fontFamily:
                '"Inter Display", "Inter Display Placeholder", sans-serif',
            }}
          >
            Pour, make, bake, <span className="text-[#B0562B]">share.</span>
          </motion.h1>
        </div>
        <motion.div
          variants={heroVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.6 }}
          custom={2}
          className="max-w-sm text-[1.3rem] font-semibold leading-[1.2] text-[#141415] lg:ml-auto lg:pt-28"
          style={{ fontFamily: '"DM Sans","DM Sans Placeholder",sans-serif' }}
        >
          <p>
            Nous travaillons en duo texte &amp; gestes : l&apos;un raconte
            l&apos;origine des grains, l&apos;autre surveille les flammes.
            Ensemble, on compose des moments simples, presque pauvres dans la
            forme, riches dans le goût.
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        className="overflow-hidden border border-[#e1d7c8]"
      >
        <img
          src="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1800&q=80"
          alt="Bakeat atelier"
          className="h-[700px] w-full object-cover"
        />
      </motion.div>
    </section>
  );
}
