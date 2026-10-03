import React from 'react';

/**
 * FounderProfile Component
 * Sections 5 & 6: Founder Profile, Image Placeholder & Editorial Introduction
 * Strict adherence to source of truth:
 * - No invented founder name
 * - No fake persona or stock portrait
 * - Visually intentional Swiss image placeholder
 * - Exact disciplines and concise introduction
 */
export function FounderProfile({ founderImage = null }) {
  return (
    <div className="founder-profile-zone" data-about-anim="fade-up">
      {/* Column 1–5: Founder Image or Intentional Swiss Placeholder */}
      <div className="founder-profile__media-col">
        {founderImage ? (
          <div className="founder-image-wrapper">
            <img
              src={founderImage}
              alt="Daniel Wellness Center Founder"
              className="founder-image"
              loading="lazy"
            />
          </div>
        ) : (
          <div
            className="founder-placeholder"
            role="img"
            aria-label="Daniel Wellness Center Founder Portrait Archive Placeholder"
          >
            {/* Swiss Precision Corner Crosshairs */}
            <span className="founder-placeholder__corner founder-placeholder__corner--tl" aria-hidden="true">+</span>
            <span className="founder-placeholder__corner founder-placeholder__corner--tr" aria-hidden="true">+</span>
            <span className="founder-placeholder__corner founder-placeholder__corner--bl" aria-hidden="true">+</span>
            <span className="founder-placeholder__corner founder-placeholder__corner--br" aria-hidden="true">+</span>

            <div className="founder-placeholder__grid-overlay" aria-hidden="true" />

            <div className="founder-placeholder__header">
              <span className="founder-placeholder__stamp">ARCHIVE // PORTRAIT</span>
              <span className="founder-placeholder__status">
                <span className="founder-placeholder__status-dot" aria-hidden="true" />
                DWC FOUNDER
              </span>
            </div>

            <div className="founder-placeholder__body">
              <div className="founder-placeholder__glyph" aria-hidden="true">
                DWC
              </div>
              <p className="founder-placeholder__caption">FOUNDER PORTRAIT</p>
              <p className="founder-placeholder__subtext">DOCUMENTARY PHOTOGRAPHY ARCHIVE</p>
            </div>

            <div className="founder-placeholder__footer">
              <span>SYSTEM: SWISS EDITORIAL</span>
              <span>CHENNAI // AMBATTUR</span>
            </div>
          </div>
        )}

        <div className="founder-profile__media-caption">
          <span>SEC 02.1 // PORTRAIT</span>
          <span>DANIEL WELLNESS CENTER</span>
        </div>
      </div>

      {/* Column 6–12: Founder Metadata & Introduction */}
      <div className="founder-profile__content-col">
        <div>
          <div className="founder-profile__meta-header">
            <div className="founder-profile__badge">
              <span className="founder-profile__badge-accent" aria-hidden="true" />
              <span>FOUNDER</span>
            </div>
            <span className="founder-profile__index">DISCIPLINES // 03</span>
          </div>

          <h3 className="founder-profile__intro-heading">
            A multidisciplinary foundation across mind, movement and recovery.
          </h3>

          <p className="founder-profile__lead-paragraph">
            With a background spanning psychology, competitive sport, coaching and wellness training, the founder is building Daniel Wellness Center around a broader understanding of well-being.
          </p>
        </div>

        {/* 3 Verified Disciplines */}
        <div className="founder-profile__roles-list">
          <div className="founder-profile__role-item">
            <span className="founder-profile__role-index">01</span>
            <span className="founder-profile__role-title">Psychology Graduate</span>
          </div>

          <div className="founder-profile__role-item">
            <span className="founder-profile__role-index">02</span>
            <span className="founder-profile__role-title">Basketball Player / Coach</span>
          </div>

          <div className="founder-profile__role-item">
            <span className="founder-profile__role-index">03</span>
            <span className="founder-profile__role-title">Wellness Practitioner</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FounderProfile;
