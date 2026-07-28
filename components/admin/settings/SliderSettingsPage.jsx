'use client';

import { ImagePlus, Loader2, Trash2, Upload } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { deleteSliderImage, getSliderImages, uploadSliderImage } from '../../../services/slider.service';

export default function SliderSettingsPage() {
  const [sliders, setSliders] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [deletingId, setDeletingId] = useState('');

  const previewName = useMemo(() => selectedFile?.name || 'Slider preview', [selectedFile]);

  const loadSliders = async () => {
    setIsLoading(true);
    try {
      setSliders(await getSliderImages());
    } catch (error) {
      toast.error(error?.message || 'Failed to load slider images');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSliders();
  }, []);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl('');
      return undefined;
    }

    const nextPreviewUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(nextPreviewUrl);
    return () => URL.revokeObjectURL(nextPreviewUrl);
  }, [selectedFile]);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please choose an image file');
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    if (!selectedFile || isUploading) return;

    setIsUploading(true);
    try {
      const uploaded = await uploadSliderImage(selectedFile);
      setSliders((current) => [...current, uploaded].filter(Boolean));
      setSelectedFile(null);
      toast.success('Slider image uploaded');
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message || 'Failed to upload slider image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (publicId) => {
    if (!publicId || deletingId) return;

    setDeletingId(publicId);
    try {
      await deleteSliderImage(publicId);
      setSliders((current) => current.filter((slider) => slider.publicId !== publicId));
      toast.success('Slider image deleted from database and Cloudinary');
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message || 'Failed to delete slider image');
    } finally {
      setDeletingId('');
    }
  };

  return (
    <div className="mx-auto grid max-w-7xl gap-5 xl:grid-cols-[0.9fr_1.1fr]">
      <section className="rounded-lg border border-[#E8D8CC] bg-[#FFFCF8] p-5 shadow-[0_10px_30px_rgba(43,20,14,0.08)] sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#FBE8E3] text-[#D85C6B]">
            <ImagePlus className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <h2 className="brand-serif text-3xl font-bold leading-none text-[#2B140E]">Add Slider Image</h2>
            <p className="mt-2 text-sm leading-6 text-[#7A625A]">
              Upload home page slider images. They appear in the first section of the storefront and auto-slide every 2 seconds.
            </p>
          </div>
        </div>

        <form onSubmit={handleUpload} className="mt-6 space-y-4">
          <label className="flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#C98A78]/55 bg-[#FFF9F3] px-4 py-6 text-center transition hover:bg-[#F6ECDD]">
            <Upload className="h-7 w-7 text-[#8D3D35]" aria-hidden="true" />
            <span className="mt-3 text-sm font-bold text-[#2B140E]">Choose slider image</span>
            <span className="mt-1 text-xs text-[#7A625A]">JPG, PNG, or WebP up to 5 MB</span>
            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFileChange} className="sr-only" />
          </label>

          {previewUrl && (
            <div className="overflow-hidden rounded-lg border border-[#E8D8CC] bg-[#FFF9F3]">
              <img src={previewUrl} alt={previewName} className="aspect-[16/7] w-full object-cover" />
              <div className="flex items-center justify-between gap-3 px-4 py-3">
                <p className="truncate text-sm font-semibold text-[#2E1A14]">{previewName}</p>
                <button
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  className="text-sm font-bold text-[#D95C5C] hover:text-[#4A2318]"
                >
                  Remove
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={!selectedFile || isUploading}
            className="ui-btn-primary w-full"
          >
            {isUploading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Upload className="h-4 w-4" aria-hidden="true" />}
            {isUploading ? 'Uploading...' : 'Upload Slider Image'}
          </button>
        </form>
      </section>

      <section className="rounded-lg border border-[#E8D8CC] bg-[#FFFCF8] p-5 shadow-[0_10px_30px_rgba(43,20,14,0.08)] sm:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="brand-serif text-3xl font-bold leading-none text-[#2B140E]">Preview</h2>
            <p className="mt-2 text-sm text-[#7A625A]">{sliders.length} slider image{sliders.length === 1 ? '' : 's'} active</p>
          </div>
          <button type="button" onClick={loadSliders} className="ui-btn-secondary h-10 px-4">
            Refresh
          </button>
        </div>

        {isLoading ? (
          <div className="mt-6 flex h-64 items-center justify-center rounded-lg border border-[#E8D8CC] bg-[#FFF9F3] text-[#7A625A]">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
            Loading slider images...
          </div>
        ) : sliders.length === 0 ? (
          <div className="mt-6 flex h-64 items-center justify-center rounded-lg border border-[#E8D8CC] bg-[#FFF9F3] px-4 text-center text-sm font-semibold text-[#7A625A]">
            No slider images uploaded yet.
          </div>
        ) : (
          <div className="mt-6 grid gap-4">
            {sliders.map((slider, index) => (
              <article key={slider.publicId || slider.uuid} className="overflow-hidden rounded-lg border border-[#E8D8CC] bg-[#FFF9F3]">
                <img src={slider.imageUrl} alt={`Home slider ${index + 1}`} className="aspect-[16/7] w-full object-cover" />
                <div className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-[#2E1A14]">Slider {index + 1}</p>
                    <p className="truncate text-xs text-[#7A625A]">{slider.publicId}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDelete(slider.publicId)}
                    disabled={deletingId === slider.publicId}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[#D95C5C]/35 px-4 text-sm font-bold text-[#D95C5C] hover:bg-[#FFF0F0] disabled:opacity-60"
                  >
                    {deletingId === slider.publicId ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Trash2 className="h-4 w-4" aria-hidden="true" />}
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
