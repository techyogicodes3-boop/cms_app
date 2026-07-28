import { Check } from 'lucide-react';

export default function CheckoutStepper({ currentStep }) {
  // currentStep: 1 = Cart, 2 = Checkout, 3 = Confirmation
  const steps = [
    { number: 1, label: 'Cart', sublabel: 'Review items' },
    { number: 2, label: 'Checkout', sublabel: 'Enter details' },
    { number: 3, label: 'Confirmation', sublabel: 'Order complete' },
  ];

  return (
    <div className="bg-white border-b border-slate-200 py-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between relative">
          {steps.map((step, index) => {
            const isCompleted = currentStep > step.number;
            const isActive = currentStep === step.number;
            const isUpcoming = currentStep < step.number;

            return (
              <div key={step.number} className="flex flex-col items-center flex-1 relative">
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div
                    className={`absolute top-6 left-1/2 w-full h-0.5 -z-10 ${
                      isCompleted ? 'bg-emerald-500' : 'bg-slate-200'
                    }`}
                    style={{ transform: 'translateY(-50%)' }}
                  />
                )}

                {/* Step Circle */}
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full border-2 font-semibold text-base transition-all ${
                      isCompleted
                        ? 'border-emerald-500 bg-emerald-500 text-white'
                        : isActive
                          ? 'border-blue-600 bg-blue-600 text-white'
                          : 'border-slate-300 bg-white text-slate-400'
                    }`}
                  >
                    {isCompleted ? <Check className="h-6 w-6" aria-hidden="true" /> : step.number}
                  </div>

                  {/* Step Label */}
                  <div className="mt-2 text-center">
                    <div
                      className={`text-sm font-semibold ${
                        isActive ? 'text-blue-600' : isCompleted ? 'text-emerald-600' : 'text-slate-500'
                      }`}
                    >
                      {step.label}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">{step.sublabel}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
