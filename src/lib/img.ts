/** Maps a full-size photo URL (GitHub raw) to the resized WebP copies in /public/img. */
const slug = (url: string) => {
  const file = decodeURIComponent(url.split("?")[0].split("/").pop() ?? "");
  return file
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
};

const isPhoto = (url: string) =>
  /github(usercontent)?\.com\/Kbelony\/DK-Shop\//.test(url) &&
  /\.(jpe?g|png)(\?|$)/i.test(url);

/** One resized copy (800 or 1600 px wide). Other URLs are returned unchanged. */
export function photo(url: string, width: 800 | 1600 = 1600): string {
  return isPhoto(url) ? `/img/${slug(url)}-${width}.webp` : url;
}

/** srcSet with both sizes, or undefined for URLs we did not resize. */
export function photoSrcSet(url: string): string | undefined {
  return isPhoto(url)
    ? `${photo(url, 800)} 800w, ${photo(url, 1600)} 1600w`
    : undefined;
}
