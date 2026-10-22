import { motion } from "framer-motion";

const articles = [
  {
    title: "Mountain rye flour joins the winter line-up",
    image:
      "https://images.unsplash.com/photo-1517685352821-92cf88aee5a5?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Fermented viennoiserie workshop — new seats",
    image:
      "https://images.unsplash.com/photo-1481391032119-d89fee407e44?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Chef Minato residency for Saturday brunch",
    image:
      "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?auto=format&fit=crop&w=1200&q=80",
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
            News, updates, behind-the-scenes stories. Fresh snippets tout droit
            sortis du four et des carnets de nos artisans.
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
              <img
                src={article.image}
                alt={article.title}
                className="aspect-[437/292] w-full object-cover transition duration-700 group-hover:scale-105"
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
