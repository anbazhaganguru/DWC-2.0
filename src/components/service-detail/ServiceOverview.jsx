import React from 'react';

/**
 * ServiceOverview Component
 * Editorial Introduction and "What Is This Therapy?" section
 * Uses authentic PDF content with alternating image/text rhythm
 */
export function ServiceOverview({ service }) {
  if (!service) return null;

  return (
    <section className="service-overview" aria-labelledby="overview-heading">
      <div className="service-overview__container">
        {/* Section Header */}
        <div className="service-section-header">
          <div className="service-section-header__tag-row">
            <span className="service-section-header__tag">OVERVIEW // SECTION 01</span>
            <span className="service-section-header__system">DWC PROTOCOL MATRIX</span>
          </div>
          <h2 id="overview-heading" className="service-section-header__title">
            WHAT IS THIS THERAPY?
          </h2>
        </div>

        {/* 2-Column Editorial Grid: Left Lead & Paragraph, Right Secondary Specimen Image */}
        <div className="service-overview__grid">
          <div className="service-overview__content">
            <h3 className="service-overview__subhead">
              A Disciplined Approach to Restorative Physical Comfort
            </h3>
            <p className="service-overview__lead">
              {service.introduction}
            </p>
            <div className="service-overview__divider" aria-hidden="true" />
            <p className="service-overview__body">
              {service.whatIsThis}
            </p>

            <div className="service-overview__quote-panel">
              <span className="service-overview__quote-accent" aria-hidden="true" />
              <p className="service-overview__quote-text">
                “Every session is approached with patience and personal consideration, providing dedicated time away from everyday physical and mental strain.”
              </p>
            </div>
          </div>

          <div className="service-overview__media-col">
            <div className="service-overview__image-card">
              <div className="service-overview__image-header">
                <span>SPECIMEN // {service.num} SECONDARY</span>
                <span>[ CLINICAL ARCHIVE ]</span>
              </div>
              <img
                src={service.secondaryImage || service.heroImage}
                alt={`${service.title} session preparation`}
                className="service-overview__image"
                loading="lazy"
              />
              <div className="service-overview__image-caption">
                <span className="service-overview__caption-dot" aria-hidden="true" />
                <span>Sanctuary Environment &middot; Ambattur, Chennai</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ServiceOverview;
