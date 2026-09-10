"use client";

import { useEffect, useRef, useState } from "react";
import { ImagePlus, Link as LinkIcon, RefreshCw, Trash2 } from "lucide-react";
import { MAX_PRODUCT_IMAGES } from "@/utils/imageEntries";

export default function AdminImageManager({
  images = [],
  onChange,
  disabled = false,
  label = "Product images",
}) {
  const [url, setUrl] = useState("");
  const [inputError, setInputError] = useState("");
  const objectUrls = useRef(new Set());

  useEffect(() => () => {
    objectUrls.current.forEach((objectUrl) => URL.revokeObjectURL(objectUrl));
    objectUrls.current.clear();
  }, []);

  const makeFileEntry = (file) => {
    const previewUrl = URL.createObjectURL(file);
    objectUrls.current.add(previewUrl);
    return {
      url: previewUrl,
      publicId: "",
      file,
    };
  };

  const addFiles = (event) => {
    const files = Array.from(event.target.files || []);
    event.target.value = "";
    if (!files.length) return;
    const room = Math.max(0, MAX_PRODUCT_IMAGES - images.length);
    setInputError(files.length > room ? `Only ${room} more image${room === 1 ? "" : "s"} can be added.` : "");
    onChange([...images, ...files.slice(0, room).map(makeFileEntry)]);
  };

  const replaceFile = (index, event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    const next = [...images];
    next[index] = makeFileEntry(file);
    onChange(next);
  };

  const addUrl = () => {
    const nextUrl = url.trim();
    if (!nextUrl || images.length >= MAX_PRODUCT_IMAGES) return;
    try {
      const parsedUrl = new URL(nextUrl);
      if (!['http:', 'https:'].includes(parsedUrl.protocol)) throw new Error("Invalid protocol");
    } catch {
      setInputError("Enter a valid HTTP or HTTPS image URL.");
      return;
    }
    onChange([
      ...images,
      { url: nextUrl, publicId: "" },
    ]);
    setUrl("");
    setInputError("");
  };

  const removeImage = (index) => {
    const removed = images[index];
    if (removed?.url?.startsWith("blob:") && objectUrls.current.has(removed.url)) {
      URL.revokeObjectURL(removed.url);
      objectUrls.current.delete(removed.url);
    }
    onChange(images.filter((_, imageIndex) => imageIndex !== index));
  };

  const atLimit = images.length >= MAX_PRODUCT_IMAGES;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <label className="text-sm font-medium text-slate-700">{label}</label>
        <span className="text-xs text-slate-500">{images.length}/{MAX_PRODUCT_IMAGES}</span>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          type="url"
          value={url}
          onChange={(event) => { setUrl(event.target.value); setInputError(""); }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              addUrl();
            }
          }}
          disabled={disabled || atLimit}
          placeholder="Paste an image URL"
          className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50"
        />
        <button
          type="button"
          onClick={addUrl}
          disabled={disabled || atLimit || !url.trim()}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <LinkIcon className="h-4 w-4" /> Add URL
        </button>
        <label className={`inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 ${disabled || atLimit ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:bg-slate-50"}`}>
          <ImagePlus className="h-4 w-4" /> Add files
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="hidden"
            onChange={addFiles}
            disabled={disabled || atLimit}
          />
        </label>
      </div>
      {inputError && <p className="text-xs font-medium text-red-600" role="alert">{inputError}</p>}

      {images.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {images.map((image, index) => (
            <div key={image.id || `${image.url}-${index}`} className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
              <div className="relative aspect-square">
                <img src={image.url} alt={`${label} ${index + 1}`} className="h-full w-full object-contain p-1" />
                {index === 0 && (
                  <span className="absolute left-1.5 top-1.5 rounded-full bg-slate-900/80 px-2 py-0.5 text-[10px] font-semibold text-white">Cover</span>
                )}
              </div>
              <div className="grid grid-cols-2 border-t border-slate-200 bg-white">
                <label className={`inline-flex items-center justify-center gap-1 border-r border-slate-200 px-2 py-2 text-xs font-medium text-slate-700 ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:bg-slate-50"}`}>
                  <RefreshCw className="h-3.5 w-3.5" /> Replace
                  <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(event) => replaceFile(index, event)} disabled={disabled} />
                </label>
                <button type="button" onClick={() => removeImage(index)} disabled={disabled} className="inline-flex items-center justify-center gap-1 px-2 py-2 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50">
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
          Add up to {MAX_PRODUCT_IMAGES} images. The first image is used as the cover.
        </div>
      )}
      <p className="text-xs text-slate-500">JPG, PNG, or WebP; maximum 5 MB each. Removed hosted images are permanently deleted after saving.</p>
    </div>
  );
}
