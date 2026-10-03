import React from 'react';

/**
 * ServiceDetailFooter Component
 * Compact Swiss editorial footer for service detail pages
 */
export function ServiceDetailFooter({ onOpenBooking }) {
  return (
    <footer className="service-footer" aria-label="Daniel Wellness Center Footer">
      <div className="service-footer__container">
        {/* Brand & Mission Column */}
        <div className="service-footer__col service-footer__col--brand">
          <a href="/#hero" className="service-footer__brand" aria-label="Daniel Wellness Center - Home">
            <span className="service-footer__brand-accent" aria-hidden="true" />
            <div className="service-footer__brand-text">
              <span className="service-footer__brand-primary">DANIEL</span>
              <span className="service-footer__brand-sub">WELLNESS CENTER</span>
            </div>
          </a>
          <p className="service-footer__tagline">
            Physical recovery engineered with uncompromising Swiss precision. Sanctuary of restorative physical comfort.
          </p>
          <div className="service-footer__address">
            5th Avenue, Banu Nagar, Ambattur, Chennai &middot; Tamil Nadu, India
          </div>
        </div>

        {/* Quick Links Column */}
        <div className="service-footer__col">
          <span className="service-footer__heading">QUICK NAVIGATION</span>
          <ul className="service-footer__links">
            <li><a href="/#hero">HOME</a></li>
            <li><a href="/#about">ABOUT</a></li>
            <li><a href="/#therapy">THERAPY</a></li>
            <li><a href="/#recovery">RECOVERY</a></li>
            <li><a href="/#cta">CONTACT</a></li>
          </ul>
        </div>

        {/* Contact & Concierge Column */}
        <div className="service-footer__col">
          <span className="service-footer__heading">CONCIERGE &amp; RESERVATIONS</span>
          <div className="service-footer__contact-item">
            <span className="service-footer__sub-label">DIRECT WHATSAPP</span>
            <a
              href="https://wa.me/917358313291"
              target="_blank"
              rel="noopener noreferrer"
              className="service-footer__link"
            >
              +91 7358313291 &middot; WhatsApp Direct ↗
            </a>
          </div>
          <div className="service-footer__contact-item">
            <span className="service-footer__sub-label">EMAIL INQUIRIES</span>
            <a href="mailto:aswinkumar8949@gmail.com" className="service-footer__link">
              aswinkumar8949@gmail.com
            </a>
          </div>
          <div className="service-footer__contact-item">
            <button
              type="button"
              className="service-footer__book-btn"
              onClick={() => onOpenBooking?.()}
            >
              BOOK APPOINTMENT →
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="service-footer__bottom">
        <div className="service-footer__bottom-container">
          <span>&copy; {new Date().getFullYear()} DANIEL WELLNESS CENTER. ALL RIGHTS RESERVED.</span>
          <span>EST. WELLNESS MATRIX &middot; SWISS INTERNATIONAL STYLE</span>
        </div>
      </div>
    </footer>
  );
}

export default ServiceDetailFooter;
