import imageCompression from "browser-image-compression";

export async function compressImage(file: File): Promise<File> {
  const options = {
    maxSizeMB: 0.4,            // target ~400kb
    maxWidthOrHeight: 1600,    // resize large images
    useWebWorker: true,        // faster + non‑blocking
  };

  try {
    const compressed = await imageCompression(file, options);
    return compressed;
  } catch (err) {
    console.error("Image compression failed:", err);
    return file; // fallback to original
  }
}