import React from 'react';

/**
 * ServiceWhyChooseUs Component
 * Section E: Why Choose Daniel Wellness Center?
 * Minimal Swiss editorial list highlighting the authentic practice standards
 */
export function ServiceWhyChooseUs({ service }) {
  if (!service || !service.whyChooseUs?.length) return null;

  return (
    <section className="service-why-us" aria-labelledby="why-heading">
      <div className="service-why-us__container">
        {/* Section Header */}
        <div className="service-section-header">
          <div className="service-section-header__tag-row">
            <span className="service-section-header__tag">DWC STANDARD // SECTION 05</span>
            <span className="service-section-header__system">DANIEL WELLNESS IDENTITY</span>
          </div>
          <h2 id="why-heading" className="service-section-header__title">
            WHY CHOOSE DANIEL WELLNESS CENTER?
          </h2>
        </div>

        {/* Minimal Numbered List */}
        <div className="service-why-us__grid">
          {service.whyChooseUs.map((point, index) => {
            const formatted = String(index + 1).padStart(2, '0');
            return (
              <div key={index} className="service-why-us__item">
                <span className="service-why-us__num">{formatted}</span>
                <p className="service-why-us__text">{point}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default ServiceWhyChooseUs;
