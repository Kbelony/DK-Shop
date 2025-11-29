/**
 * Service pour gérer les appels à Google Photos
 * 
 * IMPORTANT: Google Photos nécessite une authentification OAuth et un backend
 * pour accéder à l'API. Ce service est structuré pour être branché sur un backend.
 * 
 * Options:
 * 1. Créer un backend (Node.js/Express) qui appelle l'API Google Photos
 * 2. Utiliser un service proxy/backendless comme Firebase Functions
 * 3. Utiliser une méthode alternative (scraping, mais fragile et non recommandé)
 */

export type GalleryImage = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
};

export type Gallery = {
  id: string;
  title: string;
  images: GalleryImage[];
};

/**
 * Configuration des albums Google Photos
 * Mappe les IDs de galerie vers les IDs d'albums Google Photos
 * 
 * IMPORTANT: Ce ne sont PAS les liens de partage (photos.app.goo.gl)
 * Ce sont les vrais albumId de l'API Google Photos
 * 
 * Pour obtenir les vrais IDs:
 * 1. Authentifiez-vous: /api/auth/login
 * 2. Listez vos albums: /api/albums/list
 * 3. Copiez les "id" de la réponse et collez-les ici
 */
export const GOOGLE_PHOTOS_ALBUM_MAP: Record<string, string> = {
  "gallery-1": "", // Remplacez par le vrai albumId (ex: "AF1QipOJqJff-5owDQSggspJeUWJAxH9t9DYwVckl3JNob1vdX7N1mwiXjFnSMumAeaehQ")
  "gallery-2": "",
  "gallery-3": "",
  "gallery-4": "",
  "gallery-5": "",
};

/**
 * URL de l'API backend
 * En production, utilisez l'URL complète de Vercel
 * En développement, utilisez le chemin relatif pour que Vite proxy vers l'API
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api/gallery";

/**
 * Parse un lien de partage Google Photos pour extraire l'albumId
 * Note: Cette méthode est fragile et peut ne pas fonctionner pour tous les formats
 */
export function parseGooglePhotosShareLink(shareLink: string): string | null {
  try {
    // Le format peut varier, cette regex est une approximation
    const match = shareLink.match(/\/share\/([A-Za-z0-9_-]+)/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

/**
 * Récupère les images d'un album Google Photos via le backend
 */
export async function fetchGooglePhotosAlbum(
  albumId: string
): Promise<GalleryImage[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/${albumId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch album: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Format attendu depuis le backend:
    // { images: [{ src: string, alt: string, width?: number, height?: number }] }
    return data.images || [];
  } catch (error) {
    console.error("Error fetching Google Photos album:", error);
    throw error;
  }
}

/**
 * Récupère une galerie complète (titre + images) depuis Google Photos
 */
export async function fetchGalleryFromGooglePhotos(
  galleryId: string
): Promise<Gallery | null> {
  const albumId = GOOGLE_PHOTOS_ALBUM_MAP[galleryId];
  
  if (!albumId) {
    console.warn(`No Google Photos album ID mapped for gallery: ${galleryId}`);
    return null;
  }

  try {
    const images = await fetchGooglePhotosAlbum(albumId);
    
    return {
      id: galleryId,
      title: `Gallery ${galleryId.replace("gallery-", "")}`, // Ou récupérer depuis l'API
      images,
    };
  } catch (error) {
    console.error(`Error fetching gallery ${galleryId}:`, error);
    return null;
  }
}

/**
 * Méthode alternative: Extraire les images depuis un lien de partage (non recommandé)
 * Cette méthode est fragile et peut casser si Google change le format
 * Utilisez uniquement comme fallback de dernier recours
 */
export async function extractImagesFromShareLink(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _shareLink: string
): Promise<GalleryImage[]> {
  // Cette méthode nécessiterait un backend qui fait du scraping
  // ou une solution CORS proxy, ce qui n'est pas recommandé
  console.warn("extractImagesFromShareLink is not implemented. Use a backend with Google Photos API instead.");
  return [];
}

