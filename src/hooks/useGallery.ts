import { useState, useEffect } from "react";
import {
  fetchGalleryFromGooglePhotos,
  // fetchGalleryFromGooglePhotos, // Décommentez quand vous activez Google Photos
  type Gallery,
} from "@/services/googlePhotos";
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
        // Option 1: Essayer de récupérer depuis Google Photos
        // Décommentez cette ligne quand vous avez configuré le backend
        const googlePhotosGallery = await fetchGalleryFromGooglePhotos(galleryId);
        
        // Pour l'instant, on utilise directement les données mockées
        //const googlePhotosGallery = null;

        if (googlePhotosGallery) {
          setGallery(googlePhotosGallery);
        } else {
          // Fallback: Utiliser les données mockées
          const mockGallery = mockGalleries[galleryId];
          if (mockGallery) {
            setGallery(mockGallery);
          } else {
            // Fallback final: utiliser gallery-1
            setGallery(mockGalleries["gallery-1"] || null);
          }
        }
      } catch (err) {
        console.error("Error loading gallery:", err);
        setError(err instanceof Error ? err.message : "Failed to load gallery");
        
        // En cas d'erreur, utiliser les données mockées
        const mockGallery = mockGalleries[galleryId];
        if (mockGallery) {
          setGallery(mockGallery);
        } else {
          setGallery(mockGalleries["gallery-1"] || null);
        }
      } finally {
        setLoading(false);
      }
    };

    loadGallery();
  }, [galleryId]);

  return { gallery, loading, error };
}

