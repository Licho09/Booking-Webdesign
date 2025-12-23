export function SoftProofSection() {
  const points = [
    'Built specifically for local contractors',
    'No long-term contracts',
    'Works even with small budgets',
    'Only take on limited contractors per area',
  ];

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 fade-in-slide-up">
        {points.map((point, index) => (
          <div key={index} className="flex items-center gap-3">
            <span className="text-green-400 text-xl font-bold flex-shrink-0">✔</span>
            <p className="text-base sm:text-lg text-white/90">
              {point}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

