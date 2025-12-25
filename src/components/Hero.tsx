export function Hero() {
  const scrollToCalendar = () => {
    const calendarSection = document.getElementById('offer');
    if (calendarSection) {
      calendarSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      {/* Mobile-only pop-up style layout */}
      <section className="block md:hidden relative min-h-screen -mx-4 sm:-mx-6 bg-gradient-to-b from-indigo-900 via-purple-900 to-indigo-950">
        {/* Background image with blur */}
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src="/Sprayfoam.png" 
            alt="Spray Foam Services" 
            loading="eager"
            className="w-full h-full object-cover object-center scale-110 blur-sm brightness-75"
            style={{ clipPath: 'inset(0 0 20% 0)' }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        </div>
        
        {/* White pop-up modal */}
        <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-8">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4" style={{ fontFamily: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
            {/* Title */}
            <h3 className="text-center text-black uppercase text-xs font-bold tracking-wider" style={{ letterSpacing: '0.1em' }}>
              Special Offer
            </h3>
            
            {/* Main headline */}
            <h1 className="text-center text-3xl sm:text-4xl font-medium text-black leading-tight" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 500 }}>
              Book <span style={{ fontWeight: 600 }}>10–20</span> Qualified Spray Foam Jobs in <span style={{ fontWeight: 600 }}>90</span> Days
            </h1>
            
            {/* Subheadline */}
            <h2 className="text-center text-lg sm:text-xl font-bold text-red-500 leading-tight" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700 }}>
              Or you don't pay !!!
            </h2>
            
            {/* Description */}
            <p className="text-center text-sm text-gray-700 leading-relaxed" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 400 }}>
              We book spray foam jobs with ads + automation.
            </p>
            
            {/* CTA Button */}
            <button
              onClick={scrollToCalendar}
              className="w-full mt-4 px-6 py-4 bg-red-500 hover:bg-red-600 text-white text-base font-bold rounded-lg transition-all transform hover:scale-105 shadow-lg"
              style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700 }}
            >
              Book Your Free Call Now!
            </button>
          </div>
        </div>
      </section>

      {/* Desktop layout - hidden on mobile */}
      <section className="hidden md:block max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Left - Text Content */}
        <div className="text-center lg:text-left space-y-6 fade-in-slide-up">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-medium text-white leading-tight">
            Book 10–20 Qualified Spray Foam Jobs in 90 Days
          </h1>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-red-500 leading-tight">
            Or you don't pay !!!
          </h2>
          <p className="text-lg sm:text-xl lg:text-2xl text-white/90 leading-relaxed">
            We book spray foam jobs with ads + automation.
          </p>
          <button
            onClick={scrollToCalendar}
            className="mt-6 px-8 py-4 bg-red-500 hover:bg-red-600 text-white text-xl sm:text-2xl md:text-3xl font-bold rounded-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            👉 Book Your Free Call Now!
          </button>
        </div>
        
        {/* Right - Professional Photo */}
        <div className="flex justify-center lg:justify-end fade-in-slide-up-delay-1">
          <img 
            src="/Sprayfoam.png" 
            alt="Spray Foam Services" 
            loading="eager"
            width="500"
            height="600"
            className="w-full max-w-md lg:max-w-lg rounded-lg aspect-[5/6] object-cover object-top shadow-2xl"
            style={{ clipPath: 'inset(0 0 20% 0)' }}
            onError={(e) => {
              // Fallback if image doesn't exist
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        </div>
        </div>
      </section>
    </>
  );
}
