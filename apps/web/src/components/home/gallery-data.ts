export type GalleryImage = { src: string; alt: string };

// Public galleries are populated exclusively with photos uploaded by the admin.
export const columns: GalleryImage[][] = [[], [], [], []];

export const galleryImages = columns.flat().filter((image, index, all) =>
  all.findIndex((item) => item.src === image.src) === index
);
