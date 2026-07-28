'use client';

export default function DescriptionTab({
  sections = [],
}) {
  return (
    <div className="w-full h-auto space-y-6">
      {sections.length > 0 && (
        <div className="space-y-6">
          {sections.map((section, index) => (
            <div key={index} className="space-y-3">
              <h3 className="text-xl font-semibold text-slate-900">
                {section.heading}
              </h3>
              <p className="text-base text-slate-700 leading-relaxed">
                {section.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
