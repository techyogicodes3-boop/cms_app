import './globals.css';
import ToastProvider from '../components/providers/ToastProvider';
import QueryProvider from '../components/providers/QueryProvider';
import { CartProvider } from '../contexts/CartContext';
import { CheckoutProvider } from '../contexts/CheckoutContext';
import PwaInstallPrompt from '../components/pwa/PwaInstallPrompt';

export const metadata = {
  title: {
    default: 'Chocotraill',
    template: '%s | Chocotraill',
  },
  description: 'Premium chocolate gifting, curated hampers, custom orders, and WhatsApp checkout by Chocotraill.',
  applicationName: 'Chocotraill',
  manifest: '/manifest.json',
  keywords: ['Chocotraill', 'chocolate gifts', 'premium hampers', 'custom gifting', 'WhatsApp checkout'],
  authors: [{ name: 'Chocotraill' }],
  creator: 'Chocotraill',
  publisher: 'Chocotraill',
  openGraph: {
    title: 'Chocotraill',
    description: 'Premium chocolate gifting, curated hampers, and custom orders.',
    siteName: 'Chocotraill',
    images: [{ url: '/image.png', width: 617, height: 482, alt: 'Chocotraill' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chocotraill',
    description: 'Premium chocolate gifting, curated hampers, and custom orders.',
    images: ['/image.png'],
  },
  icons: {
    icon: '/image.png',
    shortcut: '/image.png',
    apple: '/image.png',
  },
  appleWebApp: {
    capable: true,
    title: 'Chocotraill',
    statusBarStyle: 'default',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          precedence="default" // Important for Next.js 13 App Router
        />
      </head>
      <body>
        <QueryProvider>
          <CartProvider>
            <CheckoutProvider>
            {children}
            <PwaInstallPrompt />

            </CheckoutProvider>
            <ToastProvider />
          </CartProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
