import { SkeletonImage } from "@/components/ui/skeleton-image";
import { motion } from "framer-motion";

const articles = [
  {
    title: "New collection in progress",
    image:
      "https://github.com/Kbelony/DK-Shop/blob/main/src/assets/scss/_DSC1423.jpg?raw=true",
  },
  {
    title: "Behind the scenes of the latest photo shoot",
    image:
      "https://github.com/Kbelony/DK-Shop/blob/main/src/assets/scss/057_1U1A1561_DEBORA.jpg?raw=true",
  },
  {
    title: "Fitting day with the models",
    image:
      "https://github.com/Kbelony/DK-Shop/blob/main/src/assets/scss/MB_Monica-366.jpeg?raw=true",
  },
];

export function NewsSection() {
  return (
    <section id="news" className="pt-[100px] lg:pt-[200px]">
      <div className="grid gap-6 lg:grid-cols-[1fr_368px] lg:items-start lg:gap-0">
        <h2 className="font-display text-[56px] leading-[1] lg:text-[128px]">
          News
        </h2>
        <div className="font-dm lg:pt-[15px]">
          <p className="text-base leading-[1.2] text-greyText">
            News, updates and behind-the-scenes stories from the studio and the photo shoots.
          </p>
          <button
            className="mt-7 rounded-full bg-ember px-8 py-3 text-base font-bold text-white transition-opacity hover:opacity-90"
            data-cursor="focus"
          >
            View All
          </button>
        </div>
      </div>

      <div className="mt-[52px] grid gap-12 md:grid-cols-3 md:gap-10 lg:mt-16">
        {articles.map((article, idx) => (
          <motion.a
            href="#news"
            key={article.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: idx * 0.1, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            className="group block"
            data-cursor="focus"
          >
            <div className="overflow-hidden">
              <SkeletonImage
                src={article.image}
                alt={article.title}
                wrapperClassName="aspect-[437/292] w-full"
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
            </div>
            <h3 className="font-display mt-6 text-xl leading-6">
              {article.title}
            </h3>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
