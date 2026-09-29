import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import HeroCanvas from './HeroCanvas';
import HeroHeader from './HeroHeader';
import HeroLeftContent from './HeroLeftContent';
import HeroRightContent from './HeroRightContent';
import HeroSecondaryContent from './HeroSecondaryContent';
import HeroScrollIndicator from './HeroScrollIndicator';
import { useHeroSequence } from '../../hooks/useHeroSequence';
import { initHeroSequenceAnimation, cleanupHeroAnimation } from '../../animations/heroAnimation';
import '../../styles/hero.css';

/**
 * Main Hero Component.
 * Orchestrates the existing 360° scroll-controlled iROBO chair rotation canvas
 * alongside the disciplined Swiss International Style UI overlay.
 * 
 * Conceptual zones:
 * - LEFT CONTENT ZONE: "OUR WELLNESS SERVICES" + Supporting copy
 * - CHAIR SAFE ZONE: Center-protected 360° chair rotation
 * - RIGHT CONTENT ZONE: "EVERY INDIVIDUAL HAS DIFFERENT NEEDS" editorial block
 * - SAFE LOWER AREA: Secondary goal statement & scroll indicator
 */
export function Hero() {
  const heroRef = useRef(null);
  const canvasRef = useRef(null);
  const frameIndexRef = useRef(0);
  const uiContainerRef = useRef(null);

  const {
    images,
    isLoaded
  } = useHeroSequence();

  // Initialize GSAP ScrollTrigger sequence animation for the chair
  useEffect(() => {
    if (!heroRef.current) return;

    const scrollTriggerInstance = initHeroSequenceAnimation({
      triggerRef: heroRef.current,
      totalFrames: 61,
      onUpdateFrame: (frameIndex) => {
        frameIndexRef.current = frameIndex;
      }
    });

    return () => {
      cleanupHeroAnimation(scrollTriggerInstance);
    };
  }, []);

  // Subtle initial entrance animation for Swiss UI overlay (strictly once, static thereafter)
  useEffect(() => {
    if (!uiContainerRef.current) return;

    const prefersReducedMotion = typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      gsap.set(uiContainerRef.current, { opacity: 1 });
      return;
    }

    const elementsToReveal = uiContainerRef.current.querySelectorAll(
      '.hero-header, .hero-left-content, .hero-right-content, .hero-secondary-content, .hero-scroll-indicator'
    );

    const anim = gsap.fromTo(
      elementsToReveal,
      { opacity: 0, y: 10 },
      {
        opacity: 1,
        y: 0,
        duration: 0.85,
        stagger: 0.08,
        ease: 'power2.out',
        delay: 0.1
      }
    );

    return () => {
      anim.kill();
    };
  }, []);

  return (
    <section className="hero-section" id="hero" ref={heroRef}>
      {/* Existing iROBO Chair 360° Canvas (Unchanged) */}
      <HeroCanvas 
        canvasRef={canvasRef} 
        images={images}
        frameIndexRef={frameIndexRef} 
        isLoaded={isLoaded} 
      />

      {/* Swiss International Style UI Overlay (Layered on top of canvas) */}
      <div className="hero-ui-overlay" ref={uiContainerRef}>
        <div className="hero-swiss-container">
          {/* Header Row: Left Brand, Center Nav, Right BOOK APPOINTMENT */}
          <HeroHeader />

          {/* Middle Body: Left Content Zone, Chair Safe Zone (Center), Right Content Zone */}
          <div className="hero-middle-body">
            <HeroLeftContent />
            
            {/* Center column is the Chair Safe Zone: strictly unoccupied by text */}
            <div className="hero-chair-safe-zone" aria-hidden="true" />

            <HeroRightContent />
          </div>

          {/* Lower Safe Area: Secondary Statement & Scroll to Rotate Indicator */}
          <footer className="hero-bottom-row">
            <HeroSecondaryContent />
            <HeroScrollIndicator />
          </footer>
        </div>
      </div>
    </section>
  );
}

export default Hero;
