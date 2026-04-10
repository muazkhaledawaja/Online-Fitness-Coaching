"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  addGalleryImage,
  deleteGalleryImage,
  toggleGalleryVisibility,
  uploadImage,
} from "@/actions";
import { toast } from "sonner";
import { Trash2, Eye, EyeOff, Upload, Loader2 } from "lucide-react";
import type { GalleryImage } from "@/types";

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  async function fetchImages() {
    const supabase = createClient();
    const { data } = await supabase
      .from("gallery_images")
      .select("*")
      .order("sort_order", { ascending: true });
    setImages(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    fetchImages();
  }, []);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    let successCount = 0;
    let failCount = 0;

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);

      const uploadResult = await uploadImage(formData);
      if (!uploadResult.success || !uploadResult.url) {
        failCount++;
        continue;
      }

      const result = await addGalleryImage(uploadResult.url, file.name);
      if (result.success) {
        successCount++;
      } else {
        failCount++;
      }
    }

    if (successCount > 0) toast.success(`${successCount} image(s) uploaded!`);
    if (failCount > 0) toast.error(`${failCount} upload(s) failed`);
    fetchImages();
    setUploading(false);
    e.target.value = "";
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this image?")) return;
    const result = await deleteGalleryImage(id);
    if (result.success) {
      toast.success("Deleted");
      fetchImages();
    }
  }

  async function handleToggle(id: string, currentlyVisible: boolean) {
    const result = await toggleGalleryVisibility(id, !currentlyVisible);
    if (result.success) {
      toast.success(currentlyVisible ? "Hidden" : "Visible");
      fetchImages();
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl tracking-[3px]">GALLERY</h1>
        <label className="inline-flex items-center gap-2 bg-accent text-bg px-5 py-2.5 text-sm font-semibold tracking-widest uppercase cursor-pointer hover:bg-accent-hover transition-colors">
          {uploading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Upload className="w-4 h-4" />
          )}
          {uploading ? "Uploading..." : "Upload"}
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      {loading ? (
        <div className="text-muted text-center py-20">Loading...</div>
      ) : images.length === 0 ? (
        <div className="text-muted text-center py-20 bg-surface border border-accent/[0.06]">
          No images yet. Upload your first photo above.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {images.map((img) => (
            <div
              key={img.id}
              className={`relative aspect-[3/4] overflow-hidden group border border-accent/[0.06] ${
                !img.is_visible ? "opacity-40" : ""
              }`}
            >
              <img
                src={img.url}
                alt={img.alt_text}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-bg/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button
                  onClick={() => handleToggle(img.id, img.is_visible)}
                  className="p-2 bg-surface/80 text-foreground hover:text-accent transition-colors"
                  title={img.is_visible ? "Hide" : "Show"}
                >
                  {img.is_visible ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => handleDelete(img.id)}
                  className="p-2 bg-surface/80 text-foreground hover:text-red-400 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
