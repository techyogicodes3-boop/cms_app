import { Shield, RotateCcw, Headphones, BadgeCheck } from 'lucide-react';

const securityFeatures = [
  {
    icon: 'Shield',
    title: '256-bit SSL',
    description: 'Bank-level encryption',
    bgColor: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
  },
  {
    icon: 'RotateCcw',
    title: '30-Day Returns',
    description: 'Hassle-free refunds',
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    icon: 'BadgeCheck',
    title: 'Authenticity',
    description: '100% genuine products',
    bgColor: 'bg-amber-50',
    iconColor: 'text-amber-600',
  },
  {
    icon: 'Headphones',
    title: '24/7 Support',
    description: 'Always here to help',
    bgColor: 'bg-purple-50',
    iconColor: 'text-purple-600',
  },
];

const iconMap = {
  Shield: Shield,
  RotateCcw: RotateCcw,
  Headphones: Headphones,
  BadgeCheck: BadgeCheck,
};

export default function SecurityBadges() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-xl font-bold text-slate-900 mb-4">Secure Checkout Guaranteed</h3>
      <div className="space-y-3">
        {securityFeatures.map((feature, index) => {
          const Icon = iconMap[feature.icon] || Shield;
          return (
            <div key={index} className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${feature.bgColor} flex-shrink-0`}
              >
                <Icon className={`h-5 w-5 ${feature.iconColor}`} aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-base font-semibold text-slate-900">{feature.title}</h4>
                <p className="text-sm text-slate-600 mt-0.5">{feature.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
