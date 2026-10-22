export interface NewsItem {
  slug: string;
  title: string;
  image: string;
  excerpt: string;
  body: string[];
}

const img = (name: string) =>
  `https://github.com/Kbelony/DK-Shop/blob/main/src/assets/scss/${name}?raw=true`;

// Placeholder articles. Deborah will replace the titles and texts with her own.
export const news: NewsItem[] = [
  {
    slug: "new-collection-in-progress",
    title: "New collection in progress",
    image: img("_DSC1423.jpg"),
    excerpt: "A first look at the pieces on the table right now.",
    body: [
      "This is a placeholder article. Deborah will write the real story here.",
      "A new collection is taking shape in the studio. Each piece starts as a sketch, then becomes a pattern, then a garment sewn by hand.",
      "More photos and details will be added as the pieces are finished.",
    ],
  },
  {
    slug: "behind-the-scenes-of-the-latest-photo-shoot",
    title: "Behind the scenes of the latest photo shoot",
    image: img("057_1U1A1561_DEBORA.jpg"),
    excerpt: "How a shoot comes together, from the first fitting to the last frame.",
    body: [
      "This is a placeholder article. Deborah will write the real story here.",
      "Every photo shoot shows the clothes on real people. Models wear the pieces, and each shoot tells a small story about them.",
      "The final photos will appear in the gallery once they are ready.",
    ],
  },
  {
    slug: "fitting-day-with-the-models",
    title: "Fitting day with the models",
    image: img("MB_Monica-366.jpeg"),
    excerpt: "Small adjustments so every piece sits right.",
    body: [
      "This is a placeholder article. Deborah will write the real story here.",
      "Before a shoot, the models try on each piece. Small adjustments to the fit make sure the clothes look the way they were designed.",
      "This text will be replaced with Deborah's own words.",
    ],
  },
];
