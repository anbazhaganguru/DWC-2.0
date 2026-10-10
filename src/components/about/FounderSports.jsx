import React from 'react';

/**
 * FounderSports Component (DWC 2.0)
 * Section 03: Athletics Background (Basketball & Netball)
 *
 * Swiss International Style Editorial Architecture:
 * - Clear editorial header: SPORT & ATHLETICS
 * - Grouped facts: Basketball (Player/Coach, State-level) & Netball (South Zone Silver Medalist)
 * - Prominent sports photograph: founder with championship trophy at useful size, uncropped
 * - Prominent Video 01 card: Basketball Movement & Conditioning with clear play trigger
 * - Strictly sports content: no certificates, newspaper clippings, or wellness items
 */
export function FounderSports({ onOpenVideo }) {
  const handleOpenFilm = () => {
    if (onOpenVideo) {
      onOpenVideo({
        id: 'video-01',
        title: 'Basketball Movement & Conditioning',
        tag: 'VIDEO 01 // ATHLETIC FILM',
        src: `${import.meta.env.BASE_URL}videos/founder/founder-sports-video.mp4`,
        poster: `${import.meta.env.BASE_URL}images/about/sports/founder-basketball-trophy.png`,
        aspectRatio: '9/16',
        isPortrait: true
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
      {/* Editorial Section Top Header */}
      <div className="founder-sports__header">
        <div className="sports-header__left">
          <span className="sports-header__tag-line" aria-hidden="true" />
          <div className="sports-header__titles">
            <span className="sports-header__eyebrow">03 // ATHLETIC BACKGROUND</span>
            <h3 className="sports-header__title">SPORT &amp; ATHLETICS</h3>
          </div>
        </div>
        <span className="sports-header__right">STATE &amp; NATIONAL LEVEL REPRESENTATION</span>
      </div>

      {/* Sports Asymmetric Core Grid */}
      <div className="founder-sports__grid">
        {/* Left Column: Grouped Sports Facts & Credentials */}
        <div className="founder-sports__facts-col">
          {/* Primary Sport: Basketball */}
          <div className="sports-card sports-card--basketball">
            <div className="sports-card__top">
              <span className="sports-card__index">PRIMARY SPORT // 01</span>
              <span className="sports-card__status-tag">STATE REPRESENTATION</span>
            </div>

            <div className="sports-card__body">
              <h4 className="sports-card__discipline-title">Basketball</h4>
              <div className="sports-card__tags">
                <span className="sports-tag">Player / Coach</span>
                <span className="sports-tag">Athletic Conditioning</span>
                <span className="sports-tag">Competitive Movement</span>
              </div>
              <p className="sports-card__desc">
                A competitive basketball player and coach with state-level representation and extensive coaching experience in movement mechanics, high-intensity agility, and athletic conditioning.
              </p>
            </div>

            <div className="sports-card__footer">
              <span>COMPETITIVE MOVEMENT &amp; ATHLETIC CONDITIONING</span>
            </div>
          </div>

          {/* Secondary Sport: Netball */}
          <div className="sports-card sports-card--netball">
            <div className="sports-card__top">
              <span className="sports-card__index">SECONDARY SPORT // 02</span>
              <span className="sports-card__status-tag sports-card__status-tag--silver">SILVER MEDALIST</span>
            </div>

            <div className="sports-card__body">
              <h4 className="sports-card__discipline-title">Netball</h4>

              {/* Medal Achievement Callout */}
              <div className="sports-netball__medal-block">
                <div className="sports-netball__medal-label">MEDAL ACHIEVEMENT</div>
                <h5 className="sports-netball__medal-title">Senior National South Zone Silver Medal</h5>
                <p className="sports-netball__rep-text">Tamil Nadu Netball Team Representative</p>
              </div>

              <p className="sports-card__desc">
                Represented Tamil Nadu Netball team in the South Zone National Championship, securing the silver medal in state-level competition.
              </p>
            </div>

            <div className="sports-card__footer">
              <span>STATE REPRESENTATION // SOUTH ZONE SENIOR NATIONALS</span>
            </div>
          </div>
        </div>

        {/* Right Column: Prominent Media Showcase (Useful Photo Size + Large Video Card) */}
        <div className="founder-sports__media-col">
          {/* 1. Large Relevant Sports Photograph (Basketball Championship Trophy) */}
          <div className="sports-photo-feature">
            <div className="sports-photo-feature__frame">
              <img
                src={`${import.meta.env.BASE_URL}images/about/sports/founder-basketball-trophy.png`}
                alt="Founder with basketball championship trophy"
                className="sports-photo-feature__img"
                loading="lazy"
                onError={(e) =>
                  handleImageFallback(e, `${import.meta.env.BASE_URL}images/about/sports/photo-b-basketball-athlete.svg`)
                }
              />
              <div className="sports-frame-accent-corner" aria-hidden="true" />
            </div>

            <div className="sports-photo-feature__caption">
              <div className="sports-caption-left">
                <span className="sports-caption-dot" aria-hidden="true" />
                <span className="sports-caption-tag">BASKETBALL</span>
              </div>
              <span className="sports-caption-meta">CHAMPIONSHIP TROPHY &amp; COACHING</span>
            </div>
          </div>

          {/* 2. Large Interactive Video 01 Card */}
          <div
            className="sports-video-feature"
            onClick={handleOpenFilm}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') handleOpenFilm();
            }}
            aria-label="Play Founder Basketball Movement and Conditioning Video"
          >
            <div className="sports-video-feature__frame">
              <div className="sports-video-feature__overlay">
                <span className="sports-video-feature__play-badge">
                  <span className="sports-video-feature__play-icon" aria-hidden="true">▶</span>
                  <span>PLAY ATHLETIC FILM →</span>
                </span>
              </div>
              <img
                src={`${import.meta.env.BASE_URL}images/about/sports/founder-basketball-trophy.png`}
                alt="Basketball movement film preview"
                className="sports-video-feature__poster"
                loading="lazy"
                onError={(e) =>
                  handleImageFallback(e, `${import.meta.env.BASE_URL}images/about/sports/photo-b-basketball-athlete.svg`)
                }
              />
            </div>

            <div className="sports-video-feature__info">
              <div className="sports-video-feature__header">
                <span className="sports-video-feature__tag">VIDEO 01</span>
                <span className="sports-video-feature__duration">PORTRAIT FILM</span>
              </div>
              <h5 className="sports-video-feature__title">Basketball Movement &amp; Conditioning</h5>
              <p className="sports-video-feature__desc">
                High-intensity ball-handling, agility footwork, and movement conditioning.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FounderSports;
