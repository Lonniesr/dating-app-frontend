import * as faceapi from "face-api.js";

// Load model once
let modelLoaded = false;

export async function loadFaceModel() {
  if (modelLoaded) return;

  await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
  modelLoaded = true;
}

export interface FaceValidationResult {
  ok: boolean;
  error?: string;
}

export async function validatePhoto(file: File): Promise<FaceValidationResult> {
  await loadFaceModel();

  const img = await fileToImage(file);

  // 1. Face detection
  const detection = await faceapi.detectSingleFace(
    img,
    new faceapi.TinyFaceDetectorOptions()
  );

  if (!detection) {
    return { ok: false, error: "Face not detected" };
  }

  // 2. Brightness check
  const brightness = getBrightness(img);
  if (brightness < 60) {
    return { ok: false, error: "Low brightness" };
  }

  // 3. Blur check
  const blur = estimateBlur(img);
  if (blur > 40) {
    return { ok: false, error: "Image too blurry" };
  }

  // 4. Centering check
  const box = detection.box;
  const centerX = box.x + box.width / 2;
  const imgCenterX = img.width / 2;

  if (Math.abs(centerX - imgCenterX) > img.width * 0.25) {
    return { ok: false, error: "Face not centered" };
  }

  return { ok: true };
}

// -------------------------------
// Helpers
// -------------------------------

function fileToImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };

    img.onerror = (err) => {
      URL.revokeObjectURL(url);
      reject(err);
    };

    img.src = url;
  });
}

function getBrightness(img: HTMLImageElement): number {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  canvas.width = img.width;
  canvas.height = img.height;

  ctx.drawImage(img, 0, 0);
  const data = ctx.getImageData(0, 0, img.width, img.height).data;

  let sum = 0;
  const totalPixels = data.length / 4;

  for (let i = 0; i < data.length; i += 4) {
    sum += data[i] + data[i + 1] + data[i + 2];
  }

  return sum / (totalPixels * 3);
}

function estimateBlur(img: HTMLImageElement): number {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  canvas.width = img.width;
  canvas.height = img.height;

  ctx.drawImage(img, 0, 0);
  const data = ctx.getImageData(0, 0, img.width, img.height).data;

  let variance = 0;
  let mean = 0;
  const totalPixels = data.length / 4;

  // Compute mean brightness
  for (let i = 0; i < data.length; i += 4) {
    mean += data[i];
  }
  mean /= totalPixels;

  // Compute variance
  for (let i = 0; i < data.length; i += 4) {
    const v = data[i];
    variance += (v - mean) ** 2;
  }
  variance /= totalPixels;

  return Math.sqrt(variance);
}
