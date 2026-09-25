import React from 'react';
import { siteConfig } from '../../config/siteConfig';

/**
 * Swiss Minimalist Luxury Navbar Component.
 */
export function Navbar() {
  return (
    <header className="dwc-navbar">
      <a href="#hero" className="dwc-navbar__logo">
        <span className="dwc-navbar__logo-main">DWC</span>
        <span className="dwc-navbar__logo-sub">DANIEL WELLNESS CENTER</span>
      </a>

      <nav>
        <ul className="dwc-navbar__nav">
          <li><a href="#about" className="dwc-navbar__link">ABOUT</a></li>
          <li><a href="#therapy" className="dwc-navbar__link">THERAPY</a></li>
          <li><a href="#recovery" className="dwc-navbar__link">RECOVERY</a></li>
        </ul>
      </nav>

      <a href="#experience" className="dwc-navbar__cta">
        EXPERIENCE iROBO
      </a>
    </header>
  );
}

export default Navbar;
