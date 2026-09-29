import React from 'react';

/**
 * TherapyTopBar Component
 * Sub-header tracking line for SEC 04 / DWC CLINICAL DISCIPLINES.
 */
export function TherapyTopBar() {
  return (
    <div className="therapy-top-bar" aria-label="Section Metadata">
      <div className="therapy-top-bar__left">
        <span className="therapy-top-bar__accent" aria-hidden="true" />
        <span>SEC 04 / DWC CLINICAL DISCIPLINES</span>
      </div>

      <div className="therapy-top-bar__right">
        <span>SYSTEM: INTERNATIONAL TYPOGRAPHIC</span>
        <span>DANIEL WELLNESS CENTER</span>
        <span>DWC-2.0</span>
        <span className="therapy-top-bar__index">INDEX: 01–06</span>
      </div>
    </div>
  );
}

export default TherapyTopBar;
