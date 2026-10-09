import React from 'react';

/**
 * FounderSports Component (DWC 2.0)
 * Section 04.1: Athletics Background (Basketball & Netball)
 * Compact Swiss International Style Layout:
 * - 12-Column Grid System: 3 columns for side label, 9 columns for sports content.
 * - Row 1 (Basketball):
 *   [ 8 cols ] Basketball Content Card
 *   [ 4 cols ] Photo B: Basketball Athlete Supporting Photo
 * - Row 2 (Netball & Film):
 *   [ 8 cols ] Netball Content Card (Silver Medal Achievement)
 *   [ 4 cols ] Video 01: Compact Athletic Film Card (Play Film →)
 */
export function FounderSports({ onOpenVideo }) {
  const handleOpenFilm = () => {
    if (onOpenVideo) {
      onOpenVideo({
        id: 'video-01',
        title: 'Basketball Movement & Conditioning',
        tag: 'VIDEO 01 // ATHLETIC FILM',
        src: '/videos/founder/founder-sports-video.mp4',
        poster: '/images/about/sports/founder-basketball-trophy.png'
      });
    }
  };

  const handleImageFallback = (e, fallbackSvg) => {
    const candidates = [
      e.target.getAttribute('src'),
      e.target.getAttribute('src').replace('.jpg', '.png'),
      e.target.getAttribute('src').replace('.jpg', '.webp'),
      fallbackSvg
    ];
    const cur = e.target.src;
    const curPath = new URL(cur, window.location.href).pathname;
    const idx = candidates.indexOf(curPath);
    if (idx !== -1 && idx + 1 < candidates.length) {
      e.target.src = candidates[idx + 1];
    }
  };

  return (
    <div className="founder-sports-zone" data-about-anim="fade-up">
      {/* Side Label Column (Cols 1 - 3) */}
      <div className="founder-sports__side-label">
        <div className="sports-label-group">
          <span className="sports-label-group__tag">ATHLETIC RECORD</span>
          <h3 className="sports-label-group__title">SPORT</h3>
        </div>
        <span className="founder-sports__side-meta">STATE &amp; NATIONAL LEVEL</span>
      </div>

      {/* Sports Content Column (Cols 4 - 12) */}
      <div className="founder-sports__content-col">
        {/* ROW 1: Basketball Content (8 cols) + Basketball Photo B (4 cols) */}
        <div className="sports-compact-row sports-compact-row--basketball">
          {/* Basketball Information Card */}
          <div className="sports-compact-card sports-compact-card--basketball">
            <div className="sports-compact-card__body">
              <div className="sports-card__header">
                <span className="sports-card__discipline">PRIMARY SPORT</span>
                <span className="sports-card__index">01</span>
              </div>

              <h4 className="sports-compact-card__title">Basketball</h4>

              <div className="sports-compact-card__tags">
                <span className="sports-tag">Player / Coach</span>
                <span className="sports-tag">State-Level Representation</span>
              </div>

              <p className="sports-compact-card__desc">
                A basketball player and coach with state-level representation and coaching experience.
              </p>
            </div>

            <div className="sports-compact-card__footer">
              <span>COMPETITIVE MOVEMENT &amp; ATHLETIC CONDITIONING</span>
            </div>
          </div>

          {/* Supporting Photo B: Basketball Athlete / Trophy Portrait Card */}
          <div className="sports-media-card sports-media-card--photo">
            <div className="sports-media-card__frame">
              <img
                src="/images/about/sports/founder-basketball-trophy.png"
                alt="Founder with basketball championship trophy"
                className="sports-media-card__img"
                loading="lazy"
                onError={(e) =>
                  handleImageFallback(e, '/images/about/sports/photo-b-basketball-athlete.svg')
                }
              />
            </div>
            <div className="sports-media-card__caption">
              <div className="sports-media-card__caption-left">
                <span className="sports-caption-accent" aria-hidden="true" />
                <span className="sports-media-card__tag">BASKETBALL</span>
              </div>
              <span className="sports-media-card__meta">ATHLETE / CHAMPION</span>
            </div>
          </div>
        </div>

        {/* ROW 2: Netball Content (8 cols) + Compact Video 01 Card (4 cols) */}
        <div className="sports-compact-row sports-compact-row--netball">
          {/* Netball Information Card */}
          <div className="sports-compact-card sports-compact-card--netball">
            <div className="sports-compact-card__body">
              <div className="sports-card__header">
                <span className="sports-card__discipline">SECONDARY SPORT</span>
                <span className="sports-card__index">02</span>
              </div>

              <h4 className="sports-compact-card__title">Netball</h4>

              {/* Medal Achievement Callout */}
              <div className="sports-netball__medal-block">
                <div className="sports-netball__medal-label">MEDAL ACHIEVEMENT</div>
                <h5 className="sports-netball__medal-title">Senior National South Zone Silver Medal</h5>
                <p className="sports-netball__rep-text">Tamil Nadu Netball Representative</p>
              </div>
            </div>

            <div className="sports-compact-card__footer">
              <span>STATE REPRESENTATION // SILVER MEDALIST</span>
            </div>
          </div>

          {/* Video 01: Compact Athletic Film Card */}
          <div
            className="sports-media-card sports-media-card--video"
            onClick={handleOpenFilm}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') handleOpenFilm();
            }}
            aria-label="Play Founder Basketball Movement Video"
          >
            <div className="sports-video-card__frame">
              <div className="sports-video-card__overlay">
                <span className="sports-video-card__play-badge">
                  <span className="sports-video-card__play-icon" aria-hidden="true">▶</span>
                  <span>PLAY FILM →</span>
                </span>
              </div>
              <img
                src="/images/about/sports/founder-basketball-trophy.png"
                alt="Basketball movement film preview"
                className="sports-video-card__poster"
                loading="lazy"
                onError={(e) =>
                  handleImageFallback(e, '/images/about/sports/photo-b-basketball-athlete.svg')
                }
              />
            </div>

            <div className="sports-video-card__caption">
              <div className="sports-video-card__meta-group">
                <span className="sports-video-card__tag">VIDEO 01</span>
                <span className="sports-video-card__title">ATHLETIC FILM</span>
              </div>
              <span className="sports-video-card__action">SPORT / FOUNDER</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FounderSports;
