import React from 'react';
import { ServiceIcon } from './ServiceIcons';

/**
 * ServiceHero Component
 * Minimal Swiss Editorial Hero for Service Detail Pages
 * Displays category, dominant title, authoritative tagline, large hero image,
 * metadata table, and minimal monochrome line badge.
 */
export function ServiceHero({ service, onOpenBooking }) {
  if (!service) return null;

  return (
    <section className="service-hero" aria-label={`${service.title} Overview`}>
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
