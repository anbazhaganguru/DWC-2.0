import React from 'react';

/**
 * RecoveryHeader Component
 * Matches Figma Node 1:7 (Swiss International Style Editorial Header)
 * Left: Meta tracking line + "Recovery Therapies" 60px headline
 * Right: Clinical statement of care copy + Live numeric counter (01 / 06)
 * (Manual arrow buttons removed in favor of seamless infinite auto-scroll)
 */
export function RecoveryHeader({
  currentIndex = 1,
  totalCount = 6
}) {
  const currentFormatted = String(currentIndex).padStart(2, '0');
  const totalFormatted = String(totalCount).padStart(2, '0');

  return (
    <header className="recovery-header">
      {/* Left Column: Asymmetric Brand Intro */}
      <div className="recovery-header__left">
        <div className="recovery-header__meta">
          <span className="recovery-header__meta-pip" aria-hidden="true" />
          <span className="recovery-header__meta-text">
            DANIEL WELLNESS CENTER — MODALITIES
          </span>
        </div>
        <h2 className="recovery-header__title">Recovery Therapies</h2>
      </div>

      {/* Right Column: Statement of Care + Minimal Live Counter */}
      <div className="recovery-header__right">
        <p className="recovery-header__copy">
          Targeted clinical and physiological therapies designed to assist
          muscular release, support circulation, and facilitate natural
          somatic restoration.
        </p>

        <div className="recovery-header__nav-row">
          <div
            className="recovery-header__counter"
            aria-live="polite"
            aria-atomic="true"
            aria-label={`Current therapy ${currentFormatted} of ${totalFormatted}`}
          >
            <span className="recovery-header__counter-current">
              {currentFormatted}
            </span>
            <span className="recovery-header__counter-slash" aria-hidden="true">
              /
            </span>
            <span className="recovery-header__counter-total">
              {totalFormatted}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default React.memo(RecoveryHeader);
