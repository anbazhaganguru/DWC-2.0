import React from 'react';

/**
 * RecoveryCard Component
 * Faithfully matches Figma Node 1:34 (390px x 577px container, 24px padding,
 * dedicated photography display with glassmorphic badge, title, clinical description,
 * and observed benefits checklist).
 */
export function RecoveryCard({
  numeral,
  category,
  badge,
  title,
  description,
  image,
  imageAlt,
  benefits
}) {
  return (
    <article
      className="recovery-card"
      aria-label={`${numeral} ${title}`}
      role="group"
      aria-roledescription="slide"
    >
      <div className="recovery-card__media">
        <img
          src={image}
          alt={imageAlt}
          className="recovery-card__img"
          loading="lazy"
          draggable="false"
        />
        <div className="recovery-card__badge" aria-label={`Category ${category}`}>
          {badge}
        </div>
      </div>

      <div className="recovery-card__body">
        <h3 className="recovery-card__title">{title}</h3>
        <p className="recovery-card__desc">{description}</p>
      </div>

      <div className="recovery-card__benefits">
        <div className="recovery-card__benefits-header">OBSERVED BENEFITS</div>
        <ul className="recovery-card__benefits-list">
          {benefits.map((benefit, idx) => (
            <li key={idx} className="recovery-card__benefit-item">
              <span className="recovery-card__benefit-dash" aria-hidden="true">
                —
              </span>
              <span className="recovery-card__benefit-text">{benefit}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export default React.memo(RecoveryCard);
