import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EASING, isReducedMotion } from '../../animations/scrollAnimations';
import Navbar from '../navigation/Navbar';
import FounderEducation from '../about/FounderEducation';
import FounderSports from '../about/FounderSports';
import FounderRecords from '../about/FounderRecords';
import AboutVision from '../about/AboutVision';
import CTA from '../cta/CTA';
import Footer from '../footer/Footer';
import FounderVideoModal from './FounderVideoModal';
import '../../styles/about.css';
import '../../styles/founder.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Dedicated Founder Page Component (DWC 2.0)
 * Route: /about/founder
 *
 * Swiss International Style Editorial Architecture:
 * - Sticky Back to About navigation bar
 * - 01. Founder Hero and Introduction (Aswin Kumar)
 * - 02. Education
 * - 03. Sports
 * - 04. Records & Recognition
 * - 05. Wellness and Therapy Training
 * - 06. Facility Direction & Vision
 * - 07. Pre-Footer CTA & Footer
 */
export function FounderPage({ onOpenBooking }) {
  const pageRef = useRef(null);
  const navigate = useNavigate();
  const [activeVideo, setActiveVideo] = useState(null);

  // Scroll to top and set page title on mount
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.title = 'Aswin Kumar — Founder Profile — Daniel Wellness Center';
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

  // GSAP ScrollTrigger Section-Specific Reveals and Parallax
  useEffect(() => {
    if (!pageRef.current) return;
    if (isReducedMotion()) return;

    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth <= 768;

      // 1. Founder Hero Image Parallax (Desktop)
      const heroSection = pageRef.current.querySelector('.founder-hero-section');
      const heroImg = heroSection?.querySelector('.founder-image');
      if (heroImg && !isMobile) {
        gsap.fromTo(
          heroImg,
          { yPercent: -5 },
          {
            yPercent: 5,
            ease: 'none',
            scrollTrigger: {
              trigger: heroSection,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.2
            }
          }
        );
      }

      // Hero Content Progressive Reveal
      if (heroSection) {
        const badge = heroSection.querySelector('.founder-hero__badge');
        const title = heroSection.querySelector('.founder-hero__title');
        const name = heroSection.querySelector('.founder-hero__name');
        const tagline = heroSection.querySelector('.founder-hero__tagline');
        const subtitle = heroSection.querySelector('.founder-hero__subtitle');
        const desc = heroSection.querySelector('.founder-hero__desc');
        const disciplines = heroSection.querySelectorAll('.founder-hero__discipline-item');

        const tlHero = gsap.timeline({
          scrollTrigger: {
            trigger: heroSection,
            start: 'top 85%',
            once: true
          }
        });

        if (badge) tlHero.from(badge, { opacity: 0, y: 15, duration: 0.6, ease: EASING.editorial });
        if (title) tlHero.from(title, { opacity: 0, y: 25, duration: 0.75, ease: EASING.editorial }, '-=0.4');
        if (name) tlHero.from(name, { opacity: 0, y: 25, duration: 0.75, ease: EASING.editorial }, '-=0.5');
        if (tagline) tlHero.from(tagline, { opacity: 0, y: 18, duration: 0.65, ease: EASING.editorial }, '-=0.5');
        if (subtitle) tlHero.from(subtitle, { opacity: 0, y: 20, duration: 0.7, ease: EASING.editorial }, '-=0.5');
        if (desc) tlHero.from(desc, { opacity: 0, y: 20, duration: 0.7, ease: EASING.editorial }, '-=0.5');
        if (disciplines && disciplines.length) {
          tlHero.from(disciplines, { opacity: 0, y: 15, stagger: 0.08, duration: 0.6, ease: EASING.editorial }, '-=0.4');
        }
      }

      // 2. Education Reveal
      const eduZone = pageRef.current.querySelector('.founder-education-zone');
      if (eduZone) {
        const header = eduZone.querySelector('.founder-education__header');
        const cards = eduZone.querySelectorAll('.education-card');

        const tlEdu = gsap.timeline({
          scrollTrigger: {
            trigger: eduZone,
            start: 'top 82%',
            once: true
          }
        });

        if (header) tlEdu.from(header, { opacity: 0, y: 15, duration: 0.65, ease: EASING.editorial });
        if (cards && cards.length) {
          tlEdu.from(cards, { opacity: 0, y: 25, stagger: 0.12, duration: 0.8, ease: EASING.editorial }, '-=0.4');
        }
      }

      // 3. Sports Reveal
      const sportsZone = pageRef.current.querySelector('.founder-sports-zone');
      if (sportsZone) {
        const header = sportsZone.querySelector('.founder-sports__header');
        const sportsCards = sportsZone.querySelectorAll('.sports-card');
        const mediaCards = sportsZone.querySelectorAll('.sports-photo-feature, .sports-video-feature');

        const tlSports = gsap.timeline({
          scrollTrigger: {
            trigger: sportsZone,
            start: 'top 82%',
            once: true
          }
        });

        if (header) tlSports.from(header, { opacity: 0, y: 15, duration: 0.65, ease: EASING.editorial });
        if (sportsCards && sportsCards.length) {
          tlSports.fromTo(
            sportsCards,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, stagger: 0.12, duration: 0.75, ease: EASING.editorial, clearProps: 'transform,opacity' },
            '-=0.4'
          );
        }
        if (mediaCards && mediaCards.length) {
          tlSports.fromTo(
            mediaCards,
            { opacity: 0, y: 25 },
            { opacity: 1, y: 0, stagger: 0.12, duration: 0.75, ease: EASING.editorial, clearProps: 'transform,opacity' },
            '-=0.4'
          );
        }
      }

      // 4. Records & Recognition Reveal
      const recordsZone = pageRef.current.querySelector('.founder-records-zone');
      if (recordsZone) {
        const header = recordsZone.querySelector('.founder-records__header');
        const primaryTier = recordsZone.querySelector('.records-tier-primary');
        const secondaryTier = recordsZone.querySelector('.records-tier-secondary');
        const pressTier = recordsZone.querySelector('.records-tier-press');
        const instaBar = recordsZone.querySelector('.founder-instagram-bar');

        const tlRecords = gsap.timeline({
          scrollTrigger: {
            trigger: recordsZone,
            start: 'top 82%',
            once: true
          }
        });

        if (header) tlRecords.from(header, { opacity: 0, y: 15, duration: 0.6, ease: EASING.editorial });
        if (primaryTier) tlRecords.from(primaryTier, { opacity: 0, y: 25, duration: 0.8, ease: EASING.editorial }, '-=0.4');
        if (secondaryTier) {
          gsap.from(secondaryTier, {
            opacity: 0,
            y: 25,
            duration: 0.8,
            ease: EASING.editorial,
            scrollTrigger: {
              trigger: secondaryTier,
              start: 'top 85%',
              once: true
            }
          });
        }
        if (pressTier) {
          gsap.from(pressTier, {
            opacity: 0,
            y: 25,
            duration: 0.8,
            ease: EASING.editorial,
            scrollTrigger: {
              trigger: pressTier,
              start: 'top 85%',
              once: true
            }
          });
        }
        if (instaBar) {
          gsap.from(instaBar, {
            opacity: 0,
            y: 15,
            duration: 0.65,
            ease: EASING.editorial,
            scrollTrigger: {
              trigger: instaBar,
              start: 'top 92%',
              once: true
            }
          });
        }
      }

      // 5. Wellness Reveal
      const wellnessZone = pageRef.current.querySelector('.founder-wellness-zone');
      if (wellnessZone) {
        const header = wellnessZone.querySelector('.founder-wellness__header');
        const cards = wellnessZone.querySelectorAll('.wellness-card');

        const tlWellness = gsap.timeline({
          scrollTrigger: {
            trigger: wellnessZone,
            start: 'top 82%',
            once: true
          }
        });

        if (header) tlWellness.from(header, { opacity: 0, y: 15, duration: 0.65, ease: EASING.editorial });
        if (cards && cards.length) {
          tlWellness.from(cards, { opacity: 0, y: 20, stagger: 0.1, duration: 0.75, ease: EASING.editorial }, '-=0.4');
        }
      }

      // 6. Vision Reveal
      const visionZone = pageRef.current.querySelector('.about-vision-zone');
      if (visionZone) {
        const header = visionZone.querySelector('.vision-zone__header');
        const grid = visionZone.querySelector('.vision-center-grid');

        const tlVision = gsap.timeline({
          scrollTrigger: {
            trigger: visionZone,
            start: 'top 85%',
            once: true
          }
        });

        if (header) tlVision.from(header, { opacity: 0, y: 15, duration: 0.65, ease: EASING.editorial });
        if (grid) tlVision.from(grid, { opacity: 0, y: 25, duration: 0.8, ease: EASING.editorial }, '-=0.4');
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
            STICKY RETURN ACTION: Stays visible while user scrolls
            ========================================================= */}
        <div className="founder-hero-nav" role="navigation" aria-label="Return Navigation">
          <div className="founder-hero-nav__left">
            <Link
              to="/#about"
              onClick={handleBackToAbout}
              className="founder-back-link"
              aria-label="Return to About section"
            >
              <span className="founder-back-arrow" aria-hidden="true">←</span>
              <span>BACK TO ABOUT</span>
            </Link>
          </div>
        </div>

        {/* =========================================================
            SECTION 01: White Hero & Introduction
            ========================================================= */}
        <section
          className="founder-section founder-section--light founder-hero-section"
          aria-label="Founder Hero and Introduction"
        >
          <div className="dwc-about-container">
            {/* Hero Main Grid: Content + Founder Studio Portrait */}
            <div className="founder-hero-grid" data-about-anim="fade-up">
              {/* Left Column: Heading, Name, Tagline, Subtitle, Lead & Disciplines */}
              <div className="founder-hero__content-col">
                <div className="founder-hero__badge">
                  <span className="founder-hero__badge-accent" aria-hidden="true" />
                  <span>FOUNDER PROFILE</span>
                </div>

                <h1 className="founder-hero__title">
                  THE FOUNDER
                </h1>

                {/* Founder Name */}
                <div className="founder-hero__name">
                  ASWIN KUMAR
                </div>

                {/* Professional Tagline */}
                <p className="founder-hero__tagline">
                  Psychology. Performance. Wellness.
                </p>

                <h2 className="founder-hero__subtitle">
                  Built at the intersection of psychology, sport and wellness.
                </h2>

                <p className="founder-hero__desc">
                  With a background spanning academic psychology, competitive sport, coaching and certified wellness training, the founder is establishing Daniel Wellness Center around a multidisciplinary understanding of mind, movement and recovery.
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

              {/* Right Column: Founder Approved Studio Portrait */}
              <div className="founder-hero__media-col">
                <div className="founder-image-wrapper founder-image-wrapper--light">
                  <img
                    src="/images/about/founder/founder-detail-portrait.png"
                    alt="Founder Studio Portrait"
                    className="founder-image"
                    width="1108"
                    height="1108"
                    loading="eager"
                  />
                </div>

                <div className="founder-hero__media-caption">
                  <span>PORTRAIT</span>
                  <span>STUDIO ARCHIVE</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            SECTION 02: White Education
            ========================================================= */}
        <section
          className="founder-section founder-section--light founder-education-section"
          aria-label="Founder Academic Credentials"
        >
          <div className="dwc-about-container">
            <FounderEducation />
          </div>
        </section>

        {/* =========================================================
            SECTION 03: Black Sports
            ========================================================= */}
        <section
          className="founder-section founder-section--dark founder-sports-section"
          aria-label="Founder Athletics and Sports Background"
        >
          <div className="dwc-about-container">
            <FounderSports onOpenVideo={setActiveVideo} />
          </div>
        </section>

        {/* =========================================================
            SECTION 04: Black World Records & Recognition
            ========================================================= */}
        <section
          className="founder-section founder-section--dark founder-records-section"
          aria-label="Founder Official World Records and Press Recognition"
        >
          <div className="dwc-about-container">
            <FounderRecords onOpenVideo={setActiveVideo} />
          </div>
        </section>



        {/* =========================================================
            SECTION 06: Black DWC Vision & Facility Direction
            ========================================================= */}
        <section
          className="founder-section founder-section--dark founder-vision-section"
          aria-label="Facility Vision"
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

      {/* Interactive Founder Video Modal */}
      <FounderVideoModal
        isOpen={!!activeVideo}
        videoData={activeVideo}
        onClose={() => setActiveVideo(null)}
      />
    </div>
  );
}

export default FounderPage;
