import { motion } from "framer-motion";

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

export function ArtisansSection() {
  return (
    <section className="space-y-10">
      <div className="flex flex-col gap-3">
        <p className="uppercase tracking-[0.3em] text-xs text-muted-foreground">Our artisans</p>
        <h2 className="font-heading text-4xl">Les mains qui nourrissent la chaleur</h2>
      </div>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {artisans.map((artisan, index) => (
          <motion.article
            key={artisan.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0, transition: { delay: index * 0.1 }}}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <div className="overflow-hidden rounded-3xl border border-[#e2d5c3]">
              <img src={artisan.img} alt={artisan.name} className="h-80 w-full object-cover" />
            </div>
            <div>
              <p className="font-heading text-2xl">{artisan.name}</p>
              <p className="text-sm uppercase tracking-wide text-muted-foreground">{artisan.role}</p>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
