import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EASING, isReducedMotion } from '../../animations/scrollAnimations';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * ServiceAudience Component
 * Section C: Who May Choose This Service?
 * Preserves the cautious, respectful wellness language from official documentation
 * 
 * Choreographed GSAP entrance reveals.
 */
export function ServiceAudience({ service }) {
  const sectionRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    if (isReducedMotion()) return;

    const ctx = gsap.context(() => {
      const header = sectionRef.current.querySelector('.service-section-header');
      const primary = sectionRef.current.querySelector('.service-audience__primary');
      const sidebar = sectionRef.current.querySelector('.service-audience__sidebar');

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

      const contentItems = [primary, sidebar].filter(Boolean);
      if (contentItems.length) {
        gsap.from(contentItems, {
          opacity: 0,
          y: 25,
          stagger: 0.12,
          duration: 0.8,
          ease: EASING.editorial,
          scrollTrigger: {
            trigger: sectionRef.current.querySelector('.service-audience__grid'),
            start: 'top 82%',
            once: true
          }
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [service]);

  if (!service) return null;

  return (
    <section ref={sectionRef} className="service-audience" aria-labelledby="audience-heading">
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
