import { useState, useEffect } from "react";
import { useUserAuth } from "../context/UserAuthContext";
import { supabase } from "../../lib/supabaseClient";

import Cropper from "react-easy-crop";
import ProgressiveImage from "../../components/ProgressiveImage";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  SortableContext,
  useSortable,
  arrayMove,
  rectSortingStrategy,
} from "@dnd-kit/sortable";

import type { DragEndEvent } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

const MAX_PHOTOS = 6;

type SortablePhotoProps = {
  photo: string;
  index: number;
  onDelete: (i: number) => void;
  onMakeMain: (i: number) => void;
};

function SortablePhoto({ photo, index, onDelete, onMakeMain }: SortablePhotoProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: photo });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="relative group border border-white/10 rounded-lg overflow-hidden cursor-grab active:cursor-grabbing"
    >
      <div onClick={() => onMakeMain(index)}>
        <ProgressiveImage
          src={photo}
          className="w-full h-32 cursor-pointer"
          alt="User photo"
        />
      </div>

      {index === 0 && (
        <div className="absolute bottom-1 left-1 text-xs bg-blue-600 px-2 py-0.5 rounded">
          Main
        </div>
      )}

      <button
        onClick={() => onDelete(index)}
        className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
      >
        Delete
      </button>
    </div>
  );
}

export default function PhotoManagerSection() {
  const { authUser, refreshUser } = useUserAuth();

  const [items, setItems] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const [cropImage, setCropImage] = useState<string | null>(null);
  const [cropFile, setCropFile] = useState<File | null>(null);

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [cropPixels, setCropPixels] = useState<any>(null);

  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    if (authUser?.photos) {
      setItems(authUser.photos);
    }
  }, [authUser]);

  const makeMainPhoto = async (index: number) => {
    if (index === 0) return;

    const newOrder = [...items];
    const [selected] = newOrder.splice(index, 1);
    newOrder.unshift(selected);

    setItems(newOrder);

    await fetch(`${import.meta.env.VITE_API_URL}/api/user/photos/reorder`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order: newOrder }),
    });

    refreshUser();
  };

  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d")!;

        const maxWidth = 1000;
        const scale = maxWidth / img.width;

        canvas.width = maxWidth;
        canvas.height = img.height * scale;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
          resolve(
            new File([blob!], file.name, {
              type: "image/jpeg",
              lastModified: Date.now(),
            })
          );
        }, "image/jpeg", 0.8);
      };

      reader.readAsDataURL(file);
    });
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (items.length >= MAX_PHOTOS) {
      alert("Maximum 6 photos allowed");
      return;
    }

    const preview = URL.createObjectURL(file);
    setCropImage(preview);
    setCropFile(file);
  };

  const onCropComplete = (_: any, pixels: any) => {
    setCropPixels(pixels);
  };

  const finishCrop = async () => {
    if (!cropImage || !cropPixels || !cropFile) return;

    setIsUploading(true);

    const img = new Image();
    img.src = cropImage;

    await new Promise((resolve) => (img.onload = resolve));

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;

    canvas.width = cropPixels.width;
    canvas.height = cropPixels.height;

    ctx.drawImage(
      img,
      cropPixels.x,
      cropPixels.y,
      cropPixels.width,
      cropPixels.height,
      0,
      0,
      cropPixels.width,
      cropPixels.height
    );

    canvas.toBlob(async (blob) => {
      const croppedFile = new File([blob!], "photo.jpg", {
        type: "image/jpeg",
      });

      try {
        const compressed = await compressImage(croppedFile);

        const filePath = `user-photos/${crypto.randomUUID()}.jpg`;

        const { error } = await supabase.storage
          .from("photos")
          .upload(filePath, compressed, { upsert: true });

        if (error) throw error;

        const { data } = supabase.storage
          .from("photos")
          .getPublicUrl(filePath);

        const url = data.publicUrl;

        setItems((prev) => [...prev, url]);

        await fetch(`${import.meta.env.VITE_API_URL}/api/user/photos/upload`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        });

        await refreshUser();
      } catch (err) {
        console.error("Upload error:", err);
        alert("Photo upload failed");
      }

      setCropImage(null);
      setCropFile(null);
      setIsUploading(false);
    }, "image/jpeg", 0.9);
  };

  const handleDelete = async (index: number) => {
    const newPhotos = [...items];
    newPhotos.splice(index, 1);

    setItems(newPhotos);

    await fetch(`${import.meta.env.VITE_API_URL}/api/user/photos/${index}`, {
      method: "DELETE",
      credentials: "include",
    });

    refreshUser();
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((i) => i === active.id);
    const newIndex = items.findIndex((i) => i === over.id);

    const newOrder = arrayMove(items, oldIndex, newIndex);

    setItems(newOrder);

    await fetch(`${import.meta.env.VITE_API_URL}/api/user/photos/reorder`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order: newOrder }),
    });

    refreshUser();
  };

  return (
    <div className="bg-white/5 p-5 rounded-xl border border-white/10 text-white mb-6">

      <h2 className="text-xl font-bold mb-4">Your Photos</h2>

      <label className="inline-block mb-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 transition rounded-lg font-semibold cursor-pointer">
        {isUploading ? "Uploading…" : "Upload Photo"}
        <input type="file" className="hidden" onChange={handleUpload} />
      </label>

      <p className="text-white/50 text-sm mb-3">
        {items.length}/{MAX_PHOTOS} photos
      </p>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-3 gap-3">
            {items.map((photo, index) => (
              <SortablePhoto
                key={photo}
                photo={photo}
                index={index}
                onDelete={handleDelete}
                onMakeMain={makeMainPhoto}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {cropImage && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">

          <div className="bg-white/10 p-4 rounded-xl w-[400px]">

            <div className="relative h-[300px]">
              <Cropper
                image={cropImage}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>

            <div className="flex justify-between mt-4">
              <button
                onClick={() => setCropImage(null)}
                className="px-3 py-1 bg-gray-500 rounded"
              >
                Cancel
              </button>

              <button
                onClick={finishCrop}
                className="px-3 py-1 bg-blue-600 rounded"
              >
                Crop & Upload
              </button>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}