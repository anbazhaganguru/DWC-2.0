import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EASING, isReducedMotion } from '../../animations/scrollAnimations';
import BookingModal from '../booking/BookingModal';
import '../../styles/cta.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * CTA Component (Daniel Wellness Center 2.0)
 * Swiss International Style architectural appointment booking and contact section.
 *
 * Animations:
 * - Subtle background image parallax (yPercent -5 to +5)
 * - Progressive editorial text loading (eyebrow, headline, quote, contact coordinates)
 * - Elevated booking card entrance and options stagger
 * - Full responsive and reduced-motion handling
 *
 * Section ID: #cta (Target for Hero header booking action)
 */
export function CTA({ onOpenBooking }) {
  const [internalModalOpen, setInternalModalOpen] = useState(false);
  const sectionRef = useRef(null);

  // Auto-open modal if URL hash is #book or #booking
  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#booking' || window.location.hash === '#book') {
        if (onOpenBooking) {
          onOpenBooking();
        } else {
          setInternalModalOpen(true);
        }
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [onOpenBooking]);

  // GSAP ScrollTrigger reveals and background parallax
  useEffect(() => {
    if (!sectionRef.current) return;
    if (isReducedMotion()) return;

    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth <= 768;
      const bgImg = sectionRef.current.querySelector('.dwc-cta-bg-img');
      const editorialCol = sectionRef.current.querySelector('.dwc-cta-editorial-col');
      const bookingCol = sectionRef.current.querySelector('.dwc-cta-booking-col');

      // 1. Subtle Slow Background Image Parallax
      if (bgImg && !isMobile) {
        gsap.fromTo(
          bgImg,
          { yPercent: -5 },
          {
            yPercent: 5,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.2
            }
          }
        );
      }

      // 2. Left Column: Progressive Editorial Text Loading
      if (editorialCol) {
        const eyebrow = editorialCol.querySelector('.dwc-cta-eyebrow');
        const headline = editorialCol.querySelector('.dwc-cta-headline');
        const philosophy = editorialCol.querySelector('.dwc-cta-philosophy');
        const description = editorialCol.querySelector('.dwc-cta-description');
        const contactItems = editorialCol.querySelectorAll('.dwc-cta-contact-item');

        const tlEditorial = gsap.timeline({
          scrollTrigger: {
            trigger: editorialCol,
            start: 'top 80%',
            once: true
          }
        });

        if (eyebrow) {
          tlEditorial.from(eyebrow, {
            opacity: 0,
            y: 15,
            duration: 0.6,
            ease: EASING.editorial
          });
        }

        if (headline) {
          tlEditorial.from(
            headline,
            {
              opacity: 0,
              y: 30,
              duration: 0.8,
              ease: EASING.editorial
            },
            '-=0.4'
          );
        }

        if (philosophy) {
          tlEditorial.from(
            philosophy,
            {
              opacity: 0,
              y: 20,
              duration: 0.7,
              ease: EASING.editorial
            },
            '-=0.5'
          );
        }

        if (description) {
          tlEditorial.from(
            description,
            {
              opacity: 0,
              y: 20,
              duration: 0.7,
              ease: EASING.editorial
            },
            '-=0.5'
          );
        }

        if (contactItems && contactItems.length) {
          tlEditorial.from(
            contactItems,
            {
              opacity: 0,
              y: 15,
              stagger: 0.08,
              duration: 0.6,
              ease: EASING.editorial
            },
            '-=0.4'
          );
        }
      }

      // 3. Right Column: Booking Card Reveal
      if (bookingCol) {
        const card = bookingCol.querySelector('.dwc-cta-card');
        const summaryBoxes = bookingCol.querySelectorAll('.dwc-cta-summary-box');
        const actionWrap = bookingCol.querySelector('.dwc-cta-action-wrap');

        const tlBooking = gsap.timeline({
          scrollTrigger: {
            trigger: bookingCol,
            start: 'top 80%',
            once: true
          }
        });

        if (card) {
          tlBooking.from(card, {
            opacity: 0,
            y: 25,
            duration: 0.85,
            ease: EASING.editorial
          });
        }

        if (summaryBoxes && summaryBoxes.length) {
          tlBooking.from(
            summaryBoxes,
            {
              opacity: 0,
              y: 15,
              stagger: 0.1,
              duration: 0.65,
              ease: EASING.editorial
            },
            '-=0.5'
          );
        }

        if (actionWrap) {
          tlBooking.from(
            actionWrap,
            {
              opacity: 0,
              y: 15,
              duration: 0.6,
              ease: EASING.editorial
            },
            '-=0.4'
          );
        }
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleBookingClick = () => {
    if (onOpenBooking) {
      onOpenBooking();
    } else {
      setInternalModalOpen(true);
    }
  };

  return (
    <section id="cta" ref={sectionRef} className="dwc-cta-section" aria-label="Contact & Appointments">
      {/* 1. Full-Screen Atmospheric Background Image with Responsive Assets */}
      <div className="dwc-cta-bg-wrap" aria-hidden="true">
        <picture className="dwc-cta-picture">
          <source media="(max-width: 768px)" srcSet="/images/cta/cta_wellness_lounge_mobile.webp" />
          <img
            src="/images/cta/cta_wellness_lounge.webp"
            alt="Daniel Wellness Center Lounge Atmosphere"
            className="dwc-cta-bg-img"
            loading="lazy"
          />
        </picture>
        {/* Dark Luxury Scrim Overlay for Contrast & Swiss Monochrome Calibration */}
        <div className="dwc-cta-scrim" />
        <div className="dwc-cta-subtle-glow" />
      </div>

      {/* 2. Architectural 12-Column Swiss Grid Container */}
      <div className="dwc-cta-container">
        {/* Left Column: Editorial Brand Content & Official DWC Contact Coordinates */}
        <div className="dwc-cta-editorial-col">
          {/* Eyebrow */}
          <div className="dwc-cta-eyebrow">
            <span className="dwc-cta-eyebrow-accent" aria-hidden="true" />
            <span className="dwc-cta-eyebrow-text">DANIEL WELLNESS CENTER / CONTACT</span>
          </div>

          {/* Headline */}
          <h2 className="dwc-cta-headline">
            Begin Your <br className="dwc-cta-desktop-br" />Recovery Journey
          </h2>

          {/* Philosophy Statement */}
          <blockquote className="dwc-cta-philosophy">
            “Every individual has different needs, which is why we encourage a personalized approach when choosing a wellness experience.”
          </blockquote>

          {/* Supporting Description */}
          <p className="dwc-cta-description">
            At Daniel Wellness Center, our services are designed around relaxation, recovery support, body comfort, and overall well-being.
          </p>

          {/* Official DWC Contact Information Panel */}
          <div className="dwc-cta-contact-panel">
            {/* Location */}
            <div className="dwc-cta-contact-item">
              <div className="dwc-cta-icon-wrap" aria-hidden="true">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div className="dwc-cta-contact-body">
                <span className="dwc-cta-contact-label">LOCATION</span>
                <address className="dwc-cta-contact-address">
                  Daniel Wellness Center<br />
                  5th Avenue, Banu Nagar, Ambattur, Chennai
                </address>
              </div>
            </div>

            {/* Phone & Email (Split Row) */}
            <div className="dwc-cta-contact-split">
              {/* Phone */}
              <div className="dwc-cta-contact-item">
                <div className="dwc-cta-icon-wrap" aria-hidden="true">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <div className="dwc-cta-contact-body">
                  <span className="dwc-cta-contact-label">PHONE</span>
                  <a href="tel:7358313291" className="dwc-cta-contact-link">
                    7358313291
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="dwc-cta-contact-item">
                <div className="dwc-cta-icon-wrap" aria-hidden="true">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </div>
                <div className="dwc-cta-contact-body">
                  <span className="dwc-cta-contact-label">EMAIL</span>
                  <a href="mailto:aswinkumar8949@gmail.com" className="dwc-cta-contact-link">
                    aswinkumar8949@gmail.com
                  </a>
                </div>
              </div>
            </div>

            {/* Instagram */}
            <div className="dwc-cta-contact-item dwc-cta-contact-item--social">
              <div className="dwc-cta-icon-wrap" aria-hidden="true">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </div>
              <div className="dwc-cta-contact-body">
                <span className="dwc-cta-contact-label">INSTAGRAM</span>
                <a
                  href="https://instagram.com/aswin_reflexologist"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="dwc-cta-contact-link"
                >
                  @aswin_reflexologist
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Elevated Architectural Booking Card */}
        <div className="dwc-cta-booking-col">
          <div className="dwc-cta-card">
            <div className="dwc-cta-card__header">
              <div className="dwc-cta-card__badge-wrap">
                <span className="dwc-cta-card__badge-accent" aria-hidden="true" />
                <span className="dwc-cta-card__badge">APPOINTMENTS &amp; ENQUIRIES</span>
              </div>
              <h3 className="dwc-cta-card__title">Book an Appointment</h3>
              <p className="dwc-cta-card__subtitle">
                Reserve your calibrated evening therapy session or daytime recovery treatment with our concierge.
              </p>
            </div>

            <div className="dwc-cta-summary-grid">
              {/* Option 1: Evening Therapies */}
              <div className="dwc-cta-summary-box">
                <div className="dwc-cta-summary-box__header">
                  <span className="dwc-cta-summary-tag">6:00 PM – 10:00 PM</span>
                  <span className="dwc-cta-summary-duration">15-Min Sessions</span>
                </div>
                <h4 className="dwc-cta-summary-title">6 Core Therapies</h4>
                <p className="dwc-cta-summary-desc">
                  Reflexology, Taping Therapy, Ice Cupping Therapy, Steam Bath, Cupping Therapy, and Bamboo Therapy.
                </p>
              </div>

              {/* Option 2: Massage / Treatment */}
              <div className="dwc-cta-summary-box">
                <div className="dwc-cta-summary-box__header">
                  <span className="dwc-cta-summary-tag dwc-cta-summary-tag--day">ALL DAY</span>
                  <span className="dwc-cta-summary-duration">Flexible Hours</span>
                </div>
                <h4 className="dwc-cta-summary-title">Massage &amp; Recovery Treatments</h4>
                <p className="dwc-cta-summary-desc">
                  Relaxation, Recovery Support, Body Comfort, Postural Care, and Mobility Care available throughout the day.
                </p>
              </div>
            </div>

            {/* Launch Modal Action */}
            <div className="dwc-cta-action-wrap">
              <button
                type="button"
                className="dwc-cta-book-btn"
                onClick={handleBookingClick}
                aria-label="Book an Appointment at Daniel Wellness Center"
              >
                <span>BOOK AN APPOINTMENT</span>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  className="dwc-cta-btn-arrow"
                >
                  <path
                    d="M9 3L14 8M14 8L9 13M14 8H2"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="square"
                    strokeLinejoin="miter"
                  />
                </svg>
              </button>

              <div className="dwc-cta-footer-note">
                <span className="dwc-cta-note-dot" aria-hidden="true" />
                <span>Enquiries sent via official WhatsApp: +91 7358313291</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Standalone Fallback Booking Modal (when used without App-level shared modal) */}
      {!onOpenBooking && (
        <BookingModal
          isOpen={internalModalOpen}
          onClose={() => setInternalModalOpen(false)}
        />
      )}
    </section>
  );
}

export default CTA;
