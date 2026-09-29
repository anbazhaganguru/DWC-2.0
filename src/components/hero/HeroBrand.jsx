import React from 'react';

/**
 * HeroBrand Component.
 * Swiss International Style brand element positioned at the top left of the 12-column grid.
 * Uses small uppercase IBM Plex Sans with light/regular weight and a thin horizontal rule
 * extending across the grid.
 */
export function HeroBrand() {
  return (
    <div className="hero-brand">
      <a href="#hero" className="hero-brand__link" aria-label="Daniel Wellness Center Home">
        <span className="hero-brand__text">DANIEL WELLNESS CENTER</span>
      </a>
      <div className="hero-brand__rule" aria-hidden="true" />
    </div>
  );
}

export default HeroBrand;
