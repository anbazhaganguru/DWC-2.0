import React from 'react';

/**
 * FounderSports Component
 * Sections 8 & 10: Basketball Background & Netball Medal Achievement
 * Strict adherence to source of truth:
 * - Basketball: Player / Coach, State-Level Representation, coaching experience
 * - Netball: Tamil Nadu netball representative, Senior National South Zone silver medal
 * - No invented teams, years, venues or competitions
 */
export function FounderSports() {
  return (
    <div className="founder-sports-zone" data-about-anim="fade-up">
      {/* Side Label Column */}
      <div className="founder-sports__side-label">
        <div className="sports-label-group">
          <span className="sports-label-group__tag">ATHLETIC RECORD</span>
          <h3 className="sports-label-group__title">SPORT</h3>
        </div>
        <span className="founder-sports__side-meta">STATE &amp; NATIONAL LEVEL</span>
      </div>

      {/* Sports Columns Grid */}
      <div className="founder-sports__content-col">
        {/* Basketball Section (Section 8) */}
        <div className="sports-basketball-card">
          <div>
            <div className="sports-card__header">
              <span className="sports-card__discipline">PRIMARY SPORT</span>
              <span className="sports-card__index">ATHLETICS 01</span>
            </div>

            <h4 className="sports-basketball__title">Basketball</h4>

            <div className="sports-basketball__tags">
              <span className="sports-tag">Player / Coach</span>
              <span className="sports-tag">State-Level Representation</span>
            </div>

            <p className="sports-basketball__desc">
              A basketball player and coach with state-level representation and coaching experience.
            </p>
          </div>

          <div className="education-card__footer">
            <span>COMPETITIVE MOVEMENT &amp; ATHLETIC CONDITIONING</span>
          </div>
        </div>

        {/* Netball Section (Section 10) */}
        <div className="sports-netball-card">
          <div>
            <div className="sports-card__header">
              <span className="sports-card__discipline">SECONDARY SPORT</span>
              <span className="sports-card__index">ATHLETICS 02</span>
            </div>

            <h4 className="sports-netball__title">Netball</h4>

            {/* Medal Achievement Typographic Callout */}
            <div className="sports-netball__medal-block">
              <div className="sports-netball__medal-label">MEDAL ACHIEVEMENT</div>
              <h5 className="sports-netball__medal-title">Senior National South Zone Silver Medal</h5>
              <p className="sports-netball__rep-text">Tamil Nadu Netball Representative</p>
            </div>
          </div>

          <div className="education-card__footer">
            <span>STATE REPRESENTATION // SILVER MEDALIST</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FounderSports;
