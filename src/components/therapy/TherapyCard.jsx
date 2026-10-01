import React from 'react';

/**
 * TherapyCard Component
 * Individual Modality Card in the Swiss Editorial Asymmetric Grid
 */
export function TherapyCard({ 
  id, 
  badge, 
  title, 
  subtitle, 
  image, 
  imageTag, 
  isDark = false,
  size = 'standard' // 'large' | 'small' | 'standard'
}) {
  return (
    <article className={`therapy-card therapy-card--${size} therapy-card--${id} ${isDark ? 'therapy-card--dark' : ''}`}>
      {/* Header Row: Modality Number Tag, Category Badge, Watermark */}
      <div className="therapy-card__header">
        <div className="therapy-card__tag-row">
          <span className="therapy-card__number-tag">MODALITY // {id}</span>
          <span className="therapy-card__badge">{badge}</span>
        </div>
        <span className="therapy-card__watermark" aria-hidden="true">{id}</span>
      </div>

      {/* Title & Subtitle / Quote */}
      <div className="therapy-card__body">
        <h4 className="therapy-card__title">{title}</h4>
        <p className="therapy-card__quote">{subtitle}</p>
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
        <span className="therapy-card__action-text">VIEW MODALITY</span>
        <button 
          className="therapy-card__arrow-btn" 
          aria-label={`View details for ${title}`}
          type="button"
        >
          ↗
        </button>
      </div>
    </article>
  );
}

export default TherapyCard;

