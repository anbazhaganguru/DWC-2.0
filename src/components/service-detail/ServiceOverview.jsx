import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EASING, isReducedMotion } from '../../animations/scrollAnimations';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * ServiceOverview Component
 * Editorial Introduction and "What Is This Therapy?" section
 * Uses authentic PDF content with alternating image/text rhythm
 * 
 * Choreographed GSAP entrance reveals.
 */
export function ServiceOverview({ service }) {
  const sectionRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    if (isReducedMotion()) return;

    const ctx = gsap.context(() => {
      const header = sectionRef.current.querySelector('.service-section-header');
      const content = sectionRef.current.querySelector('.service-overview__content');
      const media = sectionRef.current.querySelector('.service-overview__media-col');

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

      if (content) {
        const subhead = content.querySelector('.service-overview__subhead');
        const lead = content.querySelector('.service-overview__lead');
        const body = content.querySelector('.service-overview__body');
        const quote = content.querySelector('.service-overview__quote-panel');

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: content,
            start: 'top 82%',
            once: true
          }
        });

        if (subhead) tl.from(subhead, { opacity: 0, y: 25, duration: 0.75, ease: EASING.editorial });
        if (lead) tl.from(lead, { opacity: 0, y: 20, duration: 0.7, ease: EASING.editorial }, '-=0.4');
        if (body) tl.from(body, { opacity: 0, y: 20, duration: 0.7, ease: EASING.editorial }, '-=0.5');
        if (quote) tl.from(quote, { opacity: 0, y: 20, duration: 0.7, ease: EASING.editorial }, '-=0.4');
      }

      if (media) {
        gsap.from(media, {
          opacity: 0,
          y: 25,
          duration: 0.8,
          ease: EASING.editorial,
          scrollTrigger: {
            trigger: media,
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
    <section ref={sectionRef} className="service-overview" aria-labelledby="overview-heading">
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
