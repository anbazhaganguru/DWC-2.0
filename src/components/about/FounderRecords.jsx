import React from 'react';

/**
 * FounderRecords Component (DWC 2.0)
 * Section 04.2: Official World Records & Media Recognition
 *
 * Compact Asymmetric Achievement Layout (Swiss Editorial Architecture):
 * - Primary Tier (Asymmetric Grid):
 *   [ Left ~58% ]: Connected Record Typography (Hero 385 Record + Companion 210 Record)
 *   [ Right ~42% ]: Medium-sized Rectangular Trophy & Certificate Frame (Photo A)
 * - Supporting Tier (3 Asymmetric Connected Blocks):
 *   [ Block 1 ]: Award Presentation Recognition Photo (Photo C)
 *   [ Block 2 ]: Newspaper Media Clipping Photo (Photo D)
 *   [ Block 3 ]: Compact Clickable Record Film Thumbnail Card (Video 02 Modal Trigger)
 * - Row 3: Compact Swiss Journey Archive Link
 */
export function FounderRecords({ onOpenVideo }) {
  const handleOpenRecordFilm = () => {
    if (onOpenVideo) {
      onOpenVideo({
        id: 'video-02',
        title: 'Spider Dribbles World Record Attempt',
        tag: 'VIDEO 02 // RECORD BENCHMARK',
        src: '/videos/founder/founder-achievement-video.mp4',
        poster: '/images/about/sports/founder-records-trophies.png'
      });
    }
  };

  const handleImageFallback = (e, fallbackSvg) => {
    const candidates = [
      e.target.getAttribute('src'),
      e.target.getAttribute('src').replace('.png', '.jpg'),
      e.target.getAttribute('src').replace('.jpg', '.png'),
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
    <div className="founder-records-zone" data-about-anim="records-reveal">
      {/* Editorial Section Top Header */}
      <div className="founder-records__header">
        <div className="records-header__left">
          <span className="records-header__tag-line" aria-hidden="true" />
          <h3 className="records-header__title">RECORDS &amp; RECOGNITION</h3>
        </div>
        <span className="records-header__right">OFFICIAL WORLD RECORD BENCHMARKS</span>
      </div>

      {/* Primary Area: Compact Asymmetric Record Architecture */}
      <div className="records-asymmetric-primary">
        {/* Left: Connected Record Typography & Information Archive */}
        <div className="records-primary__data-col">
          {/* Primary Hero Record: 385 Dribbles (Indian Book of World Records) */}
          <div className="record-compact-card record-hero-entry">
            <div className="record-entry__header">
              <div className="record-column__book-tag">
                <span className="record-column__book-tag-dot" aria-hidden="true" />
                <span>INDIAN BOOK OF WORLD RECORDS</span>
              </div>
              <span className="record-entry__badge-index">RECORD 01 // WORLD BENCHMARK</span>
            </div>

            <div className="record-hero-entry__body">
              <div className="record-hero-entry__num-wrapper">
                <div
                  className="record-hero-entry__num record-column__num-hero"
                  aria-label="385 dribbles"
                >
                  385
                </div>
                <div className="record-hero-entry__num-label">
                  DRIBBLES / MIN
                </div>
              </div>

              <div className="record-hero-entry__content">
                <h4 className="record-hero-entry__title">
                  BASKETBALL<br />
                  SPIDER DRIBBLES
                </h4>

                <div className="record-hero-entry__metrics">
                  <div className="record-metric-time">
                    <span className="record-metric-time__val">01</span>
                    <span className="record-metric-time__unit">MINUTE</span>
                  </div>

                  <div className="record-metric-status">
                    <span className="record-metric-status__label">OFFICIAL BENCHMARK</span>
                    <span className="record-column__badge">VERIFIED</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Companion Record: 210 Dribbles Blindfolded (Asia Book of Records) */}
          <div className="record-compact-card record-companion-entry">
            <div className="record-entry__header">
              <div className="record-column__book-tag">
                <span className="record-column__book-tag-dot" aria-hidden="true" />
                <span>ASIA BOOK OF RECORDS</span>
              </div>
              <span className="record-entry__badge-index">RECORD 02 // BLINDFOLDED</span>
            </div>

            <div className="record-companion-entry__body">
              <div className="record-companion-entry__num-wrapper">
                <div
                  className="record-companion-entry__num record-compact-card__num"
                  aria-label="210 dribbles"
                >
                  210
                </div>
                <div className="record-companion-entry__num-label">
                  DRIBBLES / 60S
                </div>
              </div>

              <div className="record-companion-entry__content">
                <h4 className="record-companion-entry__title">
                  BLINDFOLDED BASKETBALL<br />
                  SPIDER DRIBBLES
                </h4>

                <div className="record-hero-entry__metrics">
                  <div className="record-metric-time">
                    <span className="record-metric-time__val">59.98</span>
                    <span className="record-metric-time__unit">SECONDS</span>
                  </div>

                  <div className="record-metric-status">
                    <span className="record-metric-status__label">RECORD CITATION</span>
                    <span className="record-column__badge">VERIFIED</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Trophy & Certificate Medium-Sized Frame */}
        <div className="records-primary__visual-col">
          <div className="records-modular-card records-modular-card--photo records-trophy-feature">
            <div className="records-trophy-feature__frame">
              <img
                src="/images/about/sports/founder-records-trophies.png"
                alt="Founder seated on basketball court with official record trophies, medals, certificate and jerseys"
                className="records-modular-card__img"
                loading="eager"
                onError={(e) =>
                  handleImageFallback(e, '/images/about/sports/photo-a-court-achievement.svg')
                }
              />
              <div className="records-frame-accent-corner" aria-hidden="true" />
            </div>

            <div className="records-trophy-feature__footer">
              <div className="records-modular-card__caption">
                <div className="records-modular-card__caption-left">
                  <span className="records-caption-accent" aria-hidden="true" />
                  <span className="records-modular-card__tag">RECORD EVIDENCE</span>
                </div>
                <span className="records-modular-card__meta">TROPHIES &amp; CITATIONS</span>
              </div>
              <div className="records-trophy-feature__subnote">
                Official court evidence documenting national and continental records
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Supporting Area: Connected Asymmetric Recognition & Media Blocks */}
      <div className="records-asymmetric-supporting">
        {/* Block 1: Award Presentation Photo */}
        <div className="recognition-modular-card records-support-item">
          <div className="recognition-modular-card__frame records-support-frame records-support-frame--award">
            <img
              src="/images/about/sports/founder-award-presentation.png"
              alt="Founder receiving official world record award and citation"
              className="recognition-modular-card__img"
              loading="eager"
              onError={(e) =>
                handleImageFallback(e, '/images/about/sports/photo-c-record-award.svg')
              }
            />
          </div>
          <div className="records-support-item__body">
            <div className="recognition-modular-card__caption">
              <div className="recognition-modular-card__caption-left">
                <span className="records-caption-accent" aria-hidden="true" />
                <span className="recognition-modular-card__tag">RECOGNITION</span>
              </div>
              <span className="recognition-modular-card__meta">CITATION CEREMONY</span>
            </div>
            <h5 className="records-support-item__title">AWARD PRESENTATION</h5>
            <p className="records-support-item__desc">
              Formal citation and trophy presentation honoring world record benchmark.
            </p>
          </div>
        </div>

        {/* Block 2: Newspaper Press Media Coverage Photo */}
        <div className="recognition-modular-card records-support-item">
          <div className="recognition-modular-card__frame records-support-frame records-support-frame--press">
            <img
              src="/images/about/sports/founder-newspaper-recognition.png"
              alt="Newspaper press coverage documenting founder's official world record"
              className="recognition-modular-card__img"
              loading="eager"
              onError={(e) =>
                handleImageFallback(e, '/images/about/sports/photo-d-press-coverage.svg')
              }
            />
          </div>
          <div className="records-support-item__body">
            <div className="recognition-modular-card__caption">
              <div className="recognition-modular-card__caption-left">
                <span className="records-caption-accent" aria-hidden="true" />
                <span className="recognition-modular-card__tag">PRESS / MEDIA</span>
              </div>
              <span className="recognition-modular-card__meta">PRESS ARCHIVE</span>
            </div>
            <h5 className="records-support-item__title">MEDIA EVIDENCE</h5>
            <p className="records-support-item__desc">
              National daily publication documenting the verified spider dribbles achievement.
            </p>
          </div>
        </div>

        {/* Block 3: Video 02 Compact Clickable Record Film Thumbnail Card */}
        <div
          className="records-modular-card records-modular-card--video records-support-item records-support-item--video"
          onClick={handleOpenRecordFilm}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') handleOpenRecordFilm();
          }}
          aria-label="Play Founder World Record Spider Dribbles Video"
        >
          <div className="records-video-card__frame records-support-frame records-support-frame--video">
            <div className="sports-video-card__overlay">
              <span className="sports-video-card__play-badge">
                <span className="sports-video-card__play-icon" aria-hidden="true">▶</span>
                <span>PLAY FILM →</span>
              </span>
            </div>
            <img
              src="/images/about/sports/founder-records-trophies.png"
              alt="World record spider dribbles film preview"
              className="sports-video-card__poster"
              loading="eager"
              onError={(e) =>
                handleImageFallback(e, '/images/about/sports/photo-a-court-achievement.svg')
              }
            />
          </div>

          <div className="records-support-item__body">
            <div className="sports-video-card__caption">
              <div className="sports-video-card__meta-group">
                <span className="sports-video-card__tag">VIDEO 02</span>
                <span className="sports-video-card__title">RECORD FILM</span>
              </div>
              <span className="sports-video-card__action">SPIDER DRIBBLES</span>
            </div>
            <h5 className="records-support-item__title">RECORD ATTEMPT FILM</h5>
            <p className="records-support-item__desc">
              Official video documentation of the benchmark performance.
            </p>
          </div>
        </div>
      </div>

      {/* Row 3: Subtle Swiss Instagram Reference */}
      <div className="founder-instagram-bar">
        <div className="founder-instagram-bar__left">
          <span className="founder-instagram-bar__tag">JOURNEY ARCHIVE</span>
          <span className="founder-instagram-bar__desc">ATHLETIC, RECORD &amp; WELLNESS UPDATES</span>
        </div>

        <a
          href="https://www.instagram.com/aswin.kumar9?stkn=MTU3MG5wd2xuNjR2Mg=="
          target="_blank"
          rel="noopener noreferrer"
          className="founder-instagram-link"
          aria-label="Follow the Founder's journey on Instagram @aswin.kumar9"
        >
          <span className="founder-instagram-link__label">FOLLOW THE JOURNEY</span>
          <span className="founder-instagram-link__handle">@aswin.kumar9</span>
          <span className="founder-instagram-link__action">
            <span aria-hidden="true">↗</span> INSTAGRAM
          </span>
        </a>
      </div>
    </div>
  );
}

export default FounderRecords;
