import React from 'react';

/**
 * FounderEducation Component
 * Section 7: Academic Background
 * Strict adherence to source of truth:
 * - B.Sc. Psychology — PSG College of Arts and Science
 * - M.Sc. Clinical Psychology — Currently Studying — Dr. M.G.R. University
 * - Crystal clear that M.Sc. is currently being studied (not completed)
 */
export function FounderEducation() {
  return (
    <div className="founder-education-zone" data-about-anim="fade-up">
      {/* Side Label Column */}
      <div className="founder-education__side-label">
        <div className="education-label-group">
          <span className="education-label-group__tag">ACADEMIC BACKGROUND</span>
          <h3 className="education-label-group__title">EDUCATION</h3>
        </div>
        <span className="founder-education__side-meta">FACULTY OF PSYCHOLOGY</span>
      </div>

      {/* Education Cards Grid */}
      <div className="founder-education__content-col">
        {/* Degree 1: B.Sc. Psychology */}
        <div className="education-card">
          <div className="education-card__top">
            <span className="education-card__index">DEGREE 01</span>
            <span className="education-card__status-tag">GRADUATE</span>
          </div>

          <div>
            <h4 className="education-card__degree">B.Sc. Psychology</h4>
            <p className="education-card__institution">PSG College of Arts and Science</p>
          </div>

          <div className="education-card__footer">
            <span>UNDERGRADUATE STUDIES // PSYCHOLOGICAL SCIENCE</span>
          </div>
        </div>

        {/* Degree 2: M.Sc. Clinical Psychology (Currently Studying) */}
        <div className="education-card">
          <div className="education-card__top">
            <span className="education-card__index">DEGREE 02</span>
            <span className="education-card__status-tag education-card__status-tag--active">
              CURRENTLY STUDYING
            </span>
          </div>

          <div>
            <h4 className="education-card__degree">M.Sc. Clinical Psychology</h4>
            <p className="education-card__institution">Dr. M.G.R. University</p>
          </div>

          <div className="education-card__footer">
            <span>POSTGRADUATE PROGRAM // CURRENT ENROLLMENT</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FounderEducation;
