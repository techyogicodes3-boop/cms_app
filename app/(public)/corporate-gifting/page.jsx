'use client';

import { BriefcaseBusiness, Mail, MessageCircle } from 'lucide-react';
import SiteFooter from '../../../components/footer/SiteFooter';
import InquiryForm from '../../../components/user/contact/InquiryForm';
import UserNavbar from '../../../components/user/home/UserNavbar';
import { CHOCOTRAILL_CONTACT } from '../../../utils/whatsappCheckout';

const steps = [
  ['Curated Consultation', "Connect with Nisha's design studio. Share your budget, theme, and product choices."],
  ['Digital Mock-Up Catalogues', 'We formulate your customized visual catalogue and physical sample box if needed.'],
  ['Production & Assembly in Mumbai', 'We personalize, engrave, print, and package hampers under rigorous quality controls.'],
  ['All-India Warehousing & Delivery', 'Dispatched through express courier partners to homes or central offices across India.'],
];

function ProcessCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {steps.map(([title, text], index) => (
        <article
          key={title}
          className="animate-[fadeUp_700ms_ease-out_both] rounded-lg border border-[#E8D8CC] bg-[#FFFCF8] p-5 shadow-[0_10px_30px_rgba(43,20,14,0.08)]"
          style={{ animationDelay: `${index * 90}ms` }}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#C89A4B] text-sm font-black text-[#2B140E]">{index + 1}</div>
          <h2 className="mt-4 text-base font-bold text-[#2B140E]">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-[#7A625A]">{text}</p>
        </article>
      ))}
    </div>
  );
}

export default function CorporateGiftingPage() {
  return (
    <>
      <UserNavbar />
      <main className="bg-[#FFF9F3] text-[#2E1A14]">
        <section className="bg-[#2B140E] text-[#FFF9F3]">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-20">
            <div className="animate-[fadeUp_700ms_ease-out_both]">
              <div className="mb-4 inline-flex items-center gap-2 border-y border-[#C89A4B]/55 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#C89A4B]">
                <BriefcaseBusiness className="h-4 w-4" aria-hidden="true" />
                Corporate HR, Procurement, Marketing & Rewards Teams
              </div>
              <h1 className="brand-serif text-5xl font-bold leading-none sm:text-6xl lg:text-7xl">Corporate Gifting/Bulk Order</h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-[#FFF9F3]/86">
                We make procurement, logistics, and branding simple. From trial kits to bulk commercial tiers, Chocotraill handles consultation, samples, production, packaging, and delivery.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a href={`https://wa.me/${CHOCOTRAILL_CONTACT.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="ui-btn-primary">
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  WhatsApp
                </a>
                <a href={`mailto:${CHOCOTRAILL_CONTACT.email}`} className="ui-btn-secondary border-[#C89A4B] text-[#FFF9F3] hover:bg-[#C89A4B] hover:text-[#2B140E]">
                  <Mail className="h-4 w-4" aria-hidden="true" />
                  Email
                </a>
              </div>
            </div>

            <InquiryForm
              subject="Corporate gifting meeting request"
              submitLabel="Let's Schedule Meeting"
            />
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8 lg:py-14">
          <aside className="rounded-lg border border-[#E8D8CC] bg-[#FFFCF8] p-6 shadow-[0_10px_30px_rgba(43,20,14,0.08)]">
            <h2 className="brand-serif text-3xl font-bold text-[#2B140E]">Partnership Terms</h2>
            <div className="mt-5 space-y-4 text-sm leading-6 text-[#4A2318]">
              <p><span className="font-bold text-[#2B140E]">Minimum order value:</span> Trial kits starting at 20 units. Bulk commercial tiers available.</p>
              <p><span className="font-bold text-[#2B140E]">Brand personalization:</span> Logo laser engraving, screen printing, thermal foil stamping, customized ribbon setups, and packaging.</p>
              <p><span className="font-bold text-[#2B140E]">Delivery:</span> All-India dispatch to individual home addresses or central offices.</p>
            </div>
          </aside>

          <ProcessCards />
        </section>
      </main>
      <SiteFooter copyright="(c) 2026 chocotraill. All rights reserved." />
    </>
  );
}
