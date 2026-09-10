'use client';

import { Film, ImagePlus, Loader2, RefreshCw, Trash2, Upload } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import {
  deleteSliderImage,
  getSliderImages,
  replaceSliderMedia,
  uploadSliderMedia,
} from '../../../services/slider.service';

const IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const VIDEO_TYPES = new Set(['video/mp4', 'video/webm', 'video/quicktime']);
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_VIDEO_BYTES = 50 * 1024 * 1024;
const ACCEPTED_MEDIA = 'image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime';

const isVideoAsset = (asset) => asset?.mediaType === 'video' || asset?.mimeType?.startsWith('video/');

function validateMedia(file) {
  const video = VIDEO_TYPES.has(file.type);
  if (!video && !IMAGE_TYPES.has(file.type)) {
    return 'Only JPG, PNG, WebP, MP4, MOV, and WebM files are supported.';
  }
  if (file.size > (video ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES)) {
    return video ? 'Each video must be 50 MB or smaller.' : 'Each image must be 5 MB or smaller.';
  }
  return '';
}

function MediaPreview({ source, video, label, className = '' }) {
  return video ? (
    <video src={source} aria-label={label} controls muted playsInline preload="metadata" className={`w-full bg-black object-contain ${className}`} />
  ) : (
    <img src={source} alt={label} className={`w-full object-cover ${className}`} />
  );
}

export default function HomeMediaSettingsPage() {
  const [sliders, setSliders] = useState([]);
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [deletingId, setDeletingId] = useState('');
  const [replacingId, setReplacingId] = useState('');
  const objectUrls = useRef(new Set());

  useEffect(() => () => {
    objectUrls.current.forEach((url) => URL.revokeObjectURL(url));
    objectUrls.current.clear();
  }, []);

  const loadSliders = async () => {
    setIsLoading(true);
    try {
      setSliders(await getSliderImages());
    } catch (error) {
      toast.error(error?.message || 'Failed to load home media');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSliders();
  }, []);

  const releasePreview = (url) => {
    if (!objectUrls.current.has(url)) return;
    URL.revokeObjectURL(url);
    objectUrls.current.delete(url);
  };

  const handleFilesChange = (event) => {
    const files = Array.from(event.target.files || []);
    event.target.value = '';
    const accepted = [];

    files.forEach((file) => {
      const error = validateMedia(file);
      if (error) {
        toast.error(`${file.name}: ${error}`);
        return;
      }
      const previewUrl = URL.createObjectURL(file);
      objectUrls.current.add(previewUrl);
      accepted.push({ file, previewUrl, video: VIDEO_TYPES.has(file.type) });
    });

    if (accepted.length) setSelectedMedia((current) => [...current, ...accepted]);
  };

  const removeSelected = (previewUrl) => {
    releasePreview(previewUrl);
    setSelectedMedia((current) => current.filter((entry) => entry.previewUrl !== previewUrl));
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    if (!selectedMedia.length || isUploading) return;
    setIsUploading(true);

    const uploaded = [];
    const successfulPreviews = new Set();
    let failed = 0;
    for (const entry of selectedMedia) {
      try {
        const media = await uploadSliderMedia(entry.file);
        if (media) uploaded.push(media);
        successfulPreviews.add(entry.previewUrl);
      } catch (error) {
        failed += 1;
        toast.error(`${entry.file.name}: ${error?.response?.data?.message || error?.message || 'Upload failed'}`);
      }
    }

    if (uploaded.length) {
      setSliders((current) => [...current, ...uploaded]);
      setSelectedMedia((current) => current.filter((entry) => !successfulPreviews.has(entry.previewUrl)));
      successfulPreviews.forEach(releasePreview);
      toast.success(`${uploaded.length} home media file${uploaded.length === 1 ? '' : 's'} uploaded`);
    }
    if (failed) toast.error(`${failed} file${failed === 1 ? '' : 's'} could not be uploaded.`);
    setIsUploading(false);
  };

  const handleReplace = async (slider, event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file || replacingId) return;
    const validationError = validateMedia(file);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setReplacingId(slider.uuid);
    try {
      const replacement = await replaceSliderMedia(slider.uuid, file);
      setSliders((current) => current.map((entry) => entry.uuid === slider.uuid ? replacement : entry));
      toast.success('Home media replaced and the old Cloudinary file was permanently deleted');
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message || 'Failed to replace home media');
    } finally {
      setReplacingId('');
    }
  };

  const handleDelete = async (publicId) => {
    if (!publicId || deletingId) return;
    if (!window.confirm('Permanently delete this media from the home page and Cloudinary?')) return;

    setDeletingId(publicId);
    try {
      await deleteSliderImage(publicId);
      setSliders((current) => current.filter((slider) => slider.publicId !== publicId));
      toast.success('Media permanently deleted from the database and Cloudinary');
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message || 'Failed to delete home media');
    } finally {
      setDeletingId('');
    }
  };

  return (
    <div className="mx-auto grid max-w-7xl gap-5 xl:grid-cols-[0.9fr_1.1fr]">
      <section className="rounded-lg border border-[#E8D8CC] bg-[#FFFCF8] p-5 shadow-[0_10px_30px_rgba(43,20,14,0.08)] sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#FBE8E3] text-[#D85C6B]">
            <Film className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <h2 className="brand-serif text-3xl font-bold leading-none text-[#2B140E]">Add Home Media</h2>
            <p className="mt-2 text-sm leading-6 text-[#7A625A]">Upload multiple images, landscape videos, or vertical reels for the storefront hero.</p>
          </div>
        </div>

        <form onSubmit={handleUpload} className="mt-6 space-y-4">
          <label className="flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#C98A78]/55 bg-[#FFF9F3] px-4 py-6 text-center transition hover:bg-[#F6ECDD]">
            <Upload className="h-7 w-7 text-[#8D3D35]" aria-hidden="true" />
            <span className="mt-3 text-sm font-bold text-[#2B140E]">Choose images or videos</span>
            <span className="mt-1 text-xs text-[#7A625A]">Select multiple files · images up to 5 MB · videos up to 50 MB</span>
            <input type="file" multiple accept={ACCEPTED_MEDIA} onChange={handleFilesChange} className="sr-only" disabled={isUploading} />
          </label>

          {selectedMedia.length > 0 && (
            <div className="grid gap-3 sm:grid-cols-2">
              {selectedMedia.map((entry) => (
                <article key={entry.previewUrl} className="overflow-hidden rounded-lg border border-[#E8D8CC] bg-white">
                  <MediaPreview source={entry.previewUrl} video={entry.video} label={entry.file.name} className="aspect-video" />
                  <div className="flex items-center justify-between gap-3 px-3 py-2">
                    <div className="min-w-0">
                      <p className="truncate text-xs font-bold text-[#2E1A14]">{entry.file.name}</p>
                      <p className="text-[11px] text-[#7A625A]">{entry.video ? 'Video / Reel' : 'Image'}</p>
                    </div>
                    <button type="button" onClick={() => removeSelected(entry.previewUrl)} disabled={isUploading} className="text-xs font-bold text-[#D95C5C] hover:text-[#4A2318] disabled:opacity-50">Remove</button>
                  </div>
                </article>
              ))}
            </div>
          )}

          <button type="submit" disabled={!selectedMedia.length || isUploading} className="ui-btn-primary w-full">
            {isUploading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Upload className="h-4 w-4" aria-hidden="true" />}
            {isUploading ? 'Uploading media...' : `Upload ${selectedMedia.length || ''} File${selectedMedia.length === 1 ? '' : 's'}`}
          </button>
        </form>
      </section>

      <section className="rounded-lg border border-[#E8D8CC] bg-[#FFFCF8] p-5 shadow-[0_10px_30px_rgba(43,20,14,0.08)] sm:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="brand-serif text-3xl font-bold leading-none text-[#2B140E]">Home Preview</h2>
            <p className="mt-2 text-sm text-[#7A625A]">{sliders.length} active media file{sliders.length === 1 ? '' : 's'}</p>
          </div>
          <button type="button" onClick={loadSliders} disabled={isLoading} className="ui-btn-secondary h-10 px-4">
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} aria-hidden="true" /> Refresh
          </button>
        </div>

        {isLoading ? (
          <div className="mt-6 flex h-64 items-center justify-center rounded-lg border border-[#E8D8CC] bg-[#FFF9F3] text-[#7A625A]">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" /> Loading home media...
          </div>
        ) : sliders.length === 0 ? (
          <div className="mt-6 flex h-64 flex-col items-center justify-center rounded-lg border border-dashed border-[#C98A78]/55 bg-[#FFF9F3] px-4 text-center text-sm font-semibold text-[#7A625A]">
            <ImagePlus className="mb-3 h-9 w-9 text-[#C89A4B]" aria-hidden="true" /> No home media uploaded yet.
          </div>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {sliders.map((slider, index) => {
              const video = isVideoAsset(slider);
              return (
                <article key={slider.publicId || slider.uuid} className="overflow-hidden rounded-lg border border-[#E8D8CC] bg-[#FFF9F3]">
                  <div className="relative">
                    <MediaPreview source={slider.mediaUrl || slider.imageUrl} video={video} label={`Home ${video ? 'video' : 'image'} ${index + 1}`} className="aspect-video" />
                    <span className="absolute left-2 top-2 rounded-full bg-[#2B140E]/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white backdrop-blur-sm">{video ? 'Video / Reel' : 'Image'}</span>
                  </div>
                  <div className="space-y-3 px-3 py-3">
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-[#2E1A14]">Slide {index + 1}</p>
                      <p className="truncate text-xs text-[#7A625A]">{slider.originalName || slider.publicId}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <label className={`inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[#C98A78]/45 px-3 text-sm font-bold text-[#8D3D35] ${replacingId || deletingId ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:bg-[#F6ECDD]'}`}>
                        {replacingId === slider.uuid ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />} Replace
                        <input type="file" accept={ACCEPTED_MEDIA} className="sr-only" disabled={Boolean(replacingId || deletingId)} onChange={(event) => handleReplace(slider, event)} />
                      </label>
                      <button type="button" onClick={() => handleDelete(slider.publicId)} disabled={Boolean(deletingId || replacingId)} className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[#D95C5C]/35 px-3 text-sm font-bold text-[#D95C5C] hover:bg-[#FFF0F0] disabled:opacity-60">
                        {deletingId === slider.publicId ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Trash2 className="h-4 w-4" aria-hidden="true" />} Delete
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
