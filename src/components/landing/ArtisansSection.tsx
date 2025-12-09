import { motion } from "framer-motion";
import { useState } from "react";

const artisans = [
  {
    name: "Lucie Perrin",
    role: "Cheffe boulangère",
    img: "https://github.com/Kbelony/DK-Shop/blob/main/src/assets/scss/018_1U1A0987_DEBORA_Original.jpg?raw=true",
  },
  {
    name: "Elliot Marchand",
    role: "Maître torréfacteur",
    img: "https://github.com/Kbelony/DK-Shop/blob/main/src/assets/scss/016_1U1A0977_DEBORA_Original.jpg?raw=true",
  },
  {
    name: "Sana Roussel",
    role: "Fermentation & R&D",
    img: "https://github.com/Kbelony/DK-Shop/blob/main/src/assets/scss/_DSC1423.jpg?raw=true",
  },
];

interface ArtisanCardProps {
  artisan: {
    name: string;
    role: string;
    img: string;
  };
  index: number;
}

function ArtisanCard({ artisan, index }: ArtisanCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.article
      key={artisan.name}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0, transition: { delay: index * 0.1 } }}
      viewport={{ once: true }}
      className="space-y-4"
    >
      <div
        className="group relative overflow-hidden rounded-3xl border border-[#e2d5c3] cursor-pointer bg-gray-100"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Background avec blur */}
        <img
          src={artisan.img}
          alt=""
          className="absolute inset-0 w-full h-full object-cover blur-3xl opacity-40 scale-110 z-0"
          aria-hidden="true"
        />
        <motion.img
          src={artisan.img}
          alt={artisan.name}
          className="relative w-full h-auto object-contain z-10"
          animate={{
            scale: isHovered ? 1.1 : 1,
          }}
          transition={{
            duration: 0.5,
            ease: [0.25, 0.1, 0.25, 1],
          }}
        />
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-black/40 z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.button
            className="rounded-full bg-white px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-deep shadow-lg transition-colors hover:bg-deep hover:text-white"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{
              scale: isHovered ? 1 : 0.8,
              opacity: isHovered ? 1 : 0,
            }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            See more
          </motion.button>
        </motion.div>
      </div>
      <div>
        <p className="font-heading text-2xl">{artisan.name}</p>
        <p className="text-sm uppercase tracking-wide text-muted-foreground">
          {artisan.role}
        </p>
      </div>
    </motion.article>
  );
}

export function ArtisansSection() {
  return (
    <section className="space-y-10">
      <div className="flex flex-col gap-3">
        <p className="uppercase tracking-[0.3em] text-xs text-muted-foreground">
          Our artisans
        </p>
        <h2 className="font-heading text-4xl">
          Les mains qui nourrissent la chaleur
        </h2>
      </div>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {artisans.map((artisan, index) => (
          <ArtisanCard key={artisan.name} artisan={artisan} index={index} />
        ))}
      </div>
    </section>
  );
}
