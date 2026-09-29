import React from 'react';
import Hero from './components/hero/Hero';
import AboutPlaceholder from './components/about/AboutPlaceholder';
import RecoveryPlaceholder from './components/recovery/RecoveryPlaceholder';

/**
 * Main Application Root.
 * Sequence:
 * 1. Hero with integrated Swiss International Style UI and 360° scroll turntable
 * 2. About Section (minimal placeholder as content is pending)
 * 3. Recovery Section (placeholder)
 */
export function App() {
  return (
    <div className="dwc-app">
      <main>
        <Hero />
        <AboutPlaceholder />
        <RecoveryPlaceholder />
      </main>
    </div>
  );
}

export default App;

