import React from 'react';

/**
 * FounderRecords Component (DWC 2.0)
 * Section 04: Official World Records & Recognition
 *
 * Swiss International Style Editorial Architecture:
 * - Strong visual hierarchy for Primary Record (385 Dribbles / 1 Min — Indian Book of World Records)
 * - Clear Companion Record (210 Blindfolded Dribbles / 59.98s — Asia Book of Records)
 * - Large Court Evidence Photograph (Trophies, Medals, Certificate & Jerseys in natural ~1:1 uncropped frame)
 * - Large 16:9 Video 02 Card (World Record Spider Dribbles Attempt Film)
 * - Prominent Award Presentation Photograph (Citation ceremony uncropped frame)
 * - Large Legible Newspaper Media Clipping Feature (High-resolution, uncropped evidence frame)
 * - Clean Instagram archive link
 */
export function FounderRecords({ onOpenVideo }) {
  const handleOpenRecordFilm = () => {
    if (onOpenVideo) {
      onOpenVideo({
        id: 'video-02',
        title: 'Spider Dribbles World Record Attempt',
        tag: 'VIDEO 02 // RECORD BENCHMARK',
        src: '/videos/founder/founder-achievement-video.mp4',
        poster: '/images/about/sports/founder-records-trophies.png',
        aspectRatio: '16/9',
        isPortrait: false
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
          <div className="records-header__titles">
            <span className="records-header__eyebrow">04 // OFFICIAL WORLD RECORDS</span>
            <h3 className="records-header__title">RECORDS &amp; RECOGNITION</h3>
          </div>
        </div>
      </div>

      {/* Tier 1: World Record Benchmarks + Trophy Evidence Frame */}
      <div className="records-tier-primary">
        {/* Left Column: Official Records Typography */}
        <div className="records-benchmarks-col">
          {/* Primary Record: 385 Dribbles (Indian Book of World Records) */}
          <div className="record-feature-card record-feature-card--hero">
            <div className="record-feature__header">
              <div className="record-book-tag">
                <span className="record-book-tag__dot" aria-hidden="true" />
                <span>INDIAN BOOK OF WORLD RECORDS</span>
              </div>
              <span className="record-feature__index">RECORD 01 // WORLD BENCHMARK</span>
            </div>

            <div className="record-feature__body">
              <div className="record-num-hero-group">
                <div className="record-num-hero" aria-label="385 spider dribbles">
                  385
                </div>
                <div className="record-num-hero__unit">
                  DRIBBLES / MIN
                </div>
              </div>

              <div className="record-feature__content">
                <h4 className="record-feature__title">
                  BASKETBALL SPIDER DRIBBLES
                </h4>
                <div className="record-feature__meta-row">
                  <div className="record-metric">
                    <span className="record-metric__val">01</span>
                    <span className="record-metric__label">MINUTE</span>
                  </div>
                  <div className="record-status-pill">
                    <span className="record-status-pill__dot" aria-hidden="true" />
                    <span>VERIFIED BENCHMARK</span>
                  </div>
                </div>
                <p className="record-feature__desc">
                  385 basketball spider dribbles in one minute — certified official benchmark by the Indian Book of World Records.
                </p>
              </div>
            </div>
          </div>

          {/* Companion Record: 210 Blindfolded Dribbles (Asia Book of Records) */}
          <div className="record-feature-card record-feature-card--companion">
            <div className="record-feature__header">
              <div className="record-book-tag">
                <span className="record-book-tag__dot" aria-hidden="true" />
                <span>ASIA BOOK OF RECORDS</span>
              </div>
              <span className="record-feature__index">RECORD 02 // BLINDFOLDED</span>
            </div>

            <div className="record-feature__body">
              <div className="record-num-hero-group">
                <div className="record-num-companion" aria-label="210 blindfolded spider dribbles">
                  210
                </div>
                <div className="record-num-hero__unit">
                  DRIBBLES / 59.98S
                </div>
              </div>

              <div className="record-feature__content">
                <h4 className="record-feature__title">
                  BLINDFOLDED SPIDER DRIBBLES
                </h4>
                <div className="record-feature__meta-row">
                  <div className="record-metric">
                    <span className="record-metric__val">59.98</span>
                    <span className="record-metric__label">SECONDS</span>
                  </div>
                  <div className="record-status-pill">
                    <span className="record-status-pill__dot" aria-hidden="true" />
                    <span>VERIFIED CITATION</span>
                  </div>
                </div>
                <p className="record-feature__desc">
                  210 blindfolded basketball spider dribbles in 59.98 seconds — official record citation by the Asia Book of Records.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Court Evidence Trophy & Certificate Photo (Large Natural ~1:1 Proportions) */}
        <div className="records-trophy-col">
          <div className="records-evidence-feature">
            <div className="records-evidence-feature__frame">
              <img
                src="/images/about/sports/founder-records-trophies.png"
                alt="Founder seated on basketball court with official record trophies, medals, certificate and jerseys"
                className="records-evidence-feature__img"
                loading="eager"
                onError={(e) =>
                  handleImageFallback(e, '/images/about/sports/photo-a-court-achievement.svg')
                }
              />
              <div className="records-frame-accent-corner" aria-hidden="true" />
            </div>

            <div className="records-evidence-feature__caption">
              <div className="records-caption-left">
                <span className="records-caption-dot" aria-hidden="true" />
                <span className="records-caption-tag">OFFICIAL COURT EVIDENCE</span>
              </div>
              <span className="records-caption-meta">TROPHIES, MEDALS &amp; CERTIFICATES</span>
            </div>
            <p className="records-evidence-feature__subnote">
              Official court evidence documenting national and continental records with trophies, medals, certificate, and jerseys.
            </p>
          </div>
        </div>
      </div>

      {/* Tier 2: Large Video 02 Feature + Award Presentation Feature */}
      <div className="records-tier-secondary">
        {/* Left: Large 16:9 Video 02 Card (Record Attempt Film) */}
        <div
          className="records-video-card-feature"
          onClick={handleOpenRecordFilm}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') handleOpenRecordFilm();
          }}
          aria-label="Play Founder World Record Spider Dribbles Video"
        >
          <div className="records-video-card__frame">
            <div className="records-video-card__overlay">
              <span className="records-video-card__play-badge">
                <span className="records-video-card__play-icon" aria-hidden="true">▶</span>
                <span>PLAY RECORD FILM →</span>
              </span>
            </div>
            <img
              src="/images/about/sports/founder-records-trophies.png"
              alt="World record spider dribbles film preview"
              className="records-video-card__poster"
              loading="lazy"
              onError={(e) =>
                handleImageFallback(e, '/images/about/sports/photo-a-court-achievement.svg')
              }
            />
          </div>

          <div className="records-video-card__info">
            <div className="records-video-card__meta">
              <span className="records-video-card__tag">VIDEO 02</span>
            </div>
            <h5 className="records-video-card__title">Spider Dribbles World Record Attempt</h5>
            <p className="records-video-card__desc">
              Official video documentation of the verified benchmark performance and timing verification.
            </p>
          </div>
        </div>

        {/* Right: Award Presentation Photograph (Large Natural Frame) */}
        <div className="records-award-card-feature">
          <div className="records-award-card__frame">
            <img
              src="/images/about/sports/founder-award-presentation.png"
              alt="Founder receiving official world record award and citation"
              className="records-award-card__img"
              loading="lazy"
              onError={(e) =>
                handleImageFallback(e, '/images/about/sports/photo-c-record-award.svg')
              }
            />
            <div className="records-frame-accent-corner" aria-hidden="true" />
          </div>

          <div className="records-award-card__info">
            <div className="records-award-card__meta">
              <span className="records-award-card__tag">OFFICIAL RECOGNITION</span>
            </div>
            <h5 className="records-award-card__title">Formal Citation &amp; Award Presentation</h5>
            <p className="records-award-card__desc">
              Formal felicitation and trophy presentation ceremony honoring the verified basketball spider dribbles world records.
            </p>
          </div>
        </div>
      </div>

      {/* Tier 3: Legible, Large Newspaper Press Media Evidence Feature */}
      <div className="records-tier-press">
        <div className="records-press-feature">
          <div className="records-press-feature__header">
            <div className="records-press-header__left">
              <span className="records-press-tag">PRESS &amp; MEDIA COVERAGE</span>
              <h4 className="records-press-title">National Daily Press Recognition</h4>
            </div>
            <span className="records-press-meta">PRINT MEDIA ARCHIVE // VERIFIED REPORT</span>
          </div>

          {/* Large Newspaper Clipping Frame preserving natural ~1.38:1 proportions */}
          <div className="records-press-frame">
            <img
              src="/images/about/sports/founder-newspaper-recognition.png"
              alt="Newspaper press coverage documenting founder's official world record"
              className="records-press-frame__img"
              loading="lazy"
              onError={(e) =>
                handleImageFallback(e, '/images/about/sports/photo-d-press-coverage.svg')
              }
            />
          </div>

          <div className="records-press-caption">
            <div className="records-caption-left">
              <span className="records-caption-dot" aria-hidden="true" />
              <span>PRINT PUBLICATION</span>
            </div>
            <span>NATIONAL DAILY REPORT DOCUMENTING TIMING, RULES COMPLIANCE &amp; CERTIFICATION</span>
          </div>
        </div>
      </div>

      {/* Journey Archive Link (Subtle Swiss Instagram Link) */}
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
