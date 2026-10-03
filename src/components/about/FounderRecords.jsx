import React from 'react';

/**
 * FounderRecords Component
 * Section 9: Official World Records in Basketball Spider Dribbles
 * Strict adherence to source of truth:
 * 1. Asia Book of Records holder:
 *    - 210 blindfolded basketball spider dribbles in 59.98 seconds
 * 2. Indian Book of World Records:
 *    - 385 basketball spider dribbles in one minute (01 minute)
 * Swiss International Style large numerical data layout.
 */
export function FounderRecords() {
  return (
    <div className="founder-records-zone" data-about-anim="records-reveal">
      {/* Editorial Section Top Header */}
      <div className="founder-records__header">
        <div className="records-header__left">
          <span className="records-header__tag-line" aria-hidden="true" />
          <h3 className="records-header__title">RECORDS</h3>
        </div>
        <span className="records-header__right">OFFICIAL WORLD RECORD BENCHMARKS</span>
      </div>

      {/* 2-Column Asymmetric Swiss Data Grid */}
      <div className="founder-records__grid">
        {/* Record 1: Asia Book of Records */}
        <div className="record-column">
          <div>
            <div className="record-column__book-tag">
              <span className="record-column__book-tag-dot" aria-hidden="true" />
              <span>ASIA BOOK OF RECORDS</span>
            </div>

            <div className="record-column__num-hero" aria-label="210 dribbles">
              210
            </div>

            <h4 className="record-column__discipline-title">
              BLINDFOLDED BASKETBALL<br />
              SPIDER DRIBBLES
            </h4>
          </div>

          <div>
            <div className="record-column__time-block">
              <div className="record-column__time-num">59.98</div>
              <div className="record-column__time-unit">SECONDS</div>
            </div>

            <div className="record-column__verification">
              <span>RECORD HOLDER // OFFICIAL CITATION</span>
              <span className="record-column__badge">VERIFIED</span>
            </div>
          </div>
        </div>

        {/* Record 2: Indian Book of World Records */}
        <div className="record-column">
          <div>
            <div className="record-column__book-tag">
              <span className="record-column__book-tag-dot" aria-hidden="true" />
              <span>INDIAN BOOK OF WORLD RECORDS</span>
            </div>

            <div className="record-column__num-hero" aria-label="385 dribbles">
              385
            </div>

            <h4 className="record-column__discipline-title">
              BASKETBALL<br />
              SPIDER DRIBBLES
            </h4>
          </div>

          <div>
            <div className="record-column__time-block">
              <div className="record-column__time-num">01</div>
              <div className="record-column__time-unit">MINUTE</div>
            </div>

            <div className="record-column__verification">
              <span>RECORD CITATION // OFFICIAL BENCHMARK</span>
              <span className="record-column__badge">VERIFIED</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FounderRecords;
