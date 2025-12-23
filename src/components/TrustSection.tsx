export function TrustSection() {
  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 fade-in-slide-up">
        {/* Circular Image */}
        <div className="flex-shrink-0">
          <img 
            src="/luis-photo.png" 
            alt="Luis - Founder of DesignLabs" 
            loading="lazy"
            width="200"
            height="200"
            className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full object-cover object-top shadow-xl border-4 border-white/20"
            onError={(e) => {
              // Fallback if image doesn't exist
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        </div>
        
        {/* Text Content */}
        <div className="flex-1 text-center md:text-left space-y-6">
          <p className="text-xl sm:text-2xl lg:text-3xl text-white leading-relaxed">
            Hi, I'm Luis — Founder of DesignLabs. I work directly with contractors to get them booked jobs — no outsourcing, no fluff.
          </p>
          
          <div className="space-y-4 mt-8 text-left max-w-2xl md:mx-0 mx-auto">
            <div className="flex items-start gap-3">
              <span className="text-red-500 text-xl font-bold mt-1">•</span>
              <p className="text-lg sm:text-xl text-white/90">
                Focused exclusively on spray foam contractors
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-red-500 text-xl font-bold mt-1">•</span>
              <p className="text-lg sm:text-xl text-white/90">
                Built with proven ad frameworks
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-red-500 text-xl font-bold mt-1">•</span>
              <p className="text-lg sm:text-xl text-white/90">
                Simple systems, no complicated software
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

