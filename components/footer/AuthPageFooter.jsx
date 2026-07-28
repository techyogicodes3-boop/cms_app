import { Layers, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

// Data arrays – defined at top of file
const productLinksData = ['Features', 'Pricing', 'Integrations', 'API', 'Changelog'];
const companyLinksData = ['About Us', 'Careers', 'Blog', 'Press Kit', 'Contact'];
const supportLinksData = ['Help Center', 'Documentation', 'Community', 'Status', 'System Status'];
const legalLinksData = ['Privacy Policy', 'Terms of Service', 'Cookie Policy'];
const socialLinksData = [
  ['Facebook', '#'],
  ['Twitter', '#'],
  ['LinkedIn', '#'],
  ['Instagram', '#'],
];

const socialIcons = {
  Facebook,
  Twitter,
  LinkedIn: Linkedin,
  Instagram,
};

export default function AuthPageFooter({
  productLinks,
  companyLinks,
  supportLinks,
  legalLinks,
  socialLinks,
  copyright,
}) {
  const products = productLinks || productLinksData;
  const company = companyLinks || companyLinksData;
  const support = supportLinks || supportLinksData;
  const legal = legalLinks || legalLinksData;
  const socials = socialLinks || socialLinksData;
  const copyrightText = copyright || '© 2026 Chocotraill. All rights reserved.';

  return (
    <footer className="bg-slate-950 border-t border-slate-900" aria-labelledby="auth-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <h2 id="auth-footer" className="sr-only">
          Chocotraill authentication footer
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand / About */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-emerald-500 via-sky-500 to-blue-600 flex items-center justify-center shadow-md">
                <Layers className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <div>
                <p className="text-lg font-semibold text-white leading-tight">Chocotraill</p>
              </div>
            </div>

            <p className="mt-4 text-sm text-slate-300 leading-relaxed max-w-sm">
              Empowering businesses with focused catalogue management tools.
            </p>

            <div className="mt-5 flex items-center gap-2">
              {socials.map((link, index) => {
                const [label = '', href = '#'] = Array.isArray(link) ? link : [link, '#'];
                const Icon = socialIcons[label] || Facebook;
                return (
                  <a
                    key={label || index}
                    href={href}
                    aria-label={label}
                    className="h-9 w-9 rounded-md bg-slate-900/70 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-950"
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Product */}
          <nav aria-label="Product" className="md:col-span-1">
            <h3 className="text-sm font-semibold text-white tracking-wide">Product</h3>
            <ul className="mt-4 space-y-2 text-sm">
              {products.map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-slate-300 hover:text-white hover:underline transition-colors duration-150"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Company */}
          <nav aria-label="Company" className="md:col-span-1">
            <h3 className="text-sm font-semibold text-white tracking-wide">Company</h3>
            <ul className="mt-4 space-y-2 text-sm">
              {company.map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-slate-300 hover:text-white hover:underline transition-colors duration-150"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Support */}
          <nav aria-label="Support" className="md:col-span-1">
            <h3 className="text-sm font-semibold text-white tracking-wide">Support</h3>
            <ul className="mt-4 space-y-2 text-sm">
              {support.map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-slate-300 hover:text-white hover:underline transition-colors duration-150"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Divider */}
        <div className="mt-8 border-t border-slate-800" />

        {/* Bottom row */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs sm:text-sm text-slate-500">{copyrightText}</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs sm:text-sm text-slate-400">
            {legal.map((item) => (
              <a
                key={item}
                href="#"
                className="hover:text-white hover:underline transition-colors duration-150"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
