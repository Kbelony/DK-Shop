import { useMemo, useEffect, useLayoutEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

type GalleryImage = {
  src: string;
  alt: string;
};

const mockGalleries: Record<string, { title: string; images: GalleryImage[] }> =
  {
    "gallery-1": {
      title: "Ancient Grain Fields",
      images: [
        {
          src: "https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=1600&q=80",
          alt: "Champs de blé anciens",
        },
        {
          src: "https://github.com/Kbelony/DK-Shop/blob/main/src/assets/scss/024_1U1A1138_DEBORA.jpg?raw=true",
          alt: "Pain sorti du four",
        },
        {
          src: "https://github.com/Kbelony/DK-Shop/blob/main/src/assets/scss/012_1U1A0932_DEBORA.jpg?raw=true",
          alt: "Préparation de la pâte",
        },
        {
          src: "https://github.com/Kbelony/DK-Shop/blob/main/src/assets/scss/001_1U1A0815_DEBORA.jpg?raw=true",
          alt: "Atelier Bakeat",
        },
      ],
    },
    "gallery-2": {
      title: "Wood-Fired Ovens",
      images: [
        {
          src: "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?auto=format&fit=crop&w=1600&q=80",
          alt: "Four à bois",
        },
        {
          src: "https://github.com/Kbelony/DK-Shop/blob/main/src/assets/scss/024_1U1A1138_DEBORA.jpg?raw=true",
          alt: "Pain sorti du four",
        },
        {
          src: "https://github.com/Kbelony/DK-Shop/blob/main/src/assets/scss/012_1U1A0932_DEBORA.jpg?raw=true",
          alt: "Préparation de la pâte",
        },
        {
          src: "https://github.com/Kbelony/DK-Shop/blob/main/src/assets/scss/001_1U1A0815_DEBORA.jpg?raw=true",
          alt: "Atelier Bakeat",
        },
      ],
    },
    "gallery-3": {
      title: "The Tasting Room",
      images: [
        {
          src: "https://github.com/Kbelony/DK-Shop/blob/main/src/assets/scss/024_1U1A1138_DEBORA.jpg?raw=true",
          alt: "Pain sorti du four",
        },
        {
          src: "https://github.com/Kbelony/DK-Shop/blob/main/src/assets/scss/012_1U1A0932_DEBORA.jpg?raw=true",
          alt: "Préparation de la pâte",
        },
        {
          src: "https://github.com/Kbelony/DK-Shop/blob/main/src/assets/scss/001_1U1A0815_DEBORA.jpg?raw=true",
          alt: "Atelier Bakeat",
        },
        {
          src: "https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=1600&q=80",
          alt: "Champs de blé anciens",
        },
      ],
    },
    "gallery-4": {
      title: "Hands Mixing Ingredients",
      images: [
        {
          src: "https://github.com/Kbelony/DK-Shop/blob/main/src/assets/scss/012_1U1A0932_DEBORA.jpg?raw=true",
          alt: "Préparation de la pâte",
        },
        {
          src: "https://github.com/Kbelony/DK-Shop/blob/main/src/assets/scss/024_1U1A1138_DEBORA.jpg?raw=true",
          alt: "Pain sorti du four",
        },
        {
          src: "https://github.com/Kbelony/DK-Shop/blob/main/src/assets/scss/001_1U1A0815_DEBORA.jpg?raw=true",
          alt: "Atelier Bakeat",
        },
        {
          src: "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?auto=format&fit=crop&w=1600&q=80",
          alt: "Four à bois",
        },
      ],
    },
    "gallery-5": {
      title: "Fresh Loaves Cooling",
      images: [
        {
          src: "https://images.unsplash.com/photo-1481391032119-d89fee407e44?auto=format&fit=crop&w=1600&q=80",
          alt: "Pains frais sur grille",
        },
        {
          src: "https://github.com/Kbelony/DK-Shop/blob/main/src/assets/scss/024_1U1A1138_DEBORA.jpg?raw=true",
          alt: "Pain sorti du four",
        },
        {
          src: "https://github.com/Kbelony/DK-Shop/blob/main/src/assets/scss/012_1U1A0932_DEBORA.jpg?raw=true",
          alt: "Préparation de la pâte",
        },
        {
          src: "https://github.com/Kbelony/DK-Shop/blob/main/src/assets/scss/001_1U1A0815_DEBORA.jpg?raw=true",
          alt: "Atelier Bakeat",
        },
      ],
    },
    // Fallback pour compatibilité
    origin: {
      title: "Sourdough Origins",
      images: [
        {
          src: "https://github.com/Kbelony/DK-Shop/blob/main/src/assets/scss/024_1U1A1138_DEBORA.jpg?raw=true",
          alt: "Pain sorti du four",
        },
        {
          src: "https://github.com/Kbelony/DK-Shop/blob/main/src/assets/scss/012_1U1A0932_DEBORA.jpg?raw=true",
          alt: "Préparation de la pâte",
        },
        {
          src: "https://github.com/Kbelony/DK-Shop/blob/main/src/assets/scss/001_1U1A0815_DEBORA.jpg?raw=true",
          alt: "Atelier Bakeat",
        },
        {
          src: "https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=1600&q=80",
          alt: "Champs de blé anciens",
        },
      ],
    },
  };

export function GalleryPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const gallery = useMemo(() => {
    if (id && mockGalleries[id]) return mockGalleries[id];
    // Fallback vers gallery-1 si l'ID n'existe pas
    return mockGalleries["gallery-1"] || mockGalleries.origin;
  }, [id]);

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
      {/* En-tête proche du bord, comme sur le template */}
      <section className="mx-auto max-w-6xl px-4 sm:px-8 pt-24 pb-10 space-y-6">
        <header className="space-y-4">
          <div className="space-y-4">
            <button
              onClick={() => navigate("/")}
              className="group inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-deep/70 transition-colors hover:text-deep"
              data-cursor="focus"
              aria-label="Retour à l'accueil"
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
            {gallery.title}
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Cette galerie est alimentée par un jeu de données mocké. Plus tard,
            elle pourra être reliée à un album Google Photos via une API ou un
            backend dédié.
          </p>
        </header>
      </section>

      {/* Images full-width en desktop, sans padding */}
      <section className="mx-auto max-w-6xl px-2 sm:px-4 lg:px-0 pb-24 space-y-10">
        {/* 1. Grande image plein largeur */}
        {gallery.images[0] && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
            className="overflow-hidden"
          >
            <img
              src={gallery.images[0].src}
              alt={gallery.images[0].alt}
              className="h-[560px] w-full object-cover"
            />
          </motion.div>
        )}

        {/* 2. Deux images verticales côte à côte */}
        {(gallery.images[1] || gallery.images[2]) && (
          <div className="grid gap-4 md:grid-cols-2">
            {gallery.images.slice(1, 3).map((image) => (
              <motion.div
                key={image.src}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                className="overflow-hidden"
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="h-[520px] w-full object-cover"
                />
              </motion.div>
            ))}
          </div>
        )}

        {/* 3. Dernière image large en bas */}
        {gallery.images[3] && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            className="overflow-hidden"
          >
            <img
              src={gallery.images[3].src}
              alt={gallery.images[3].alt}
              className="h-[460px] w-full object-cover"
            />
          </motion.div>
        )}
      </section>
    </main>
  );
}


