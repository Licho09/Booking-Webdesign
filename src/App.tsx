import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { LeadForm } from './components/LeadForm';
import { Services } from './components/Services';
import { DesignSection } from './components/DesignSection';
import { LeadsSection } from './components/LeadsSection';
import { ToolsSection } from './components/ToolsSection';
import { ThankYou } from './components/ThankYou';
import CurvedLoop from './components/CurvedLoop';
import { useScrollbarDetection } from './hooks/useScrollbarDetection';
import { trackPageView } from './lib/analytics';

function HomePage() {
  const { isUsingScrollbar, scrollbarWidth } = useScrollbarDetection();

  useEffect(() => {
    if (isUsingScrollbar) {
      console.log('User is using the scrollbar!', { scrollbarWidth });
    }
  }, [isUsingScrollbar, scrollbarWidth]);

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
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-indigo-950 pb-32">
      <Header />
      <main>
        <Hero />
        <LeadForm />
        <Services />
        <DesignSection />
        <LeadsSection />
        <ToolsSection />
        <div className="py-16">
          <CurvedLoop 
            marqueeText="Clients ✦ Sales ✦ Leads ✦ Bookings ✦ Growth ✦"
            speed={3}
            curveAmount={500}
            direction="right"
            interactive={true}
          />
        </div>
      </main>
    </div>
  );
}

function App() {
  const location = useLocation();

  // Track page views on route changes
  useEffect(() => {
    trackPageView(location.pathname, document.title);
  }, [location]);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/thank-you" element={<ThankYou />} />
    </Routes>
  );
}

export default App;
