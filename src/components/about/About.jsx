import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../../styles/about.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Homepage About Teaser Component (DWC 2.0)
 * Rebuilt as a concise, minimal Swiss International Style teaser profile.
 * 
 * Contains ONLY:
 * 1. Small section label / index
 * 2. Short About introduction
 * 3. Founder image / archival portrait placeholder
 * 4. Very short founder introduction
 * 5. Small supporting metadata (PSYCHOLOGY, SPORT, WELLNESS)
 * 6. Clear CTA button: VIEW FOUNDER → (links to /about/founder)
 */
export function About() {
  const sectionRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const prefersReducedMotion = typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const animatedElements = sectionRef.current.querySelectorAll('[data-about-anim="fade-up"]');
      animatedElements.forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 20 },
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
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="dwc-about-section dwc-about-section--teaser" id="about" ref={sectionRef} aria-label="About Daniel Wellness Center Founder">
      <div className="dwc-about-container">
        {/* 1. Small section label / index */}
        <div className="about-top-bar" aria-label="Section Identity">
          <div className="about-top-bar__left">
            <span className="about-top-bar__accent" aria-hidden="true" />
            <span>SEC 02 // ABOUT &amp; FOUNDER</span>
          </div>

          <div className="about-top-bar__right">
            <span>SWISS EDITORIAL SYSTEM</span>
            <span>DANIEL WELLNESS CENTER</span>
            <span>DWC-2.0</span>
            <span className="about-top-bar__index">INDEX: 02</span>
          </div>
        </div>

        {/* Teaser Core Grid */}
        <div className="about-teaser-zone" data-about-anim="fade-up">
          {/* 3. Founder Image / Intentional Swiss Architectural Placeholder */}
          <div className="about-teaser__media-col">
            <div
              className="founder-placeholder"
              role="img"
              aria-label="Daniel Wellness Center Founder Portrait Archive Placeholder"
            >
              {/* Swiss Precision Corner Crosshairs */}
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

            <div className="founder-profile__media-caption">
              <span>SEC 02.1 // PORTRAIT</span>
              <span>DANIEL WELLNESS CENTER</span>
            </div>
          </div>

          {/* Right Column: Teaser Content */}
          <div className="about-teaser__content-col">
            <div className="about-teaser__meta-header">
              <div className="about-teaser__badge">
                <span className="about-teaser__badge-accent" aria-hidden="true" />
                <span>FOUNDER PROFILE</span>
              </div>
              <span className="about-teaser__index">DISCIPLINES // 03</span>
            </div>

            {/* 2. Short About introduction */}
            <h2 className="about-teaser__headline">
              Built at the intersection of psychology, sport and wellness.
            </h2>

            {/* 4. Very short founder introduction */}
            <p className="about-teaser__lead">
              With a background spanning psychology, competitive sport, coaching and wellness training, the founder is building Daniel Wellness Center around a multidisciplinary understanding of mind, movement and recovery.
            </p>

            {/* 5. Small supporting metadata */}
            <div className="about-teaser__disciplines">
              <div className="about-teaser__discipline-item">
                <span className="about-teaser__discipline-num">01</span>
                <span className="about-teaser__discipline-title">PSYCHOLOGY</span>
              </div>

              <div className="about-teaser__discipline-item">
                <span className="about-teaser__discipline-num">02</span>
                <span className="about-teaser__discipline-title">SPORT</span>
              </div>

              <div className="about-teaser__discipline-item">
                <span className="about-teaser__discipline-num">03</span>
                <span className="about-teaser__discipline-title">WELLNESS</span>
              </div>
            </div>

            {/* 6. Clear CTA button */}
            <div className="about-teaser__cta-wrapper">
              <Link
                to="/about/founder"
                className="about-teaser__cta-btn"
                aria-label="View complete founder profile and background"
              >
                <span>VIEW FOUNDER</span>
                <span className="about-teaser__cta-arrow" aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Section Verification Bar */}
        <div className="about-footer-bar" aria-label="Section Verification">
          <div className="about-footer-bar__left">
            <span className="about-footer-bar__dot" aria-hidden="true" />
            <span>DANIEL WELLNESS CENTER // FOUNDER PROFILE TEASER</span>
          </div>

          <div className="about-footer-bar__right">
            <span>AMBATTUR, CHENNAI</span>
            <span>NEXT: CLINICAL MODALITIES [01–06]</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
