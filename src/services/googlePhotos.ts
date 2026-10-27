import { mockGalleries } from "@/data/mockGalleries";

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

type AlbumPhoto = { src: string; width: number; height: number };
type AlbumResponse = {
  albums: { id: string; title: string; images: AlbumPhoto[] }[];
};

/** Google serves any size from the same base URL: add =w<width>. */
export function photoUrl(base: string, width: number) {
  return base.includes("=") ? base : `${base}=w${width}`;
}

let albumsPromise: Promise<Gallery[] | null> | null = null;

/**
 * Photos of the shared Google Photos albums, read through /api/albums.
 * Resolves to null when the endpoint is missing or fails, so callers fall
 * back to the static photos.
 */
export function fetchAlbums(): Promise<Gallery[] | null> {
  if (!albumsPromise) {
    albumsPromise = fetch("/api/albums")
      .then((res) => (res.ok ? (res.json() as Promise<AlbumResponse>) : null))
      .then((data) => {
        if (!data || !Array.isArray(data.albums) || data.albums.length === 0) return null;
        return data.albums.map((album) => ({
          id: album.id,
          title: album.title,
          images: album.images.map((img, i) => ({
            src: photoUrl(img.src, 1600),
            alt: `${album.title}, photo ${i + 1}`,
            width: img.width,
            height: img.height,
          })),
        }));
      })
      .catch(() => null);
  }
  return albumsPromise;
}

export async function fetchGallery(galleryId: string): Promise<Gallery | null> {
  if (!galleryId) return null;
  const albums = await fetchAlbums();
  const album = albums?.find((a) => a.id === galleryId);
  if (album) {
    // the first photo is the one shown on the homepage carousel
    return { ...album, images: album.images.slice(1) };
  }
  return mockGalleries[galleryId] || null;
}
