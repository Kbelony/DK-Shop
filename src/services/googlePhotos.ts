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

import { mockGalleries } from "@/data/mockGalleries";

// Service simplifié : on ne dépend plus de Google Photos.
export async function fetchGallery(
  galleryId: string
): Promise<Gallery | null> {
  if (!galleryId) return null;
  return mockGalleries[galleryId] || null;
}

