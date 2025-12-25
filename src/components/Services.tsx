import { useState, useRef, useEffect } from 'react';
import SpotlightCard from './SpotlightCard';

export function Services() {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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

  // Update active index based on scroll position
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const cardWidth = container.offsetWidth * 0.85 + 16; // 85vw + gap
      const newIndex = Math.round(scrollLeft / cardWidth);
      setActiveIndex(Math.min(newIndex, steps.length - 1));
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [steps.length]);

  const scrollToIndex = (index: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const cardWidth = container.offsetWidth * 0.85 + 16; // 85vw + gap
    container.scrollTo({
      left: index * cardWidth,
      behavior: 'smooth',
    });
  };

  const scrollLeft = () => {
    if (activeIndex > 0) {
      scrollToIndex(activeIndex - 1);
    }
  };

  const scrollRight = () => {
    if (activeIndex < steps.length - 1) {
      scrollToIndex(activeIndex + 1);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
      <div className="text-center mb-8 sm:mb-10 lg:mb-12">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-5 lg:mb-6 px-4">
          How It Works
        </h2>
      </div>

      {/* Mobile: Horizontal scrollable */}
      <div className="sm:hidden mb-8 -mx-4 sm:mx-0">
        <div 
          ref={scrollContainerRef}
          className="overflow-x-auto scrollbar-hide" 
          style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}
        >
          {/* Progress indicator - inside scrollable container */}
          <div className="relative mb-4 px-[7.5vw]" style={{ height: '90px' }}>
            {/* Circles and dashed lines - matching box layout exactly */}
            <div className="flex gap-4">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 relative flex justify-center"
                  style={{ width: '85vw' }}
                >
                  {/* Centered circle and dashed line - perfectly aligned with box center */}
                  <div 
                    className="absolute top-0 flex flex-col items-center"
                    style={{ 
                      left: '50%',
                      transform: index === 1 
                        ? 'translateX(calc(-50% - 54px))' // Shift box 2 a little more to the left
                        : index === 2 
                        ? 'translateX(calc(-50% - 95px))' // Shift box 3 a little more to the left
                        : 'translateX(-50%)', // Box 1 stays centered
                    }}
                  >
                    {/* Solid circle - centered */}
                    <div 
                      className="rounded-full bg-white"
                      style={{ 
                        width: '16px', 
                        height: '16px',
                        zIndex: 10,
                      }}
                    />
                    
                    {/* Dashed vertical line - centered and extends all the way to boxes */}
                    <div 
                      style={{ 
                        marginTop: '0px',
                        height: '74px', // Extend to bottom of container (90px - 16px)
                        width: '2px',
                        backgroundImage: 'repeating-linear-gradient(to bottom, rgba(255, 255, 255, 0.6) 0px, rgba(255, 255, 255, 0.6) 4px, transparent 4px, transparent 10px)',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            
            {/* Horizontal connecting line - positioned after circles to span correctly */}
            <div 
              className="absolute bg-white/60"
              style={{ 
                top: '8px', // Center of 16px circle (16px / 2 = 8px)
                height: '2px',
                left: 'calc(7.5vw + 42.5vw)', // Start at center of first box (padding + half box width)
                width: `calc(157vw)`, // Span from first circle center to third circle center (slightly increased)
                transform: 'translateY(-50%)', // Center the 2px line on the circle
              }}
            />
          </div>

          {/* Boxes */}
          <div className="flex gap-4 pb-4 px-[7.5vw] -mt-2">
            {steps.map((step, index) => (
              <div key={index} className="flex-shrink-0 w-[85vw] max-w-sm" style={{ scrollSnapAlign: 'center' }}>
                <SpotlightCard 
                  className="custom-spotlight-card flex flex-col justify-center p-6 h-full" 
                  spotlightColor="rgba(255, 255, 255, 0.25)"
                >
                  <div className="flex items-start gap-4">
                    <div className="text-4xl font-bold text-red-500 flex-shrink-0">
                      {step.number}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-3 relative z-10">
                        {step.title}
                      </h3>
                      <p className="text-white/80 leading-relaxed text-sm relative z-10">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </SpotlightCard>
              </div>
            ))}
          </div>
        </div>
        
        {/* Navigation dots and arrows - Mobile only */}
        <div className="sm:hidden flex items-center justify-center gap-4 mt-2">
          {/* Left arrow */}
          <button
            onClick={scrollLeft}
            disabled={activeIndex === 0}
            className={`text-white ${activeIndex === 0 ? 'opacity-40' : 'opacity-100'} transition-opacity`}
            aria-label="Previous step"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          {/* Dots indicator */}
          <div className="flex gap-2">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollToIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  activeIndex === index ? 'bg-white w-6' : 'bg-white/40'
                }`}
                aria-label={`Go to step ${index + 1}`}
              />
            ))}
          </div>
          
          {/* Right arrow */}
          <button
            onClick={scrollRight}
            disabled={activeIndex === steps.length - 1}
            className={`text-white ${activeIndex === steps.length - 1 ? 'opacity-40' : 'opacity-100'} transition-opacity`}
            aria-label="Next step"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Desktop: Grid layout */}
      <div className="hidden sm:grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto mb-8">
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
