import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

/**
 * HeroContent Component.
 * Swiss International Style typographic and grid UI overlay positioned over the Hero Canvas.
 * Typography occupies the left negative space, keeping the iROBO chair completely unobstructed.
 * Content is strictly derived from approved DWC project materials.
 * Remains completely fixed during scroll-driven 360° turntable chair rotation.
 */
export function HeroContent() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Respect accessibility settings
    const prefersReducedMotion = typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      gsap.set(containerRef.current, { opacity: 1, y: 0 });
      return;
    }

    // Subtle initial entrance animation per Swiss design specs
    const anim = gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out', delay: 0.15 }
    );

    return () => {
      anim.kill();
    };
  }, []);

  return (
    <div className="hero-content" ref={containerRef}>
      <div className="hero-swiss-grid">
        {/* Left Negative Space Editorial Typography (Cols 1-5 Desktop) */}
        <div className="hero-typography-column">
          {/* Eyebrow / Metadata */}
          <div className="hero-meta">
            <span className="hero-meta__dot" aria-hidden="true" />
            <span className="hero-meta__brand">DANIEL WELLNESS CENTER</span>
            <span className="hero-meta__sep">/</span>
            <span className="hero-meta__tag">SANCTUARY 01</span>
          </div>

          <div className="hero-hairline" />

          {/* Large Swiss Headline */}
          <h1 className="hero-headline">
            <span className="hero-headline__line">Take Time for Your Body.</span>
            <span className="hero-headline__line hero-headline__line--light">Take Time for Your Well-being.</span>
          </h1>

          {/* Approved Supporting Copy */}
          <p className="hero-body">
            Wellness experiences designed around relaxation, recovery support, body comfort, and overall well-being.
          </p>

          {/* Action CTAs */}
          <div className="hero-actions">
            <a href="#about" className="hero-btn-primary">
              <span>BOOK AN APPOINTMENT</span>
              <span className="hero-btn-arrow" aria-hidden="true">→</span>
            </a>
            <a href="#about" className="hero-btn-secondary">
              <span>EXPLORE SERVICES</span>
            </a>
          </div>

          {/* Editorial Wellness Values */}
          <div className="hero-values-strip">
            <div className="hero-value-item">
              <span className="hero-value-num">01</span>
              <span className="hero-value-text">RELAXATION</span>
            </div>
            <span className="hero-value-divider" />
            <div className="hero-value-item">
              <span className="hero-value-num">02</span>
              <span className="hero-value-text">RECOVERY SUPPORT</span>
            </div>
            <span className="hero-value-divider" />
            <div className="hero-value-item">
              <span className="hero-value-num">03</span>
              <span className="hero-value-text">BODY COMFORT</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar: System Spec & Fixed Scroll Indicator */}
        <div className="hero-bottom-bar">
          <div className="hero-bottom-bar__meta">
            <span className="hero-bottom-bar__system-id">[SYSTEM 01]</span>
            <span className="hero-bottom-bar__desc">iROBO 360° KINEMATIC ROTATION</span>
          </div>

          <div className="hero-bottom-bar__indicator">
            <span className="hero-bottom-bar__scroll-text">SCROLL TO ROTATE</span>
            <div className="hero-bottom-bar__hairline" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroContent;
