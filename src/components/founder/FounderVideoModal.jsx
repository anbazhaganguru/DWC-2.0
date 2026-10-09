import React, { useEffect, useRef, useState } from 'react';

/**
 * FounderVideoModal Component (DWC 2.0)
 * Accessible, responsive Swiss International Style video modal.
 * Features:
 * - Programmatic playback start with promise handling and error logging
 * - Leaves modal open with controls if autoplay is restricted by browser policy
 * - Resets video source when switching cards
 * - Stops playback and resets currentTime on close
 * - ESC key, Close button, and Backdrop click close
 * - Body scroll lock & restoration
 * - HTML5 video element with controls, playsInline, preload="auto"
 */
export function FounderVideoModal({ isOpen, videoData, onClose }) {
  const videoRef = useRef(null);
  const scrollPosRef = useRef(0);
  const [videoError, setVideoError] = useState(false);

  // Body scroll lock & Escape key handling
  useEffect(() => {
    if (!isOpen) return;

    scrollPosRef.current = window.scrollY;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      window.scrollTo(0, scrollPosRef.current);
    };
  }, [isOpen, onClose]);

  // Video playback management & reset
  useEffect(() => {
    if (!isOpen || !videoData) {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
      return;
    }

    setVideoError(false);

    // Timeout ensures the video element is mounted and ready
    const timer = setTimeout(() => {
      const videoEl = videoRef.current;
      if (videoEl) {
        videoEl.pause();
        videoEl.currentTime = 0;
        videoEl.load();

        const playPromise = videoEl.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log(`[FounderVideoModal] Playing video: ${videoData.title}`);
            })
            .catch((err) => {
              console.warn(
                `[FounderVideoModal] Autoplay restricted (${err.name}: ${err.message}). Controls available for user playback.`
              );
            });
        }
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [isOpen, videoData]);

  // Handle clean stop on modal close
  const handleModalClose = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    onClose();
  };

  const handleVideoError = (e) => {
    const err = videoRef.current?.error;
    console.error('[FounderVideoModal] Video load error:', {
      code: err?.code,
      message: err?.message,
      networkState: videoRef.current?.networkState,
      readyState: videoRef.current?.readyState,
      currentSrc: videoRef.current?.currentSrc
    });
    setVideoError(true);
  };

  if (!isOpen || !videoData) return null;

  return (
    <div
      className="founder-video-modal-backdrop"
      onClick={handleModalClose}
      role="dialog"
      aria-modal="true"
      aria-label={videoData.title || 'Founder Video Player'}
    >
      <div
        className="founder-video-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="founder-video-modal__header">
          <div className="founder-video-modal__title-group">
            <span className="founder-video-modal__accent-dot" aria-hidden="true" />
            <span className="founder-video-modal__tag">{videoData.tag || 'FOUNDER ARCHIVE'}</span>
            <h3 className="founder-video-modal__title">{videoData.title}</h3>
          </div>

          <button
            type="button"
            className="founder-video-modal__close-btn"
            onClick={handleModalClose}
            aria-label="Close video player"
          >
            <span aria-hidden="true">✕</span>
            <span>CLOSE</span>
          </button>
        </div>

        {/* Video Player Frame */}
        <div className="founder-video-modal__player-frame">
          {!videoError ? (
            <video
              ref={videoRef}
              src={videoData.src}
              poster={videoData.poster}
              controls
              playsInline
              preload="auto"
              onError={handleVideoError}
              className="founder-video-modal__video"
            >
              <source src={videoData.src} type="video/mp4" />
              Your browser does not support HTML5 video playback.
            </video>
          ) : (
            <div className="founder-video-modal__fallback">
              <div className="founder-video-fallback__badge">
                <span className="founder-video-fallback__dot" />
                <span>FOUNDER MEDIA ARCHIVE</span>
              </div>
              <h4 className="founder-video-fallback__title">{videoData.title}</h4>
              <p className="founder-video-fallback__desc">
                Source asset: <code>{videoData.src}</code>
              </p>
              <p className="founder-video-fallback__sub">
                Could not load video media stream. Please verify the asset exists.
              </p>
            </div>
          )}
        </div>

        {/* Modal Bottom Metadata */}
        <div className="founder-video-modal__footer">
          <span className="founder-video-modal__meta-left">
            DANIEL WELLNESS CENTER // FOUNDER MEDIA ARCHIVE
          </span>
          <span className="founder-video-modal__meta-right">
            ESC OR CLICK OUTSIDE TO CLOSE
          </span>
        </div>
      </div>
    </div>
  );
}

export default FounderVideoModal;
