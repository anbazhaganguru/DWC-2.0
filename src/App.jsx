import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from './components/navigation/Navbar';
import Hero from './components/hero/Hero';
import About from './components/about/About';
import Therapy from './components/therapy/Therapy';
import Recovery from './components/recovery/Recovery';
import GoogleReviews from './components/reviews/GoogleReviews';
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
    // 1. Determine if this visit is a return from a therapy detail page
    let restoreData = location.state?.restoreTherapyScrollData;

    if (!restoreData) {
      try {
        const isPending = sessionStorage.getItem('dwc_therapy_return_pending') === 'true';
        if (isPending) {
          const stored = sessionStorage.getItem('dwc_therapy_scroll_data');
          if (stored) {
            restoreData = JSON.parse(stored);
          }
        }
      } catch (_) {}
    }

    if (!restoreData && window.history?.state?.dwcTherapyScroll) {
      restoreData = window.history.state.dwcTherapyScroll;
    }

    // If we have valid restore data, restore the exact card viewport position
    if (restoreData && (restoreData.cardId || restoreData.slug || typeof restoreData.scrollY === 'number')) {
      // Prevent browser auto-scroll interference during restoration
      if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual';
      }

      const getTargetCardEl = () => {
        if (restoreData.cardId === 'apparatus' || restoreData.slug === 'irobo-massage-chair') {
          return document.querySelector('.therapy-apparatus-section, [data-card-id="apparatus"]');
        }
        if (restoreData.cardId) {
          const el = document.querySelector(`.therapy-card--${restoreData.cardId}, [data-card-id="${restoreData.cardId}"]`);
          if (el) return el;
        }
        if (restoreData.slug) {
          const el = document.querySelector(`[data-slug="${restoreData.slug}"]`);
          if (el) return el;
        }
        return null;
      };

      const restorePosition = () => {
        if (typeof window !== 'undefined' && ScrollTrigger) {
          ScrollTrigger.refresh();
        }

        const cardEl = getTargetCardEl();
        if (cardEl) {
          const cardDocTop = window.scrollY + cardEl.getBoundingClientRect().top;
          let targetY;
          if (typeof restoreData.cardViewportTop === 'number') {
            targetY = Math.max(0, Math.round(cardDocTop - restoreData.cardViewportTop));
          } else {
            const viewportH = window.innerHeight;
            const cardH = cardEl.offsetHeight;
            targetY = Math.max(0, Math.round(cardDocTop - Math.max(80, (viewportH - cardH) / 2)));
          }
          window.scrollTo({ top: targetY, behavior: 'instant' });
        } else if (typeof restoreData.scrollY === 'number') {
          window.scrollTo({ top: restoreData.scrollY, behavior: 'instant' });
        }
      };

      // Execute across animation frames as layout commits
      requestAnimationFrame(() => {
        restorePosition();
        requestAnimationFrame(() => {
          restorePosition();
        });
      });

      // Follow-up progressive adjustments to catch pin spacers, async images & fonts
      const t1 = setTimeout(restorePosition, 100);
      const t2 = setTimeout(restorePosition, 250);
      const t3 = setTimeout(() => {
        restorePosition();
        try {
          sessionStorage.removeItem('dwc_therapy_return_pending');
          sessionStorage.removeItem('dwc_therapy_scroll_data');
        } catch (_) {}
        if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
          window.history.scrollRestoration = 'auto';
        }
      }, 550);

      if (document.fonts?.ready) {
        document.fonts.ready.then(() => {
          restorePosition();
        }).catch(() => {});
      }

      // Clear the restore state from history so normal future visits don't loop
      if (window.history?.replaceState) {
        const cleanState = { ...window.history.state };
        if (cleanState.usr) {
          cleanState.usr = { ...cleanState.usr, restoreTherapyScrollData: null };
        }
        cleanState.dwcTherapyScroll = null;
        window.history.replaceState(cleanState, '');
      }

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
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
        <GoogleReviews />
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
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/+$/, '') || '/'}>
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
