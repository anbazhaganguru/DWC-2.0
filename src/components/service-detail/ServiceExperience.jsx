import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EASING, isReducedMotion } from '../../animations/scrollAnimations';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * ServiceExperience Component
 * Section D: What to Expect During Your Session
 * Editorial timeline visualizing the structured session progression
 * 
 * Choreographed GSAP staggered scroll reveals.
 */
export function ServiceExperience({ service }) {
  const sectionRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    if (isReducedMotion()) return;

    const ctx = gsap.context(() => {
      const header = sectionRef.current.querySelector('.service-section-header');
      const steps = sectionRef.current.querySelectorAll('.service-experience__step');

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

      if (steps.length) {
        gsap.from(steps, {
          opacity: 0,
          y: 24,
          stagger: 0.12,
          duration: 0.75,
          ease: EASING.editorial,
          scrollTrigger: {
            trigger: sectionRef.current.querySelector('.service-experience__timeline'),
            start: 'top 82%',
            once: true
          }
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [service]);

  if (!service || !service.sessionExpectations?.length) return null;

  return (
    <section ref={sectionRef} className="service-experience" aria-labelledby="experience-heading">
      <div className="service-experience__container">
        {/* Section Header */}
        <div className="service-section-header">
          <div className="service-section-header__tag-row">
            <span className="service-section-header__tag">SESSION PROGRESSION // SECTION 04</span>
            <span className="service-section-header__system">CLINICAL DISCIPLINE</span>
          </div>
          <h2 id="experience-heading" className="service-section-header__title">
            WHAT TO EXPECT DURING YOUR SESSION
          </h2>
        </div>

        {/* Timeline Sequence */}
        <div className="service-experience__timeline">
          {service.sessionExpectations.map((stepItem, index) => (
            <div key={index} className="service-experience__step">
              <div className="service-experience__step-header">
                <span className="service-experience__step-num">{stepItem.step}</span>
                <span className="service-experience__step-dash" aria-hidden="true" />
                <h3 className="service-experience__step-title">{stepItem.title}</h3>
              </div>
              <p className="service-experience__step-desc">
                {stepItem.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ServiceExperience;
