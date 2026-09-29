import React from 'react';

/**
 * HeroScrollIndicator Component.
 * Minimal Swiss bottom scroll indicator with "SCROLL TO ROTATE" and directional hairline.
 * Purely a visual cue; chair rotation is powered by GSAP ScrollTrigger.
 */
export function HeroScrollIndicator() {
  return (
    <div className="hero-scroll-indicator" aria-hidden="true">
      <span className="hero-scroll-indicator__text">SCROLL TO ROTATE</span>
      <div className="hero-scroll-indicator__hairline" />
    </div>
  );
}

export default HeroScrollIndicator;
