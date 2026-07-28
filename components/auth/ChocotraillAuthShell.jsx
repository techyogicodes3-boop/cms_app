import Link from 'next/link';
import { Briefcase, Gift, Sparkles, UserRound } from 'lucide-react';

function BrandMark() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#C89A4B] bg-[#2B140E] text-[#C89A4B] shadow-[0_12px_28px_rgba(0,0,0,0.2)]">
        <span className="brand-serif text-3xl font-bold leading-none">C</span>
      </div>
      <div>
        <div className="brand-serif text-2xl font-bold leading-none text-[#C89A4B]">chocotraill</div>
        <div className="mt-1 text-[0.52rem] font-bold uppercase tracking-[0.18em] text-[#FFF9F3]/70">
          CUSTOMISED CHOCOLATES & GIFTING.
        </div>
      </div>
    </div>
  );
}

function GiftIllustration() {
  return (
    <div className="relative h-[220px] w-full" aria-hidden="true">
      <div className="absolute bottom-2 left-4 h-40 w-[68%] -rotate-3 rounded-lg border border-[#C89A4B]/45 bg-[#3B180F] shadow-[0_20px_48px_rgba(0,0,0,0.32)]">
        <div className="absolute inset-4 rounded border border-[#C89A4B]/20" />
        <div className="absolute left-0 top-10 h-6 w-full bg-[#E9B8B0]" />
        <div className="absolute left-1/2 top-0 h-full w-6 -translate-x-1/2 bg-[#E9B8B0]" />
        <div className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#C89A4B] bg-[#2B140E] text-[#C89A4B]">
          <Gift className="h-5 w-5" />
        </div>
      </div>

      <div className="absolute bottom-0 right-0 w-[52%] rounded-lg border border-[#C89A4B]/45 bg-[#140705] p-2.5 shadow-[0_18px_42px_rgba(0,0,0,0.42)]">
        <div className="grid grid-cols-4 gap-2">
          {Array.from({ length: 16 }).map((_, index) => (
            <span
              key={index}
              className={`aspect-square rounded-md border border-[#C89A4B]/18 shadow-inner ${
                index % 5 === 0 ? 'bg-[#E9B8B0]' : index % 3 === 0 ? 'bg-[#C89A4B]' : 'bg-[#5B281B]'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="absolute bottom-6 left-0 h-12 w-12 rounded-full border border-[#C98A78]/35 bg-[#E9B8B0]/15" />
      <div className="absolute right-10 top-7 h-8 w-8 rotate-45 rounded-sm bg-[#C89A4B]/20" />
    </div>
  );
}

function Perk({ icon: Icon, title, text }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-[#C89A4B]/16 bg-[#FFF9F3]/6 p-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FFF9F3]/10 text-[#C89A4B] ring-1 ring-[#C89A4B]/20">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </div>
      <div>
        <p className="text-sm font-bold text-[#FFF9F3]">{title}</p>
        <p className="mt-0.5 text-xs leading-5 text-[#FFF9F3]/78">{text}</p>
      </div>
    </div>
  );
}

export default function ChocotraillAuthShell({ active = 'login', children }) {
  return (
    <main className="min-h-screen bg-[#FFF9F3] px-4 py-6 text-[#2E1A14] sm:px-6 lg:flex lg:items-center lg:px-8">
      <section className="mx-auto grid w-full max-w-5xl overflow-hidden rounded-2xl border border-[#E8D8CC] bg-[#FFFCF8] shadow-[0_16px_40px_rgba(43,20,14,0.13)] lg:min-h-[590px] lg:grid-cols-[45fr_55fr]">
        <aside className="relative hidden overflow-hidden bg-[#2B140E] text-[#FFF9F3] lg:block">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_16%,rgba(233,184,176,0.16),transparent_18%),radial-gradient(circle_at_86%_12%,rgba(201,154,75,0.14),transparent_22%),linear-gradient(135deg,#2B140E_0%,#4A2318_58%,#1C0A06_100%)]" />
          <div className="relative z-10 flex h-full flex-col justify-between gap-5 p-8 xl:p-9">
            <BrandMark />

            <div className="max-w-[380px]">
              <div className="mb-4 inline-flex items-center gap-2 border-y border-[#C89A4B]/35 py-1.5 text-[0.62rem] font-bold uppercase tracking-[0.22em] text-[#C89A4B]">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                Welcome to Chocotraill
              </div>
              <h1 className="brand-serif text-4xl font-bold leading-[0.98] xl:text-5xl">
                Sign in to your
                <span className="block text-[#E9B8B0]">world of joy</span>
              </h1>
              <p className="mt-4 max-w-sm text-sm leading-6 text-[#FFF9F3]/84">
                Manage addresses, order gifts faster, and keep every celebration beautifully wrapped.
              </p>
            </div>

            <GiftIllustration />

            <div className="grid gap-2.5">
          <Perk icon={Gift} title="Premium Gifts" text="Gifts crafted for every occasion." />
<Perk icon={Briefcase} title="Easy Ordering" text="Order quickly through WhatsApp." />
<Perk icon={UserRound} title="Special Offers" text="Enjoy exclusive seasonal deals." />
            </div>
          </div>
        </aside>

        <div className="flex items-center justify-center px-5 py-7 sm:px-8 lg:px-10 xl:px-12">
          <div className="w-full max-w-[430px]">
            <div className="mb-5 grid grid-cols-2 rounded-lg border border-[#E8D8CC] bg-[#FFF9F3] p-1 text-center text-sm font-bold">
              <Link
                href="/login"
                className={`rounded-md px-4 py-3 transition ${
                  active === 'login'
                    ? 'bg-[#FFFCF8] text-[#2E1A14] shadow-[0_10px_30px_rgba(43,20,14,0.08)] ring-1 ring-[#E9B8B0]'
                    : 'text-[#7A625A] hover:text-[#C98A78]'
                }`}
              >
                Login
              </Link>
              <Link
                href="/register"
                className={`rounded-md px-4 py-3 transition ${
                  active === 'register'
                    ? 'bg-[#FFFCF8] text-[#2E1A14] shadow-[0_10px_30px_rgba(43,20,14,0.08)] ring-1 ring-[#E9B8B0]'
                    : 'text-[#7A625A] hover:text-[#C98A78]'
                }`}
              >
                Register
              </Link>
            </div>

            <div className="rounded-lg border border-[#E8D8CC] bg-[#FFFCF8] p-5 shadow-[0_10px_28px_rgba(43,20,14,0.06)]">
              {children}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
