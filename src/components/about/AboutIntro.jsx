import React from 'react';

/**
 * AboutIntro Component
 * Section 4: Editorial Heading & Core Design Statement
 * Strict adherence to source of truth: no clinical or therapeutic claims.
 */
export function AboutIntro() {
  return (
    <div className="about-intro-zone" data-about-anim="fade-up">
      {/* Editorial Micro-Header */}
      <div className="about-intro__header">
        <div className="about-intro__tag-group">
          <span className="about-intro__tag-line" aria-hidden="true" />
          <span className="about-intro__tag">ABOUT / FOUNDER</span>
        </div>
        <span className="about-intro__num">02</span>
      </div>

      {/* Large Swiss Headline */}
      <div className="about-intro__main-col">
        <h2 className="about-intro__title">
          Built at the intersection<br />
          of psychology, sport<br />
          and wellness.
        </h2>
      </div>

      {/* Contextual Directional Introduction */}
      <div className="about-intro__side-col">
        <span className="about-intro__side-label">THE FOUNDATION // PHILOSOPHY</span>
        <p className="about-intro__desc">
          Daniel Wellness Center is being built around a multidisciplinary approach shaped by psychology, sport, movement and wellness.
        </p>
      </div>
    </div>
  );
}

export default AboutIntro;
