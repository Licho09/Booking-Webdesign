export function ProblemSolutionSection() {
  const problems = [
    'Paying for leads that never answer',
    'Facebook messages that go nowhere',
    'Wasting time chasing homeowners',
    'Unpredictable workflow',
  ];

  const solutions = [
    'Ads that attract serious homeowners',
    'A page that pre-qualifies them',
    'Automatic reminders so they show up',
  ];

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Problems */}
        <div className="fade-in-slide-up">
          <h2 className="text-3xl sm:text-4xl font-bold text-red-500 mb-6">
            Problems
          </h2>
          <ul className="space-y-4">
            {problems.map((problem, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="text-red-500 text-xl font-bold mt-1">✗</span>
                <p className="text-lg sm:text-xl text-white/90">
                  {problem}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* Solutions */}
        <div className="fade-in-slide-up-delay-1">
          <h2 className="text-3xl sm:text-4xl font-bold text-green-400 mb-6">
            Solutions
          </h2>
          <ul className="space-y-4">
            {solutions.map((solution, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="text-green-400 text-xl font-bold mt-1">✓</span>
                <p className="text-lg sm:text-xl text-white/90">
                  {solution}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}


