import React from 'react';

/**
 * HeroLeftContent Component.
 * Left Content Zone in the Swiss 12-column grid.
 * 
 * MAIN HEADLINE:
 * OUR (black)
 * WELLNESS (restrained red)
 * SERVICES (black)
 * Bold, prominent, and impactful Swiss typography.
 * 
 * SUPPORTING CONTENT:
 * "Relaxation, recovery support, body comfort, and overall well-being."
 * Placed inside a solid black rectangular content panel with crisp white text.
 */
export function HeroLeftContent() {
  return (
    <div className="hero-left-content">
      {/* Main Dominant Swiss Headline: Black + Red + Black */}
      <h1 className="hero-left-content__title">
        <span className="hero-left-content__title-line hero-left-content__title-line--black">OUR</span>
        <span className="hero-left-content__title-line hero-left-content__title-line--red">WELLNESS</span>
        <span className="hero-left-content__title-line hero-left-content__title-line--black">SERVICES</span>
      </h1>

      {/* Supporting Content inside Solid Black Rectangular Panel */}
      <div className="hero-left-content__panel">
        <p className="hero-left-content__panel-text">
          Relaxation, recovery support, body comfort, and overall well-being.
        </p>
      </div>
    </div>
  );
}

export default HeroLeftContent;
