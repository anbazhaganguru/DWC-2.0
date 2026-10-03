import React from 'react';

/**
 * Parses and formats any valid YouTube URL into an embed link:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://www.youtube.com/shorts/VIDEO_ID
 */
function getYouTubeEmbedUrl(url) {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (!trimmed) return '';

  const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = trimmed.match(regExp);

  if (match && match[1]) {
    return `https://www.youtube-nocookie.com/embed/${match[1]}?rel=0&modestbranding=1`;
  }

  if (trimmed.includes('/embed/')) {
    return trimmed;
  }

  return trimmed;
}

/**
 * Returns service-specific video headings according to Specification Section 14:
 * - Reflexology: THERAPY VIDEO // See How Reflexology Works
 * - Taping Therapy: THERAPY VIDEO // See How Taping Therapy Works
 * - Ice Bath Therapy: THERAPY VIDEO // Experience Ice Bath Therapy
 * - Steam Bath: THERAPY VIDEO // Experience Steam Bath
 * - Cupping Therapy: THERAPY VIDEO // See How Cupping Therapy Works
 * - Bamboo Therapy: THERAPY VIDEO // Experience Bamboo Therapy
 * - iROBO Massage Chair: PRODUCT VIDEO // Experience iROBO Wellness
 */
function getVideoHeadings(service) {
  const isIrobo = service?.slug === 'irobo-massage-chair';
  const tagKicker = isIrobo ? 'PRODUCT VIDEO' : 'THERAPY VIDEO';
  const tagSystem = isIrobo ? 'HIGH-FIDELITY APPARATUS' : 'CLINICAL MODALITY PRACTICE';

  let headline = `EXPERIENCE ${service?.title || 'WELLNESS'}`;

  switch (service?.slug) {
    case 'reflexology':
      headline = 'SEE HOW REFLEXOLOGY WORKS';
      break;
    case 'taping':
      headline = 'SEE HOW TAPING THERAPY WORKS';
      break;
    case 'ice-bath':
      headline = 'EXPERIENCE ICE BATH THERAPY';
      break;
    case 'steam-bath':
      headline = 'EXPERIENCE STEAM BATH';
      break;
    case 'cupping':
      headline = 'SEE HOW CUPPING THERAPY WORKS';
      break;
    case 'bamboo':
      headline = 'EXPERIENCE BAMBOO THERAPY';
      break;
    case 'irobo-massage-chair':
      headline = 'EXPERIENCE iROBO WELLNESS';
      break;
    default:
      headline = `EXPERIENCE ${service?.title || 'THERAPY'}`;
  }

  return { tagKicker, tagSystem, headline, isIrobo };
}

/**
 * ServiceVideo Component
 * Dedicated Video Section for all 7 service pages (Requirements 8 - 18)
 * - Always renders on each dedicated page.
 * - When videoUrl is empty: displays a clean editorial placeholder ("VIDEO COMING SOON").
 * - When client YouTube URL is provided: automatically embeds the 16:9 responsive YouTube player.
 */
export function ServiceVideo({ service }) {
  if (!service) return null;

  const { tagKicker, tagSystem, headline, isIrobo } = getVideoHeadings(service);
  const embedUrl = getYouTubeEmbedUrl(service.videoUrl);
  const hasVideoUrl = Boolean(embedUrl);

  return (
    <section className="service-video" id="service-video" aria-labelledby="video-heading">
      <div className="service-video__container">
        {/* Section Header */}
        <div className="service-section-header">
          <div className="service-section-header__tag-row">
            <span className="service-section-header__tag">{service.title} // {tagKicker}</span>
            <span className="service-section-header__system">{tagSystem}</span>
          </div>
          <h2 id="video-heading" className="service-section-header__title">
            {headline}
          </h2>
        </div>

        {/* Video Player Box or Clean Editorial Placeholder */}
        <div className="service-video__layout">
          {hasVideoUrl ? (
            <div className="service-video__player-box">
              <div className="service-video__iframe-wrap">
                <iframe
                  src={embedUrl}
                  title={`${service.title} demonstration video`}
                  frameBorder="0"
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="service-video__iframe"
                />
              </div>
            </div>
          ) : (
            <div
              className="service-video__placeholder-box"
              role="region"
              aria-label={`${service.title} video placeholder`}
            >
              <div className="service-video__placeholder-inner">
                <div className="service-video__play-emblem" aria-hidden="true">
                  <svg className="service-video__play-svg" viewBox="0 0 48 48" fill="none">
                    <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.4" />
                    <polygon points="20,15 33,24 20,33" fill="currentColor" />
                  </svg>
                </div>
                <span className="service-video__placeholder-kicker">
                  {isIrobo ? 'OFFICIAL PRODUCT RECORDING' : 'CLINICAL DEMONSTRATION RECORDING'}
                </span>
                <h3 className="service-video__placeholder-title">VIDEO COMING SOON</h3>
                <p className="service-video__placeholder-text">
                  The service video will appear here once provided by Daniel Wellness Center.
                </p>
              </div>
            </div>
          )}

          {/* Supporting Editorial Content beside the video box */}
          <div className="service-video__info">
            <div className="service-video__meta-row">
              <span className="service-video__meta-pill">
                {isIrobo ? 'APPARATUS DEMO' : 'CLINICAL SPECIMEN'}
              </span>
              <span className="service-video__format-tag">16:9 CINEMATIC SPECIMEN</span>
            </div>

            <h3 className="service-video__lead-title">
              {isIrobo ? 'HIGH-PRECISION SOMATIC RESTORATION' : 'A CALM, GUIDED EXPERIENCE'}
            </h3>
            
            <p className="service-video__lead-text">
              {service.videoSupportingText ||
                'The session is designed around comfort, controlled techniques, and a deeply personalized wellness journey.'}
            </p>

            <div className="service-video__status-bar">
              <span className="service-video__status-dot" />
              <span className="service-video__status-text">
                {hasVideoUrl
                  ? 'VERIFIED CLIENT BROADCAST ACTIVE'
                  : 'ARCHIVAL RECORDING IN PREPARATION'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ServiceVideo;
