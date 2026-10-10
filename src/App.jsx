import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from './components/navigation/Navbar';
import Hero from './components/hero/Hero';
import About from './components/about/About';
import Therapy from './components/therapy/Therapy';
import Recovery from './components/recovery/Recovery';
import CTA from './components/cta/CTA';
import Footer from './components/footer/Footer';
import BookingModal from './components/booking/BookingModal';
import ServiceDetailPage from './components/service-detail/ServiceDetailPage';
import FounderPage from './components/founder/FounderPage';

/**
 * HomePage Component
 * Houses the standard single-page sequence:
 * 1. Hero with integrated Swiss International Style UI and 360° scroll turntable
 * 2. About Section
 * 3. Therapy Section (modality cards linking to dedicated detail pages)
 * 4. Recovery Section
 * 5. CTA Section
 * 6. Footer
 */
function HomePage({ onOpenBooking }) {
  const location = useLocation();

  useEffect(() => {
    // Check if we have an explicit request or history state to restore scroll position
    const restoreData = location.state?.restoreTherapyScrollData || window.history?.state?.dwcTherapyScroll;

    if (restoreData && typeof restoreData.scrollY === 'number') {
      const restorePosition = () => {
        if (typeof window !== 'undefined') {
          ScrollTrigger.refresh();
        }

        window.scrollTo({ top: restoreData.scrollY, behavior: 'instant' });

        // Fine-tune viewport alignment to the exact card if cardId & cardViewportTop were recorded
        if (restoreData.cardId && restoreData.cardViewportTop != null) {
          const selector = restoreData.cardId === 'apparatus'
            ? '.therapy-apparatus-section'
            : `.therapy-card--${restoreData.cardId}`;
          const cardEl = document.querySelector(selector);
          if (cardEl) {
            const currentTop = cardEl.getBoundingClientRect().top;
            const delta = currentTop - restoreData.cardViewportTop;
            if (Math.abs(delta) > 1 && Math.abs(delta) < 600) {
              window.scrollBy({ top: delta, behavior: 'instant' });
            }
          }
        }
      };

      // Perform restoration across animation frames as layout commits
      requestAnimationFrame(() => {
        restorePosition();
        requestAnimationFrame(() => {
          restorePosition();
        });
      });

      if (document.fonts?.ready) {
        document.fonts.ready.then(() => {
          restorePosition();
        }).catch(() => {});
      }

      // Clear the restore state from history so page refreshes or user scrolls don't loop
      if (window.history?.replaceState) {
        const cleanState = { ...window.history.state };
        if (cleanState.usr) {
          cleanState.usr = { ...cleanState.usr, restoreTherapyScrollData: null };
        }
        cleanState.dwcTherapyScroll = null;
        window.history.replaceState(cleanState, '');
      }
      return;
    }

    // Default anchor jump on direct load or generic navigation back (e.g. /#therapy)
    if (window.location.hash) {
      const target = window.location.hash;
      const targetEl = document.querySelector(target);
      if (targetEl) {
        setTimeout(() => {
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }, 120);
      }
    }
  }, [location.state]);

  return (
    <>
      <Navbar onOpenBooking={onOpenBooking} />
      <main>
        <Hero />
        <About />
        <Therapy />
        <Recovery />
        <CTA onOpenBooking={onOpenBooking} />
      </main>
      <Footer onOpenBooking={onOpenBooking} />
    </>
  );
}

/**
 * Main Application Root with React Router architecture
 */
export function App() {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [modalOptions, setModalOptions] = useState({
    initialServiceType: 'therapy',
    initialService: ''
  });

  const handleOpenBooking = (options = {}) => {
    setModalOptions({
      initialServiceType: options.serviceType || 'therapy',
      initialService: options.initialService || ''
    });
    setIsBookingModalOpen(true);
  };

  const handleCloseBooking = () => {
    setIsBookingModalOpen(false);
  };

  // Support URL hash #book or #booking
  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#booking' || window.location.hash === '#book') {
        setIsBookingModalOpen(true);
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  return (
    <BrowserRouter>
      <div className="dwc-app">
        <Routes>
          {/* Main Homepage Route */}
          <Route path="/" element={<HomePage onOpenBooking={handleOpenBooking} />} />

          {/* Dedicated Therapy Service Detail Routes (01 - 06) */}
          <Route
            path="/therapy/:slug"
            element={<ServiceDetailPage onOpenBooking={handleOpenBooking} />}
          />

          {/* Dedicated iROBO Massage Chair Route */}
          <Route
            path="/services/irobo-massage-chair"
            element={
              <ServiceDetailPage
                slugOverride="irobo-massage-chair"
                onOpenBooking={handleOpenBooking}
              />
            }
          />

          {/* Alias for iROBO therapy route */}
          <Route
            path="/therapy/irobo-massage-chair"
            element={<Navigate to="/services/irobo-massage-chair" replace />}
          />

          {/* Dedicated Founder Page Route */}
          <Route
            path="/about/founder"
            element={<FounderPage onOpenBooking={handleOpenBooking} />}
          />

          {/* Alias for Founder page */}
          <Route
            path="/founder"
            element={<Navigate to="/about/founder" replace />}
          />

          {/* Fallback Route */}
          <Route path="*" element={<HomePage onOpenBooking={handleOpenBooking} />} />
        </Routes>

        {/* Unified Single Booking Modal Instance */}
        <BookingModal
          key={`${modalOptions.initialServiceType}-${modalOptions.initialService}-${isBookingModalOpen}`}
          isOpen={isBookingModalOpen}
          onClose={handleCloseBooking}
          initialServiceType={modalOptions.initialServiceType}
          initialService={modalOptions.initialService}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;
