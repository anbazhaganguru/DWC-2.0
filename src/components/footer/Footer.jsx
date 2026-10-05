import React from 'react';
import '../../styles/footer.css';

/**
 * Footer Component (Daniel Wellness Center 2.0)
 * Disciplined 4-column Swiss International Style layout with verified legacy brand content,
 * navigation anchors, contact coordinates, and unified booking modal trigger.
 */
export function Footer({ onOpenBooking }) {
  const currentYear = new Date().getFullYear();

  const handleBookingClick = (e) => {
    e.preventDefault();
    if (onOpenBooking) {
      onOpenBooking();
    } else {
      // Fallback if no handler passed: scroll to #cta
      const ctaEl = document.getElementById('cta');
      if (ctaEl) {
        ctaEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer id="footer" className="dwc-footer" aria-label="Website Footer">
      {/* Atmosphere Background Layer */}
      <div className="dwc-footer-bg-wrap" aria-hidden="true">
        <picture>
          <source media="(max-width: 768px)" srcSet="/images/footer/footer_wellness_background_mobile.webp" />
          <img
            src="/images/footer/footer_wellness_background.webp"
            alt=""
            className="dwc-footer-bg-img"
            loading="lazy"
          />
        </picture>
        <div className="dwc-footer-bg-scrim" />
      </div>

      <div className="dwc-footer-container">
        {/* Main 4-Column Swiss Editorial Grid */}
        <div className="dwc-footer-grid">
          {/* Column 1: Brand & Philosophy */}
          <div className="dwc-footer-col dwc-footer-col--brand">
            <a href="#hero" className="dwc-footer-brand-link dwc-brand-lockup dwc-brand-lockup--footer" aria-label="Daniel Wellness Center - Home">
              <span className="dwc-brand-lockup__accent" aria-hidden="true" />
              <div className="dwc-brand-lockup__text">
                <span className="dwc-brand-lockup__primary dwc-footer-brand-title">DANIEL</span>
                <span className="dwc-brand-lockup__supporting dwc-footer-brand-subtitle">WELLNESS CENTER</span>
              </div>
            </a>

            <p className="dwc-footer-brand-desc">
              Holistic wellness experiences designed around relaxation, recovery support, body comfort, and personalized care.
            </p>

            <div className="dwc-footer-brand-pill">
              <span className="dwc-footer-brand-pill-accent" aria-hidden="true" />
              <span className="dwc-footer-brand-pill-text">SANCTUARY OF WELL-BEING</span>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="dwc-footer-col dwc-footer-col--nav">
            <h4 className="dwc-footer-col-title">NAVIGATION</h4>
            <nav className="dwc-footer-nav-list" aria-label="Footer Navigation">
              <a href="#hero" className="dwc-footer-nav-link">HOME</a>
              <a href="#about" className="dwc-footer-nav-link">ABOUT</a>
              <a href="#therapy" className="dwc-footer-nav-link">THERAPY</a>
              <a href="#recovery" className="dwc-footer-nav-link">RECOVERY FOR</a>
              <a href="#cta" className="dwc-footer-nav-link dwc-footer-nav-link--highlight">CONTACT</a>
              <button
                type="button"
                onClick={handleBookingClick}
                className="dwc-footer-nav-link dwc-footer-nav-link--btn dwc-footer-nav-link--highlight"
              >
                BOOK AN APPOINTMENT
              </button>
            </nav>
          </div>

          {/* Column 3: Location & Contact */}
          <div className="dwc-footer-col dwc-footer-col--contact">
            <h4 className="dwc-footer-col-title">LOCATION &amp; CONTACT</h4>
            
            <div className="dwc-footer-contact-item">
              <svg className="dwc-footer-contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <div className="dwc-footer-contact-text">
                <strong className="dwc-footer-contact-strong">Daniel Wellness Center</strong><br />
                5th Avenue, Banu Nagar,<br />
                Ambattur, Chennai
              </div>
            </div>

            <div className="dwc-footer-contact-item">
              <svg className="dwc-footer-contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <a href="tel:7358313291" className="dwc-footer-contact-link">
                7358313291
              </a>
            </div>

            <div className="dwc-footer-contact-item">
              <svg className="dwc-footer-contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              <a href="mailto:aswinkumar8949@gmail.com" className="dwc-footer-contact-link">
                aswinkumar8949@gmail.com
              </a>
            </div>
          </div>

          {/* Column 4: Direct Action & Instagram */}
          <div className="dwc-footer-col dwc-footer-col--action">
            <h4 className="dwc-footer-col-title">CONNECT</h4>
            
            <a
              href="https://instagram.com/aswin_reflexologist"
              target="_blank"
              rel="noopener noreferrer"
              className="dwc-footer-social-link"
              aria-label="Follow Aswin Reflexologist on Instagram"
            >
              <svg className="dwc-footer-social-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
              <span>@aswin_reflexologist</span>
            </a>

            <button
              type="button"
              onClick={handleBookingClick}
              className="dwc-footer-btn-appointment"
              aria-label="Book an Appointment at Daniel Wellness Center"
            >
              BOOK AN APPOINTMENT
            </button>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Subtle Brand Signoff */}
        <div className="dwc-footer-bottom">
          <p className="dwc-footer-copyright">
            &copy; {currentYear} Daniel Wellness Center. All rights reserved.
          </p>
          <p className="dwc-footer-signoff">
            A Sanctuary for Natural Healing &amp; Restoration
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
