export function Hero() {
  const scrollToCalendar = () => {
    const calendarSection = document.getElementById('offer');
    if (calendarSection) {
      calendarSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Left - Text Content */}
        <div className="text-center lg:text-left space-y-6 fade-in-slide-up">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight">
            Book <span className="bg-white/20 px-3 py-1 rounded-lg">10–20</span> Qualified Spray Foam Jobs in <span className="bg-white/20 px-3 py-1 rounded-lg">90</span> Days
          </h1>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-red-500 leading-tight">
            OR you DONT PAY !!!
          </h2>
          <p className="text-lg sm:text-xl lg:text-2xl text-white/90 leading-relaxed">
            We help spray foam contractors get booked appointments using Facebook ads + automation.
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
            onError={(e) => {
              // Fallback if image doesn't exist
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        </div>
      </div>
    </section>
  );
}
