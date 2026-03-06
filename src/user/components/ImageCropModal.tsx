import Cropper from "react-easy-crop";
import { useState } from "react";

type Props = {
  image: string;
  onCancel: () => void;
  onCropComplete: (file: File) => void;
};

export default function ImageCropModal({
  image,
  onCancel,
  onCropComplete,
}: Props) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [pixels, setPixels] = useState<any>(null);

  const onCropCompleteInternal = (_: any, croppedPixels: any) => {
    setPixels(croppedPixels);
  };

  const createCroppedImage = async () => {
    const img = new Image();
    img.src = image;

    await new Promise((resolve) => (img.onload = resolve));

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;

    canvas.width = pixels.width;
    canvas.height = pixels.height;

    ctx.drawImage(
      img,
      pixels.x,
      pixels.y,
      pixels.width,
      pixels.height,
      0,
      0,
      pixels.width,
      pixels.height
    );

    canvas.toBlob((blob) => {
      const file = new File([blob!], "cropped.jpg", {
        type: "image/jpeg",
      });
      onCropComplete(file);
    }, "image/jpeg", 0.9);
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">

      <div className="bg-white/10 p-4 rounded-xl w-[400px]">

        <div className="relative h-[300px]">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropCompleteInternal}
          />
        </div>

        <div className="flex justify-between mt-4">
          <button
            onClick={onCancel}
            className="px-3 py-1 bg-gray-500 rounded"
          >
            Cancel
          </button>

          <button
            onClick={createCroppedImage}
            className="px-3 py-1 bg-blue-600 rounded"
          >
            Crop
          </button>
        </div>

      </div>

    </div>
  );
}