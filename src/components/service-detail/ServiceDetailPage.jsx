import React, { useEffect } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import Navbar from '../navigation/Navbar';
import ServiceHero from './ServiceHero';
import ServiceOverview from './ServiceOverview';
import ServiceBenefits from './ServiceBenefits';
import ServiceAudience from './ServiceAudience';
import ServiceExperience from './ServiceExperience';
import ServiceWhyChooseUs from './ServiceWhyChooseUs';
import ServiceVideo from './ServiceVideo';
import ServiceFAQ from './ServiceFAQ';
import ServiceNextNavigation from './ServiceNextNavigation';
import ServiceCTA from './ServiceCTA';
import ServiceDetailFooter from './ServiceDetailFooter';
import { getServiceBySlug } from '../../data/servicesData';
import '../../styles/service-detail.css';

/**
 * ServiceDetailPage Component
 * Master template for dedicated therapy and iROBO service pages
 */
export function ServiceDetailPage({ slugOverride, onOpenBooking }) {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const activeSlug = slugOverride || params.slug;
  const service = getServiceBySlug(activeSlug);

  // Scroll to top whenever active service changes
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (service) {
      document.title = `${service.title} — Daniel Wellness Center`;
    }
  }, [activeSlug, service]);

  // Handle returning to therapy listing with exact saved scroll restoration
  const handleBackToTherapies = (e) => {
    e.preventDefault();

    let scrollData = location.state?.therapyScrollData;

    if (!scrollData) {
      try {
        const stored = sessionStorage.getItem('dwc_therapy_scroll_data');
        if (stored) {
          scrollData = JSON.parse(stored);
        }
      } catch (_) {}
    }

    if (!scrollData && window.history?.state?.dwcTherapyScroll) {
      scrollData = window.history.state.dwcTherapyScroll;
    }

    if (scrollData && typeof scrollData.scrollY === 'number' && !isNaN(scrollData.scrollY)) {
      navigate('/#therapy', {
        state: {
          restoreTherapyScrollData: scrollData
        }
      });
    } else {
      // Direct visit fallback: navigate to therapy section
      navigate('/#therapy');
    }
  };

  if (!service) {
    return (
      <div className="service-not-found">
        <Navbar isDetailPage={true} onOpenBooking={onOpenBooking} />
        <div className="service-not-found__content">
          <span className="service-not-found__tag">404 // MODALITY NOT FOUND</span>
          <h1 className="service-not-found__title">SERVICE SPECIMEN UNAVAILABLE</h1>
          <p className="service-not-found__desc">
            The requested wellness modality does not exist or has been relocated.
          </p>
          <a href="/#therapy" className="service-not-found__btn">
            ← RETURN TO ALL THERAPIES
          </a>
        </div>
        <ServiceDetailFooter onOpenBooking={onOpenBooking} />
      </div>
    );
  }

  return (
    <div className="service-detail-page" id="top">
      {/* Top Navbar in Detail Mode: Black sticky background, HOME, THERAPY, BOOK, MENU + */}
      <Navbar isDetailPage={true} onOpenBooking={onOpenBooking} />

      {/* =========================================================
          STICKY RETURN ACTION: Stays visible while user scrolls
          ========================================================= */}
      <div className="service-hero-nav" role="navigation" aria-label="Return Navigation">
        <div className="service-hero-nav__inner">
          <Link
            to="/#therapy"
            onClick={handleBackToTherapies}
            className="service-hero-nav__back-link"
            aria-label="Return to all therapies"
          >
            <span className="service-hero-nav__back-arrow" aria-hidden="true">←</span>
            <span>ALL THERAPY SERVICES</span>
          </Link>
          <span className="service-hero-nav__specimen-tag" aria-hidden="true">
            DWC CLINICAL MODALITY // {service.num}
          </span>
        </div>
      </div>

      <main className="service-detail-main">
        {/* Section 1: Hero */}
        <ServiceHero service={service} onOpenBooking={onOpenBooking} />

        {/* Section 2: Overview & What is This Therapy? */}
        <ServiceOverview service={service} />

        {/* Section 3: Key Wellness Benefits */}
        <ServiceBenefits service={service} />

        {/* Section 4: Who May Choose This Service? */}
        <ServiceAudience service={service} />

        {/* Section 5: What to Expect / Your Session Progression */}
        <ServiceExperience service={service} />

        {/* Section 6: Why Daniel Wellness Center? */}
        <ServiceWhyChooseUs service={service} />

        {/* Section 7: Practice Video (Renders strictly if verified URL exists) */}
        <ServiceVideo service={service} />

        {/* Section 8: Frequently Asked Questions */}
        <ServiceFAQ service={service} />

        {/* Section 9: Next Therapy Sequential Navigation */}
        <ServiceNextNavigation currentService={service} />

        {/* Section 10: Final Pre-Footer Call to Action */}
        <ServiceCTA service={service} onOpenBooking={onOpenBooking} />
      </main>

      {/* Detail Page Footer */}
      <ServiceDetailFooter onOpenBooking={onOpenBooking} />
    </div>
  );
}

export default ServiceDetailPage;
