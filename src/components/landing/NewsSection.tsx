import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const articles = [
  {
    title: "Mountain rye flour joins the winter line-up",
    category: "Journal",
    date: "Nov 2025",
    image: "https://images.unsplash.com/photo-1517685352821-92cf88aee5a5?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Fermented viennoiserie workshop — new seats",
    category: "Agenda",
    date: "Dec 2025",
    image: "https://images.unsplash.com/photo-1481391032119-d89fee407e44?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Chef Minato residency for Saturday brunch",
    category: "Collab",
    date: "Jan 2026",
    image: "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?auto=format&fit=crop&w=1200&q=80",
  },
];

export function NewsSection() {
  return (
    <section className="space-y-12">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.6em] text-deep/50">News</p>
          <h2 className="mt-3 font-heading text-4xl leading-tight">News, updates &amp; oven-side notes</h2>
        </div>
        <div className="max-w-xl text-base text-deep/70">
          News, updates, behind-the-scenes stories. Fresh snippets tout droit sortis du four et des carnets de nos artisans.
        </div>
        <Button
          variant="ghost"
          className="self-start rounded-full px-6 py-4 text-sm font-heading uppercase tracking-[0.3em]"
          data-cursor="focus"
        >
          View all
        </Button>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article, idx) => (
          <motion.div
            key={article.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: idx * 0.1, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          >
            <Card className="group h-full overflow-hidden border border-[#e1d7c8] bg-sand/40 shadow-none transition duration-500 hover:-translate-y-2 hover:shadow-xl">
              <CardHeader className="relative p-0">
                <img src={article.image} alt={article.title} className="h-64 w-full object-cover transition duration-700 group-hover:scale-105" />
                <span className="absolute right-4 top-4 rounded-full bg-white/80 px-4 py-1 text-xs uppercase tracking-[0.3em] text-deep">
                  {article.category}
                </span>
              </CardHeader>
              <CardContent className="space-y-3 p-6">
                <div className="text-xs uppercase tracking-[0.4em] text-deep/50">{article.date}</div>
                <h3 className="font-heading text-2xl leading-tight">{article.title}</h3>
                <Button variant="link" className="px-0 text-ember" data-cursor="focus">
                  Lire →
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

