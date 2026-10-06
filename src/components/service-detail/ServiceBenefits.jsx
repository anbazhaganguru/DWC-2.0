import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EASING, isReducedMotion } from '../../animations/scrollAnimations';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * ServiceBenefits Component
 * Section B: Key Wellness Benefits
 * Clean Swiss editorial numbered list (01, 02, 03) preserving exact PDF wording
 * 
 * Choreographed GSAP staggered scroll reveals.
 */
export function ServiceBenefits({ service }) {
  const sectionRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    if (isReducedMotion()) return;

    const ctx = gsap.context(() => {
      const header = sectionRef.current.querySelector('.service-section-header');
      const items = sectionRef.current.querySelectorAll('.service-benefits__item');

      if (header) {
        gsap.from(header, {
          opacity: 0,
          y: 20,
          duration: 0.75,
          ease: EASING.editorial,
          scrollTrigger: {
            trigger: header,
            start: 'top 85%',
            once: true
          }
        });
      }

      if (items.length) {
        gsap.from(items, {
          opacity: 0,
          y: 24,
          stagger: 0.1,
          duration: 0.75,
          ease: EASING.editorial,
          scrollTrigger: {
            trigger: sectionRef.current.querySelector('.service-benefits__list'),
            start: 'top 82%',
            once: true
          }
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [service]);

  if (!service || !service.benefits?.length) return null;

  return (
    <section ref={sectionRef} className="service-benefits" aria-labelledby="benefits-heading">
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
