import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EASING, isReducedMotion } from '../../animations/scrollAnimations';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * ServiceWhyChooseUs Component
 * Section E: Why Choose Daniel Wellness Center?
 * Minimal Swiss editorial list highlighting the authentic practice standards
 * 
 * Choreographed GSAP staggered scroll reveals.
 */
export function ServiceWhyChooseUs({ service }) {
  const sectionRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    if (isReducedMotion()) return;

    const ctx = gsap.context(() => {
      const header = sectionRef.current.querySelector('.service-section-header');
      const items = sectionRef.current.querySelectorAll('.service-why-us__item');

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
            trigger: sectionRef.current.querySelector('.service-why-us__grid'),
            start: 'top 82%',
            once: true
          }
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [service]);

  if (!service || !service.whyChooseUs?.length) return null;

  return (
    <section ref={sectionRef} className="service-why-us" aria-labelledby="why-heading">
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
