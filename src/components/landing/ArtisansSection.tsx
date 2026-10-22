import { motion } from "framer-motion";

const artisans = [
  {
    name: "Lucie Perrin",
    img: "https://github.com/Kbelony/DK-Shop/blob/main/src/assets/scss/IMG_7186.jpg?raw=true",
  },
  {
    name: "Elliot Marchand",
    img: "https://github.com/Kbelony/DK-Shop/blob/main/src/assets/scss/016_1U1A0977_DEBORA_Original.jpg?raw=true",
  },
  {
    name: "Sana Roussel",
    img: "https://github.com/Kbelony/DK-Shop/blob/main/src/assets/scss/_DSC1423.jpg?raw=true",
  },
  {
    name: "Artisan 4",
    img: "https://github.com/Kbelony/DK-Shop/blob/main/src/assets/scss/057_1U1A1561_DEBORA.jpg?raw=true",
  },
  {
    name: "Artisan 5",
    img: "https://github.com/Kbelony/DK-Shop/blob/main/src/assets/scss/MB_Monica-366.jpeg?raw=true",
  },
  {
    name: "Artisan 6",
    img: "https://github.com/Kbelony/DK-Shop/blob/main/src/assets/scss/009_1U1A0904_DEBORA_Original.jpg?raw=true",
  },
];

const ease = [0.23, 1, 0.32, 1] as const;

export function ArtisansSection() {
  const names = artisans.map((a) => a.name);
  return (
    <section id="about" className="pt-[120px] lg:pt-[200px]">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7, ease }}
        className="text-center"
      >
        <h2 className="font-display text-[56px] leading-[1] lg:text-[128px]">
          Our Artisans
        </h2>
        <p className="font-dm mx-auto mt-6 max-w-[700px] text-base leading-[1.2] text-greyText lg:mt-8">
          Les mains qui nourrissent la chaleur : des gestes lents, du temps et
          beaucoup de passion, du premier pétrissage jusqu&apos;à la dernière
          fournée.
        </p>
      </motion.div>

      <div className="relative mt-10 lg:mt-[99px]">
        <div className="mx-auto w-full max-w-[684px] overflow-hidden">
          <img
            src={artisans[0].img}
            alt={artisans[0].name}
            className="h-[190px] w-full object-cover sm:h-[300px] lg:h-[364px]"
          />
        </div>
        <p className="font-dm mt-4 max-w-[200px] text-xs uppercase leading-[1.2] text-greyText lg:absolute lg:left-0 lg:top-[168px] lg:mt-0">
          &quot;True craftsmanship is tasted in every bite.&quot;
        </p>
        <p className="font-dm mt-4 max-w-[210px] text-xs uppercase leading-[1.2] text-greyText lg:absolute lg:right-0 lg:top-[168px] lg:mt-0 lg:text-right">
          &quot;Baking is our love language, we&apos;d love to share with you
          &lt;3&quot;
        </p>
      </div>

      {/* names marquee */}
      <div className="-mx-4 mt-[60px] overflow-hidden md:-mx-6 lg:mt-[126px]">
        <div className="marquee-track" style={{ animationDuration: "50s" }}>
          {[0, 1].map((k) => (
            <p
              key={k}
              className="font-display flex shrink-0 gap-6 whitespace-nowrap pr-6 text-5xl leading-[1]"
            >
              {names.concat(names).map((n, i) => (
                <span key={i} className="flex gap-6">
                  {n}
                  <span aria-hidden>•</span>
                </span>
              ))}
            </p>
          ))}
        </div>
      </div>

      {/* photo strip */}
      <div className="-mx-4 mt-[120px] overflow-hidden md:-mx-6 lg:mt-[296px]">
        <div className="marquee-track" style={{ animationDuration: "60s" }}>
          {[0, 1].map((k) => (
            <div key={k} className="flex shrink-0 gap-4 pr-4">
              {artisans.map((a) => (
                <img
                  key={a.name}
                  src={a.img}
                  alt={a.name}
                  className="h-[338px] w-[316px] shrink-0 object-cover lg:h-[360px] lg:w-[338px]"
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
