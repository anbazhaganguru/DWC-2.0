import React from 'react';
import Hero from './components/hero/Hero';

/**
 * Main Application Root.
 * Renders Hero with integrated Swiss International Style UI and 360° scroll turntable,
 * followed by next section release architecture.
 */
export function App() {
  return (
    <div className="dwc-app">
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
