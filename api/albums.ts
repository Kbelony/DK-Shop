import type { VercelRequest, VercelResponse } from "@vercel/node";

/**
 * Reads public Google Photos shared albums (anonymously) and returns their
 * photos in album order. Google has no official API for this, so the page
 * format can change; the front end falls back to its static photos when this
 * answers with an error or no photos.
 *
 * ALBUM_SHARE_URLS (server-side env var only) is a JSON array:
 *   [{ "id": "gallery-1", "title": "Monica", "url": "https://photos.google.com/share/...?key=..." }]
 * The share links carry an access key, so they never reach the browser.
 */

type AlbumConfig = { id: string; title?: string; url: string };
type AlbumPhoto = { src: string; width: number; height: number; takenAt: number };
type Album = { id: string; title: string; images: AlbumPhoto[] };

// Albums with one of these names are not slides: their first photo fills one
// fixed spot on the page (the big photo under the headline, and the Dresses,
// Jackets and Pants photos in "Behind the seams").
const SLOT_NAMES = ["hero", "dresses", "jackets", "pants"];

const SHARE_HOST = "https://photos.google.com/share/";
const PHOTO_HOST = "https://lh3.googleusercontent.com/";

function isPhotoRecord(x: unknown): x is unknown[] {
  if (!Array.isArray(x) || x.length < 3) return false;
  const media = x[1];
  return (
    typeof x[0] === "string" &&
    x[0].startsWith("AF1Qip") &&
    Array.isArray(media) &&
    typeof media[0] === "string" &&
    media[0].startsWith(PHOTO_HOST) &&
    typeof media[1] === "number" &&
    typeof media[2] === "number" &&
    typeof x[2] === "number"
  );
}

function collect(node: unknown, out: unknown[][]) {
  if (isPhotoRecord(node)) {
    out.push(node);
    return;
  }
  if (Array.isArray(node)) for (const child of node) collect(child, out);
}

export function parseAlbumHtml(html: string): { title: string; images: AlbumPhoto[] } {
  const data = html.match(/AF_initDataCallback\(\{key: 'ds:1'[\s\S]*?data:([\s\S]*?), sideChannel/);
  if (!data) throw new Error("album data block not found");
  const records: unknown[][] = [];
  collect(JSON.parse(data[1]), records);
  const seen = new Set<string>();
  const images: AlbumPhoto[] = [];
  for (const r of records) {
    const id = r[0] as string;
    if (seen.has(id)) continue;
    seen.add(id);
    const media = r[1] as [string, number, number];
    images.push({ src: media[0], width: media[1], height: media[2], takenAt: r[2] as number });
  }
  const t = html.match(/<title>([^<]*)<\/title>/);
  const title = (t?.[1] ?? "").replace(/\s+-\s+Google Photos\s*$/, "").trim();
  return { title, images };
}

async function loadAlbum(cfg: AlbumConfig): Promise<Album> {
  if (!cfg.url.startsWith(SHARE_HOST)) throw new Error(`unexpected share URL for ${cfg.id}`);
  const res = await fetch(cfg.url, {
    headers: { "user-agent": "Mozilla/5.0 (compatible; DKShopAlbums/1.0)", "accept-language": "en" },
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`album ${cfg.id}: HTTP ${res.status}`);
  const { title, images } = parseAlbumHtml(await res.text());
  if (images.length === 0) throw new Error(`album ${cfg.id}: no photos found`);
  return { id: cfg.id, title: cfg.title || title || cfg.id, images };
}

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  let configs: AlbumConfig[] = [];
  try {
    configs = JSON.parse(process.env.ALBUM_SHARE_URLS ?? "[]");
  } catch {
    configs = [];
  }
  if (!Array.isArray(configs) || configs.length === 0) {
    res.status(404).json({ error: "no albums configured" });
    return;
  }
  const results = await Promise.allSettled(configs.map(loadAlbum));
  const loaded = results.flatMap((r) => (r.status === "fulfilled" ? [r.value] : []));
  const failed = results.length - loaded.length;
  const slots: Record<string, AlbumPhoto> = {};
  const albums: Album[] = [];
  for (const a of loaded) {
    const name = a.title.trim().toLowerCase();
    if (SLOT_NAMES.includes(name)) slots[name] = a.images[0];
    else albums.push(a);
  }
  if (loaded.length === 0) {
    res.status(502).json({ error: "could not read any album" });
    return;
  }
  // Cached at the edge for 1 minute; stale copy served for a day while it refreshes.
  res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=86400");
  res.status(200).json({ albums, slots, failed });
}
