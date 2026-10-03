import React, { useState } from 'react';

/**
 * ServiceFAQ Component
 * Section: Frequently Asked Questions
 * Minimal Swiss accordion using authentic PDF questions and answers
 */
export function ServiceFAQ({ service }) {
  if (!service || !service.faqs?.length) return null;

  // Track currently active accordion item (first open by default)
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFAQ = (index) => {
    setOpenIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="service-faq" aria-labelledby="faq-heading">
      <div className="service-faq__container">
        {/* Section Header */}
        <div className="service-section-header">
          <div className="service-section-header__tag-row">
            <span className="service-section-header__tag">CLARITY // SECTION 06</span>
            <span className="service-section-header__system">FREQUENT INQUIRIES</span>
          </div>
          <h2 id="faq-heading" className="service-section-header__title">
            FREQUENTLY ASKED QUESTIONS
          </h2>
        </div>

        {/* Accordion List */}
        <div className="service-faq__accordion" role="region" aria-label="Questions and answers">
          {service.faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            const contentId = `faq-content-${index}`;
            const headerId = `faq-header-${index}`;

            return (
              <div
                key={index}
                className={`service-faq__item ${isOpen ? 'service-faq__item--open' : ''}`}
              >
                <button
                  type="button"
                  id={headerId}
                  className="service-faq__trigger"
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={isOpen}
                  aria-controls={contentId}
                >
                  <span className="service-faq__num">0{index + 1}</span>
                  <span className="service-faq__question">{faq.q}</span>
                  <span className="service-faq__icon" aria-hidden="true">
                    {isOpen ? '—' : '+'}
                  </span>
                </button>

                <div
                  id={contentId}
                  role="region"
                  aria-labelledby={headerId}
                  className={`service-faq__answer-panel ${isOpen ? 'service-faq__answer-panel--open' : ''}`}
                >
                  <p className="service-faq__answer">{faq.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default ServiceFAQ;
