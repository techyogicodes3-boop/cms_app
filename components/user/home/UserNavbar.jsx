'use client';

import { Menu, ShoppingCart, User, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useCartContext } from '../../../contexts/CartContext';

const navItems = [
  { label: 'Home', href: '/home' },
  { label: 'About Us', href: '/about-us' },
  { label: 'Shop All', href: '/catalogues' },
  { label: 'Corporate Gifting/Bulk Order', href: '/corporate-gifting' },
  { label: 'Contact Us', href: '/orders' },
];

function Logo({ showText = true }) {
  return (
    <Link href="/home" className="flex min-w-0 items-center justify-center gap-2.5 sm:gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[#C89A4B] bg-[#FFFCF8] shadow-[0_10px_30px_rgba(43,20,14,0.08)] sm:h-12 sm:w-14">
        <Image
          src="/image.png"
          alt="Chocotraill"
          width={617}
          height={482}
          priority
          className="h-full w-full object-contain p-1"
        />
      </div>
      {showText && (
        <div className="flex min-w-0 flex-col items-start justify-center leading-none sm:items-start">
          <div className="brand-serif truncate text-[1.35rem] font-bold leading-none text-[#2B140E] sm:text-3xl">Chocotraill</div>
          <div className="mt-1 block max-w-[172px] truncate text-[0.43rem] font-semibold uppercase leading-none tracking-[0.14em] text-[#7A625A] sm:max-w-none sm:text-[0.58rem] sm:tracking-[0.16em]">
            CUSTOMISED CHOCOLATES & GIFTING.
          </div>
        </div>
      )}
    </Link>
  );
}

function CartButton({ itemCount, mobile = false }) {
  return (
    <Link
      href="/cart"
      className={`relative inline-flex items-center justify-center gap-2 rounded-lg border border-[#C98A78] bg-[#FFFCF8] font-bold text-[#2E1A14] transition hover:bg-[#F6ECDD] ${
        mobile ? 'h-11 w-full px-4 text-sm' : 'h-11 px-4 text-sm'
      }`}
    >
      <ShoppingCart className="h-4 w-4" aria-hidden="true" />
      Cart
      {itemCount > 0 && (
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#C89A4B] px-1 text-[0.68rem] font-bold text-[#2B140E]">
          {itemCount}
        </span>
      )}
    </Link>
  );
}

export default function UserNavbar() {
  const { itemCount } = useCartContext();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [adminPromptOpen, setAdminPromptOpen] = useState(false);
  const promptRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (promptRef.current && !promptRef.current.contains(event.target)) {
        setAdminPromptOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-[70] border-b border-[#E8D8CC] bg-[#FFFCF8]/95 shadow-[0_10px_30px_rgba(43,20,14,0.06)] backdrop-blur">
        <nav className="mx-auto grid min-h-[76px] max-w-7xl grid-cols-[44px_1fr_44px] items-center gap-2 px-3 sm:min-h-20 sm:px-6 lg:flex lg:gap-6 lg:px-8" aria-label="Main navigation">
          <button
            type="button"
            onClick={() => setMobileMenuOpen((value) => !value)}
            className="flex h-11 w-11 items-center justify-center rounded-lg text-[#2E1A14] hover:bg-[#F6ECDD] lg:hidden"
            aria-label="Open menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>

          <div className="flex justify-center lg:justify-start">
            <Logo showText />
          </div>

          <div className="relative flex justify-end lg:ml-auto lg:items-center lg:gap-7" ref={promptRef}>
            <div className="hidden items-center gap-2 lg:flex">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="inline-flex h-11 items-center rounded-lg px-4 text-sm font-bold text-[#2E1A14] transition hover:bg-[#F6ECDD] hover:text-[#8D3D35]"
                >
                  {item.label}
                </Link>
              ))}
              <CartButton itemCount={itemCount} />
            </div>

            <button
              type="button"
              onClick={() => setAdminPromptOpen((value) => !value)}
              className="flex h-11 w-11 items-center justify-center rounded-lg text-[#2E1A14] hover:bg-[#F6ECDD]"
              aria-label="Admin login"
            >
              <User className="h-5 w-5" aria-hidden="true" />
            </button>

            {adminPromptOpen && (
              <div className="absolute right-0 top-12 w-[min(84vw,22rem)] overflow-hidden rounded-lg border border-[#E8D8CC] bg-[#FFFCF8] shadow-[0_16px_40px_rgba(43,20,14,0.15)]">
                <div className="border-b border-[#E8D8CC] px-4 py-4">
                  <p className="text-sm font-bold text-[#2E1A14]">Admin access only</p>
                  <p className="mt-1 text-xs leading-5 text-[#7A625A]">
                    This login is only for Chocotraill admins. Customers can continue browsing and using the cart without signing in.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2 p-3">
                  <Link
                    href="/login"
                    onClick={() => setAdminPromptOpen(false)}
                    className="inline-flex h-10 items-center justify-center rounded-lg bg-[#D85C6B] px-4 text-sm font-bold text-white hover:bg-[#4A2318]"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setAdminPromptOpen(false)}
                    className="inline-flex h-10 items-center justify-center rounded-lg border border-[#C98A78] px-4 text-sm font-bold text-[#4A2318] hover:bg-[#F6ECDD]"
                  >
                    Register
                  </Link>
                </div>
              </div>
            )}
          </div>
        </nav>

        {mobileMenuOpen && (
          <div className="border-t border-[#E8D8CC] bg-[#FFFCF8] px-3 py-3 lg:hidden">
            <div className="mx-auto grid max-w-7xl gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex h-11 items-center rounded-lg px-4 text-sm font-bold text-[#2E1A14] hover:bg-[#F6ECDD]"
                >
                  {item.label}
                </Link>
              ))}
              <CartButton itemCount={itemCount} mobile />
            </div>
          </div>
        )}
      </header>
      <div className="h-[76px] sm:h-20" aria-hidden="true" />
    </>
  );
}
