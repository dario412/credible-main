export type MediaAssetCard = {
  id: string;
  fileName: string;
  mimeType: string;
  alt: string;
  byteSize: number;
  createdAt: string;
  url: string;
};

export function mediaAssetUrl(id: string) {
  return `/api/media/${id}`;
}

export function isMediaAssetUrl(src: string | null | undefined) {
  if (!src) return false;
  return src.startsWith("/api/media/");
}

/** Use with next/image — media library bytes should not go through the optimizer. */
export function imageUnoptimized(src: string | null | undefined) {
  return isMediaAssetUrl(src);
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export const MEDIA_ALLOWED_MIME = new Set([
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]);

export const MEDIA_MAX_BYTES = 4 * 1024 * 1024;
