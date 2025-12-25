import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { TrustSection } from './components/TrustSection';
import { ProblemSolutionSection } from './components/ProblemSolutionSection';
import { Services } from './components/Services';
import { SoftProofSection } from './components/SoftProofSection';
import { LeadForm } from './components/LeadForm';
import { ThankYou } from './components/ThankYou';
import { CancelBooking } from './components/CancelBooking';
import { RescheduleBooking } from './components/RescheduleBooking';
import { useScrollbarDetection } from './hooks/useScrollbarDetection';
import { trackPageView } from './lib/analytics';

function HomePage() {
  const { isUsingScrollbar, scrollbarWidth } = useScrollbarDetection();

  useEffect(() => {
    if (isUsingScrollbar) {
      console.log('User is using the scrollbar!', { scrollbarWidth });
    }
  }, [isUsingScrollbar, scrollbarWidth]);

  // Track ViewContent event for Meta Pixel on landing page
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'ViewContent');
    }
  }, []);

  // Setup smooth scrolling with Lenis
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-indigo-950 pb-32 overflow-x-hidden">
      <Header />
      <main className="overflow-x-hidden">
        <Hero />
        <Services />
        <SoftProofSection />
        <LeadForm />
        <ProblemSolutionSection />
        <TrustSection />
      </main>
    </div>
  );
}

function App() {
  const location = useLocation();

  // Normalize pathname to handle double slashes
  const normalizedPathname = location.pathname.replace(/\/+/g, '/');

  // Track page views on route changes
  useEffect(() => {
    trackPageView(normalizedPathname, document.title);
  }, [normalizedPathname]);

  // Redirect if pathname has double slashes
  useEffect(() => {
    if (location.pathname !== normalizedPathname) {
      window.history.replaceState({}, '', normalizedPathname + location.search);
    }
  }, [location.pathname, normalizedPathname, location.search]);

  return (
    <Routes location={{ ...location, pathname: normalizedPathname }}>
      <Route path="/" element={<HomePage />} />
      <Route path="/thank-you" element={<ThankYou />} />
      <Route path="/cancel" element={<CancelBooking />} />
      <Route path="/reschedule" element={<RescheduleBooking />} />
    </Routes>
  );
}

export default App;
