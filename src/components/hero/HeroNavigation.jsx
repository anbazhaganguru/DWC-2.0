import React from 'react';

/**
 * HeroNavigation Component.
 * Minimal Swiss navigation aligned to the top grid on the right half.
 * Navigation items: ABOUT, THERAPY, RECOVERY.
 * Action: EXPERIENCE iROBO (a disciplined outlined rectangular button; strictly no pill shapes).
 */
export function HeroNavigation() {
  return (
    <nav className="hero-navigation" aria-label="Main Navigation">
      <ul className="hero-navigation__links">
        <li><a href="#about" className="hero-navigation__link">ABOUT</a></li>
        <li><a href="#therapy" className="hero-navigation__link">THERAPY</a></li>
        <li><a href="#recovery" className="hero-navigation__link">RECOVERY</a></li>
      </ul>
      <a href="#experience" className="hero-navigation__cta">
        EXPERIENCE iROBO
      </a>
    </nav>
  );
}

export default HeroNavigation;
