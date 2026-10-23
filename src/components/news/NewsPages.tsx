import { useEffect } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { SkeletonImage } from "@/components/ui/skeleton-image";
import { Footer } from "@/components/landing/Footer";
import { news } from "@/data/news";

function useTopOnMount(key: string) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [key]);
}

// Same header as the gallery pages: BACK, small spaced label, big title
function PageHeader({
  backTo,
  title,
  small = false,
  children,
}: {
  backTo: string;
  title: string;
  small?: boolean;
  children?: React.ReactNode;
}) {
  const navigate = useNavigate();
  return (
    <header className="space-y-4">
      <div className="space-y-4">
        <button
          onClick={() => navigate(backTo)}
          className="group inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-deep/70 transition-colors hover:text-deep"
          data-cursor="focus"
          aria-label="Back"
        >
          <span className="transition-transform group-hover:-translate-x-1">←</span>
          Back
        </button>
        <p className="uppercase tracking-[0.3em] text-xs text-muted-foreground">
          News
        </p>
      </div>
      <h1
        className={`font-extrabold leading-[0.95] tracking-[-4px] text-deep ${
          small
            ? "text-[clamp(2.5rem,6vw,6rem)]"
            : "text-[clamp(3.5rem,8vw,8rem)]"
        }`}
        style={{
          fontFamily: '"Inter Display", "Inter Display Placeholder", sans-serif',
        }}
      >
        {title}
      </h1>
      {children}
    </header>
  );
}

export function NewsListPage() {
  useTopOnMount("list");
  return (
    <main className="mx-auto w-full px-4 pt-[76px] sm:px-6 lg:px-10">
      <PageHeader backTo="/" title="News">
        <p className="font-dm max-w-[560px] text-base leading-[1.2] text-greyText">
          News, updates and behind-the-scenes stories from the studio and the
          photo shoots.
        </p>
      </PageHeader>

      <div className="mt-10 grid gap-12 md:grid-cols-3 md:gap-10 lg:mt-12">
        {news.map((item, idx) => (
          <motion.div
            key={item.slug}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: (idx % 3) * 0.1, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          >
            <Link to={`/news/${item.slug}`} className="group block" data-cursor="focus">
              <div className="overflow-hidden">
                <div
                className="transform-gpu transition-transform will-change-transform group-hover:scale-[1.04]"
                style={{
                  transitionDuration: "1200ms",
                  transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
                }}
              >
                  <SkeletonImage
                    src={item.image}
                    alt={item.title}
                    wrapperClassName="aspect-[437/292] w-full"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
              <h2 className="font-display mt-6 text-xl leading-6">{item.title}</h2>
              <p className="font-dm mt-2 text-base leading-[1.2] text-greyText">
                {item.excerpt}
              </p>
            </Link>
          </motion.div>
        ))}
      </div>
      <Footer />
    </main>
  );
}

export function NewsArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  useTopOnMount(slug ?? "");
  const index = news.findIndex((n) => n.slug === slug);
  if (index < 0) return <Navigate to="/news" replace />;
  const item = news[index];
  const next = news[(index + 1) % news.length];

  return (
    <main className="mx-auto w-full px-4 pt-[76px] sm:px-6 lg:px-10">
      <PageHeader backTo="/news" title={item.title} small />

      <div className="mt-10 overflow-hidden lg:mt-12">
        <SkeletonImage
          src={item.image}
          alt={item.title}
          wrapperClassName="aspect-[4/3] w-full lg:aspect-[16/8]"
          className="h-full w-full object-cover"
        />
      </div>

      <div className="font-dm mt-10 max-w-[680px] space-y-5 text-xl leading-[1.3] text-deep lg:mt-16 lg:ml-[284px] lg:text-2xl">
        {item.body.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>

      <div className="mt-16 lg:ml-[284px]">
        <p className="font-dm text-xs uppercase text-greyLabel">Next</p>
        <Link
          to={`/news/${next.slug}`}
          className="font-display mt-2 block text-[28px] leading-[1.1] lg:text-5xl"
          data-cursor="focus"
        >
          {next.title}
        </Link>
      </div>
      <Footer />
    </main>
  );
}
