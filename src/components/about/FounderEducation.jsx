import React from 'react';

/**
 * FounderEducation Component (DWC 2.0)
 * Section 02: Academic Background
 *
 * Swiss International Style Editorial Architecture:
 * - Clear editorial header: EDUCATION & ACADEMIC FOUNDATION
 * - Degree 01: B.Sc. Psychology — PSG College of Arts and Science (Graduated)
 * - Degree 02: M.Sc. Clinical Psychology — Dr. M.G.R. University (Currently Studying — crystal clear active enrollment)
 * - Clean editorial proportions, readable typography, and balanced layout
 */
export function FounderEducation() {
  return (
    <div className="founder-education-zone" data-about-anim="fade-up">
      {/* Editorial Section Top Header */}
      <div className="founder-education__header">
        <div className="education-header__left">
          <span className="education-header__tag-line" aria-hidden="true" />
          <div className="education-header__titles">
            <span className="education-header__eyebrow">02 // ACADEMIC BACKGROUND</span>
            <h3 className="education-header__title">EDUCATION</h3>
          </div>
        </div>
        <span className="education-header__right">FACULTY OF PSYCHOLOGY &amp; BEHAVIORAL SCIENCE</span>
      </div>

      {/* Degree Cards Grid */}
      <div className="founder-education__grid">
        {/* Degree 1: B.Sc. Psychology */}
        <div className="education-card education-card--undergraduate">
          <div className="education-card__top">
            <span className="education-card__index">DEGREE 01</span>
            <span className="education-card__status-tag">GRADUATE</span>
          </div>

          <div className="education-card__main">
            <h4 className="education-card__degree">B.Sc. Psychology</h4>
            <p className="education-card__institution">PSG College of Arts and Science</p>
            <p className="education-card__desc">
              Foundational undergraduate studies in human psychology, behavioral dynamics, cognitive processes, and psychometrics.
            </p>
          </div>

          <div className="education-card__footer">
            <span>UNDERGRADUATE STUDIES // PSYCHOLOGICAL SCIENCE</span>
          </div>
        </div>

        {/* Degree 2: M.Sc. Clinical Psychology (Currently Studying) */}
        <div className="education-card education-card--postgraduate">
          <div className="education-card__top">
            <span className="education-card__index">DEGREE 02</span>
            <span className="education-card__status-tag education-card__status-tag--active">
              CURRENTLY STUDYING
            </span>
          </div>

          <div className="education-card__main">
            <h4 className="education-card__degree">M.Sc. Clinical Psychology</h4>
            <p className="education-card__institution">Dr. M.G.R. University</p>
            <p className="education-card__desc">
              Postgraduate specialization currently in progress, focused on clinical evaluation, assessment methodologies, and psychological research.
            </p>
          </div>

          <div className="education-card__footer">
            <span>POSTGRADUATE PROGRAM // CURRENT ACTIVE ENROLLMENT</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FounderEducation;
