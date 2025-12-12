import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { trackEvent } from '../lib/analytics';

export function ThankYou() {
  const navigate = useNavigate();

  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    // Also try scrolling the document element for better compatibility
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    // Track thank you page view (conversion event)
    trackEvent('conversion', {
      conversion_type: 'booking_completed',
    });

    // Track Schedule event for Meta Pixel
    // This only fires if user reaches thank you page, which means booking was successfully saved
    // (Navigation only happens after successful async booking save in LeadForm)
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'Schedule');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-indigo-950 flex flex-col">
      {/* Header with DesignLabs */}
      <header className="flex items-center justify-center py-6 px-8">
        <div className="text-white text-4xl font-bold" style={{
          textShadow: '0 0 20px rgba(168, 85, 247, 0.8), 0 0 40px rgba(168, 85, 247, 0.6), 0 0 60px rgba(168, 85, 247, 0.4)'
        }}>
          DesignLabs
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-8 py-12 overflow-y-auto">
        <div className="text-center max-w-2xl mx-auto w-full">
          <CheckCircle className="w-20 h-20 sm:w-24 sm:h-24 text-green-500 mx-auto mb-8" />
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Thank You!
          </h2>
          <p className="text-white/90 mb-8 text-xl sm:text-2xl lg:text-3xl">
            Your booking request has been submitted successfully. We'll send you a confirmation email shortly.
          </p>
        </div>
      </main>

      {/* Done Button at Bottom */}
      <footer className="pb-8 px-8">
        <button
          onClick={() => navigate('/')}
          className="submit-button relative overflow-hidden h-12 px-8 rounded-3xl bg-green-600 text-white border-none cursor-pointer text-xl font-bold w-full max-w-md mx-auto block"
        >
          <span className="relative z-10">Done</span>
        </button>
      </footer>
    </div>
  );
}

