import React from 'react';

/**
 * HeroHeader Component.
 * Clean Swiss-style header aligned to the 12-column grid.
 * 
 * LEFT:
 * DANIEL WELLNESS CENTER
 * Distinctive Swiss typographic lockup with restrained red geometric accent.
 * 
 * CENTER:
 * ABOUT
 * THERAPY
 * RECOVERY
 * 
 * RIGHT:
 * BOOK APPOINTMENT
 * Outlined rectangular button linking to #cta.
 */
export function HeroHeader() {
  return (
    <header className="hero-header" aria-label="Hero Header">
      {/* Left: Distinctive Swiss Brand Lockup */}
      <a href="#hero" className="hero-header__brand" aria-label="Daniel Wellness Center">
        <span className="hero-header__brand-accent" aria-hidden="true" />
        <div className="hero-header__brand-text">
          <span className="hero-header__brand-primary">DANIEL</span>
          <span className="hero-header__brand-sub">WELLNESS</span>
          <span className="hero-header__brand-sub">CENTER</span>
        </div>
      </a>

      {/* Center: Navigation Links */}
      <nav className="hero-header__nav" aria-label="Main Navigation">
        <ul className="hero-header__nav-list">
          <li><a href="#about" className="hero-header__link">ABOUT</a></li>
          <li><a href="#therapy" className="hero-header__link">THERAPY</a></li>
          <li><a href="#recovery" className="hero-header__link">RECOVERY</a></li>
        </ul>
      </nav>

      {/* Right: BOOK APPOINTMENT Button */}
      <div className="hero-header__actions">
        <a href="#cta" className="hero-header__cta">
          BOOK APPOINTMENT
        </a>
      </div>
    </header>
  );
}

export default HeroHeader;
