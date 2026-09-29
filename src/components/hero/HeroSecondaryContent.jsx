import React from 'react';

/**
 * HeroSecondaryContent Component.
 * Placed in a safe lower area of the Swiss grid.
 * 
 * EXACT SOURCE CONTENT:
 * Our goal is to provide a comfortable environment where clients can take time away from everyday stress and focus on feeling refreshed, relaxed, and supported.
 * 
 * Secondary hierarchy that never competes with the chair or main headline.
 */
export function HeroSecondaryContent() {
  return (
    <div className="hero-secondary-content">
      <div className="hero-secondary-content__accent" aria-hidden="true" />
      <p className="hero-secondary-content__text">
        Our goal is to provide a comfortable environment where clients can take time away from everyday stress and focus on feeling refreshed, relaxed, and supported.
      </p>
    </div>
  );
}

export default HeroSecondaryContent;
