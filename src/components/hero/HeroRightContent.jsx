import React from 'react';

/**
 * HeroRightContent Component.
 * Right Content Zone in the Swiss 12-column grid.
 * 
 * HEADING:
 * EVERY INDIVIDUAL
 * HAS DIFFERENT NEEDS
 * 
 * EXACT SOURCE CONTENT:
 * Every individual has different needs, which is why we encourage a personalized approach when choosing a wellness experience.
 */
export function HeroRightContent() {
  return (
    <aside className="hero-right-content" aria-label="Personalized Approach">
      {/* Thin horizontal Swiss rule */}
      <div className="hero-right-content__rule" aria-hidden="true" />

      {/* Editorial Heading */}
      <h2 className="hero-right-content__heading">
        <span className="hero-right-content__heading-line">EVERY INDIVIDUAL</span>
        <span className="hero-right-content__heading-line">HAS DIFFERENT NEEDS</span>
      </h2>

      {/* Exact Source Sentence */}
      <p className="hero-right-content__text">
        Every individual has different needs, which is why we encourage a personalized approach when choosing a wellness experience.
      </p>
    </aside>
  );
}

export default HeroRightContent;
