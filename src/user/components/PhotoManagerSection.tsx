import { useState, useEffect } from "react";
import { useUserAuth } from "../context/UserAuthContext";
import { supabase } from "../../lib/supabaseClient";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import type { DragEndEvent } from "@dnd-kit/core";

import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

type AuthUserWithPhotos = {
  photos: string[];
  [key: string]: any;
};

type SortablePhotoProps = {
  photo: string;
  index: number;
  onDelete: (i: number) => void;
};

function SortablePhoto({ photo, index, onDelete }: SortablePhotoProps) {
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
      <img src={photo} className="w-full h-32 object-cover" />

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
  const user = authUser as AuthUserWithPhotos | null;

  const [isUploading, setIsUploading] = useState(false);
  const [items, setItems] = useState<string[]>([]);

  useEffect(() => {
    if (user?.photos) {
      setItems(user.photos);
    }
  }, [user]);

  const sensors = useSensors(useSensor(PointerSensor));

  // ✅ FIXED UPLOAD LOGIC
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const filePath = `user-photos/${crypto.randomUUID()}.jpg`;

      const { error: uploadError } = await supabase.storage
        .from("photos")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("photos")
        .getPublicUrl(filePath);

      // Send URL to backend
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/photos/upload`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url: data.publicUrl }),
        }
      );

      if (!res.ok) throw new Error("Failed to save photo URL");

      await refreshUser();
    } catch (err) {
      console.error("Upload error:", err);
    }

    setIsUploading(false);
  };

  const handleDelete = async (index: number) => {
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

      {items.length === 0 && (
        <p className="text-white/50 text-sm">
          You haven't uploaded any photos yet.
        </p>
      )}

      {items.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            <div className="grid grid-cols-3 gap-3">
              {items.map((photo, index) => (
                <SortablePhoto
                  key={photo}
                  photo={photo}
                  index={index}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}