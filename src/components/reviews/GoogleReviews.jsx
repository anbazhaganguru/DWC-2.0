import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EASING, isReducedMotion } from '../../animations/scrollAnimations';
import '../../styles/reviews.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const ZYFF_SCRIPT_URL = 'https://www.zyff.app/w/google-reviews.js';
const WIDGET_ID = 'A_ZiT5Oj7FqEew';
const GOOGLE_MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=Daniel%20wellness%20centre&query_place_id=ChIJU9zbIgBjUjoRWvxWXywoc7s';

/**
 * Singleton script loader to guarantee the external Zyff widget script
 * is appended and executed exactly once across the application lifecycle.
 */
let scriptPromise = null;

function loadZyffScriptOnce() {
  if (typeof window === 'undefined') return Promise.resolve();

  // Return existing promise if already initiating or loaded
  if (window.__dwcZyffScriptReady) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  const existingScript = document.querySelector(`script[src="${ZYFF_SCRIPT_URL}"]`);
  if (existingScript) {
    if (existingScript.dataset.loaded === 'true') {
      window.__dwcZyffScriptReady = true;
      return Promise.resolve();
    }
    scriptPromise = new Promise((resolve) => {
      existingScript.addEventListener('load', () => {
        window.__dwcZyffScriptReady = true;
        resolve();
      }, { once: true });
      existingScript.addEventListener('error', () => {
        scriptPromise = null;
        resolve(); // resolve to allow graceful fallback handling
      }, { once: true });
    });
    return scriptPromise;
  }

  scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = ZYFF_SCRIPT_URL;
    script.defer = true;
    script.setAttribute('data-zyff-loader', 'dwc-2.0');
    script.onload = () => {
      script.dataset.loaded = 'true';
      window.__dwcZyffScriptReady = true;
      resolve();
    };
    script.onerror = (err) => {
      console.warn('[DWC Google Reviews] Failed to fetch external Zyff script:', err);
      scriptPromise = null; // allow retry on next mount
      reject(err);
    };
    document.head.appendChild(script);
  });

  return scriptPromise;
}

/**
 * Injects restrained Swiss International Style typography and subtle refinements
 * into the widget's open shadowRoot to seamlessly blend with the DWC monochromatic theme.
 */
function applyShadowDomTheme(shadowRoot) {
  if (!shadowRoot || shadowRoot.querySelector('[data-dwc-theme-injected]')) return;

  const styleEl = document.createElement('style');
  styleEl.setAttribute('data-dwc-theme-injected', 'true');
  styleEl.textContent = `
    :host {
      font-family: 'IBM Plex Sans', -apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif !important;
      letter-spacing: -0.01em;
      box-sizing: border-box !important;
    }
    /* Suppress duplicate internal heading since DWC section provides the authoritative header */
    h2 {
      display: none !important;
    }
    /* Overall wrapper padding adjustments */
    div[dir="ltr"], div[dir="auto"] {
      padding-left: 0 !important;
      padding-right: 0 !important;
      background: transparent !important;
    }
    /* Summary header box */
    div[style*="justify-content: space-between"],
    div[style*="justify-content:space-between"] {
      border: 1px solid #e8e8e8 !important;
      border-radius: 0px !important;
      box-shadow: none !important;
      background: #fafafa !important;
      padding: clamp(16px, 2.5vw, 24px) clamp(16px, 3vw, 28px) !important;
      box-sizing: border-box !important;
      margin-bottom: 8px !important;
    }
    /* "Review us on Google" Action Button */
    a[href*="writereview"],
    a[href*="search.google.com/local/writereview"] {
      background: #000000 !important;
      color: #ffffff !important;
      border: 1px solid #000000 !important;
      border-radius: 0px !important;
      font-family: 'IBM Plex Sans', -apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif !important;
      font-weight: 600 !important;
      letter-spacing: 0.16em !important;
      text-transform: uppercase !important;
      font-size: 0.75rem !important;
      padding: 12px 22px !important;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
      display: inline-flex !important;
      align-items: center !important;
      text-decoration: none !important;
    }
    a[href*="writereview"]:hover,
    a[href*="search.google.com/local/writereview"]:hover {
      background: #222222 !important;
      border-color: #222222 !important;
      color: #ffffff !important;
    }
    /* Review Cards */
    article {
      border: 1px solid #e8e8e8 !important;
      box-shadow: none !important;
      border-radius: 0px !important;
      background: #fafafa !important;
      padding: clamp(18px, 2.5vw, 24px) !important;
      box-sizing: border-box !important;
      transition: border-color 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
    }
    article:hover {
      border-color: #bbbbbb !important;
    }
    /* Typography inside review cards */
    article p {
      font-family: 'IBM Plex Sans', -apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif !important;
      color: #333333 !important;
      line-height: 1.55 !important;
    }
    /* Review author title */
    article header a, article header span {
      font-family: 'IBM Plex Sans', -apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif !important;
      font-weight: 600 !important;
      color: #0d0d0d !important;
    }
    /* "Read on Google" Links */
    article a[aria-label*="review on Google"],
    article a[href*="maps/reviews"] {
      color: #666666 !important;
      font-family: 'IBM Plex Sans', -apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif !important;
      font-size: 0.75rem !important;
      font-weight: 500 !important;
      letter-spacing: 0.06em !important;
      text-transform: uppercase !important;
      text-decoration: underline !important;
      text-underline-offset: 3px !important;
      transition: color 0.2s ease !important;
    }
    article a[aria-label*="review on Google"]:hover,
    article a[href*="maps/reviews"]:hover {
      color: var(--color-accent-red, #e62217) !important;
    }
    /* Carousel Navigation Buttons */
    button[aria-label*="reviews"] {
      border: 1px solid #e0e0e0 !important;
      border-radius: 0px !important;
      background: #ffffff !important;
      color: #111111 !important;
      box-shadow: none !important;
      transition: all 0.2s ease !important;
    }
    button[aria-label*="reviews"]:hover {
      background: #000000 !important;
      color: #ffffff !important;
      border-color: #000000 !important;
    }
    /* Carousel Pagination Dots */
    button[aria-label*="page"] {
      border-radius: 0px !important;
      width: 8px !important;
      height: 8px !important;
      transition: all 0.2s ease !important;
    }
    /* Hide broken or low-quality streetview thumbnails */
    img[src*="streetviewpixels"] {
      display: none !important;
    }
  `;
  shadowRoot.appendChild(styleEl);
}

/**
 * Dedicated Google Reviews Component for DWC 2.0 Homepage
 * Placed immediately before the CTA section.
 */
export function GoogleReviews() {
  const sectionRef = useRef(null);
  const widgetContainerRef = useRef(null);
  const [widgetState, setWidgetState] = useState('loading'); // 'loading' | 'ready' | 'empty' | 'error'

  // 1. GSAP ScrollTrigger Entrance Animation for Section Header
  useEffect(() => {
    if (!sectionRef.current) return;
    if (isReducedMotion()) return;

    const ctx = gsap.context(() => {
      const header = sectionRef.current.querySelector('.dwc-reviews-header');
      if (header) {
        const eyebrow = header.querySelector('.dwc-reviews-eyebrow');
        const headline = header.querySelector('.dwc-reviews-headline');
        const description = header.querySelector('.dwc-reviews-description');
        const metaStrip = header.querySelector('.dwc-reviews-meta-strip');

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: header,
            start: 'top 82%',
            once: true
          }
        });

        if (eyebrow) {
          tl.from(eyebrow, {
            opacity: 0,
            y: 15,
            duration: 0.6,
            ease: EASING.editorial
          });
        }

        if (headline) {
          tl.from(
            headline,
            {
              opacity: 0,
              y: 25,
              duration: 0.75,
              ease: EASING.editorial
            },
            '-=0.4'
          );
        }

        if (description) {
          tl.from(
            description,
            {
              opacity: 0,
              y: 20,
              duration: 0.7,
              ease: EASING.editorial
            },
            '-=0.45'
          );
        }

        if (metaStrip) {
          tl.from(
            metaStrip,
            {
              opacity: 0,
              y: 15,
              duration: 0.6,
              ease: EASING.editorial
            },
            '-=0.35'
          );
        }
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // 2. Safe Widget Integration & Mutation Observer
  useEffect(() => {
    let isMounted = true;
    let observer = null;
    let timeoutId = null;

    const checkWidgetDOM = () => {
      const container = widgetContainerRef.current;
      if (!container) return;

      const stateAttr = container.getAttribute('data-zyff-state');
      const rootEl = container.querySelector('[data-zyff-root]');

      if (rootEl && rootEl.shadowRoot) {
        applyShadowDomTheme(rootEl.shadowRoot);
      }

      if (stateAttr === 'ready' || stateAttr === 'stale') {
        if (isMounted) setWidgetState('ready');
      } else if (stateAttr === 'empty') {
        if (isMounted) setWidgetState('empty');
      } else if (stateAttr === 'error' || stateAttr === 'paused') {
        if (isMounted) setWidgetState('error');
      }
    };

    // Load external script once
    loadZyffScriptOnce()
      .then(() => {
        if (!isMounted || !widgetContainerRef.current) return;

        // Observe container attribute changes and shadowRoot attachments
        observer = new MutationObserver(() => {
          checkWidgetDOM();
        });

        observer.observe(widgetContainerRef.current, {
          attributes: true,
          childList: true,
          subtree: true
        });

        // Initial check in case it already initialized
        checkWidgetDOM();

        // Dispatch a gentle event if IntersectionObserver needs a nudge
        requestAnimationFrame(() => {
          window.dispatchEvent(new Event('scroll'));
        });
      })
      .catch((err) => {
        console.warn('[DWC Google Reviews] Script loading error:', err);
        if (isMounted) setWidgetState('error');
      });

    // Graceful fallback timer: if widget doesn't report ready within 9 seconds
    timeoutId = setTimeout(() => {
      if (isMounted) {
        const container = widgetContainerRef.current;
        const stateAttr = container?.getAttribute('data-zyff-state');
        if (!stateAttr || stateAttr === 'loading') {
          // If still loading after 9s, check if shadowRoot rendered anyway
          const rootEl = container?.querySelector('[data-zyff-root]');
          if (rootEl && rootEl.shadowRoot) {
            applyShadowDomTheme(rootEl.shadowRoot);
            setWidgetState('ready');
          } else {
            setWidgetState('fallback');
          }
        }
      }
    }, 9000);

    return () => {
      isMounted = false;
      if (observer) observer.disconnect();
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  return (
    <section
      id="reviews"
      ref={sectionRef}
      className="dwc-reviews-section"
      aria-label="Google Reviews"
    >
      <div className="dwc-reviews-container">
        {/* Editorial Section Header */}
        <header className="dwc-reviews-header">
          <div className="dwc-reviews-eyebrow">
            <span className="dwc-reviews-eyebrow-accent" aria-hidden="true" />
            <span className="dwc-reviews-eyebrow-text">
              DANIEL WELLNESS CENTER / VERIFIED RATINGS
            </span>
          </div>

          <h2 className="dwc-reviews-headline">Google Reviews</h2>

          <p className="dwc-reviews-description">
            Authentic experiences, recovery results, and verified clinical feedback shared by clients and patients on Google Maps.
          </p>

          <div className="dwc-reviews-meta-strip">
            <div className="dwc-reviews-rating-item">
              <span className="dwc-reviews-rating-score">4.4</span>
              <span className="dwc-reviews-rating-stars" aria-label="4.4 out of 5 stars">
                ★★★★★
              </span>
              <span className="dwc-reviews-rating-count">9 Verified Reviews</span>
            </div>

            <span className="dwc-reviews-meta-divider" aria-hidden="true" />

            <div className="dwc-reviews-source-item">
              <svg
                className="dwc-reviews-google-icon"
                viewBox="0 0 24 24"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  fill="#4285F4"
                  d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29A11.86 11.86 0 0 0 0 12c0 1.94.46 3.77 1.29 5.38l3.98-3.09z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75z"
                />
              </svg>
              <span>Google Maps Verified Profile</span>
            </div>
          </div>
        </header>

        {/* Widget Mount Container */}
        <div className="dwc-reviews-widget-wrapper">
          {/* Skeleton while loading */}
          {widgetState === 'loading' && (
            <div className="dwc-reviews-skeleton" aria-hidden="true">
              <div className="dwc-reviews-skeleton__header" />
              <div className="dwc-reviews-skeleton__grid">
                <div className="dwc-reviews-skeleton__card" />
                <div className="dwc-reviews-skeleton__card" />
                <div className="dwc-reviews-skeleton__card" />
              </div>
            </div>
          )}

          {/* Exact required Zyff embed markup */}
          <div
            ref={widgetContainerRef}
            className="zyff-google-reviews"
            data-zyff-widget="google-reviews"
            data-zyff-id={WIDGET_ID}
          />

          {/* Graceful fallback if offline or third-party service unavailable */}
          {(widgetState === 'fallback' || widgetState === 'error') && (
            <div className="dwc-reviews-fallback" role="status">
              <h3 className="dwc-reviews-fallback__title">
                Verified Reviews on Google
              </h3>
              <p className="dwc-reviews-fallback__copy">
                View all authentic ratings, testimonials, and patient feedback directly on our verified Google Maps listing.
              </p>
              <a
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="dwc-reviews-fallback__btn"
              >
                <span>Read Reviews on Google Maps</span>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M9 3L14 8M14 8L9 13M14 8H2"
                    stroke="currentColor"
                    strokeWidth="1.75"
                  />
                </svg>
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default GoogleReviews;
