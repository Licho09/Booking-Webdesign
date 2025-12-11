import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { trackEvent } from '../lib/analytics';

// Updated: Added spam folder instructions with images

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
      <main className="flex-1 flex items-center justify-center px-2 sm:px-8 py-12 overflow-y-auto">
        <div className="text-center max-w-6xl mx-auto w-full">
          <CheckCircle className="w-20 h-20 sm:w-24 sm:h-24 text-green-500 mx-auto mb-8" />
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Thank You!
          </h2>
          <p className="text-white/90 mb-8 text-xl sm:text-2xl lg:text-3xl">
            Your booking request has been submitted successfully. We'll send you a confirmation email shortly.
          </p>

          {/* Spam Folder Instructions */}
          <div className="mt-8 sm:mt-12 bg-white/10 backdrop-blur-sm rounded-2xl p-2 sm:p-8 lg:p-10 border border-white/20" style={{ isolation: 'isolate' }}>
            <div className="flex items-center justify-center gap-2 mb-4">
              <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <h3 className="text-2xl sm:text-3xl font-bold text-white">
                Check Your Spam Folder!
              </h3>
            </div>
            <p className="text-white/80 mb-8 text-lg sm:text-xl">
              Your confirmation email might end up in your spam folder. Please check it and mark it as "Not Spam" so future emails arrive in your inbox.
            </p>

            {/* Image Section */}
            <div className="space-y-6 sm:space-y-8">
              {/* Email Preview Image */}
              <div className="bg-white/5 rounded-xl p-1 sm:p-6">
                <p className="text-white mb-2 sm:mb-4 text-sm sm:text-lg font-semibold px-1">
                  📧 Your confirmation email will look like this:
                </p>
                <div className="bg-white rounded-lg p-0.5 sm:p-3 shadow-xl overflow-x-auto" style={{ isolation: 'isolate' }}>
                  <div className="flex justify-center items-center min-w-full">
                    <img 
                      src="/email-preview.png" 
                      alt="Confirmation email preview showing what the email looks like"
                      className="min-w-[120%] sm:min-w-0 sm:w-auto w-full"
                      style={{ 
                        maxWidth: '1400px',
                        width: '120%',
                        height: 'auto',
                        display: 'block',
                        imageRendering: '-webkit-optimize-contrast',
                        transform: 'translateZ(0)',
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        willChange: 'transform',
                        filter: 'contrast(1.05) saturate(1.05)',
                        WebkitFilter: 'contrast(1.05) saturate(1.05)',
                        touchAction: 'pan-x pan-y pinch-zoom',
                        WebkitTouchCallout: 'none',
                        WebkitUserSelect: 'none',
                        userSelect: 'none'
                      }}
                      loading="eager"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                        if (fallback) fallback.classList.remove('hidden');
                      }}
                    />
                  </div>
                  <div className="hidden text-gray-500 p-8 text-center border-2 border-dashed border-gray-400 rounded-lg">
                    <p className="text-sm">Email Preview Image</p>
                    <p className="text-xs mt-2">Add your email preview image as /public/email-preview.png</p>
                  </div>
                </div>
              </div>

              {/* Report Not Spam Image */}
              <div className="bg-white/5 rounded-xl p-1 sm:p-6">
                <p className="text-white mb-2 sm:mb-4 text-sm sm:text-lg font-semibold px-1">
                  ✅ Click "Report not spam" if you see this:
                </p>
                <div className="bg-white rounded-lg p-0.5 sm:p-3 shadow-xl overflow-x-auto" style={{ isolation: 'isolate' }}>
                  <div className="flex justify-center items-center min-w-full">
                    <img 
                      src="/report-not-spam.png" 
                      alt="Instructions showing where to find the Report not spam button"
                      className="min-w-[120%] sm:min-w-0 sm:w-auto w-full"
                      style={{ 
                        maxWidth: '100%',
                        width: '120%',
                        height: 'auto',
                        display: 'block',
                        imageRendering: '-webkit-optimize-contrast',
                        transform: 'translateZ(0)',
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        willChange: 'transform',
                        filter: 'contrast(1.05) saturate(1.05)',
                        WebkitFilter: 'contrast(1.05) saturate(1.05)',
                        touchAction: 'pan-x pan-y pinch-zoom',
                        WebkitTouchCallout: 'none',
                        WebkitUserSelect: 'none',
                        userSelect: 'none'
                      }}
                      loading="eager"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                        if (fallback) fallback.classList.remove('hidden');
                      }}
                    />
                  </div>
                  <div className="hidden text-gray-500 p-8 text-center border-2 border-dashed border-gray-400 rounded-lg">
                    <p className="text-sm">Report Not Spam Button Image</p>
                    <p className="text-xs mt-2">Add your report not spam image as /public/report-not-spam.png</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="mt-6 bg-blue-500/20 border border-blue-400/30 rounded-lg p-4">
              <p className="text-white text-base sm:text-lg font-semibold mb-2">
                Quick Steps:
              </p>
              <ol className="text-white/90 text-sm sm:text-base text-left space-y-2 list-decimal list-inside">
                <li>Check your spam/junk folder</li>
                <li>Find the email from DesignCXLabs</li>
                <li>Click "Report not spam" or "Not spam"</li>
                <li>Move it to your inbox if needed</li>
              </ol>
            </div>
          </div>
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

