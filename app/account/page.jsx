'use client';

import { useEffect, useMemo, useState } from 'react';
import { Edit3, MapPin, Package, Save, ShoppingCart, UserRound } from 'lucide-react';
import toast from 'react-hot-toast';
import AuthGuard from '../../components/auth/AuthGuard';
import UserNavbar from '../../components/user/home/UserNavbar';
import SiteFooter from '../../components/footer/SiteFooter';
import { useCartContext } from '../../contexts/CartContext';
import api from '../../utils/axios';
import { firstValidationMessage, validateProfileForm } from '../../utils/formValidation';

const blankProfile = {
  name: '', email: '', phone: '',
  address: { streetAddress: '', city: '', state: '', zipcode: '' },
};

function money(value) {
  return `₹${Number(value || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function AccountPage() {
  const { itemCount, cart } = useCartContext();
  const [data, setData] = useState({ profile: blankProfile, orders: [], stats: {} });
  const [profile, setProfile] = useState(blankProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    let active = true;
    api.get('/api/v1/user/dashboard')
      .then((response) => {
        if (!active) return;
        const next = response.data?.data || {};
        const nextProfile = { ...blankProfile, ...(next.profile || {}), address: { ...blankProfile.address, ...(next.profile?.address || {}) } };
        setData({ ...next, profile: nextProfile, orders: next.orders || [], stats: next.stats || {} });
        setProfile(nextProfile);
      })
      .catch((error) => toast.error(error?.response?.status === 404
        ? 'Account service is currently unavailable. Please try again shortly.'
        : error?.response?.data?.message || 'Could not load your account.'))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  const activeCartLines = useMemo(() => cart?.items?.length || 0, [cart?.items]);

  const update = (field, value) => {
    const nextValue = field === 'phone' ? value.replace(/\D/g, '').slice(0, 10) : value;
    setProfile((current) => ({ ...current, [field]: nextValue }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };
  const updateAddress = (field, value) => {
    const nextValue = field === 'zipcode' ? value.replace(/\D/g, '').slice(0, 6) : value;
    setProfile((current) => ({
      ...current,
      address: { ...current.address, [field]: nextValue },
    }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const saveProfile = async (event) => {
    event.preventDefault();
    const nextErrors = validateProfileForm(profile);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      toast.error(firstValidationMessage(nextErrors));
      return;
    }

    setSaving(true);
    try {
      const response = await api.put('/api/v1/user/profile', {
        name: profile.name.trim(),
        email: profile.email.trim().toLowerCase(),
        phone: profile.phone.trim(),
        address: Object.fromEntries(Object.entries(profile.address).map(([key, value]) => [key, value.trim()])),
      });
      const saved = response.data?.data?.profile;
      if (!response.data?.success || !saved) throw new Error('Profile update failed.');
      setData((current) => ({ ...current, profile: saved }));
      setProfile({ ...blankProfile, ...saved, address: { ...blankProfile.address, ...(saved.address || {}) } });
      const stored = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({ ...stored, ...saved }));
      window.dispatchEvent(new Event('token-changed'));
      setEditing(false);
      toast.success('Profile updated');
    } catch (error) {
      const message = error?.response?.status === 404
        ? 'Profile service is currently unavailable. Please try again shortly.'
        : error?.response?.data?.message || error.message || 'Could not update profile.';
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AuthGuard requiredRole="user">
      <UserNavbar />
      <main className="min-h-screen bg-[#FFF9F3] px-4 py-8 text-[#2E1A14] sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#D85C6B]">My account</p>
            <h1 className="brand-serif mt-2 text-4xl font-bold">Welcome{data.profile.name ? `, ${data.profile.name.split(' ')[0]}` : ''}</h1>
            <p className="mt-2 text-sm text-[#7A625A]">Manage your details and review every WhatsApp order inquiry you submitted.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              [Package, 'Orders placed', data.stats.orders || 0],
              [ShoppingCart, 'Items in cart', itemCount],
              [ShoppingCart, 'Cart product lines', activeCartLines],
            ].map(([Icon, label, value]) => (
              <div key={label} className="rounded-lg border border-[#E8D8CC] bg-[#FFFCF8] p-5 shadow-[0_10px_30px_rgba(43,20,14,0.07)]">
                <Icon className="h-6 w-6 text-[#D85C6B]" />
                <p className="mt-4 text-sm font-semibold text-[#7A625A]">{label}</p>
                <p className="brand-serif mt-1 text-4xl font-bold">{loading ? '…' : value}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-[0.85fr_1.35fr]">
            <section className="rounded-lg border border-[#E8D8CC] bg-[#FFFCF8] p-5 shadow-[0_10px_30px_rgba(43,20,14,0.07)] sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3"><UserRound className="h-6 w-6 text-[#D85C6B]" /><h2 className="brand-serif text-2xl font-bold">Profile</h2></div>
                {!editing && <button type="button" onClick={() => { setErrors({}); setEditing(true); }} className="inline-flex items-center gap-2 rounded-lg border border-[#C98A78] px-3 py-2 text-sm font-bold hover:bg-[#F6ECDD]"><Edit3 className="h-4 w-4" /> Edit</button>}
              </div>

              <form onSubmit={saveProfile} noValidate className="mt-5 space-y-4">
                <label className="block text-sm font-semibold">Full name<input required disabled={!editing} value={profile.name} maxLength={120} onChange={(event) => update('name', event.target.value)} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'profile-name-error' : undefined} className={`mt-1.5 h-11 w-full rounded-lg border bg-[#FFF9F3] px-3 disabled:opacity-70 ${errors.name ? 'border-[#D95C5C]' : 'border-[#E8D8CC]'}`} />{errors.name && <span id="profile-name-error" className="mt-1 block text-xs text-[#D95C5C]" role="alert">{errors.name}</span>}</label>
                <label className="block text-sm font-semibold">Email<input type="email" required disabled={!editing} value={profile.email} maxLength={254} onChange={(event) => update('email', event.target.value)} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'profile-email-error' : undefined} className={`mt-1.5 h-11 w-full rounded-lg border bg-[#FFF9F3] px-3 disabled:opacity-70 ${errors.email ? 'border-[#D95C5C]' : 'border-[#E8D8CC]'}`} />{errors.email && <span id="profile-email-error" className="mt-1 block text-xs text-[#D95C5C]" role="alert">{errors.email}</span>}</label>
                <label className="block text-sm font-semibold">Phone<input type="tel" inputMode="numeric" disabled={!editing} value={profile.phone} maxLength={10} onChange={(event) => update('phone', event.target.value)} aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? 'profile-phone-error' : undefined} className={`mt-1.5 h-11 w-full rounded-lg border bg-[#FFF9F3] px-3 disabled:opacity-70 ${errors.phone ? 'border-[#D95C5C]' : 'border-[#E8D8CC]'}`} />{errors.phone && <span id="profile-phone-error" className="mt-1 block text-xs text-[#D95C5C]" role="alert">{errors.phone}</span>}</label>
                <div className="flex items-center gap-2 pt-2 text-sm font-bold"><MapPin className="h-4 w-4 text-[#D85C6B]" /> Default address</div>
                <label className="block text-sm font-semibold">Street address<input disabled={!editing} value={profile.address.streetAddress} maxLength={300} onChange={(event) => updateAddress('streetAddress', event.target.value)} aria-invalid={Boolean(errors.streetAddress)} aria-describedby={errors.streetAddress ? 'profile-streetAddress-error' : undefined} className={`mt-1.5 h-11 w-full rounded-lg border bg-[#FFF9F3] px-3 disabled:opacity-70 ${errors.streetAddress ? 'border-[#D95C5C]' : 'border-[#E8D8CC]'}`} />{errors.streetAddress && <span id="profile-streetAddress-error" className="mt-1 block text-xs text-[#D95C5C]" role="alert">{errors.streetAddress}</span>}</label>
                <div className="grid gap-3 sm:grid-cols-2">
                  {['city', 'state', 'zipcode'].map((field) => <label key={field} className="block text-sm font-semibold capitalize">{field === 'zipcode' ? 'PIN code' : field}<input inputMode={field === 'zipcode' ? 'numeric' : undefined} disabled={!editing} value={profile.address[field]} maxLength={field === 'zipcode' ? 6 : 100} onChange={(event) => updateAddress(field, event.target.value)} aria-invalid={Boolean(errors[field])} aria-describedby={errors[field] ? `profile-${field}-error` : undefined} className={`mt-1.5 h-11 w-full rounded-lg border bg-[#FFF9F3] px-3 disabled:opacity-70 ${errors[field] ? 'border-[#D95C5C]' : 'border-[#E8D8CC]'}`} />{errors[field] && <span id={`profile-${field}-error`} className="mt-1 block text-xs normal-case text-[#D95C5C]" role="alert">{errors[field]}</span>}</label>)}
                </div>
                {editing && <div className="flex gap-2 pt-2"><button disabled={saving} className="inline-flex h-11 items-center gap-2 rounded-lg bg-[#D85C6B] px-4 text-sm font-bold text-white disabled:opacity-60"><Save className="h-4 w-4" /> {saving ? 'Saving…' : 'Save profile'}</button><button type="button" onClick={() => { setErrors({}); setProfile({ ...data.profile, address: { ...data.profile.address } }); setEditing(false); }} className="h-11 rounded-lg border border-[#E8D8CC] px-4 text-sm font-bold">Cancel</button></div>}
              </form>
            </section>

            <section className="overflow-hidden rounded-lg border border-[#E8D8CC] bg-[#FFFCF8] shadow-[0_10px_30px_rgba(43,20,14,0.07)]">
              <div className="border-b border-[#E8D8CC] px-5 py-5 sm:px-6"><h2 className="brand-serif text-2xl font-bold">Previous orders</h2><p className="mt-1 text-sm text-[#7A625A]">Orders are recorded before you continue to WhatsApp.</p></div>
              {loading ? <p className="p-6 text-sm text-[#7A625A]">Loading orders…</p> : data.orders.length === 0 ? <p className="p-6 text-sm text-[#7A625A]">No orders submitted yet.</p> : (
                <div className="divide-y divide-[#E8D8CC]">
                  {data.orders.map((order) => <article key={order.uuid} className="p-5 sm:p-6">
                    <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="font-bold">Order #{order.uuid.slice(0, 8)}</p><p className="mt-1 text-xs text-[#7A625A]">{new Date(order.createdAt).toLocaleString('en-IN')}</p></div><span className="rounded-full bg-[#F6ECDD] px-3 py-1 text-xs font-bold capitalize text-[#8D3D35]">{String(order.status).replaceAll('_', ' ')}</span></div>
                    <ul className="mt-4 space-y-2 text-sm">{order.items.map((item, index) => <li key={`${item.catalogueItemId}-${index}`} className="flex justify-between gap-3"><span>{item.name} × {item.quantity}</span><span className="font-semibold">{money(item.lineTotal)}</span></li>)}</ul>
                    <div className="mt-4 flex justify-between border-t border-[#E8D8CC] pt-3 font-bold"><span>Total</span><span>{money(order.total)}</span></div>
                  </article>)}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
      <SiteFooter />
    </AuthGuard>
  );
}
