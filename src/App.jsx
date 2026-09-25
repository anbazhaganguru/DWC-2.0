import React from 'react';
import Navbar from './components/navigation/Navbar';
import Hero from './components/hero/Hero';

/**
 * Main Application Root.
 * Renders Navbar, Hero 360° scroll turntable section, and section transition architecture.
 */
export function App() {
  return (
    <div className="dwc-app">
      <Navbar />
      <main>
        <Hero />
        
        {/* Next section placeholder to enable natural scroll release past pinned hero */}
        <section className="dwc-next-section" id="about">
          <p className="dwc-next-section__tag">DANIEL WELLNESS CENTER</p>
          <h2 className="dwc-next-section__title">
            PHYSICAL RECOVERY ENGINEERED WITH UNCOMPROMISING SWISS PRECISION
          </h2>
        </section>
      </main>
    </div>
  );
}

export default App;
