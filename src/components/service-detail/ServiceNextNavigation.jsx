import React from 'react';
import { getServiceBySlug } from '../../data/servicesData';

/**
 * ServiceNextNavigation Component
 * Editorial navigation to the next therapy in sequence.
 * - Sequence for 6 Therapies: Reflexology → Taping → Ice Bath → Steam Bath → Cupping → Bamboo → Reflexology (Requirement 10)
 * - Separate Product Navigation for iROBO Massage Chair: links to complementary clinical therapy (Requirement 10)
 */
export function ServiceNextNavigation({ currentService }) {
  if (!currentService) return null;

  const isIrobo = currentService.slug === 'irobo-massage-chair';
  const nextService = getServiceBySlug(currentService.nextSlug);
  const prevService = getServiceBySlug(currentService.prevSlug);

  if (!nextService) return null;

  return (
    <section className="service-next-nav" aria-label="Sequential Service Navigation">
      <div className="service-next-nav__container">
        {/* Breadcrumb / Sequence Status */}
        <div className="service-next-nav__top-row">
          {isIrobo ? (
            <a href="/#therapy" className="service-next-nav__prev-link">
              ← RETURN TO ALL WELLNESS SERVICES
            </a>
          ) : (
            prevService && (
              <a href={prevService.route} className="service-next-nav__prev-link">
                ← PREVIOUS: {prevService.title}
              </a>
            )
          )}
          <span className="service-next-nav__seq-indicator">
            {isIrobo
              ? 'RECOVERY APPARATUS // PAIR WITH CLINICAL THERAPIES'
              : `SEQUENCE // ${currentService.num} → ${nextService.num}`}
          </span>
        </div>

        {/* Heroic Next Service Card / Banner */}
        <a href={nextService.route} className="service-next-nav__card">
          <div className="service-next-nav__card-inner">
            <div className="service-next-nav__info">
              <span className="service-next-nav__label">
                {isIrobo
                  ? 'COMPLEMENTARY CLINICAL THERAPY // 01'
                  : `NEXT THERAPY // ${nextService.num}`}
              </span>
              <h2 className="service-next-nav__title">{nextService.title}</h2>
              <p className="service-next-nav__tagline">“{nextService.tagline}”</p>
              
              <div className="service-next-nav__cta-row">
                <span className="service-next-nav__cta-text">
                  {isIrobo ? 'EXPLORE CLINICAL THERAPIES' : 'VIEW NEXT THERAPY'}
                </span>
                <span className="service-next-nav__cta-arrow" aria-hidden="true">→</span>
              </div>
            </div>

            <div className="service-next-nav__thumbnail-box">
              <img
                src={nextService.heroImage}
                alt={nextService.title}
                className="service-next-nav__thumbnail"
                loading="lazy"
              />
            </div>
          </div>
        </a>
      </div>
    </section>
  );
}

export default ServiceNextNavigation;
