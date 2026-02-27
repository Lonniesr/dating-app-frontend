export async function compressImage(
  file: File,
  maxSize = 1400,
  quality = 0.82
): Promise<File> {
  // Create an object URL for the image
  const objectUrl = URL.createObjectURL(file);

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = reject;
    i.src = objectUrl;
  });

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;

  // Determine scale factor
  const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);

  canvas.width = img.width * scale;
  canvas.height = img.height * scale;

  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  // Cleanup object URL
  URL.revokeObjectURL(objectUrl);

  // Convert canvas to blob and return as File
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Image compression failed: Blob is null"));
          return;
        }

        resolve(new File([blob], file.name, { type: "image/jpeg" }));
      },
      "image/jpeg",
      quality
    );
  });
}
