import React from 'react';

/**
 * HeroEditorial Component.
 * Swiss International Style editorial layout occupying the negative space on the left.
 * Follows an asymmetric poster hierarchy: Category, Large Light Headlines,
 * Supporting Statement, Supporting Paragraph, and Disciplined Geometric Accents.
 */
export function HeroEditorial() {
  return (
    <div className="hero-editorial">
      {/* Oversized low-emphasis background typography reinforcing grid depth without obscuring chair */}
      <div className="hero-editorial__bg-type" aria-hidden="true">
        DWC
      </div>

      {/* Category Eyebrow with Restrained Swiss Red Accent Block */}
      <div className="hero-editorial__category">
        <span className="hero-editorial__accent-block" aria-hidden="true" />
        <span className="hero-editorial__category-label">SWISS THERAPEUTIC ENGINEERING</span>
        <span className="hero-editorial__category-sep" aria-hidden="true">/</span>
        <span className="hero-editorial__category-tag">SANCTUARY 01</span>
      </div>

      {/* Thin 1px Horizontal Rule */}
      <div className="hero-editorial__rule" aria-hidden="true" />

      {/* Asymmetric Swiss Headlines */}
      <h1 className="hero-editorial__headline">
        <span className="hero-editorial__headline-primary">Take Time for Your Body.</span>
        <span className="hero-editorial__headline-secondary">Take Time for Your Well-being.</span>
      </h1>

      {/* Small Supporting Statement */}
      <p className="hero-editorial__statement">
        PHYSICAL RECOVERY ENGINEERED WITH UNCOMPROMISING SWISS PRECISION
      </p>

      {/* Approved Supporting Paragraph */}
      <p className="hero-editorial__paragraph">
        Wellness experiences designed around relaxation, recovery support, body comfort, and overall well-being.
      </p>

      {/* Swiss Metadata & Alignment Details */}
      <div className="hero-editorial__meta-strip">
        <div className="hero-editorial__meta-item">
          <span className="hero-editorial__meta-label">SYS.01</span>
          <span className="hero-editorial__meta-val">KINEMATIC 360°</span>
        </div>
        <span className="hero-editorial__meta-divider" aria-hidden="true" />
        <div className="hero-editorial__meta-item">
          <span className="hero-editorial__meta-label">SPEC</span>
          <span className="hero-editorial__meta-val">16-FRAME SEQUENCE</span>
        </div>
        <span className="hero-editorial__meta-divider" aria-hidden="true" />
        <div className="hero-editorial__meta-item">
          <span className="hero-editorial__meta-label">EDITION</span>
          <span className="hero-editorial__meta-val">DWC 2.0</span>
        </div>
      </div>
    </div>
  );
}

export default HeroEditorial;
