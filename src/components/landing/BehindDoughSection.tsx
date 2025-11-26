import { useState } from "react";
import { motion } from "framer-motion";

const steps = [
  {
    title: "Make",
    number: "01",
    label: "/Finest ingredients",
    copy:
      "At Bakeat, every creation starts with the finest ingredients and a passion for perfection. Our bakers carefully mix each batch with love, ensuring the perfect balance of flavors and textures. From the very first step, we pour our hearts into crafting something truly special.",
    image: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Bake",
    number: "02",
    label: "/Wood-fired balance",
    copy:
      "Les pains reposent sur pierre, les braises sont rassemblées d'un côté pour créer une chaleur douce qui caramélise la croûte sans brûler.",
    image: "https://images.unsplash.com/photo-1481391032119-d89fee407e44?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Eat",
    number: "03",
    label: "/Savor together",
    copy:
      "On sert chaud sur des tables communes avec beurre battu maison et confitures fermentées. Chaque service raconte une histoire.",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80",
  },
];

export function BehindDoughSection() {
  const [activeIndex, setActiveIndex] = useState(0);

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
        <div className="space-y-28">
          {steps.map((step, index) => (
            <motion.article
              key={step.title}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ amount: 0.6, once: false }}
              onViewportEnter={() => setActiveIndex(index)}
              className="space-y-6"
            >
              <div className="flex items-end gap-4">
                <h3
                  className="font-heading text-[6.5rem] font-extrabold leading-[0.9]"
                  style={{
                    fontFamily:
                      '"Inter Display", "Inter Display Placeholder", sans-serif',
                  }}
                >
                  {step.title}
                </h3>
                <span className="text-lg text-deep/50">{step.number}</span>
              </div>
              <p
                className="font-heading text-base uppercase tracking-[0.5em] text-deep/50"
                style={{
                  fontFamily: '"DM Sans","DM Sans Placeholder",sans-serif',
                }}
              >
                {step.label}
              </p>
              <p className="text-lg leading-relaxed text-deep/80 pb-40">
                {step.copy}
              </p>
              <div className="overflow-hidde border border-[#e1d7c8] lg:hidden">
                <img
                  src={step.image}
                  alt={step.title}
                  className="h-64 w-full object-cover"
                />
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      <div className="relative hidden lg:block">
        <div className="sticky top-32 h-[420px] overflow-hidden  border border-[#e1d7c8] shadow-lg">
          {steps.map((step, index) => (
            <motion.img
              key={step.title}
              src={step.image}
              alt={step.title}
              className="absolute inset-0 h-full w-full object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: index === activeIndex ? 1 : 0 }}
              transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
