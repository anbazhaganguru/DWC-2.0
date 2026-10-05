import React from 'react';

/**
 * AboutVision Component
 * Sections 12, 13 & 14: Vision, Ambattur Center Direction & Editorial Visual Bridge into Therapy
 * Strict adherence to source of truth:
 * - "TWO DISCIPLINES. ONE DIRECTION."
 * - "Psychology, sport and wellness form the foundation of the direction behind Daniel Wellness Center."
 * - "Building Daniel Wellness Center in Ambattur."
 * - "A wellness space being developed around psychology, sport and wellness-related services."
 * - "A different approach to wellness, built from experience across mind, movement and recovery."
 * - No medical claims, no clinical therapy claims from psychology degree.
 * - Visual bridge into Therapy with directional cue (no giant CTA).
 */
export function AboutVision() {
  return (
    <div className="about-vision-zone">
      {/* Section 12: Psychology + Sport + Wellness Connection */}
      <div className="vision-disciplines-row" data-about-anim="fade-up">
        <div className="vision-disciplines__left">
          <div className="vision-disciplines__tag">
            <span className="vision-disciplines__tag-bar" aria-hidden="true" />
            <span>INTERSECTION</span>
          </div>

          <h3 className="vision-disciplines__title">
            TWO DISCIPLINES.<br />
            ONE DIRECTION.
          </h3>

          <p className="vision-disciplines__desc">
            Psychology, sport and wellness form the foundation of the direction behind Daniel Wellness Center.
          </p>
        </div>

        {/* 3 Pillars Across Grid */}
        <div className="vision-disciplines__pillars-col">
          <div className="vision-pillar-box">
            <span className="vision-pillar-box__index">PILLAR 01</span>
            <h4 className="vision-pillar-box__label">PSYCHOLOGY</h4>
          </div>

          <div className="vision-pillar-box">
            <span className="vision-pillar-box__index">PILLAR 02</span>
            <h4 className="vision-pillar-box__label">SPORT</h4>
          </div>

          <div className="vision-pillar-box">
            <span className="vision-pillar-box__index">PILLAR 03</span>
            <h4 className="vision-pillar-box__label">WELLNESS</h4>
          </div>
        </div>
      </div>

      {/* Section 13: Daniel Wellness Center Vision in Ambattur */}
      <div className="vision-center-row" data-about-anim="fade-up">
        <div className="vision-center__side-label">
          <div>
            <div className="vision-center__label-tag">THE MISSION</div>
            <h3 className="vision-center__label-title">THE CENTER</h3>
          </div>
          <span className="founder-education__side-meta">FACILITY SPECIFICATION</span>
        </div>

        <div className="vision-center__content-col">
          <div className="vision-center__location-pill">
            <span>LOCATION: AMBATTUR // CHENNAI</span>
          </div>

          <h3 className="vision-center__heading">
            Building Daniel Wellness Center<br />
            in Ambattur.
          </h3>

          <p className="vision-center__desc">
            A wellness space being developed around psychology, sport and wellness-related services.
          </p>
        </div>
      </div>

      {/* Section 14: Visual Ending Statement & Bridge into Therapy */}
      <div className="about-bridge-row" data-about-anim="fade-up">
        <div className="about-bridge__quote-col">
          <span className="about-bridge__tag">PERSPECTIVE</span>
          <p className="about-bridge__statement">
            A different approach to wellness,<br />
            built from experience across<br />
            mind, movement and recovery.
          </p>
        </div>

        <div className="about-bridge__nav-col">
          <a href="/#therapy" className="about-bridge__arrow-link" aria-label="Explore Clinical Modalities">
            <span className="about-bridge__arrow-label">EXPLORE MODALITIES</span>
            <div className="about-bridge__arrow-icon" aria-hidden="true">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M8 2v12M2 8l6 6 6-6" strokeLinecap="square" />
              </svg>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}

export default AboutVision;
