import SpotlightCard from './SpotlightCard';

export function Services() {
  const services = [
    {
      emoji: '🖥️',
      title: 'Website Design',
      description: 'Modern, mobile-first websites that turn visitors into paying clients.',
    },
    {
      emoji: '🧭',
      title: 'SEO & Google Setup',
      description: 'Make sure your business shows up when people search for what you offer.',
    },
    {
      emoji: '🤖',
      title: 'AI Chat & Automation',
      description: 'Add simple AI bots to answer questions, collect leads, and follow up 24/7.',
    },
    {
      emoji: '📣',
      title: 'Ads & Funnels',
      description: 'Launch ad campaigns that drive real traffic straight to your site — and convert.',
    },
    {
      emoji: '💬',
      title: 'Ongoing Support',
      description: 'I stay available for updates, improvements, and strategy so your website keeps performing.',
    },
    {
      emoji: '📊',
      title: 'Analytics & Performance Analysis',
      description: "Understand and improve your website's health and functionality so you can continue to rank well in search results.",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
      <div className="text-center mb-8 sm:mb-10 lg:mb-12">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-5 lg:mb-6 px-4">
          What I Can Do <span className="text-red-500 text-4xl sm:text-5xl lg:text-6xl">For You</span>
        </h2>
        <p className="text-base sm:text-lg lg:text-xl text-white/90 max-w-3xl mx-auto px-4">
          I combine design, automation, and marketing to help your business grow faster and work smarter.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {services.map((service, index) => (
          <SpotlightCard 
            key={index}
            className="custom-spotlight-card aspect-square flex flex-col justify-center" 
            spotlightColor="rgba(255, 255, 255, 0.25)"
          >
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4 text-center relative z-10">
              {service.title}
            </h3>
            <p className="text-white/80 leading-relaxed text-center text-sm sm:text-base lg:text-lg relative z-10">
              {service.description}
            </p>
          </SpotlightCard>
        ))}
      </div>
    </section>
  );
}
