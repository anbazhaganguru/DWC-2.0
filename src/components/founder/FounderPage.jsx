import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EASING, isReducedMotion } from '../../animations/scrollAnimations';
import Navbar from '../navigation/Navbar';
import AboutIntro from '../about/AboutIntro';
import FounderEducation from '../about/FounderEducation';
import FounderSports from '../about/FounderSports';
import FounderRecords from '../about/FounderRecords';
import FounderWellness from '../about/FounderWellness';
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
  const [activeVideo, setActiveVideo] = useState(null);

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

  // GSAP ScrollTrigger Section-Specific Reveals and Parallax
  useEffect(() => {
    if (!pageRef.current) return;
    if (isReducedMotion()) return;

    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth <= 768;

      // 1. Founder Hero Image Slow Vertical Parallax (Desktop)
      const heroSection = pageRef.current.querySelector('.founder-hero-section');
      const heroImg = heroSection?.querySelector('.founder-image');
      if (heroImg && !isMobile) {
        gsap.fromTo(
          heroImg,
          { yPercent: -6 },
          {
            yPercent: 6,
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
        if (title) tlHero.from(title, { opacity: 0, y: 30, duration: 0.8, ease: EASING.editorial }, '-=0.4');
        if (subtitle) tlHero.from(subtitle, { opacity: 0, y: 20, duration: 0.7, ease: EASING.editorial }, '-=0.5');
        if (desc) tlHero.from(desc, { opacity: 0, y: 20, duration: 0.7, ease: EASING.editorial }, '-=0.5');
        if (disciplines && disciplines.length) {
          tlHero.from(disciplines, { opacity: 0, y: 15, stagger: 0.08, duration: 0.6, ease: EASING.editorial }, '-=0.4');
        }
      }

      // 2. Founder Introduction: Fade + Upward Reveal
      const introZone = pageRef.current.querySelector('.about-intro-zone');
      if (introZone) {
        const tagGroup = introZone.querySelector('.about-intro__tag-group');
        const num = introZone.querySelector('.about-intro__num');
        const title = introZone.querySelector('.about-intro__title');
        const sideCol = introZone.querySelector('.about-intro__side-col');

        const tlIntro = gsap.timeline({
          scrollTrigger: {
            trigger: introZone,
            start: 'top 82%',
            once: true
          }
        });

        if (tagGroup || num) {
          tlIntro.from([tagGroup, num].filter(Boolean), {
            opacity: 0,
            y: 15,
            duration: 0.6,
            ease: EASING.editorial
          });
        }
        if (title) {
          tlIntro.from(title, { opacity: 0, y: 30, duration: 0.8, ease: EASING.editorial }, '-=0.4');
        }
        if (sideCol) {
          tlIntro.from(sideCol, { opacity: 0, y: 20, duration: 0.7, ease: EASING.editorial }, '-=0.5');
        }
      }

      // 3. Education: Staggered Reveal
      const eduZone = pageRef.current.querySelector('.founder-education-zone');
      if (eduZone) {
        const sideLabel = eduZone.querySelector('.founder-education__side-label');
        const cards = eduZone.querySelectorAll('.education-card');

        const tlEdu = gsap.timeline({
          scrollTrigger: {
            trigger: eduZone,
            start: 'top 82%',
            once: true
          }
        });

        if (sideLabel) tlEdu.from(sideLabel, { opacity: 0, y: 20, duration: 0.65, ease: EASING.editorial });
        if (cards && cards.length) {
          tlEdu.from(cards, { opacity: 0, y: 25, stagger: 0.12, duration: 0.8, ease: EASING.editorial }, '-=0.4');
        }
      }

      // 4. Sports & Records: Directional Stagger + Numeric Counter Reveal
      const sportsZone = pageRef.current.querySelector('.founder-sports-zone');
      if (sportsZone) {
        const sideLabel = sportsZone.querySelector('.founder-sports__side-label');
        const cards = sportsZone.querySelectorAll(
          '.sports-compact-card, .sports-media-card, .sports-basketball-card, .sports-netball-card'
        );

        const tlSports = gsap.timeline({
          scrollTrigger: {
            trigger: sportsZone,
            start: 'top 82%',
            once: true
          }
        });

        if (sideLabel) tlSports.from(sideLabel, { opacity: 0, y: 20, duration: 0.65, ease: EASING.editorial });
        if (cards && cards.length) {
          tlSports.from(
            cards,
            {
              opacity: 0,
              x: isMobile ? 0 : 24,
              y: isMobile ? 20 : 0,
              stagger: 0.12,
              duration: 0.75,
              ease: EASING.editorial
            },
            '-=0.4'
          );
        }
      }

      const recordsZone = pageRef.current.querySelector('.founder-records-zone');
      if (recordsZone) {
        const header = recordsZone.querySelector('.founder-records__header');
        const recordCols = recordsZone.querySelectorAll('.record-compact-card, .record-column');
        const recordNumbers = recordsZone.querySelectorAll('.record-compact-card__num, .record-column__num-hero');

        const tlRecords = gsap.timeline({
          scrollTrigger: {
            trigger: recordsZone,
            start: 'top 82%',
            once: true
          }
        });

        if (header) tlRecords.from(header, { opacity: 0, y: 15, duration: 0.6, ease: EASING.editorial });
        if (recordCols && recordCols.length) {
          tlRecords.from(recordCols, { opacity: 0, y: 25, stagger: 0.12, duration: 0.8, ease: EASING.editorial }, '-=0.4');
        }
        if (recordNumbers && recordNumbers.length) {
          tlRecords.from(recordNumbers, { opacity: 0, y: 20, stagger: 0.15, duration: 0.8, ease: EASING.editorial }, '-=0.6');
        }
        const supportingVisuals = recordsZone.querySelectorAll(
          '.records-modular-card, .recognition-modular-card, .records-evidence-card, .recognition-compact-card, .records-visual-hero, .records-recognition-pairing, .founder-instagram-bar'
        );
        if (supportingVisuals && supportingVisuals.length) {
          tlRecords.from(
            supportingVisuals,
            { opacity: 0, y: 25, stagger: 0.12, duration: 0.8, ease: EASING.editorial },
            '-=0.4'
          );
        }
      }

      // 5. Wellness: Clean Stagger & Clip Reveal
      const wellnessZone = pageRef.current.querySelector('.founder-wellness-zone');
      if (wellnessZone) {
        const sideLabel = wellnessZone.querySelector('.founder-wellness__side-label');
        const items = wellnessZone.querySelectorAll('.wellness-training-item');

        const tlWellness = gsap.timeline({
          scrollTrigger: {
            trigger: wellnessZone,
            start: 'top 82%',
            once: true
          }
        });

        if (sideLabel) tlWellness.from(sideLabel, { opacity: 0, y: 20, duration: 0.65, ease: EASING.editorial });
        if (items && items.length) {
          tlWellness.from(
            items,
            {
              opacity: 0,
              y: 18,
              stagger: 0.1,
              duration: 0.75,
              ease: EASING.editorial
            },
            '-=0.4'
          );
        }
      }

      // 6. Vision: Disciplines, Center, and Bridge Stagger
      const visionZone = pageRef.current.querySelector('.about-vision-zone');
      if (visionZone) {
        const disciplinesRow = visionZone.querySelector('.vision-disciplines-row');
        const centerRow = visionZone.querySelector('.vision-center-row');
        const bridgeRow = visionZone.querySelector('.about-bridge-row');

        if (disciplinesRow) {
          gsap.from(disciplinesRow, {
            opacity: 0,
            y: 25,
            duration: 0.8,
            ease: EASING.editorial,
            scrollTrigger: {
              trigger: disciplinesRow,
              start: 'top 82%',
              once: true
            }
          });
        }

        if (centerRow) {
          gsap.from(centerRow, {
            opacity: 0,
            y: 25,
            duration: 0.8,
            ease: EASING.editorial,
            scrollTrigger: {
              trigger: centerRow,
              start: 'top 82%',
              once: true
            }
          });
        }

        if (bridgeRow) {
          gsap.from(bridgeRow, {
            opacity: 0,
            y: 20,
            duration: 0.8,
            ease: EASING.editorial,
            scrollTrigger: {
              trigger: bridgeRow,
              start: 'top 88%',
              once: true
            }
          });
        }
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

              {/* Right Column: Founder Approved Studio Portrait */}
              <div className="founder-hero__media-col">
                <div className="founder-image-wrapper founder-image-wrapper--light">
                  <img
                    src="/images/about/founder/founder-detail-portrait.png"
                    alt="Daniel Wellness Center Founder Portrait"
                    className="founder-image"
                    width="1108"
                    height="1419"
                    loading="eager"
                  />
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
            <FounderSports onOpenVideo={setActiveVideo} />
            <FounderRecords onOpenVideo={setActiveVideo} />
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
