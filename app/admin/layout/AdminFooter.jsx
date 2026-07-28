'use client';
import React from 'react';
import Link from 'next/link';

const footerLinks = [
  { label: 'Documentation', href: '/documentation' },
  { label: 'API Reference', href: '/api-reference' },
  { label: 'Support', href: '/support' },
  { label: 'Privacy Policy', href: '/privacy' },
];

export default function AdminFooter() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-slate-100 px-6 py-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-slate-600">
          © 2026 Chocotraill. All rights reserved.
        </p>
        {/* <nav className="flex items-center gap-6" aria-label="Footer links">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav> */}
      </div>
    </footer>
  );
}
