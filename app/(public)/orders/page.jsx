'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Clock,
  Gift,
  Headphones,
  Heart,
  LockKeyhole,
  Mail,
  MapPin,
  MessageCircle,
  Package,
  Phone,
  RotateCcw,
  Store,
} from 'lucide-react';
import UserNavbar from '../../../components/user/home/UserNavbar';
import InquiryForm from '../../../components/user/contact/InquiryForm';
import SiteFooter from '../../../components/footer/SiteFooter';
import { buildWhatsAppInquiryUrl, CHOCOTRAILL_CONTACT } from '../../../utils/whatsappCheckout';

const contactDetails = {
  phone: CHOCOTRAILL_CONTACT.phoneDisplay,
  whatsapp: CHOCOTRAILL_CONTACT.whatsappNumber,
  email: CHOCOTRAILL_CONTACT.email,
  address: ['Chocotraill', '1104, Signature By Peridot,', 'Azad Nagar, Veera Desai Road,', 'Andheri West - 400058'],
  hours: ['Monday - Saturday', '10:00 AM - 7:00 PM (IST)'],
};

const trustBadges = [
  {
    icon: Headphones,
    title: 'Quick Support',
    text: 'Real people. Real fast responses.',
  },
  {
    icon: LockKeyhole,
    title: 'Your Privacy',
    text: 'Your details are safe with us.',
  },
  {
    icon: Heart,
    title: 'Made with Love',
    text: 'Every gift is packed with care.',
  },
];

const supportCards = [
  {
    icon: Package,
    title: 'Order Support',
    text: 'Help with orders, tracking & deliveries',
  },
  {
    icon: Gift,
    title: 'Product Queries',
    text: 'Know more about our chocolates & gifts',
  },
  {
    icon: Gift,
    title: 'Custom & Bulk Orders',
    text: 'Corporate gifting, events & bulk requirements',
  },
  {
    icon: RotateCcw,
    title: 'Returns & Refunds',
    text: 'Hassle-free returns & refund assistance',
  },
  {
    icon: MessageCircle,
    title: 'Feedback & Suggestions',
    text: 'We love hearing from you and improving',
  },
];

export default function ContactPage() {
  const whatsappUrl = useMemo(() => {
    return buildWhatsAppInquiryUrl({
      subject: 'Visit booking',
      message: 'I would like to book a visit with the Chocotraill team.',
    });
  }, []);

  return (
    <>
      <UserNavbar />

      <main className="min-h-screen bg-[#FFF9F3] text-[#2E1A14]">
        <section className="border-b border-[#E8D8CC] bg-[#FFF9F3]">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <nav className="mb-3 flex items-center gap-2 text-xs font-semibold text-[#7A625A]" aria-label="Breadcrumb">
              <Link href="/home" className="hover:text-[#D85C6B]">Home</Link>
              <span className="text-[#C98A78]">›</span>
              <span className="text-[#4A2318]">Contact Us</span>
            </nav>

            <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
              <div className="max-w-2xl">
                <h1 className="brand-serif text-5xl font-bold leading-none text-[#2B140E] sm:text-6xl">Contact Us</h1>
                <p className="mt-4 max-w-xl text-sm leading-6 text-[#4A2318] sm:text-base sm:leading-7">
                  We&apos;re here to help and make your gifting experience delightful. Reach out to us for queries, custom orders, bulk gifting, or any assistance you need.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {trustBadges.map((badge) => {
                  const Icon = badge.icon;
                  return (
                    <div key={badge.title} className="flex items-start gap-3 rounded-lg border border-transparent p-2">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#E9B8B0]/35 text-[#D85C6B]">
                        <Icon className="h-6 w-6" aria-hidden="true" />
                      </div>
                      <div>
                        <h2 className="brand-serif text-base font-bold leading-tight text-[#2B140E]">{badge.title}</h2>
                        <p className="mt-1 text-xs leading-4 text-[#4A2318]">{badge.text}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="grid gap-5 xl:grid-cols-[0.82fr_1.55fr_1.05fr]">
            <aside className="rounded-lg border border-[#E8D8CC] bg-[#FFFCF8] p-5 shadow-[0_10px_30px_rgba(43,20,14,0.08)] sm:p-6">
              <h2 className="brand-serif text-2xl font-bold text-[#4A2318]">Get in Touch</h2>

              <div className="mt-6 space-y-6">
                <div className="flex gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#E9B8B0]/35 text-[#8D3D35]">
                    <MapPin className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#2B140E]">Our Address</h3>
                    <div className="mt-1 text-sm leading-5 text-[#4A2318]">
                      {contactDetails.address.map((line) => (
                        <p key={line}>{line}</p>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#E9B8B0]/35 text-[#8D3D35]">
                    <Phone className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#2B140E]">Phone</h3>
                    <a href={`tel:${contactDetails.phone.replace(/\s/g, '')}`} className="mt-1 block text-sm font-medium text-[#4A2318] hover:text-[#D85C6B]">
                      {contactDetails.phone}
                    </a>
                    <p className="text-sm text-[#4A2318]">(10:00 AM - 7:00 PM IST)</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#E9B8B0]/35 text-[#8D3D35]">
                    <Mail className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#2B140E]">Email</h3>
                    <a href={`mailto:${contactDetails.email}`} className="mt-1 block text-sm font-medium text-[#4A2318] hover:text-[#D85C6B]">
                      {contactDetails.email}
                    </a>
                    <p className="text-sm text-[#4A2318]">We reply within 24 hours</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#E9B8B0]/35 text-[#8D3D35]">
                    <Clock className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#2B140E]">Working Hours</h3>
                    <div className="mt-1 text-sm leading-5 text-[#4A2318]">
                      {contactDetails.hours.map((line) => (
                        <p key={line}>{line}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            <section className="rounded-lg border border-[#E8D8CC] bg-[#FFFCF8] p-4 shadow-[0_10px_30px_rgba(43,20,14,0.08)] sm:p-5">
              <h2 className="brand-serif text-2xl font-bold text-[#4A2318]">Find Us</h2>
              <div className="mt-4 overflow-hidden rounded-lg border border-[#E8D8CC] bg-[#F6ECDD]">
                <iframe
                  title="Chocotraill location map"
                  src="https://www.google.com/maps?q=1104%20Signature%20By%20Peridot%20Azad%20Nagar%20Veera%20Desai%20Road%20Andheri%20West%20400058&output=embed"
                  className="h-72 w-full border-0 sm:h-80 xl:h-[310px]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>

              <div className="mt-4 flex flex-col gap-4 rounded-lg border border-[#E8D8CC] bg-[#FBE8E3] p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-[#C98A78]/45 bg-[#FFFCF8] text-[#8D3D35]">
                    <Store className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#2B140E]">Experience Chocotraill in person</h3>
                    <p className="mt-1 max-w-md text-sm leading-5 text-[#4A2318]">
                      Visit our gifting studio by appointment for custom hampers, corporate gifting, and exclusive collections.
                    </p>
                  </div>
                </div>
                {/* <Link
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg border border-[#C98A78] bg-[#FFFCF8] px-5 text-sm font-bold text-[#8D3D35] hover:bg-[#4A2318] hover:text-white"
                >
                  Book a Visit
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link> */}
              </div>
            </section>

            <div>
              <InquiryForm
                title="Send Us a Message"
                description=""
                subject="Contact page inquiry"
                submitLabel="Send Message"
              />
              <p className="mt-5 flex items-center justify-center gap-2 text-center text-xs font-semibold text-[#7A625A]">
                <LockKeyhole className="h-4 w-4 text-[#4A2318]" aria-hidden="true" />
                We respect your privacy. Your information is safe with us.
              </p>
            </div>
          </div>

          <section className="mt-6 rounded-lg border border-[#E8D8CC] bg-[#FFFCF8] p-5 shadow-[0_10px_30px_rgba(43,20,14,0.06)] sm:p-6">
            <div className="mb-5 flex items-center justify-center gap-4">
              <span className="hidden h-px w-28 bg-[#C98A78]/45 sm:block" />
              <h2 className="brand-serif text-center text-2xl font-bold text-[#4A2318] sm:text-3xl">We&apos;re here for you at every step</h2>
              <span className="hidden h-px w-28 bg-[#C98A78]/45 sm:block" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {supportCards.map((card) => {
                const Icon = card.icon;
                return (
                  <div key={card.title} className="flex items-center gap-3 rounded-lg border border-[#E8D8CC] bg-[#FFF9F3] p-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#E9B8B0]/35 text-[#D85C6B]">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#2B140E]">{card.title}</h3>
                      <p className="mt-1 text-xs leading-4 text-[#4A2318]">{card.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </section>
      </main>

      <SiteFooter
        quickLinks={['Home', 'Catalogues', 'Contact']}
        supportLinks={['Help Center', 'Contact Us', 'FAQs', 'Shipping Info', 'Returns']}
        legalLinks={['Privacy Policy', 'Terms of Service', 'Cookie Policy']}
        socialLinks={[
          ['Facebook', '#'],
          ['Twitter', '#'],
          ['LinkedIn', '#'],
          ['Instagram', '#'],
        ]}
        copyright="© 2026 chocotraill. All rights reserved."
      />
    </>
  );
}
