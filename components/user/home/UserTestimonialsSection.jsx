import { Star } from "lucide-react";

const defaultTestimonials = [
  {
    name: "Priya Sharma",
    initials: "PS",
    role: "Verified Customer",
    quote:
      "The chocolates were fresh, beautifully packed, and perfect for gifting.",
    rating: 5,
  },
  {
    name: "Rohan Mehta",
    initials: "RM",
    role: "Verified Customer",
    quote:
      "The surprise box looked premium and made the celebration truly special.",
    rating: 5,
  },
  {
    name: "Ananya Patil",
    initials: "AP",
    role: "Verified Customer",
    quote:
      "Easy WhatsApp ordering, quick response, and excellent gift quality.",
    rating: 5,
  },
];

function RatingStars({ rating = 5 }) {
  return (
    <div
      className="flex items-center gap-0.5"
      aria-label={`${rating} out of 5 stars`}
    >
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={`h-4 w-4 ${
            index < rating ? "text-[#C9963A]" : "text-[#DCCCB8]"
          }`}
          fill={index < rating ? "currentColor" : "none"}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

export default function UserTestimonialsSection({
  heading = "Loved by Our Customers",
  subtitle = "Sweet experiences shared by happy customers.",
  testimonials = defaultTestimonials,
}) {
  return (
    <section
      className="border-t border-[#C9963A] bg-[#FFF8ED]"
      aria-labelledby="user-testimonials"
    >
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
        <div className="mb-7 text-center">
          <h2
            id="user-testimonials"
            className="text-2xl font-semibold text-[#3A211E]"
          >
            {heading}
          </h2>

          <p className="mt-2 text-sm text-[#7A625A]">{subtitle}</p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3 lg:gap-6">
          {testimonials.map((testimonial) => (
            <article
              key={testimonial.name}
              className="flex flex-col rounded-xl border border-[#E5C78F] bg-[#FFFCF8] p-5 text-[#3A211E] shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
            >
              <RatingStars rating={testimonial.rating} />

              <p className="mt-3 flex-1 text-sm leading-relaxed text-[#5F4841]">
                “{testimonial.quote}”
              </p>

              <div className="mt-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#3A211E] text-xs font-semibold text-[#FFF8ED]">
                  {testimonial.initials}
                </div>

                <div>
                  <p className="text-sm font-semibold">{testimonial.name}</p>
                  <p className="text-xs text-[#7A625A]">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}