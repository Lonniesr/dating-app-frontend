export function getProfilePhoto(photos?: any[]): string {
  const fallback = "/placeholder.jpg";

  if (!photos || photos.length === 0) {
    return fallback;
  }

  const first = photos[0];

  let url: string | undefined;

  if (typeof first === "string") {
    url = first;
  } else if (typeof first === "object" && first?.url) {
    url = first.url;
  }

  if (!url) {
    return fallback;
  }

  // If URL already absolute
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  // If relative path, prepend backend URL
  const base = import.meta.env.VITE_API_URL || "";

  return `${base}${url}`;
}