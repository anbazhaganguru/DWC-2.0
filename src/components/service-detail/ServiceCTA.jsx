import React from 'react';

/**
 * ServiceCTA Component
 * Section: Ready to Begin?
 * Pre-footer booking and concierge WhatsApp triggers
 */
export function ServiceCTA({ service, onOpenBooking }) {
  if (!service) return null;

  const handleBookingClick = () => {
    if (onOpenBooking) {
      onOpenBooking({
        serviceType: service.slug === 'irobo-massage-chair' ? 'irobo' : 'therapy',
        initialService: service.title
      });
    }
  };

  return (
    <section className="service-cta" aria-labelledby="cta-heading">
      <div className="service-cta__container">
        <div className="service-cta__inner">
          <div className="service-cta__tag-row">
            <span className="service-cta__tag">RESERVATION &amp; CONCIERGE</span>
            <span className="service-cta__accent" aria-hidden="true" />
          </div>

          <h2 id="cta-heading" className="service-cta__title">
            READY TO BEGIN?
          </h2>

          <p className="service-cta__subtitle">
            Take time for your body. Take time for your well-being.
          </p>

          <p className="service-cta__desc">
            Whether you are looking for relaxation, recovery support, body comfort, or a dedicated wellness experience, Daniel Wellness Center offers personalized services designed around your needs.
          </p>

          <div className="service-cta__action-row">
            <button
              type="button"
              className="service-cta__btn-primary"
              onClick={handleBookingClick}
            >
              BOOK AN APPOINTMENT <span aria-hidden="true">→</span>
            </button>

            <a
              href="https://wa.me/917358313291"
              target="_blank"
              rel="noopener noreferrer"
              className="service-cta__btn-secondary"
            >
              WHATSAPP CONCIERGE <span aria-hidden="true">↗</span>
            </a>
          </div>

          <div className="service-cta__footnote">
            <span>5th Avenue, Banu Nagar, Ambattur, Chennai &middot; Direct Concierge: +91 7358313291</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ServiceCTA;
