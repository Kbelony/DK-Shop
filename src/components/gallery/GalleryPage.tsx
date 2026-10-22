import { SkeletonImage } from "@/components/ui/skeleton-image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useGallery } from "@/hooks/useGallery";
import { ImageLightbox } from "./ImageLightbox";

export function GalleryPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { gallery, loading, error } = useGallery(id);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  // keep the last photo on screen while the lightbox plays its closing animation
  const lastIndex = useRef(0);
  if (lightboxIndex !== null) lastIndex.current = lightboxIndex;

  // Scroll en haut de la page au chargement - plusieurs méthodes pour être sûr
  useLayoutEffect(() => {
    // Force le scroll immédiatement
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [id]);

  useEffect(() => {
    // Double vérification après un court délai pour gérer Lenis
    const timeoutId = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;

      // Essayer aussi avec Lenis si disponible (via window)
      const win = window as Window & {
        lenis?: {
          scrollTo: (value: number, options?: { immediate?: boolean }) => void;
        };
      };
      if (win.lenis && typeof win.lenis.scrollTo === "function") {
        win.lenis.scrollTo(0, { immediate: true });
      }
    }, 0);

    // Une dernière vérification après le rendu complet
    const timeoutId2 = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(timeoutId2);
    };
  }, [id]);

  return (
    <main className="min-h-screen bg-sand text-deep">
      {/* En-tête avec le même padding que la homepage */}
      <section className="mx-auto w-full px-4 sm:px-6 lg:px-10 pt-[76px] pb-10 space-y-6">
        <header className="space-y-4">
          <div className="space-y-4">
            <button
              onClick={() => navigate("/")}
              className="group inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-deep/70 transition-colors hover:text-deep"
              data-cursor="focus"
              aria-label="Back to home"
            >
              <span className="transition-transform group-hover:translate-x-1">
                ←
              </span>
              Back
            </button>
            <p className="uppercase tracking-[0.3em] text-xs text-muted-foreground">
              Gallery
            </p>
          </div>
          <h1
            className="text-[clamp(3.5rem,8vw,8rem)] font-extrabold leading-[0.95] tracking-[-4px] text-deep"
            style={{
              fontFamily:
                '"Inter Display", "Inter Display Placeholder", sans-serif',
            }}
          >
            {gallery?.title || "Gallery"}
          </h1>
          {error && (
            <p className="max-w-2xl text-sm text-red-600">
              Error while loading: {error}
            </p>
          )}
        </header>
      </section>

      {/* Images avec le même padding que la homepage */}
      {loading && (
        <section className="mx-auto w-full px-4 sm:px-6 lg:px-10 pb-24">
          <div className="space-y-10" aria-busy="true" aria-label="Loading photos">
            <div className="img-shimmer aspect-[3/2] w-full" />
            <div className="grid gap-4 md:grid-cols-2">
              <div className="img-shimmer aspect-[3/4] w-full" />
              <div className="img-shimmer aspect-[4/5] w-full" />
            </div>
            <div className="img-shimmer aspect-[16/10] w-full" />
            <div className="grid gap-4 md:grid-cols-2">
              <div className="img-shimmer aspect-[4/5] w-full" />
              <div className="img-shimmer aspect-[3/4] w-full" />
            </div>
            <div className="img-shimmer aspect-[3/2] w-full" />
            <div className="grid gap-4 md:grid-cols-2">
              <div className="img-shimmer aspect-[3/4] w-full" />
              <div className="img-shimmer aspect-[1/1] w-full" />
            </div>
          </div>
        </section>
      )}

      {!loading && gallery && (
        <section className="mx-auto w-full px-4 sm:px-6 lg:px-10 pb-24 space-y-10">
          {gallery.images.map((image, index) => {
            // Pattern répétitif: 1 image seule, puis 2 côte à côte, puis 1, puis 2, etc.
            // Index 0, 3, 6, 9... = image seule
            // Index 1-2, 4-5, 7-8... = 2 images côte à côte
            const isSingleImage = index % 3 === 0;
            const isFirstOfPair = index % 3 === 1;
            const isSecondOfPair = index % 3 === 2;

            // Si c'est la première d'une paire, on crée le conteneur pour les 2
            if (isFirstOfPair) {
              const pairImages = gallery.images.slice(index, index + 2);
              return (
                <div key={`pair-${index}`} className="grid gap-4 md:grid-cols-2">
                  {pairImages.map((pairImage, pairIndex) => (
                    <motion.div
                      key={pairImage.src}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.4 }}
                      transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                      className="overflow-hidden cursor-pointer"
                      onClick={() => setLightboxIndex(index + pairIndex)}
                    >
                      <SkeletonImage
                        src={pairImage.src}
                        alt={pairImage.alt}
                        wrapperClassName="w-full"
                        placeholderClassName={
                          (index + pairIndex) % 2 === 0
                            ? "aspect-[3/4]"
                            : "aspect-[4/5]"
                        }
                        className="w-full h-auto object-contain"
                      />
                    </motion.div>
                  ))}
                </div>
              );
            }

            // Si c'est la seconde d'une paire, on skip (déjà géré ci-dessus)
            if (isSecondOfPair) {
              return null;
            }

            // Image seule
            if (isSingleImage) {
              return (
                <motion.div
                  key={image.src}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
                  className="overflow-hidden cursor-pointer"
                  onClick={() => setLightboxIndex(index)}
                >
                  <SkeletonImage
                    src={image.src}
                    alt={image.alt}
                    wrapperClassName="w-full"
                    placeholderClassName="aspect-[3/2]"
                    className="w-full h-auto object-contain"
                  />
                </motion.div>
              );
            }

            return null;
          })}
        </section>
      )}

      {!loading && !gallery && (
        <section className="mx-auto w-full px-4 sm:px-6 lg:px-10 pb-24">
          <div className="flex items-center justify-center h-96">
            <p className="text-muted-foreground">No gallery found</p>
          </div>
        </section>
      )}

      {/* Lightbox */}
      {gallery && (
        <ImageLightbox
          images={gallery.images}
          currentIndex={lightboxIndex ?? lastIndex.current}
          isOpen={lightboxIndex !== null}
          onClose={() => setLightboxIndex(null)}
          onNext={() =>
            setLightboxIndex((prev) =>
              prev !== null ? (prev + 1) % gallery.images.length : null
            )
          }
          onPrevious={() =>
            setLightboxIndex((prev) =>
              prev !== null
                ? (prev - 1 + gallery.images.length) % gallery.images.length
                : null
            )
          }
        />
      )}
    </main>
  );
}
