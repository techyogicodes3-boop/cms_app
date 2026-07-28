'use client';

import { ShoppingBag, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import UserNavbar from '../../../components/user/home/UserNavbar';
import SiteFooter from '../../../components/footer/SiteFooter';
import Breadcrumb from '../../../components/user/product/Breadcrumb';
import CartItem from '../../../components/user/cart/CartItem';
import OrderSummary from '../../../components/user/cart/OrderSummary';
import FrequentlyBoughtTogether from '../../../components/user/cart/FrequentlyBoughtTogether';
import { useFrequentlyBoughtItems } from '../../../hooks/useFrequentlyBoughtItems';
import FreeShippingBanner from '../../../components/user/cart/FreeShippingBanner';
import WhyShopWithUs from '../../../components/user/cart/WhyShopWithUs';
import { useUpdateCartItem, useRemoveCartItem } from '../../../hooks/useCart';
import { useCartContext } from '../../../contexts/CartContext';
import { useCartItemsData } from '../../../hooks/useCartItemsData';
import { useMemo } from 'react';
import toast from 'react-hot-toast';
import { calculateCartAmounts } from '../../../utils/whatsappCheckout';

// Breadcrumb data
const breadcrumbItems = [
  { label: 'Home', href: '/home' },
  { label: 'Shopping Cart', href: '' },
];

export default function CartPage() {
  // Use CartContext instead of calling useCart() directly to avoid duplicate API calls
  const { cart, isLoading: cartLoading, error: cartError, refetch: refetchCart } = useCartContext();
  const updateCartItem = useUpdateCartItem();
  const removeCartItem = useRemoveCartItem();
  const { products: frequentlyBoughtProducts, isLoading: frequentlyBoughtLoading } = useFrequentlyBoughtItems();

  // Memoize cart items array reference to prevent unnecessary re-renders
  const cartItemsArray = useMemo(() => {
    return cart?.items || [];
  }, [cart?.items]);

  // Use custom hook to fetch and transform cart items with product details
  const { items: cartItems, isLoading: itemsLoading } = useCartItemsData(cartItemsArray);
  const isLoading = cartLoading || itemsLoading;

  // Calculate totals from cart items (price * quantity)
  const totals = useMemo(() => {
    if (!cartItems || cartItems.length === 0) {
      return {
        subtotal: '0.00',
        shipping: 0,
        tax: '0.00',
        discount: 0,
        total: '0.00',
        itemCount: 0,
      };
    }

    const amounts = calculateCartAmounts(cartItems);

    const result = {
      subtotal: amounts.subtotal.toFixed(2),
      shipping: amounts.shipping,
      tax: amounts.tax.toFixed(2),
      discount: amounts.discount,
      total: amounts.total.toFixed(2),
      itemCount: amounts.itemCount,
    };


    return result;
  }, [cartItems]);

  const handleRemoveItem = async (catalogueItemId) => {
    // Verify item exists in cart before removing
    const cartItem = cartItems.find(item => item.catalogueItemId === catalogueItemId);
    if (!cartItem) {
      toast.error('Item not found in cart. Refreshing...');
      // Refetch cart to sync with backend
      await refetchCart();
      return;
    }

    try {
      await removeCartItem.mutateAsync(catalogueItemId);
      toast.success('Item removed from cart');
      // Note: React Query will automatically refetch cart data on success
      // via the onSuccess handler in useRemoveCartItem hook
    } catch (error) {
      // Handle "Item not found" error by refetching cart
      if (error.message && (error.message.toLowerCase().includes('not found') || 
                            error.message.toLowerCase().includes('not in cart'))) {
        toast.error('Item not found in cart. Refreshing cart...');
        // Refetch cart to sync with backend
        await refetchCart();
      } else {
        toast.error(error.message || 'Failed to remove item');
      }
    }
  };

  const handleQuantityChange = async (catalogueItemId, newQuantity) => {
    if (newQuantity < 1) {
      // Find the cart item by catalogueItemId to get its MongoDB _id for removal
      const cartItem = cartItems.find(item => item.catalogueItemId === catalogueItemId);
      if (cartItem && cartItem.cartItemId) {
        handleRemoveItem(cartItem.cartItemId);
      }
      return;
    }

    // Validate quantity
    const validQuantity = Math.max(1, Math.floor(newQuantity));
    
    // Verify item exists in cart before updating
    const cartItem = cartItems.find(item => item.catalogueItemId === catalogueItemId);
    if (!cartItem) {
      toast.error('Item not found in cart. Refreshing...');
      // Refetch cart to sync with backend
      await refetchCart();
      return;
    }

    try {
      await updateCartItem.mutateAsync({ catalogueItemId, quantity: validQuantity });
      toast.success('Quantity updated');
    } catch (error) {
      
      // Handle "Item not in cart" error by refetching cart
      if (error.message && (error.message.toLowerCase().includes('not in cart') || 
                            error.message.toLowerCase().includes('item not found'))) {
        toast.error('Item not in cart. Refreshing cart...');
        // Refetch cart to sync with backend
        await refetchCart();
      } else {
        toast.error(error.message || 'Failed to update quantity');
      }
      // Note: React Query will automatically refetch cart data on error
      // so the UI will rollback to the previous state
    }
  };

  return (
    <>
      <UserNavbar />
      <Breadcrumb items={breadcrumbItems} />

      <main className="min-h-screen bg-brand-ivory">
        {/* Header Section */}
        <section className="border-b border-border-light bg-white py-8">
          <div className="ui-container">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <span className="ui-badge-premium mb-3">WhatsApp checkout</span>
                <h1 className="brand-serif text-4xl font-bold text-text-primary sm:text-5xl">Your Cart</h1>
                <p className="mt-2 max-w-2xl text-base text-text-secondary">Review product quantities, add delivery details, and place your order on WhatsApp.</p>
              </div>
              <div className="ui-card min-w-[140px] px-5 py-4 text-center">
                <div className="mb-1 flex items-center justify-center gap-2">
                  <ShoppingBag className="h-5 w-5 text-brand-gold" aria-hidden="true" />
                  <span className="text-sm font-medium text-text-secondary">Total Items</span>
                </div>
                <div className="text-3xl font-bold text-brand-cocoa">{totals.itemCount}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content: Cart Items & Summary */}
        <section className="py-8 sm:py-10">
          <div className="ui-container">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {/* Left: Cart Items */}
              <div className="space-y-5 lg:col-span-2">
                {isLoading ? (
                  <div className="ui-card p-10 text-center">
                    <div className="animate-pulse space-y-4">
                      <div className="mx-auto h-4 w-3/4 rounded bg-surface-soft"></div>
                      <div className="mx-auto h-4 w-1/2 rounded bg-surface-soft"></div>
                    </div>
                  </div>
                ) : cartError ? (
                  <div className="ui-card border-error/20 bg-error-bg p-10 text-center">
                    <h3 className="text-xl font-semibold text-text-primary">Failed to load cart</h3>
                    <p className="mt-2 text-sm text-text-secondary">{cartError?.message || cartError || 'Please try again later'}</p>
                  </div>
                ) : cartItems.length > 0 ? (
                  cartItems.map((item, index) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      index={index}
                      onRemove={handleRemoveItem}
                      onQuantityChange={handleQuantityChange}
                    />
                  ))
                ) : (
                  <div className="ui-card p-10 text-center sm:p-12">
                    <ShoppingBag className="mx-auto h-16 w-16 text-brand-gold" aria-hidden="true" />
                    <h3 className="mt-4 text-xl font-semibold text-text-primary">Your cart is empty</h3>
                    <p className="mt-2 text-sm text-text-secondary">Add catalogue items to start your order.</p>
                    <Link
                      href="/catalogues"
                      className="ui-btn-primary mt-6 rounded-full px-6 py-3 text-base"
                    >
                      <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                      <span>Continue Shopping</span>
                    </Link>
                  </div>
                )}
              </div>

              {/* Right: Order Summary & Additional Info */}
              <div className="space-y-5 lg:col-span-1">
                <OrderSummary
                  subtotal={totals.subtotal}
                  shipping={totals.shipping}
                  tax={totals.tax}
                  discount={totals.discount}
                  total={totals.total}
                  itemCount={totals.itemCount}
                  cartItems={cartItems}
                />
                {/* <FreeShippingBanner /> */}
                {/* <WhyShopWithUs /> */}
              </div>
            </div>
          </div>
        </section>

        {/* Continue Shopping Button */}
        <section className="pb-10">
          <div className="ui-container flex justify-center">
            <Link
              href="/catalogues"
              className="ui-btn-secondary rounded-full px-8 py-3.5 text-base"
            >
              <ArrowLeft className="h-5 w-5" aria-hidden="true" />
              <span>Continue Shopping</span>
            </Link>
          </div>
        </section>

        {/* Frequently Bought Together - dynamic from catalog, max 4 */}
        {frequentlyBoughtLoading ? (
          <section className="bg-white py-10 sm:py-12">
            <div className="ui-container">
              <div className="mb-6 h-8 w-48 animate-pulse rounded bg-surface-soft" />
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="ui-card overflow-hidden">
                    <div className="h-48 animate-pulse bg-surface-soft" />
                    <div className="p-4 space-y-2">
                      <div className="h-4 w-1/3 animate-pulse rounded bg-surface-soft" />
                      <div className="h-5 w-full animate-pulse rounded bg-surface-soft" />
                      <div className="h-4 w-16 animate-pulse rounded bg-surface-soft" />
                    </div>
                    <div className="px-4 pb-4">
                      <div className="mb-3 h-6 w-20 animate-pulse rounded bg-surface-soft" />
                      <div className="h-10 animate-pulse rounded-full bg-surface-soft" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : (
          <FrequentlyBoughtTogether products={frequentlyBoughtProducts} />
        )}
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
