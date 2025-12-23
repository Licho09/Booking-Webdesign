import SpotlightCard from './SpotlightCard';

export function Services() {
  const steps = [
    {
      number: '1',
      title: 'Targeted Ads',
      description: 'We run local ads that reach serious homeowners actively looking for spray foam services.',
    },
    {
      number: '2',
      title: 'Leads Schedule',
      description: 'Interested homeowners book directly on your calendar, no back-and-forth needed.',
    },
    {
      number: '3',
      title: 'Close Jobs',
      description: 'You show up and close the job while automatic reminders ensure leads actually show up.',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
      <div className="text-center mb-8 sm:mb-10 lg:mb-12">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-5 lg:mb-6 px-4">
          How It Works
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto mb-8">
        {steps.map((step, index) => (
          <SpotlightCard 
            key={index}
            className="custom-spotlight-card flex flex-col justify-center p-6 sm:p-8" 
            spotlightColor="rgba(255, 255, 255, 0.25)"
          >
            <div className="flex items-start gap-4">
              <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-red-500 flex-shrink-0">
                {step.number}
              </div>
              <div className="flex-1">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-3 relative z-10">
                  {step.title}
                </h3>
                <p className="text-white/80 leading-relaxed text-sm sm:text-base lg:text-lg relative z-10">
                  {step.description}
                </p>
              </div>
            </div>
          </SpotlightCard>
        ))}
      </div>

      <div className="text-center mt-8">
        <p className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto px-4 font-medium">
          We handle setup and optimization — you focus on installs.
        </p>
      </div>
    </section>
  );
}
