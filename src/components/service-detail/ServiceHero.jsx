import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EASING, isReducedMotion } from '../../animations/scrollAnimations';
import { ServiceIcon } from './ServiceIcons';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * ServiceHero Component
 * Minimal Swiss Editorial Hero for Service Detail Pages
 * Displays category, dominant title, authoritative tagline, large hero image,
 * metadata table, and minimal monochrome line badge.
 * 
 * Animations:
 * - Staggered entrance for header, title, and metadata
 * - Subtle vertical parallax for the main service image (desktop)
 * - Pure preservation of layout, dimensions, and assets
 */
export function ServiceHero({ service, onOpenBooking }) {
  const heroRef = useRef(null);

  useEffect(() => {
    if (!heroRef.current) return;
    if (isReducedMotion()) return;

    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth <= 768;
      const backRow = heroRef.current.querySelector('.service-hero__back-row');
      const categoryRow = heroRef.current.querySelector('.service-hero__category-row');
      const title = heroRef.current.querySelector('.service-hero__title');
      const tagline = heroRef.current.querySelector('.service-hero__tagline');
      const badgeCard = heroRef.current.querySelector('.service-hero__badge-card');
      const imgWrap = heroRef.current.querySelector('.service-hero__image-wrap');
      const img = heroRef.current.querySelector('.service-hero__image');
      const metaItems = heroRef.current.querySelectorAll('.service-hero__meta-item');
      const bookBtn = heroRef.current.querySelector('.service-hero__book-btn');

      // 1. Header Row Entrance
      const tl = gsap.timeline({ delay: 0.1 });

      if (backRow) tl.from(backRow, { opacity: 0, y: 12, duration: 0.6, ease: EASING.editorial });
      if (categoryRow) tl.from(categoryRow, { opacity: 0, y: 12, duration: 0.5, ease: EASING.editorial }, '-=0.4');
      if (title) tl.from(title, { opacity: 0, y: 28, duration: 0.75, ease: EASING.editorial }, '-=0.4');
      if (tagline) tl.from(tagline, { opacity: 0, y: 18, duration: 0.65, ease: EASING.editorial }, '-=0.5');
      if (badgeCard) tl.from(badgeCard, { opacity: 0, y: 18, duration: 0.65, ease: EASING.editorial }, '-=0.5');
      if (imgWrap) tl.from(imgWrap, { opacity: 0, y: 24, duration: 0.8, ease: EASING.editorial }, '-=0.4');
      if (metaItems.length) tl.from(metaItems, { opacity: 0, y: 14, stagger: 0.06, duration: 0.6, ease: EASING.editorial }, '-=0.5');
      if (bookBtn) tl.from(bookBtn, { opacity: 0, y: 14, duration: 0.5, ease: EASING.editorial }, '-=0.3');

      // 2. Subtle Vertical Parallax on Main Service Image (Desktop)
      if (img && imgWrap && !isMobile) {
        gsap.fromTo(
          img,
          { yPercent: -5 },
          {
            yPercent: 5,
            ease: 'none',
            scrollTrigger: {
              trigger: imgWrap,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.2
            }
          }
        );
      }
    }, heroRef);

    return () => ctx.revert();
  }, [service]);

  if (!service) return null;

  return (
    <section ref={heroRef} className="service-hero" aria-label={`${service.title} Overview`}>
      <div className="service-hero__container">
        {/* Back Link to Therapy Grid */}
        <div className="service-hero__back-row">
          <a href="/#therapy" className="service-hero__back-link" aria-label="Return to all therapies">
            <span className="service-hero__back-arrow" aria-hidden="true">←</span>
            <span>ALL THERAPY SERVICES</span>
          </a>
          <span className="service-hero__specimen-tag" aria-hidden="true">
            DWC CLINICAL MODALITY // {service.num}
          </span>
        </div>

        {/* Top Header Block: Category, Title, Tagline, Badge */}
        <div className="service-hero__header">
          <div className="service-hero__title-col">
            <div className="service-hero__category-row">
              <span className="service-hero__category-accent" aria-hidden="true" />
              <span className="service-hero__category">{service.category}</span>
            </div>

            <h1 className="service-hero__title">
              {service.title}
            </h1>

            <p className="service-hero__tagline">
              “{service.tagline}”
            </p>
          </div>

          {/* Minimal Monochrome Swiss Badge / Icon (Requirement 8) */}
          <div className="service-hero__badge-card" aria-label="Service Emblem">
            <div className="service-hero__badge-icon-wrap">
              <ServiceIcon type={service.iconType} size={32} />
            </div>
            <div className="service-hero__badge-info">
              <span className="service-hero__badge-id">SPECIMEN // {service.num}</span>
              <span className="service-hero__badge-text">{service.badgeText}</span>
            </div>
          </div>
        </div>

        {/* Large Service Hero Image (Requirement 6 & 7) */}
        <div className="service-hero__image-wrap">
          <img
            src={service.heroImage}
            alt={service.title}
            className="service-hero__image"
            loading="eager"
            onError={(e) => {
              if (service.secondaryImage) {
                e.currentTarget.onerror = null;
                e.currentTarget.src = service.secondaryImage;
              }
            }}
          />
          <div className="service-hero__image-tag" aria-hidden="true">
            {service.imageTag}
          </div>
        </div>

        {/* Editorial Metadata Strip (Requirement 7) */}
        <div className="service-hero__meta-grid">
          {service.meta.map((item, idx) => (
            <div key={idx} className="service-hero__meta-item">
              <span className="service-hero__meta-label">{item.label}</span>
              <span className="service-hero__meta-value">{item.value}</span>
            </div>
          ))}
          <div className="service-hero__meta-action">
            <button
              type="button"
              className="service-hero__book-btn"
              onClick={() => onOpenBooking?.({ serviceType: service.slug === 'irobo-massage-chair' ? 'irobo' : 'therapy', initialService: service.title })}
            >
              BOOK SESSION →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ServiceHero;
