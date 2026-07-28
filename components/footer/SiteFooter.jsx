'use client';

import {
  ChevronUp,
  Instagram,
  Mail,
  MapPin,
  Phone,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { CHOCOTRAILL_CONTACT } from '../../utils/whatsappCheckout';

const shopLinks = ['Chocolates', 'Surprise Boxes', 'Personalized Gifts', 'Gift Combos', 'All Products'];
const occasionLinks = ['Birthday', 'Anniversary', "Valentine's Day", 'Raksha Bandhan', 'All Occasions'];
const instagramUrl = 'https://www.instagram.com/chocotraill?utm_source=qr&igsh=ZWdjd3hkbnIybGh2';

function FooterLogo() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-lg border border-[#C89A4B] bg-[#FFFCF8]">
        <Image
          src="/image.png"
          alt="Chocotraill"
          width={617}
          height={482}
          className="h-full w-full object-contain p-1"
        />
      </div>
      <div>
        <div className="brand-serif text-3xl font-bold leading-none text-[#C89A4B]">chocotraill</div>
        <div className="mt-2 max-w-[180px] text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-[#FFF9F3]">
          CUSTOMISED CHOCOLATES & GIFTING.
        </div>
      </div>
    </div>
  );
}

function FooterColumn({ title, links }) {
  return (
    <nav aria-label={title}>
      <h3 className="brand-serif mb-4 text-lg font-bold uppercase tracking-[0.12em] text-[#C89A4B]">{title}</h3>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link}>
            <p className="text-sm font-medium text-[#FFF9F3] transition hover:text-[#C89A4B]">
              {link}
            </p>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default function SiteFooter({ copyright }) {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <footer className="bg-[#2B140E] text-[#FFF9F3]" aria-labelledby="site-footer">
      <h2 id="site-footer" className="sr-only">Chocotraill footer</h2>

      

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-8 sm:px-6 lg:grid-cols-[240px_1fr] lg:items-start lg:gap-16 lg:px-8">
        <div className="max-w-md">
          <FooterLogo />
          <div className="mt-7 flex items-center gap-3">
            {[Instagram].map((Icon, index) => (
              <a
                key={index}
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#C89A4B] text-[#FFF9F3] transition hover:bg-[#C89A4B] hover:text-[#2B140E]"
                aria-label="Instagram"
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-3 lg:ml-auto lg:w-full lg:max-w-[990px] lg:grid-cols-[1fr_1.1fr_1.25fr] lg:justify-items-start">
          <FooterColumn title="Shop" links={shopLinks} />
          <FooterColumn title="Occasions" links={occasionLinks} />

          <div className="w-full max-w-sm">
            <h3 className="brand-serif mb-4 text-lg font-bold uppercase tracking-[0.12em] text-[#C89A4B]">Contact Us</h3>
            <ul className="space-y-3 text-sm font-medium text-[#FFF9F3]">
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#C89A4B]" aria-hidden="true" />
                <a href={`tel:${CHOCOTRAILL_CONTACT.phoneHref}`} className="hover:text-[#C89A4B]">
                  {CHOCOTRAILL_CONTACT.phoneDisplay}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#C89A4B]" aria-hidden="true" />
                <a href={`mailto:${CHOCOTRAILL_CONTACT.email}`} className="hover:text-[#C89A4B]">
                  {CHOCOTRAILL_CONTACT.email}
                </a>
              </li>
              <li className="flex items-start gap-3 leading-5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#C89A4B]" aria-hidden="true" />
                <span>1104, Signature By Peridot, Azad Nagar, Veera Desai Road, Andheri West - 400058</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-[#C89A4B]/35">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-5 text-xs text-[#FFF9F3]/80 sm:px-6 md:flex-row lg:px-8">
          <p>{copyright || '© 2026 Chocotraill. All Rights Reserved.'}</p>
          {/* <div className="flex items-center gap-2">
            {['SSL SECURED', 'UPI', 'VISA', 'RuPay', 'Paytm'].map((label) => (
              <span key={label} className="rounded border border-[#E8D8CC] bg-[#FFFCF8] px-2.5 py-1 font-bold text-[#2B140E]">
                {label}
              </span>
            ))}
          </div> */}
        </div>
      </div>

      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Scroll to top"
          className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-[#C89A4B] bg-[#2B140E] text-[#C89A4B] shadow-[0_16px_40px_rgba(43,20,14,0.15)] hover:bg-[#C89A4B] hover:text-[#2B140E]"
        >
          <ChevronUp className="h-5 w-5" aria-hidden="true" />
        </button>
      )}
    </footer>
  );
}
