import React from 'react';

/**
 * Global Brand Logo / Lockup Component for Daniel Wellness Center (DWC 2.0)
 * 
 * Strict Swiss International Style Typographic Architecture:
 * - Line 1: DANIEL (Primary wordmark, strong hierarchy, controlled letter spacing)
 * - Line 2: WELLNESS CENTER (Refined supporting line, restrained weight, wide tracking aligned with DANIEL)
 * - Accent: Precision hairline vertical accent (DWC signature red)
 * 
 * Reused consistently across:
 * - Homepage Hero & Fixed Navbar
 * - Founder Page Navbar
 * - Therapy / Service Detail Navbar
 * - Global Footers
 */
export function BrandLogo({
  to = '#hero',
  onClick,
  variant = 'nav',
  isLight = false,
  className = '',
  ariaLabel = 'Daniel Wellness Center - Home'
}) {
  return (
    <a
      href={to}
      onClick={onClick}
      className={`dwc-brand-lockup dwc-brand-lockup--${variant} ${isLight ? 'dwc-brand-lockup--light' : ''} ${className}`}
      aria-label={ariaLabel}
    >
      <span className="dwc-brand-lockup__accent" aria-hidden="true" />
      <div className="dwc-brand-lockup__text">
        <span className="dwc-brand-lockup__primary">DANIEL</span>
        <span className="dwc-brand-lockup__supporting">WELLNESS CENTER</span>
      </div>
    </a>
  );
}

export default BrandLogo;
