import React from 'react';

/**
 * TherapyCard Component
 * Individual Modality Card in the Swiss Editorial Asymmetric Grid
 * Features:
 * - Header with MODALITY // {id} on the left and category badge on the right
 * - Body row with Title & Quote on the left and large Service Number + Accent Underline unit on the right
 * - Controlled hover interactions (accent line extension, number shift, title motion, image zoom, arrow button)
 */
export function TherapyCard({ 
  id, 
  slug,
  badge, 
  title, 
  subtitle, 
  image, 
  imageTag, 
  isDark = false,
  size = 'standard' // 'large' | 'small' | 'standard'
}) {
  const route = `/therapy/${slug}`;

  return (
    <a
      href={route}
      className={`therapy-card therapy-card--${size} therapy-card--${id} ${isDark ? 'therapy-card--dark' : ''}`}
      aria-label={`Explore ${title} dedicated service page`}
    >
      {/* Header Row: Modality Number Tag (Left) & Category Badge (Right) */}
      <div className="therapy-card__header">
        <span className="therapy-card__number-tag">MODALITY // {id}</span>
        <span className="therapy-card__badge">{badge}</span>
      </div>

      {/* Body: Title & Quote (Left) + Service Number Unit with Accent Line (Right) */}
      <div className="therapy-card__body">
        <div className="therapy-card__title-wrap">
          <h4 className="therapy-card__title">{title}</h4>
          <p className="therapy-card__quote">{subtitle}</p>
        </div>
        <div className="therapy-card-number therapy-card__number-unit" aria-hidden="true">
          <span className="therapy-card-number-value therapy-card__watermark">{id}</span>
          <span className="therapy-card-number-line therapy-card__accent-line" />
        </div>
      </div>

      {/* Image Container with Overlay Tag */}
      <div className="therapy-card__img-box">
        <img 
          src={image} 
          alt={title} 
          className="therapy-card__img" 
          loading="lazy" 
          onError={(_e) => {
            console.error(`[TherapyCard] Failed to load image: ${image} for ${title}`);
          }}
        />
        <div className="therapy-card__img-overlay-tag">
          {imageTag}
        </div>
      </div>

      {/* Action Footer */}
      <div className="therapy-card__footer">
        <span className="therapy-card__action-text">EXPLORE THERAPY →</span>
        <span
          className="therapy-card__arrow-btn"
          aria-hidden="true"
        >
          ↗
        </span>
      </div>
    </a>
  );
}

export default TherapyCard;
