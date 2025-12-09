import { useState, useEffect } from "react";
import { fetchGallery, type Gallery } from "@/services/googlePhotos";
import { mockGalleries } from "@/data/mockGalleries";

type UseGalleryResult = {
  gallery: Gallery | null;
  loading: boolean;
  error: string | null;
};

/**
 * Hook personnalisé pour récupérer une galerie
 * Essaie d'abord Google Photos, puis fallback sur les données mockées
 */
export function useGallery(galleryId: string | undefined): UseGalleryResult {
  const [gallery, setGallery] = useState<Gallery | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!galleryId) {
      setLoading(false);
      return;
    }

    const loadGallery = async () => {
      setLoading(true);
      setError(null);

      try {
        const localGallery = await fetchGallery(galleryId);
        if (localGallery) {
          setGallery(localGallery);
        } else {
          const mockGallery = mockGalleries[galleryId];
          setGallery(mockGallery ?? mockGalleries["gallery-1"] ?? null);
        }
      } catch (err) {
        console.error("Error loading gallery:", err);
        setError(err instanceof Error ? err.message : "Failed to load gallery");
        const mockGallery = mockGalleries[galleryId];
        setGallery(mockGallery ?? mockGalleries["gallery-1"] ?? null);
      } finally {
        setLoading(false);
      }
    };

    loadGallery();
  }, [galleryId]);

  return { gallery, loading, error };
}

