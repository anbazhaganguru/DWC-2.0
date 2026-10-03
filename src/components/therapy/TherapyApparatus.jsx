import React from 'react';

/**
 * TherapyApparatus Component
 * APPARATUS 01 - Flagship iROBO Massage Chair Feature Card
 */
export function TherapyApparatus() {
  return (
    <div className="therapy-apparatus-section">
      {/* Upper Status Line */}
      <div className="therapy-apparatus__top-bar">
        <div className="therapy-apparatus__badge-row">
          <span className="therapy-apparatus__badge">APPARATUS 01</span>
          <span className="therapy-apparatus__subtitle">FLAGSHIP RECOVERY TECHNOLOGY</span>
        </div>
        <div className="therapy-apparatus__sys-id">
          DWC HIGH FIDELITY ERGONOMICS // SYSTEM 01
        </div>
      </div>

      {/* Main Grid */}
      <div className="therapy-apparatus__grid">
        {/* Left Column: Spec & CTA */}
        <div className="therapy-apparatus__info">
          <div>
            <div className="therapy-apparatus__tag">— FLAGSHIP ROBOTIC MODALITY</div>
            <h3 className="therapy-apparatus__title">
              <span className="therapy-apparatus__title-line">IROBO</span>
              <span className="therapy-apparatus__title-line">MASSAGE</span>
              <span className="therapy-apparatus__title-line therapy-apparatus__title-line--grey">CHAIR</span>
            </h3>

            <div className="therapy-apparatus__specs-table">
              <div className="therapy-apparatus__spec-row">
                <span className="therapy-apparatus__spec-key">DESIGNATION</span>
                <span className="therapy-apparatus__spec-value">Robotic Massage Suite</span>
              </div>
              <div className="therapy-apparatus__spec-row">
                <span className="therapy-apparatus__spec-key">ERGONOMICS</span>
                <span className="therapy-apparatus__spec-value">Full-Body Sculpted Recline</span>
              </div>
              <div className="therapy-apparatus__spec-row">
                <span className="therapy-apparatus__spec-key">INTEGRATION</span>
                <span className="therapy-apparatus__spec-value">Integrated Armrest Control Console</span>
              </div>
            </div>
          </div>

          <div className="therapy-apparatus__action-row">
            <a href="/services/irobo-massage-chair" className="therapy-apparatus__btn" aria-label="View dedicated iROBO massage chair detail page">
              VIEW DETAILS <span>→</span>
            </a>
            <span className="therapy-apparatus__ref">
              SUITE SPECIMEN • REF: 01
            </span>
          </div>
        </div>

        {/* Right Column: Media Display Box */}
        <div className="therapy-apparatus__media-box">
          <div className="therapy-apparatus__media-header">
            <span>FIG. 01 — IROBO CHAIR PERSPECTIVE</span>
            <span>[ 1376 x 768 STUDIO RAW ]</span>
          </div>

          <div className="therapy-apparatus__img-container">
            <img
              src="/images/therapy/irobo_chair_studio_original.png"
              alt="iROBO Massage Chair Perspective"
              className="therapy-apparatus__img"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = '/images/cinematic/hero/interpolated/desktop/frame_001.png';
              }}
            />
          </div>

          <div className="therapy-apparatus__media-footer">
            <div className="therapy-apparatus__mini-spec">
              <span className="therapy-apparatus__mini-key">UPHOLSTERY</span>
              <span className="therapy-apparatus__mini-val">Charcoal / Black</span>
            </div>
            <div className="therapy-apparatus__mini-spec">
              <span className="therapy-apparatus__mini-key">SURFACE TRIM</span>
              <span className="therapy-apparatus__mini-val">Metallic Bronze</span>
            </div>
            <div className="therapy-apparatus__mini-spec">
              <span className="therapy-apparatus__mini-key">TARGET</span>
              <span className="therapy-apparatus__mini-val">Somatic Relief</span>
            </div>
            <div className="therapy-apparatus__mini-spec">
              <span className="therapy-apparatus__mini-key">GEOMETRY</span>
              <span className="therapy-apparatus__mini-val therapy-apparatus__mini-val--red">Zero-G Align</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TherapyApparatus;
