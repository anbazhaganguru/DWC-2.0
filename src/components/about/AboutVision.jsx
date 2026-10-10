import React from 'react';

/**
 * AboutVision Component (DWC 2.0)
 * Section 06: Vision & Ambattur Center Facility Direction
 *
 * Strict adherence to source of truth:
 * - "Building Daniel Wellness Center in Ambattur."
 * - "A wellness space being developed around psychology, sport and wellness-related services."
 * - "A different approach to wellness, built from experience across mind, movement and recovery."
 * - No medical claims, no clinical therapy claims from psychology degree.
 * - No duplicate "explore modalities" down-button or repetitive pillar blocks.
 */
export function AboutVision() {
  return (
    <div className="about-vision-zone" data-about-anim="fade-up">
      {/* Editorial Section Top Header */}
      <div className="vision-zone__header">
        <div className="vision-header__left">
          <span className="vision-header__tag-line" aria-hidden="true" />
          <div className="vision-header__titles">
            <span className="vision-header__eyebrow">06 // FACILITY DIRECTION</span>
            <h3 className="vision-header__title">THE CENTER</h3>
          </div>
        </div>
        <span className="vision-header__right">LOCATION // AMBATTUR, CHENNAI</span>
      </div>

      {/* Facility Development & Mission Statement Grid */}
      <div className="vision-center-grid">
        <div className="vision-center__content-col">
          <div className="vision-center__location-pill">
            <span className="vision-location-dot" aria-hidden="true" />
            <span>LOCATION: AMBATTUR // CHENNAI</span>
          </div>

          <h3 className="vision-center__heading">
            Building Daniel Wellness Center in Ambattur.
          </h3>

          <p className="vision-center__desc">
            A wellness space being developed around psychology, sport and wellness-related services. An integrated environment bringing together human movement mechanics, physical conditioning, and restorative recovery modalities under one unified philosophy.
          </p>
        </div>

        {/* Perspective Ending Statement */}
        <div className="vision-center__perspective-col">
          <div className="vision-perspective-box">
            <span className="vision-perspective__tag">PERSPECTIVE</span>
            <blockquote className="vision-perspective__statement">
              “A different approach to wellness, built from experience across mind, movement and recovery.”
            </blockquote>
            <span className="vision-perspective__author">FOUNDER PHILOSOPHY</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutVision;
