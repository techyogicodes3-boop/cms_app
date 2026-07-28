'use client';

import { Download, Sparkles, Smartphone, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { getClientAuthState } from '../../utils/authStorage';

const DISMISSED_KEY = 'chocotraillPwaInstallDismissed:v2';
const INSTALLED_KEY = 'chocotraillPwaInstalled';

function isStandalone() {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia?.('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
  );
}

function storageHas(key) {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(key) === 'true';
}

function registerServiceWorker() {
  if (typeof window === 'undefined') return;
  if (!('serviceWorker' in navigator)) return;

  const register = () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  };

  if (document.readyState === 'complete') {
    register();
  } else {
    window.addEventListener('load', register, { once: true });
  }
}

export default function PwaInstallPrompt() {
  const pathname = usePathname();
  const [installEvent, setInstallEvent] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [dismissed, setDismissed] = useState(() => storageHas(DISMISSED_KEY));
  const [installed, setInstalled] = useState(() => storageHas(INSTALLED_KEY) || isStandalone());
  const [waitingForPrompt, setWaitingForPrompt] = useState(false);

  const isAuthRoute = useMemo(() => pathname === '/' || pathname === '/login', [pathname]);
  const shouldShow =
    !isAuthRoute &&
    authReady &&
    !installed &&
    !dismissed &&
    !isStandalone();

  useEffect(() => {
    registerServiceWorker();

    const syncAuth = () => {
      const auth = getClientAuthState();
      setAuthReady(auth.isAuthenticated);
    };

    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setInstallEvent(event);
      setWaitingForPrompt(false);
    };

    const handleInstalled = () => {
      localStorage.setItem(INSTALLED_KEY, 'true');
      setInstallEvent(null);
      setInstalled(true);
    };

    syncAuth();
    window.addEventListener('token-changed', syncAuth);
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleInstalled);

    return () => {
      window.removeEventListener('token-changed', syncAuth);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  const handleCancel = () => {
    localStorage.setItem(DISMISSED_KEY, 'true');
    setDismissed(true);
  };

  const handleInstall = async () => {
    if (!installEvent) {
      setWaitingForPrompt(true);
      return;
    }

    const promptEvent = installEvent;
    setInstallEvent(null);
    promptEvent.prompt();
    const choice = await promptEvent.userChoice.catch(() => ({ outcome: 'dismissed' }));

    if (choice?.outcome === 'accepted') {
      localStorage.setItem(INSTALLED_KEY, 'true');
      setInstalled(true);
    } else {
      localStorage.setItem(DISMISSED_KEY, 'true');
      setDismissed(true);
    }
  };

  if (!shouldShow) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-[#2B140E]/45 px-4 py-6 backdrop-blur-sm">
      <div className="relative w-full max-w-md overflow-hidden rounded-lg border border-[#E8D8CC] bg-[#FFFCF8] p-5 text-[#2E1A14] shadow-[0_24px_70px_rgba(43,20,14,0.28)] sm:p-6">
        <button
          type="button"
          onClick={handleCancel}
          className="absolute right-3 top-3 inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-[#7A625A] transition hover:bg-[#F6ECDD] hover:text-[#4A2318] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C89A4B]"
          aria-label="Close app install prompt"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>

        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#F6ECDD] text-[#B27A2E] ring-1 ring-[#C89A4B]/30">
          <Smartphone className="h-8 w-8" aria-hidden="true" />
        </div>

        <div className="mt-4 text-center">
          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-[#FFF4DB] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#9B6E24]">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            Faster access
          </div>
          <h2 className="brand-serif text-3xl font-bold leading-none text-[#3A211E]">
            Add Chocotraill to your home screen
          </h2>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#7A625A]">
            {installEvent
              ? 'Install the app for quick access to catalogues, cart, checkout, and admin tools without opening the browser every time.'
              : 'Your browser is preparing the app install option. Keep this open for a moment, then tap Add.'}
          </p>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={handleInstall}
            className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#4A2318] px-4 text-sm font-bold text-white transition hover:bg-[#2B140E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C89A4B]"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            {waitingForPrompt && !installEvent ? 'Preparing...' : 'Add to Home Screen'}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="inline-flex min-h-12 cursor-pointer items-center justify-center rounded-lg border border-[#E8D8CC] px-4 text-sm font-bold text-[#4A2318] transition hover:bg-[#F6ECDD] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C89A4B]"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
}
