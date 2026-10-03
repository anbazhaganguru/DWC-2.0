import React from 'react';

/**
 * ServiceAudience Component
 * Section C: Who May Choose This Service?
 * Preserves the cautious, respectful wellness language from official documentation
 */
export function ServiceAudience({ service }) {
  if (!service) return null;

  return (
    <section className="service-audience" aria-labelledby="audience-heading">
      <div className="service-audience__container">
        {/* Section Header */}
        <div className="service-section-header">
          <div className="service-section-header__tag-row">
            <span className="service-section-header__tag">SUITABILITY // SECTION 03</span>
            <span className="service-section-header__system">INDIVIDUAL CONSIDERATION</span>
          </div>
          <h2 id="audience-heading" className="service-section-header__title">
            WHO MAY CHOOSE THIS SERVICE?
          </h2>
        </div>

        {/* Editorial Text Block */}
        <div className="service-audience__grid">
          <div className="service-audience__primary">
            <p className="service-audience__copy">
              {service.whoIsItFor}
            </p>
          </div>

          <div className="service-audience__sidebar">
            <div className="service-audience__note-card">
              <span className="service-audience__note-badge">PRACTICE NOTE</span>
              <p className="service-audience__note-text">
                Every individual has distinct physiological tolerance and personal comfort levels. Our practitioners discuss personal goals and health considerations prior to beginning any service.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ServiceAudience;
