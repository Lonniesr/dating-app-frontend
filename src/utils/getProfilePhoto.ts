export function getProfilePhoto(photos?: any[]): string {
  if (!photos || photos.length === 0) {
    return "/placeholder.jpg";
  }

  const first = photos[0];

  if (typeof first === "string") {
    return first;
  }

  if (typeof first === "object" && first.url) {
    return first.url;
  }

  return "/placeholder.jpg";
}