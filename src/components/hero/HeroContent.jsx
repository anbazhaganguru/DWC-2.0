import React from 'react';

/**
 * HeroContent Component.
 * Static Swiss minimalist luxury text overlay positioned over the turntable canvas.
 */
export function HeroContent() {
  return (
    <div className="hero-content">
      <header className="hero-content__header">
        <span className="hero-content__badge">SWISS THERAPEUTIC ENGINEERING</span>
        <h1 className="hero-content__title">
          iROBO <span>360° RECOVERY</span>
        </h1>
      </header>

      <footer className="hero-content__footer">
        <div className="hero-content__spec">
          <p className="hero-content__spec-label">PRECISION MASSAGE TURNTABLE</p>
          <p className="hero-content__spec-value">16-Frame 360° Kinematic Turntable</p>
        </div>

        <div className="hero-content__scroll-indicator">
          <span className="hero-content__scroll-text">SCROLL TO ROTATE</span>
          <div className="hero-content__scroll-line" />
        </div>
      </footer>
    </div>
  );
}

export default HeroContent;
