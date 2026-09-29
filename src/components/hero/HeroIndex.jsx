import React from 'react';

/**
 * HeroIndex Component.
 * Minimal Swiss vertical side indicator (01 / 03) aligned to the right grid margin.
 * Subtle, restrained, and non-carousel.
 */
export function HeroIndex() {
  return (
    <aside className="hero-index" aria-label="Series Index">
      <div className="hero-index__line hero-index__line--top" aria-hidden="true" />
      <div className="hero-index__content">
        <span className="hero-index__tag">SERIES</span>
        <span className="hero-index__numbers">
          <strong className="hero-index__current">01</strong>
          <span className="hero-index__slash" aria-hidden="true">/</span>
          <span className="hero-index__total">03</span>
        </span>
      </div>
      <div className="hero-index__line hero-index__line--bottom" aria-hidden="true" />
    </aside>
  );
}

export default HeroIndex;
