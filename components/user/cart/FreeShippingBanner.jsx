import { Truck } from 'lucide-react';

export default function FreeShippingBanner() {
  return (
    <div className="ui-card border-success/20 bg-success-bg p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-success text-white">
          <Truck className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-text-primary">Free Shipping</h3>
          <p className="mt-1 text-sm text-text-secondary">Your order qualifies for free standard shipping.</p>
        </div>
      </div>
    </div>
  );
}
