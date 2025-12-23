export function SoftProofSection() {
  const points = [
    'Built specifically for local contractors',
    'No long-term contracts',
    'Works even with small budgets',
    'Only take on limited contractors per area (creates scarcity)',
  ];

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <div className="space-y-6 fade-in-slide-up">
        {points.map((point, index) => (
          <div key={index} className="flex items-start gap-4">
            <span className="text-green-400 text-2xl font-bold mt-1 flex-shrink-0">✔</span>
            <p className="text-lg sm:text-xl lg:text-2xl text-white/90">
              {point}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

