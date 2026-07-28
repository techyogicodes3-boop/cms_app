'use client';

import { ArrowRight, Gift, Mail, MessageCircle, PackageCheck, Sparkles } from 'lucide-react';
import Link from 'next/link';
import SiteFooter from '../../../components/footer/SiteFooter';
import UserNavbar from '../../../components/user/home/UserNavbar';
import { CHOCOTRAILL_CONTACT } from '../../../utils/whatsappCheckout';

const verticals = [
  'Artisanal Chocolates & Custom Creations',
  'Festive Hampers',
  'Corporate Gifting/Bulk Order',
  'Premium Gift Hampers',
  'Rewards & Recognition',
  'Promotional Events & Brand Marketing',
  'Healthy Snacks, Drinks & Juices',
  'Premium Desk & Stationery',
  'Drinkware & Flasks',
  'Branded Electronics & Technology',
  'Lifestyle & Sustainable Accessories',
  'Apparel & Travel Essentials',
  'Customized Keepsakes & Magnets',
];

const highlights = [
  'Premium & customized corporate gift hampers',
  'Personalized messaging and branding support',
  'Bulk order capabilities',
  'Elegant packaging',
  'Reliable corporate gift delivery across India',
];

export default function AboutUsPage() {
  return (
    <>
      <UserNavbar />
      <main className="bg-[#FFF9F3] text-[#2E1A14]">
        <section className="relative overflow-hidden bg-[#2B140E] text-[#FFF9F3]">
          {/* <div className="absolute inset-0 opacity-35">
            <img src="/image.png" alt="" className="h-full w-full object-contain object-right p-10" />
          </div> */}
          <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <div className="max-w-3xl animate-[fadeUp_700ms_ease-out_both]">
              <div className="mb-4 inline-flex items-center gap-2 border-y border-[#C89A4B]/55 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#C89A4B]">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                Founded in Mumbai, 2026
              </div>
              <h1 className="brand-serif text-5xl font-bold leading-none sm:text-6xl lg:text-7xl">About Chocotraill</h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-[#FFF9F3]/88">
                Chocotraill was founded with one clear goal: to act as your consolidated master gifting platform for premium hampers, custom chocolates, branded merchandise, and thoughtful lifestyle gifts.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href={`https://wa.me/${CHOCOTRAILL_CONTACT.whatsappNumber}`} target="_blank" className="ui-btn-primary">
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  WhatsApp
                </Link>
                <Link href={`mailto:${CHOCOTRAILL_CONTACT.email}`} className="ui-btn-secondary border-[#C89A4B] text-[#FFF9F3] hover:bg-[#C89A4B] hover:text-[#2B140E]">
                  <Mail className="h-4 w-4" aria-hidden="true" />
                  Email
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-lg border border-[#E8D8CC] bg-[#FFFCF8] p-6 shadow-[0_10px_30px_rgba(43,20,14,0.08)]">
              <h2 className="brand-serif text-3xl font-bold text-[#2B140E]">Executive Overview</h2>
              <p className="mt-4 text-sm leading-7 text-[#4A2318]">
                For years, procurement managers and individuals in India had to work with disconnected vendors to assemble one premium gift hamper: customized chocolates from one place, premium drinkware from another, diaries from a third, and packaging separately.
              </p>
              <p className="mt-4 text-sm leading-7 text-[#4A2318]">
                Chocotraill brings that workflow into one place. From high-end artisanal chocolates to luxury lifestyle goods, premium stationery, customized electronics, and sustainable gifts, we design, print, assemble, and deliver across India.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {highlights.map((item, index) => (
                <div key={item} className="animate-[fadeUp_700ms_ease-out_both] rounded-lg border border-[#E8D8CC] bg-[#FFFCF8] p-5 shadow-[0_10px_30px_rgba(43,20,14,0.06)]" style={{ animationDelay: `${index * 80}ms` }}>
                  <PackageCheck className="h-6 w-6 text-[#D85C6B]" aria-hidden="true" />
                  <p className="mt-3 text-sm font-bold leading-6 text-[#2E1A14]">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-[#E8D8CC] bg-[#FFFCF8]">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
            <div className="max-w-2xl">
              <h2 className="brand-serif text-4xl font-bold leading-none text-[#2B140E]">Core Gifting Verticals</h2>
              <p className="mt-3 text-sm leading-6 text-[#7A625A]">
                Our corporate gifting solutions are sourced directly, personalized carefully, and finished with elegant packaging.
              </p>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {verticals.map((item, index) => (
                <article key={item} className="group rounded-lg border border-[#E8D8CC] bg-[#FFF9F3] p-5 transition hover:-translate-y-0.5 hover:border-[#C98A78] hover:shadow-[0_16px_40px_rgba(43,20,14,0.12)]">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#FBE8E3] text-[#D85C6B]">
                      <Gift className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#2B140E]">{item}</p>
                      <p className="mt-2 text-xs leading-5 text-[#7A625A]">
                        {index === 0
                          ? 'Handcrafted gourmet chocolates made with premium cocoa and personalized for memorable brand experiences.'
                          : 'Curated products, thoughtful customization, and presentation designed for clients, employees, events, and milestones.'}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="flex flex-col gap-5 rounded-lg border border-[#E8D8CC] bg-[#2B140E] p-6 text-[#FFF9F3] shadow-[0_16px_40px_rgba(43,20,14,0.15)] sm:p-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="brand-serif text-4xl font-bold leading-none text-[#C89A4B]">Ready to create a premium hamper?</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#FFF9F3]/82">
                Connect with us for curated gifts, brand personalization, bulk orders, and India-wide delivery.
              </p>
            </div>
            <Link href="/corporate-gifting" className="ui-btn-primary shrink-0">
              Corporate Gifting/Bulk Order
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter copyright="(c) 2026 chocotraill. All rights reserved." />
    </>
  );
}
