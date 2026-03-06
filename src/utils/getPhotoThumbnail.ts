export function getPhotoThumbnail(url: string, size = 400) {
  if (!url) return "";
  return `${url}?width=${size}&height=${size}&resize=cover`;
}