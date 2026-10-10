import React from 'react';

/**
 * TherapyHeader Component
 * Main Section Header: OUR WELLNESS SERVICES + Statement of Care Philosophy
 */
export function TherapyHeader() {
  return (
    <div className="therapy-header-zone">
      {/* Left Column: Bold Swiss Headline */}
      <div className="therapy-header__left">
        <span className="therapy-header__tag">+ CLINICAL FORM &amp; RECOVERY</span>
        <h2 className="therapy-header__title">
          <span className="therapy-header__title-line therapy-header__title-line--black">OUR</span>
          <span className="therapy-header__title-line therapy-header__title-line--black">WELLNESS</span>
          <span className="therapy-header__title-line therapy-header__title-line--red">SERVICES</span>
        </h2>
        <span className="therapy-header__subtag">
          EST. WELLNESS MATRIX &nbsp;—&nbsp; ALL PROTOCOLS STANDARDIZED
        </span>
      </div>

      {/* Right Column: Statement of Care & Philosophy */}
      <div className="therapy-header__right">
        <div>
          <div className="therapy-header__right-tag">STATEMENT OF CARE / PHILOSOPHY</div>
          <p className="therapy-header__quote">
            “At Daniel Wellness Center, our services are designed around relaxation, recovery support, body comfort, and overall well-being. Every individual has different needs, which is why we encourage a personalized approach when choosing a wellness experience.”
          </p>
        </div>

        <div className="therapy-header__right-footer">
          <div className="therapy-header__modalities-tag">
            <span className="therapy-header__dot" aria-hidden="true" />
            <span>CLINICAL MODALITIES</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TherapyHeader;
