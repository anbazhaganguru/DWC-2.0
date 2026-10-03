import React from 'react';

/**
 * ServiceBenefits Component
 * Section B: Key Wellness Benefits
 * Clean Swiss editorial numbered list (01, 02, 03) preserving exact PDF wording
 */
export function ServiceBenefits({ service }) {
  if (!service || !service.benefits?.length) return null;

  return (
    <section className="service-benefits" aria-labelledby="benefits-heading">
      <div className="service-benefits__container">
        {/* Section Header */}
        <div className="service-section-header">
          <div className="service-section-header__tag-row">
            <span className="service-section-header__tag">WELLNESS MATRIX // SECTION 02</span>
            <span className="service-section-header__system">VERIFIED OBSERVATIONS</span>
          </div>
          <h2 id="benefits-heading" className="service-section-header__title">
            KEY WELLNESS BENEFITS
          </h2>
        </div>

        {/* Editorial Numbered List (No heavy box cards, whitespace as separator) */}
        <div className="service-benefits__list">
          {service.benefits.map((benefit, index) => {
            const formattedNum = String(index + 1).padStart(2, '0');
            return (
              <div key={index} className="service-benefits__item">
                <div className="service-benefits__num-col">
                  <span className="service-benefits__num">{formattedNum}</span>
                  <span className="service-benefits__line" aria-hidden="true" />
                </div>
                <div className="service-benefits__content">
                  <p className="service-benefits__text">{benefit}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default ServiceBenefits;
