'use client';

import { useMemo, useState } from 'react';
import { MessageSquare, Send, Star, UserCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const REVIEW_STORAGE_PREFIX = 'chocotraillReviews';

const initialForm = {
  title: '',
  rating: 5,
  feedback: '',
  userName: '',
};

const mockReviewsByProduct = {};

const fallbackReviews = [
  {
    id: 'mock-default-1',
    title: 'Looks exactly as shown',
    rating: 5,
    feedback: 'The product details were accurate and the quality matched the listing.',
    userName: 'Priya Nair',
    submittedAt: '2026-07-10T11:20:00.000Z',
  },
];

function getReviewStorageKey(productId) {
  return `${REVIEW_STORAGE_PREFIX}:${productId}`;
}

function getMockReviews(productId) {
  return mockReviewsByProduct[productId] || fallbackReviews;
}

function readSavedReviews(productId) {
  if (!productId || typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(getReviewStorageKey(productId));
    const parsed = stored ? JSON.parse(stored) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function formatDateTime(value) {
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function RatingStars({ rating, onChange }) {
  return (
    <div className="flex items-center gap-1" aria-label={`Rating ${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((value) => (
        <button
          key={value}
          type="button"
          onClick={() => onChange?.(value)}
          className="rounded-md p-1 text-brand-gold transition hover:bg-brand-gold/10 focus:outline-none focus:ring-2 focus:ring-brand-gold/30"
          aria-label={`${value} star${value > 1 ? 's' : ''}`}
        >
          <Star className={`h-5 w-5 ${value <= rating ? 'fill-current' : ''}`} />
        </button>
      ))}
    </div>
  );
}

export default function ProductReviews({ productId, productName }) {
  const [form, setForm] = useState(initialForm);
  const [reviewVersion, setReviewVersion] = useState(0);
  const [errors, setErrors] = useState({});

  const savedReviews = useMemo(() => {
    if (reviewVersion < 0) return [];
    return readSavedReviews(productId);
  }, [productId, reviewVersion]);

  const reviews = useMemo(() => {
    if (!productId) return [];
    return [...savedReviews, ...getMockReviews(productId)].sort(
      (a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)
    );
  }, [productId, savedReviews]);

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    return reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / reviews.length;
  }, [reviews]);

  const updateForm = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.title.trim()) nextErrors.title = 'Review title is required.';
    if (!form.userName.trim()) nextErrors.userName = 'User name is required.';
    if (!form.feedback.trim() || form.feedback.trim().length < 10) {
      nextErrors.feedback = 'Feedback must be at least 10 characters.';
    }
    if (!Number(form.rating) || form.rating < 1 || form.rating > 5) {
      nextErrors.rating = 'Select a rating.';
    }
    return nextErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      toast.error('Please complete the review form.');
      return;
    }

    const review = {
      id: `review-${Date.now()}`,
      title: form.title.trim(),
      rating: Number(form.rating),
      feedback: form.feedback.trim(),
      userName: form.userName.trim(),
      submittedAt: new Date().toISOString(),
    };

    const nextReviews = [review, ...readSavedReviews(productId)];

    if (typeof window !== 'undefined') {
      localStorage.setItem(getReviewStorageKey(productId), JSON.stringify(nextReviews));
    }

    setReviewVersion((current) => current + 1);
    setForm(initialForm);
    toast.success('Review added successfully.');
  };

  return (
    <section className="border-t border-slate-200 bg-white py-12">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-gold/40 bg-brand-ivory px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-cocoa">
              <MessageSquare className="h-4 w-4" aria-hidden="true" />
              Product Reviews
            </span>
            <h2 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">{productName}</h2>
            <p className="mt-2 text-sm text-slate-600">
              {reviews.length} review{reviews.length === 1 ? '' : 's'} with an average rating of {averageRating.toFixed(1)}.
            </p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <form onSubmit={handleSubmit} className="rounded-lg border border-slate-200 bg-slate-50 p-5">
            <h3 className="text-lg font-bold text-slate-900">Write a Review</h3>

            <div className="mt-5 space-y-4">
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Review Title</span>
                <input
                  value={form.title}
                  onChange={(event) => updateForm('title', event.target.value)}
                  className={`mt-2 w-full rounded-lg border bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-gold/30 ${
                    errors.title ? 'border-error' : 'border-slate-200 focus:border-brand-gold'
                  }`}
                  placeholder="What stood out?"
                />
                {errors.title && <span className="mt-1 block text-xs font-medium text-error">{errors.title}</span>}
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-slate-700">User Name</span>
                <input
                  value={form.userName}
                  onChange={(event) => updateForm('userName', event.target.value)}
                  className={`mt-2 w-full rounded-lg border bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-gold/30 ${
                    errors.userName ? 'border-error' : 'border-slate-200 focus:border-brand-gold'
                  }`}
                  placeholder="Your name"
                />
                {errors.userName && <span className="mt-1 block text-xs font-medium text-error">{errors.userName}</span>}
              </label>

              <div>
                <span className="text-sm font-semibold text-slate-700">Rating</span>
                <div className="mt-2">
                  <RatingStars rating={form.rating} onChange={(value) => updateForm('rating', value)} />
                </div>
                {errors.rating && <span className="mt-1 block text-xs font-medium text-error">{errors.rating}</span>}
              </div>

              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Feedback</span>
                <textarea
                  value={form.feedback}
                  onChange={(event) => updateForm('feedback', event.target.value)}
                  className={`mt-2 w-full resize-none rounded-lg border bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-gold/30 ${
                    errors.feedback ? 'border-error' : 'border-slate-200 focus:border-brand-gold'
                  }`}
                  rows={5}
                  placeholder="Share your experience with this product."
                />
                {errors.feedback && <span className="mt-1 block text-xs font-medium text-error">{errors.feedback}</span>}
              </label>

              <button type="submit" className="ui-btn-primary w-full justify-center rounded-lg py-3">
                <Send className="h-4 w-4" aria-hidden="true" />
                <span>Submit Review</span>
              </button>
            </div>
          </form>

          <div className="relative space-y-5">
            <div className="absolute left-5 top-2 hidden h-[calc(100%-1rem)] w-px bg-slate-200 sm:block" aria-hidden="true" />
            {reviews.map((review) => (
              <article key={review.id} className="relative rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:ml-12">
                <div className="absolute -left-12 top-5 hidden h-10 w-10 items-center justify-center rounded-full border border-brand-gold/40 bg-brand-ivory text-brand-cocoa sm:flex">
                  <UserCircle className="h-5 w-5" aria-hidden="true" />
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{review.title}</h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {review.userName} - {formatDateTime(review.submittedAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-brand-gold" aria-label={`${review.rating} out of 5`}>
                    {[1, 2, 3, 4, 5].map((value) => (
                      <Star key={value} className={`h-4 w-4 ${value <= review.rating ? 'fill-current' : ''}`} />
                    ))}
                  </div>
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-700">{review.feedback}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
