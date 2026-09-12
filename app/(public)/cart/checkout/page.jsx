'use client';

import { MessageCircle, Shield } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import UserNavbar from '../../../../components/user/home/UserNavbar';
import SiteFooter from '../../../../components/footer/SiteFooter';
import CheckoutStepper from '../../../../components/user/checkout/CheckoutStepper';
import DeliveryInformationForm from '../../../../components/user/checkout/DeliveryInformationForm';
import CheckoutOrderSummary from '../../../../components/user/checkout/CheckoutOrderSummary';
import ShippingMethodSelector from '../../../../components/user/checkout/ShippingMethodSelector';
import SecurityBadges from '../../../../components/user/checkout/SecurityBadges';
import HelpSection from '../../../../components/user/checkout/HelpSection';
import FAQSection from '../../../../components/user/checkout/FAQSection';
import { useCartContext } from '../../../../contexts/CartContext';
import { useCartItemsData } from '../../../../hooks/useCartItemsData';
import { useCheckout } from '../../../../contexts/CheckoutContext';
import { buildWhatsAppCheckoutUrl, calculateCartAmounts, parseCartPrice } from '../../../../utils/whatsappCheckout';
import api from '../../../../utils/axios';


export default function CheckoutPage() {
  const { address, shippingMethod, setShippingMethod } = useCheckout();

  const router = useRouter();
  const { cart, isLoading: cartLoading, error: cartError, refetch: refetchCart } = useCartContext();
  const [selectedShippingMethod, setSelectedShippingMethod] = useState('standard');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Refetch cart data on mount to ensure fresh data
  useEffect(() => {
    refetchCart();

    // Clear localStorage checkout data on mount (we use live cart data now)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('checkoutCartItems');
      localStorage.removeItem('checkoutTotals');
    }
  }, [refetchCart]);

  // Memoize cart items array
  const cartItemsArray = useMemo(() => {
    return cart?.items || [];
  }, [cart?.items]);

  // Use custom hook to fetch and transform cart items with product details
  const { items: orderItems, isLoading: itemsLoading } = useCartItemsData(cartItemsArray);

  const isLoading = cartLoading || itemsLoading;

  // Redirect to cart if empty
  useEffect(() => {
    if (!cartLoading && !itemsLoading && (!orderItems || orderItems.length === 0)) {
      router.replace('/cart');
    }
  }, [cartLoading, itemsLoading, orderItems, router]);

  const totals = useMemo(() => {
    if (!orderItems || orderItems.length === 0) {
      return {
        subtotal: '0',
        shipping: '0',
        tax: '0',
        discount: '0',
        total: '0',
      };
    }
  
    const amounts = calculateCartAmounts(orderItems);
  
    return {
      subtotal: amounts.subtotal.toFixed(2),
      shipping: amounts.shipping.toFixed(2),
      tax: amounts.tax.toFixed(2),
      discount: amounts.discount.toFixed(2),
      total: amounts.total.toFixed(2),
    };
  }, [orderItems]);
  

  // Show loading or error state
  if (isLoading) {
    return (
      <>
        <UserNavbar />
        <CheckoutStepper currentStep={2} />
        <main className="bg-slate-50 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="mt-4 text-sm text-slate-600">Loading checkout...</p>
          </div>
        </main>
      </>
    );
  }

  if (cartError) {
    return (
      <>
        <UserNavbar />
        <CheckoutStepper currentStep={2} />
        <main className="bg-slate-50 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-base text-slate-600">Failed to load cart. Redirecting...</p>
          </div>
        </main>
      </>
    );
  }

  // Redirect if cart is empty
  if (!orderItems || orderItems.length === 0) {
    return null; // useEffect will handle redirect
  }

  const validateDeliveryAddress = () => {
  const requiredFields = [
    'firstName',
    'lastName',
    'email',
    'phoneNo',
    'streetAddress',
    'city',
    'state',
    'zipcode',
  ];

  for (let field of requiredFields) {
    if (!address?.[field]?.trim()) {
      toast.error('Please complete all required delivery fields');
      return false;
    }
  }

  // Email check
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address.email)) {
    toast.error('Enter a valid email address');
    return false;
  }

  // Phone check
  if (!/^[0-9+\-\s()]{7,15}$/.test(address.phoneNo)) {
    toast.error('Enter a valid phone number');
    return false;
  }

  return true;
};


  const handleShippingMethodChange = (method) => {
    setSelectedShippingMethod(method.id);
  };

const handleConfirmPurchase = async () => {
  // 1️⃣ Check Terms
  if (!termsAccepted) {
    toast.error('Please accept Terms & Conditions');
    return;
  }

  // 2️⃣ Validate Delivery Form
  if (!validateDeliveryAddress()) {
    return;
  }

  if (submitting) return;
  const customer = {
    name: `${address.firstName} ${address.lastName}`.trim(),
    phone: address.phoneNo,
    address: [address.streetAddress, address.city, address.state, address.zipcode]
      .filter(Boolean)
      .join(', '),
    message: address.email ? `Email: ${address.email}` : '',
  };

  setSubmitting(true);
  try {
    const response = await api.post('/api/v1/orders', {
      customer: {
        name: customer.name,
        email: address.email.trim(),
        phone: address.phoneNo.trim(),
        streetAddress: address.streetAddress.trim(),
        city: address.city.trim(),
        state: address.state.trim(),
        zipcode: address.zipcode.trim(),
      },
      items: orderItems.map((item) => ({
        catalogueItemId: item.catalogueItemId || item.id,
        name: item.title || item.name,
        quantity: Number(item.quantity || 1),
        unitPrice: parseCartPrice(item.price),
        imageUrl: item.image || '',
      })),
      shippingMethod: selectedShippingMethod,
      specialInstruction: address.specialInstruction || '',
    });

    if (!response.data?.success) throw new Error(response.data?.message || 'Order could not be saved.');
    const whatsappUrl = buildWhatsAppCheckoutUrl(orderItems, response.data.data.total, customer);
    window.location.assign(whatsappUrl);
  } catch (error) {
    toast.error(error?.response?.data?.message || error.message || 'Could not save your order. Please try again.');
    setSubmitting(false);
  }
};



  return (
    <>
      <UserNavbar />
      <CheckoutStepper currentStep={2} />

      <main className="bg-slate-50 min-h-screen">
        {/* Header Section */}
        <section className="bg-white border-b border-slate-200 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Secure Checkout</h1>
                <p className="mt-2 text-base text-slate-600">Complete your order with confidence</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center gap-2 rounded-full border-2 border-emerald-200 bg-emerald-50 px-4 py-2">
                  <Shield className="h-5 w-5 text-emerald-600" aria-hidden="true" />
                  <span className="text-sm font-semibold text-emerald-900">WhatsApp Checkout</span>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border-2 border-blue-200 bg-blue-50 px-4 py-2">
                  <MessageCircle className="h-5 w-5 text-blue-600" aria-hidden="true" />
                  <span className="text-sm font-semibold text-blue-900">WhatsApp only</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-8 sm:py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left: Checkout Forms (2 columns) */}
              <div className="lg:col-span-2 space-y-6">
                {/* Delivery Information */}
                <DeliveryInformationForm />

                {/* Shipping Method */}
                <ShippingMethodSelector
                  selectedMethod={selectedShippingMethod}
                  onMethodChange={handleShippingMethodChange}
                />

                {/* Terms & Conditions */}
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="mt-1 h-5 w-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex-1 text-sm text-slate-700">
                      <span>I agree to the </span>
                      <a href="#" className="text-blue-600 hover:underline font-medium">
                        Terms and Conditions
                      </a>
                      <span> and </span>
                      <a href="#" className="text-blue-600 hover:underline font-medium">
                        Privacy Policy
                      </a>
                      <span>
                        . I understand that my order is subject to the{' '}
                      </span>
                      <a href="#" className="text-blue-600 hover:underline font-medium">
                        Cancellation Policy
                      </a>
                      <span> and </span>
                      <a href="#" className="text-blue-600 hover:underline font-medium">
                        Return Policy
                      </a>
                      <span>.</span>
                    </div>
                  </label>
                </div>

                {/* Policy Badges */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex items-start gap-2 p-4 rounded-xl bg-white border border-emerald-200">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white flex-shrink-0 mt-0.5">
                      <span className="text-xs">✓</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900">30-Day Return Policy</h4>
                      <p className="text-xs text-slate-600 mt-0.5">Free returns on all purchases within 30 days of delivery</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 p-4 rounded-xl bg-white border border-blue-200">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-white flex-shrink-0 mt-0.5">
                      <span className="text-xs">✓</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900">Order Cancellation</h4>
                      <p className="text-xs text-slate-600 mt-0.5">Cancel within 24 hours for a full refund</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 p-4 rounded-xl bg-white border border-purple-200">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-500 text-white flex-shrink-0 mt-0.5">
                      <span className="text-xs">✓</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900">Data Protection</h4>
                      <p className="text-xs text-slate-600 mt-0.5">Your information is encrypted and never shared</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Order Summary (1 column) */}
              <div className="lg:col-span-1 space-y-6">
                <CheckoutOrderSummary
                  items={orderItems}
                  subtotal={totals.subtotal}
                  shipping={totals.shipping}
                  tax={totals.tax}
                  discount={totals.discount}
                  total={totals.total}
                  onConfirm={handleConfirmPurchase}
                  isSubmitting={submitting}
                />
                <SecurityBadges />
              </div>
            </div>

          </div>
        </section>

        {/* Help Section */}
        <HelpSection />

        {/* FAQ Section */}
        <FAQSection />
      </main>

      <SiteFooter
        quickLinks={['Home', 'Catalogues', 'Categories', 'Brands', 'About Us']}
        supportLinks={['Help Center', 'Contact Us', 'FAQs', 'Shipping Info', 'Returns']}
        legalLinks={['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Disclaimer', 'Licenses']}
        socialLinks={[
          ['Facebook', '#'],
          ['Twitter', '#'],
          ['LinkedIn', '#'],
          ['Instagram', '#'],
        ]}
        copyright="© 2026 chocotraill. All rights reserved."
      />
    </>
  );
}
