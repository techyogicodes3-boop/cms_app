import { Shield, RotateCcw, Headphones, BadgeCheck } from 'lucide-react';

const benefitsData = [
  {
    icon: 'Shield',
    title: 'Trusted Support',
    description: 'Direct WhatsApp assistance',
    bgColor: 'bg-success-bg',
    iconColor: 'text-success',
  },
  {
    icon: 'RotateCcw',
    title: '30-Day Returns',
    description: 'Easy returns & exchanges',
    bgColor: 'bg-info-bg',
    iconColor: 'text-info',
  },
  {
    icon: 'Headphones',
    title: '24/7 Support',
    description: 'Always here to help',
    bgColor: 'bg-warning-bg',
    iconColor: 'text-warning',
  },
  {
    icon: 'BadgeCheck',
    title: 'Authenticity Guarantee',
    description: '100% genuine products',
    bgColor: 'bg-surface-soft',
    iconColor: 'text-brand-cocoa',
  },
];

const iconMap = {
  Shield: Shield,
  RotateCcw: RotateCcw,
  Headphones: Headphones,
  BadgeCheck: BadgeCheck,
};

export default function WhyShopWithUs({ benefits }) {
  const displayBenefits = benefits || benefitsData;

  return (
    <div className="ui-card p-6">
      <h3 className="mb-4 text-xl font-bold text-text-primary">Why Shop With Us?</h3>
      <div className="space-y-3">
        {displayBenefits.map((benefit, index) => {
          const Icon = iconMap[benefit.icon] || Shield;
          return (
            <div key={index} className="flex cursor-pointer items-start gap-3 rounded-xl p-3 transition-colors hover:bg-surface-soft">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${benefit.bgColor} flex-shrink-0`}
              >
                <Icon className={`h-5 w-5 ${benefit.iconColor}`} aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-base font-semibold text-text-primary">{benefit.title}</h4>
                <p className="mt-0.5 text-sm text-text-secondary">{benefit.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
