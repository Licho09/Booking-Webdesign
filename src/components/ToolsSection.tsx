import { useScrollAnimation } from '../hooks/useScrollAnimation';

export function ToolsSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Image on the left */}
        <div className={`flex justify-center lg:justify-start ${isVisible ? 'slide-in-right' : 'scroll-animate-hidden'}`}>
          <img 
            src="/tools-image.jpg" 
            alt="Modern Tools and AI" 
            loading="lazy"
            width="600"
            height="600"
            className="w-full max-w-md lg:max-w-lg rounded-full aspect-square object-cover shadow-2xl"
            onError={(e) => {
              // Fallback if image doesn't exist
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        </div>
        
        {/* Text on the right */}
        <div className={`flex items-center justify-center lg:justify-start ${isVisible ? 'slide-in-right' : 'scroll-animate-hidden'}`}>
          <p className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white text-center lg:text-left leading-tight">
            Modern tools + AI to save you time and boost productivity.
          </p>
        </div>
      </div>
    </section>
  );
}

