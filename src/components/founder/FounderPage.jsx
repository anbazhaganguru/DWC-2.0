import React, { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from '../navigation/Navbar';
import AboutIntro from '../about/AboutIntro';
import FounderEducation from '../about/FounderEducation';
import FounderSports from '../about/FounderSports';
import FounderRecords from '../about/FounderRecords';
import FounderWellness from '../about/FounderWellness';
import AboutVision from '../about/AboutVision';
import CTA from '../cta/CTA';
import Footer from '../footer/Footer';
import '../../styles/about.css';
import '../../styles/founder.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Dedicated Founder Page Component (DWC 2.0)
 * Route: /about/founder
 *
 * Swiss International Style Editorial Architecture with Black + White Alternation:
 * - SECTION 01: White Hero (Founder Image, Title & Back Navigation)
 * - SECTION 02: Black Introduction (AboutIntro)
 * - SECTION 03: White Education (FounderEducation)
 * - SECTION 04: Black Sports & Records (FounderSports + FounderRecords)
 * - SECTION 05: White Wellness Training (FounderWellness)
 * - SECTION 06: Black DWC Vision (AboutVision)
 * - SECTION 07: Pre-Footer CTA & Footer (CTA + Footer)
 */
export function FounderPage({ onOpenBooking }) {
  const pageRef = useRef(null);
  const navigate = useNavigate();

  // Scroll to top and set page title on mount
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.title = 'Founder Profile — Daniel Wellness Center';
  }, []);

  // Handle smooth return navigation to homepage #about section
  const handleBackToAbout = (e) => {
    e.preventDefault();
    navigate('/#about');
    setTimeout(() => {
      const el = document.getElementById('about');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  // GSAP ScrollTrigger Entrance Animations
  useEffect(() => {
    if (!pageRef.current) return;

    const prefersReducedMotion = typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const animatedElements = pageRef.current.querySelectorAll('[data-about-anim="fade-up"]');
      animatedElements.forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      });

      // Special entrance for record counter digits
      const recordsSection = pageRef.current.querySelector('[data-about-anim="records-reveal"]');
      if (recordsSection) {
        const recordNumbers = recordsSection.querySelectorAll('.record-column__num-hero');
        gsap.fromTo(
          recordNumbers,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            stagger: 0.15,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: recordsSection,
              start: 'top 82%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      }
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="founder-page" id="top" ref={pageRef}>
      {/* Reused DWC Sticky Navbar in Detail Mode with HOME and THERAPY removed */}
      <Navbar isDetailPage={true} hideCenterLinks={true} onOpenBooking={onOpenBooking} />

      <main className="founder-page-main">
        {/* =========================================================
            SECTION 01: White Hero (Founder Image, Title, Disciplines & Return Link)
            ========================================================= */}
        <section
          className="founder-section founder-section--light founder-hero-section"
          aria-label="Founder Hero Overview"
        >
          {/* Top Breadcrumb & Return Action */}
          <div className="founder-hero-nav">
            <div className="founder-hero-nav__left">
              <Link
                to="/#about"
                onClick={handleBackToAbout}
                className="founder-back-link"
                aria-label="Return to Daniel Wellness Center About section"
              >
                <span className="founder-back-arrow" aria-hidden="true">←</span>
                <span>BACK TO ABOUT</span>
              </Link>
            </div>

            <div className="founder-hero-nav__right">
              <span>SWISS EDITORIAL SYSTEM</span>
              <span>DANIEL WELLNESS CENTER</span>
              <span className="founder-hero-nav__specimen">INDEX: 02</span>
            </div>
          </div>

          <div className="dwc-about-container">
            <div className="founder-hero-grid" data-about-anim="fade-up">
              {/* Left Column: Heading, Subtitle, Lead & Disciplines */}
              <div className="founder-hero__content-col">
                <div className="founder-hero__badge">
                  <span className="founder-hero__badge-accent" aria-hidden="true" />
                  <span>FOUNDER PROFILE</span>
                </div>

                <h1 className="founder-hero__title">
                  THE FOUNDER
                </h1>

                <h2 className="founder-hero__subtitle">
                  A multidisciplinary foundation across mind, movement and recovery.
                </h2>

                <p className="founder-hero__desc">
                  With a background spanning psychology, competitive sport, coaching and wellness training, the founder is building Daniel Wellness Center around a broader understanding of well-being.
                </p>

                {/* 3 Verified Disciplines Metadata */}
                <div className="founder-hero__disciplines">
                  <div className="founder-hero__discipline-item">
                    <span className="founder-hero__discipline-num">01</span>
                    <span className="founder-hero__discipline-title">Psychology Graduate</span>
                  </div>

                  <div className="founder-hero__discipline-item">
                    <span className="founder-hero__discipline-num">02</span>
                    <span className="founder-hero__discipline-title">Basketball Player / Coach</span>
                  </div>

                  <div className="founder-hero__discipline-item">
                    <span className="founder-hero__discipline-num">03</span>
                    <span className="founder-hero__discipline-title">Wellness Practitioner</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Founder Archival Portrait Frame */}
              <div className="founder-hero__media-col">
                <div
                  className="founder-placeholder founder-placeholder--light"
                  role="img"
                  aria-label="Daniel Wellness Center Founder Portrait Archive"
                >
                  <span className="founder-placeholder__corner founder-placeholder__corner--tl" aria-hidden="true">+</span>
                  <span className="founder-placeholder__corner founder-placeholder__corner--tr" aria-hidden="true">+</span>
                  <span className="founder-placeholder__corner founder-placeholder__corner--bl" aria-hidden="true">+</span>
                  <span className="founder-placeholder__corner founder-placeholder__corner--br" aria-hidden="true">+</span>

                  <div className="founder-placeholder__grid-overlay" aria-hidden="true" />

                  <div className="founder-placeholder__header">
                    <span className="founder-placeholder__stamp">ARCHIVE // PORTRAIT</span>
                    <span className="founder-placeholder__status">
                      <span className="founder-placeholder__status-dot" aria-hidden="true" />
                      DWC FOUNDER
                    </span>
                  </div>

                  <div className="founder-placeholder__body">
                    <div className="founder-placeholder__glyph" aria-hidden="true">
                      DWC
                    </div>
                    <p className="founder-placeholder__caption">FOUNDER PORTRAIT</p>
                    <p className="founder-placeholder__subtext">DOCUMENTARY PHOTOGRAPHY ARCHIVE</p>
                  </div>

                  <div className="founder-placeholder__footer">
                    <span>SYSTEM: SWISS EDITORIAL</span>
                    <span>CHENNAI // AMBATTUR</span>
                  </div>
                </div>

                <div className="founder-hero__media-caption">
                  <span>SEC 02.1 // PORTRAIT</span>
                  <span>DANIEL WELLNESS CENTER</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            SECTION 02: Black Introduction
            ========================================================= */}
        <section
          className="founder-section founder-section--dark"
          aria-label="Founder Philosophy and Vision Statement"
        >
          <div className="dwc-about-container">
            <AboutIntro />
          </div>
        </section>

        {/* =========================================================
            SECTION 03: White Education
            ========================================================= */}
        <section
          className="founder-section founder-section--light"
          aria-label="Founder Academic Credentials"
        >
          <div className="dwc-about-container">
            <FounderEducation />
          </div>
        </section>

        {/* =========================================================
            SECTION 04: Black Sports & World Records
            ========================================================= */}
        <section
          className="founder-section founder-section--dark"
          aria-label="Founder Athletics and Official World Records"
        >
          <div className="dwc-about-container">
            <FounderSports />
            <FounderRecords />
          </div>
        </section>

        {/* =========================================================
            SECTION 05: White Wellness Training
            ========================================================= */}
        <section
          className="founder-section founder-section--light"
          aria-label="Founder Certified Wellness Modalities"
        >
          <div className="dwc-about-container">
            <FounderWellness />
          </div>
        </section>

        {/* =========================================================
            SECTION 06: Black DWC Vision
            ========================================================= */}
        <section
          className="founder-section founder-section--dark"
          aria-label="Daniel Wellness Center Facility Vision"
        >
          <div className="dwc-about-container">
            <AboutVision />
          </div>
        </section>

        {/* =========================================================
            SECTION 07: CTA & Booking Consultation
            ========================================================= */}
        <CTA onOpenBooking={onOpenBooking} />
      </main>

      {/* Detail Page Footer */}
      <Footer onOpenBooking={onOpenBooking} />
    </div>
  );
}

export default FounderPage;
