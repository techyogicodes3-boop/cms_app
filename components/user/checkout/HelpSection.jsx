import { MessageCircle, Phone, Mail } from 'lucide-react';

export default function HelpSection() {
  const helpOptions = [
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Chat with our support team in real-time',
      action: 'Start Chat',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      buttonColor: 'bg-blue-600',
    },
    {
      icon: Phone,
      title: 'Call Us',
      description: 'Speak directly with a specialist',
      action: '1-800-555-1234',
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      buttonColor: 'bg-emerald-600',
    },
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Get help via email within 2 hours',
      action: 'Send Email',
      bgColor: 'bg-amber-50',
      iconColor: 'text-amber-600',
      buttonColor: 'bg-amber-600',
    },
  ];

  return (
    <section className="bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900">Need Help with Your Order?</h2>
          <p className="mt-2 text-base text-slate-600">Our support team is here to assist you 24/7</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {helpOptions.map((option, index) => {
            const Icon = option.icon;
            return (
              <div
                key={index}
                className="flex flex-col items-center text-center p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all"
              >
                <div className={`flex h-16 w-16 items-center justify-center rounded-full ${option.bgColor} mb-4`}>
                  <Icon className={`h-8 w-8 ${option.iconColor}`} aria-hidden="true" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">{option.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{option.description}</p>
                <button
                  type="button"
                  className={`mt-4 inline-flex items-center justify-center rounded-full ${option.buttonColor} px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:brightness-110 transition-all`}
                >
                  {option.action}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
