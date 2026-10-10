import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EASING, isReducedMotion } from '../../animations/scrollAnimations';
import '../../styles/about.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Homepage About Teaser Component (DWC 2.0)
 * Rebuilt as a concise, minimal Swiss International Style teaser profile.
 * 
 * Animations:
 * - Subtle vertical parallax on the Founder portrait (yPercent -7 to +7)
 * - Progressive staggered text loading (metadata 15px, heading 30px, lead 20px)
 * - Gentle opposing movement on editorial content column
 * - Full prefers-reduced-motion and responsive mobile support
 */
export function About() {
  const sectionRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    if (isReducedMotion()) return;

    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth <= 768;
      const img = sectionRef.current.querySelector('.founder-image');
      const contentCol = sectionRef.current.querySelector('.about-teaser__content-col');
      const topBar = sectionRef.current.querySelector('.about-top-bar');
      const footerBar = sectionRef.current.querySelector('.about-footer-bar');

      // 1. Subtle Vertical Parallax on Founder Portrait
      if (img && !isMobile) {
        gsap.fromTo(
          img,
          { yPercent: -7 },
          {
            yPercent: 7,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.2
            }
          }
        );
      }

      // 2. Subtle opposing vertical movement on content column for editorial depth
      if (contentCol && !isMobile) {
        gsap.fromTo(
          contentCol,
          { y: 10 },
          {
            y: -10,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.5
            }
          }
        );
      }

      // 3. Progressive Text Loading: Top Bar
      if (topBar) {
        gsap.from(topBar, {
          opacity: 0,
          y: 15,
          duration: 0.75,
          ease: EASING.editorial,
          scrollTrigger: {
            trigger: topBar,
            start: 'top 88%',
            once: true
          }
        });
      }

      // 4. Progressive Text Loading: Editorial Teaser Content
      if (contentCol) {
        const metaHeader = contentCol.querySelector('.about-teaser__meta-header');
        const founderName = contentCol.querySelector('.about-teaser__founder-name');
        const headline = contentCol.querySelector('.about-teaser__headline');
        const lead = contentCol.querySelector('.about-teaser__lead');
        const disciplines = contentCol.querySelectorAll('.about-teaser__discipline-item');
        const ctaBtn = contentCol.querySelector('.about-teaser__cta-wrapper');

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: contentCol,
            start: 'top 82%',
            once: true
          }
        });

        if (metaHeader) {
          tl.from(metaHeader, {
            opacity: 0,
            y: 15,
            duration: 0.6,
            ease: EASING.editorial
          });
        }

        if (founderName) {
          tl.from(
            founderName,
            {
              opacity: 0,
              y: 20,
              duration: 0.65,
              ease: EASING.editorial
            },
            '-=0.4'
          );
        }

        if (headline) {
          tl.from(
            headline,
            {
              opacity: 0,
              y: 30,
              duration: 0.8,
              ease: EASING.editorial
            },
            '-=0.4'
          );
        }

        if (lead) {
          tl.from(
            lead,
            {
              opacity: 0,
              y: 20,
              duration: 0.7,
              ease: EASING.editorial
            },
            '-=0.5'
          );
        }

        if (disciplines && disciplines.length) {
          tl.from(
            disciplines,
            {
              opacity: 0,
              y: 15,
              stagger: 0.08,
              duration: 0.6,
              ease: EASING.editorial
            },
            '-=0.4'
          );
        }

        if (ctaBtn) {
          tl.from(
            ctaBtn,
            {
              opacity: 0,
              y: 15,
              duration: 0.6,
              ease: EASING.editorial
            },
            '-=0.3'
          );
        }
      }

      // 5. Section Footer Bar
      if (footerBar) {
        gsap.from(footerBar, {
          opacity: 0,
          y: 15,
          duration: 0.75,
          ease: EASING.editorial,
          scrollTrigger: {
            trigger: footerBar,
            start: 'top 92%',
            once: true
          }
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="dwc-about-section dwc-about-section--teaser" id="about" ref={sectionRef} aria-label="About Daniel Wellness Center Founder">
      <div className="dwc-about-container">
        {/* 1. Small section label / index */}
        <div className="about-top-bar" aria-label="Section Identity">
          <div className="about-top-bar__left">
            <span className="about-top-bar__accent" aria-hidden="true" />
            <span>SEC 02 // ABOUT &amp; FOUNDER</span>
          </div>
        </div>

        {/* Teaser Core Grid */}
        <div className="about-teaser-zone">
          {/* 3. Founder Image: Approved Studio Portrait */}
          <div className="about-teaser__media-col">
            <div className="founder-image-wrapper">
              <img
                src={`${import.meta.env.BASE_URL}images/about/founder_portrait.png`}
                alt="Daniel Wellness Center Founder Portrait"
                className="founder-image"
                width="1254"
                height="1254"
                loading="lazy"
              />
            </div>
          </div>

          {/* Right Column: Teaser Content */}
          <div className="about-teaser__content-col">
            <div className="about-teaser__meta-header">
              <div className="about-teaser__badge">
                <span className="about-teaser__badge-accent" aria-hidden="true" />
                <span>FOUNDER PROFILE</span>
              </div>
            </div>

            {/* Founder Name */}
            <div className="about-teaser__founder-name">
              ASWIN KUMAR
            </div>

            {/* 2. Short About introduction */}
            <h2 className="about-teaser__headline">
              Built at the intersection of psychology, sport and wellness.
            </h2>

            {/* 4. Very short founder introduction */}
            <p className="about-teaser__lead">
              With a background spanning psychology, competitive sport, coaching and wellness training, the founder is building Daniel Wellness Center around a multidisciplinary understanding of mind, movement and recovery.
            </p>

            {/* 5. Small supporting metadata */}
            <div className="about-teaser__disciplines">
              <div className="about-teaser__discipline-item">
                <span className="about-teaser__discipline-num">01</span>
                <span className="about-teaser__discipline-title">PSYCHOLOGY</span>
              </div>

              <div className="about-teaser__discipline-item">
                <span className="about-teaser__discipline-num">02</span>
                <span className="about-teaser__discipline-title">SPORT</span>
              </div>

              <div className="about-teaser__discipline-item">
                <span className="about-teaser__discipline-num">03</span>
                <span className="about-teaser__discipline-title">WELLNESS</span>
              </div>
            </div>

            {/* 6. Clear CTA button */}
            <div className="about-teaser__cta-wrapper">
              <Link
                to="/about/founder"
                className="about-teaser__cta-btn"
                aria-label="View complete founder profile and background"
              >
                <span>VIEW FOUNDER</span>
                <span className="about-teaser__cta-arrow" aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
