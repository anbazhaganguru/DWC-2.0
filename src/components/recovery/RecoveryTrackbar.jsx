import React from 'react';

/**
 * RecoveryTrackbar Component
 * Matches Figma Node 1:191 (Linear Progress Trackbar Underneath - Swiss Precision Detail)
 * 2px horizontal track spanning content width, 1/6 width active indicator thumb,
 * and technical exploration label.
 * Controlled via direct thumbRef for 60fps/120fps hardware-accelerated updates.
 */
export function RecoveryTrackbar({ thumbRef }) {
  return (
    <div
      className="recovery-trackbar"
      role="progressbar"
      aria-label="Therapy gallery scroll progress"
      aria-valuemin="0"
      aria-valuemax="100"
    >
      {/* 2px Track Rail */}
      <div className="recovery-trackbar__rail">
        <div
          ref={thumbRef}
          className="recovery-trackbar__thumb"
          style={{ transform: 'translateX(0%)' }}
        />
      </div>

      {/* Swiss Exploration Label */}
      <div className="recovery-trackbar__meta">
        <span className="recovery-trackbar__label">HORIZONTAL EXPLORATION</span>
      </div>
    </div>
  );
}

export default React.memo(RecoveryTrackbar);
