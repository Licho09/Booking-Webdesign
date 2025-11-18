import { useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { LeadForm } from './components/LeadForm';
import { Services } from './components/Services';
import CurvedLoop from './components/CurvedLoop';
import { useScrollbarDetection } from './hooks/useScrollbarDetection';

function App() {
  const { isUsingScrollbar, scrollbarWidth } = useScrollbarDetection();

  useEffect(() => {
    if (isUsingScrollbar) {
      console.log('User is using the scrollbar!', { scrollbarWidth });
    }
  }, [isUsingScrollbar, scrollbarWidth]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-indigo-950 pb-32">
      <Header />
      <main>
        <Hero />
        <LeadForm />
        <Services />
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

export default App;
