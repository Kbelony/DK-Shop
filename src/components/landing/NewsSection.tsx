import { SkeletonImage } from "@/components/ui/skeleton-image";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { news } from "@/data/news";

const articles = news;

export function NewsSection() {
  return (
    <section id="news" className="pt-[64px] lg:pt-[96px]">
      <div className="grid gap-6 lg:grid-cols-[1fr_368px] lg:items-start lg:gap-0">
        <h2 className="font-display text-[56px] leading-[1] lg:text-[128px]">
          News
        </h2>
        <div className="font-dm lg:pt-[15px]">
          <p className="text-base leading-[1.2] text-greyText">
            News, updates and behind-the-scenes stories from the studio and the photo shoots.
          </p>
          <Link
            to="/news"
            className="mt-7 inline-block rounded-full bg-ember px-8 py-3 text-base font-bold text-white transition-opacity hover:opacity-90"
            data-cursor="focus"
          >
            View All
          </Link>
        </div>
      </div>

      <div className="mt-[52px] grid gap-12 md:grid-cols-3 md:gap-10 lg:mt-16">
        {articles.map((article, idx) => (
          <motion.div
            key={article.slug}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: idx * 0.1, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          >
            <Link
              to={`/news/${article.slug}`}
              className="group block"
              data-cursor="focus"
            >
            <div className="overflow-hidden">
              <div
                className="transform-gpu transition-transform will-change-transform group-hover:scale-[1.04]"
                style={{
                  transitionDuration: "1200ms",
                  transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
                }}
              >
                <SkeletonImage
                  src={article.image}
                  alt={article.title}
                  wrapperClassName="aspect-[437/292] w-full"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            <h3 className="font-display mt-6 text-xl leading-6">
              {article.title}
            </h3>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
