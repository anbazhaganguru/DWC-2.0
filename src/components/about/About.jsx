import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AboutIntro from './AboutIntro';
import FounderProfile from './FounderProfile';
import FounderEducation from './FounderEducation';
import FounderSports from './FounderSports';
import FounderRecords from './FounderRecords';
import FounderWellness from './FounderWellness';
import AboutVision from './AboutVision';
import '../../styles/about.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Master About Component (DWC 2.0)
 * Rebuilt as a Founder-Led Swiss International Style Editorial Profile.
 *
 * Sequence:
 * 1. Top Metadata Bar (Section Tracker)
 * 2. About Intro (Large Heading & Multidisciplinary Philosophy)
 * 3. Founder Profile (Architectural Portrait Placeholder & Intro)
 * 4. Education (B.Sc. Psychology & M.Sc. Clinical Psychology - Currently Studying)
 * 5. Sport (Basketball player/coach & Netball Silver Medal)
 * 6. Records (Asia & Indian Book of World Records Spider Dribbles)
 * 7. Wellness Training (Foot Reflexology, Taping Therapy, Cupping Therapy)
 * 8. Vision (Two Disciplines, Ambattur Center & Visual Bridge to Therapy)
 * 9. Bottom Section Verification Bar
 */
export function About() {
  const sectionRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    // Respect user's accessibility preferences
    const prefersReducedMotion = typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Subtle upward reveal for editorial sections
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

      // Special subtle entrance for records numbers
      const recordsSection = sectionRef.current.querySelector('[data-about-anim="records-reveal"]');
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
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="dwc-about-section" id="about" ref={sectionRef} aria-label="About Daniel Wellness Center Founder">
      <div className="dwc-about-container">
        {/* Top Section Metadata Tracker */}
        <div className="about-top-bar" aria-label="Section Identity">
          <div className="about-top-bar__left">
            <span className="about-top-bar__accent" aria-hidden="true" />
            <span>SEC 02 // ABOUT &amp; FOUNDER PROFILE</span>
          </div>

          <div className="about-top-bar__right">
            <span>SWISS EDITORIAL SYSTEM</span>
            <span>DANIEL WELLNESS CENTER</span>
            <span>DWC-2.0</span>
            <span className="about-top-bar__index">INDEX: 02</span>
          </div>
        </div>

        {/* Section 4: Intro & Design Statement */}
        <AboutIntro />

        {/* Sections 5 & 6: Founder Profile, Image Placeholder & Concise Intro */}
        <FounderProfile />

        {/* Section 7: Education Block (B.Sc. & M.Sc. Currently Studying) */}
        <FounderEducation />

        {/* Sections 8 & 10: Sports Background (Basketball & Netball) */}
        <FounderSports />

        {/* Section 9: World Records Layout */}
        <FounderRecords />

        {/* Section 11: Wellness Training (3 Modalities) */}
        <FounderWellness />

        {/* Sections 12, 13, 14: Vision, Ambattur Center & Visual Bridge */}
        <AboutVision />

        {/* Bottom Section Verification Bar */}
        <div className="about-footer-bar" aria-label="Section Verification">
          <div className="about-footer-bar__left">
            <span className="about-footer-bar__dot" aria-hidden="true" />
            <span>DANIEL WELLNESS CENTER // FOUNDER PROFILE VERIFIED</span>
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
