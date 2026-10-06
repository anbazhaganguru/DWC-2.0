import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EASING, isReducedMotion } from '../../animations/scrollAnimations';
import TherapyTopBar from './TherapyTopBar';
import TherapyHeader from './TherapyHeader';
import TherapyApparatus from './TherapyApparatus';
import TherapyDirectoryHeader from './TherapyDirectoryHeader';
import TherapyCard from './TherapyCard';
import TherapyFooterBar from './TherapyFooterBar';
import '../../styles/therapy.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Therapy Data Specification extracted directly from Figma Node 1:2
 * Asymmetric Editorial Sizing:
 * - Card 01: Reflexology (Large)
 * - Card 02: Taping Therapy (Small)
 * - Card 03: Ice Bath Therapy (Small)
 * - Card 04: Steam Bath (Large / Dark)
 * - Card 05: Bamboo Therapy (Standard)
 * - Card 06: Cupping Therapy (Standard)
 */
const modalitiesData = [
  {
    id: '01',
    slug: 'reflexology',
    badge: 'NEURO-RESTORATIVE',
    title: 'REFLEXOLOGY',
    subtitle: '“Restore Balance. Relax Deeply. Feel Refreshed.”',
    image: '/images/therapy/modality_01_reflexology_original.png',
    imageTag: 'REFLEX STIMULATION // SOLE & ACUPOINTS',
    isDark: false,
    size: 'large'
  },
  {
    id: '02',
    slug: 'taping',
    badge: 'KINESIOLOGY',
    title: 'TAPING THERAPY',
    subtitle: '“Support Your Movement. Stay Active With Confidence.”',
    image: '/images/therapy/modality_02_taping_original.png',
    imageTag: 'MYOFASCIAL STABILITY PROTOCOL',
    isDark: false,
    size: 'small'
  },
  {
    id: '03',
    slug: 'ice-bath',
    badge: 'CRYOTHERMIC',
    title: 'ICE BATH THERAPY',
    subtitle: '“Refresh Your Body. Reset Your Mind. Support Your Recovery.”',
    image: '/images/recovery/recovery_03_ice_bath.png',
    imageTag: 'THERMAL GRADIENT // SUB-ZERO RECOVERY',
    isDark: false,
    size: 'small'
  },
  {
    id: '04',
    slug: 'steam-bath',
    badge: 'HYDRO-THERMAL',
    title: 'STEAM BATH',
    subtitle: '“Step Into Warmth. Leave Feeling Relaxed.”',
    image: '/images/therapy/modality_04_steam_bath_original.png',
    imageTag: 'ATMOSPHERIC MIST // ARCHITECTURAL CALM',
    isDark: true,
    size: 'large'
  },
  {
    id: '05',
    slug: 'bamboo',
    badge: 'ORGANIC TACTILE',
    title: 'BAMBOO THERAPY',
    subtitle: '“Experience the Natural Power of Bamboo. Deep Relaxation Starts Here.”',
    image: '/images/therapy/modality_05_bamboo_original.png',
    imageTag: 'WARM HOLLOW STALKS // DEEP TISSUE RELEASE',
    isDark: false,
    size: 'standard'
  },
  {
    id: '06',
    slug: 'cupping',
    badge: 'DECOMPRESSION',
    title: 'CUPPING THERAPY',
    subtitle: '“Release Tension. Relax Your Body. Support Your Wellness.”',
    image: '/images/therapy/modality_06_cupping_original.png',
    imageTag: 'MYOFASCIAL DECOMPRESSION // SUCTION MATRIX',
    isDark: false,
    size: 'standard'
  }
];

/**
 * Main Therapy Component.
 * Pixel-accurate reproduction of Figma Frame Node 1:2 with asymmetric card sizing.
 * 
 * Choreographed GSAP scroll reveals:
 * - Small upward heading reveal
 * - Apparatus 01 reveal + slow image parallax drift
 * - Asymmetric cards subtle y movement with staggered entrance
 * - Card images subtle parallax scrub
 * - Full responsive and reduced-motion handling
 */
export function Therapy() {
  const sectionRef = useRef(null);

  // Left Column: 01 (Large), 03 (Small), 05 (Standard)
  const col1Data = [modalitiesData[0], modalitiesData[2], modalitiesData[4]];
  
  // Right Column: 02 (Small), 04 (Large), 06 (Standard)
  const col2Data = [modalitiesData[1], modalitiesData[3], modalitiesData[5]];

  useEffect(() => {
    if (!sectionRef.current) return;
    if (isReducedMotion()) return;

    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth <= 768;

      // 1. Top Bar Reveal
      const topBar = sectionRef.current.querySelector('.therapy-top-bar');
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

      // 2. Main Header Zone Reveal (Heading + Philosophy Statement)
      const headerZone = sectionRef.current.querySelector('.therapy-header-zone');
      if (headerZone) {
        const titleLines = headerZone.querySelectorAll('.therapy-header__title-line');
        const tags = headerZone.querySelectorAll('.therapy-header__tag, .therapy-header__subtag, .therapy-header__right-tag, .therapy-header__right-footer');
        const quote = headerZone.querySelector('.therapy-header__quote');

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: headerZone,
            start: 'top 82%',
            once: true
          }
        });

        if (tags.length) {
          tl.from(tags, {
            opacity: 0,
            y: 15,
            duration: 0.6,
            stagger: 0.06,
            ease: EASING.editorial
          });
        }

        if (titleLines.length) {
          tl.from(
            titleLines,
            {
              opacity: 0,
              y: 30,
              duration: 0.8,
              stagger: 0.08,
              ease: EASING.editorial
            },
            '-=0.4'
          );
        }

        if (quote) {
          tl.from(
            quote,
            {
              opacity: 0,
              y: 20,
              duration: 0.7,
              ease: EASING.editorial
            },
            '-=0.5'
          );
        }
      }

      // 3. Apparatus 01 Feature Section Reveal & Media Parallax
      const apparatus = sectionRef.current.querySelector('.therapy-apparatus-section');
      if (apparatus) {
        const topBarApp = apparatus.querySelector('.therapy-apparatus__top-bar');
        const info = apparatus.querySelector('.therapy-apparatus__info');
        const mediaBox = apparatus.querySelector('.therapy-apparatus__media-box');
        const appImg = apparatus.querySelector('.therapy-apparatus__img');

        const tlApp = gsap.timeline({
          scrollTrigger: {
            trigger: apparatus,
            start: 'top 80%',
            once: true
          }
        });

        if (topBarApp) {
          tlApp.from(topBarApp, {
            opacity: 0,
            y: 15,
            duration: 0.6,
            ease: EASING.editorial
          });
        }

        if (info) {
          tlApp.from(
            info,
            {
              opacity: 0,
              y: 25,
              duration: 0.8,
              ease: EASING.editorial
            },
            '-=0.3'
          );
        }

        if (mediaBox) {
          tlApp.from(
            mediaBox,
            {
              opacity: 0,
              y: 25,
              duration: 0.8,
              ease: EASING.editorial
            },
            '-=0.5'
          );
        }

        // Parallax drift on Apparatus Image
        if (appImg && !isMobile) {
          gsap.fromTo(
            appImg,
            { yPercent: -4 },
            {
              yPercent: 4,
              ease: 'none',
              scrollTrigger: {
                trigger: apparatus,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1.2
              }
            }
          );
        }
      }

      // 4. Directory Header
      const dirHeader = sectionRef.current.querySelector('.therapy-directory-header');
      if (dirHeader) {
        gsap.from(dirHeader, {
          opacity: 0,
          y: 20,
          duration: 0.75,
          ease: EASING.editorial,
          scrollTrigger: {
            trigger: dirHeader,
            start: 'top 85%',
            once: true
          }
        });
      }

      // 5. Asymmetric Modalities Grid Cards Reveal (Left & Right columns staggered)
      const leftCol = sectionRef.current.querySelector('.therapy-grid__column--left');
      if (leftCol) {
        const leftCards = leftCol.querySelectorAll('.therapy-card');
        gsap.from(leftCards, {
          opacity: 0,
          y: 35,
          stagger: 0.12,
          duration: 0.85,
          ease: EASING.editorial,
          scrollTrigger: {
            trigger: leftCol,
            start: 'top 80%',
            once: true
          }
        });
      }

      const rightCol = sectionRef.current.querySelector('.therapy-grid__column--right');
      if (rightCol) {
        const rightCards = rightCol.querySelectorAll('.therapy-card');
        gsap.from(rightCards, {
          opacity: 0,
          y: 35,
          stagger: 0.12,
          duration: 0.85,
          ease: EASING.editorial,
          scrollTrigger: {
            trigger: rightCol,
            start: 'top 80%',
            once: true
          }
        });
      }

      // Subtle vertical parallax on individual card images
      if (!isMobile) {
        const allCards = sectionRef.current.querySelectorAll('.therapy-card');
        allCards.forEach((card) => {
          const cardImg = card.querySelector('.therapy-card__img');
          if (cardImg) {
            gsap.fromTo(
              cardImg,
              { yPercent: -3 },
              {
                yPercent: 3,
                ease: 'none',
                scrollTrigger: {
                  trigger: card,
                  start: 'top bottom',
                  end: 'bottom top',
                  scrub: 1.2
                }
              }
            );
          }
        });
      }

      // 6. Section Footer Bar
      const footerBar = sectionRef.current.querySelector('.therapy-footer-bar');
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
    <section className="therapy-section" id="therapy" ref={sectionRef} aria-label="Clinical Therapy Services">
      <div className="therapy-container">
        {/* Sub-header Tracking Line */}
        <TherapyTopBar />

        {/* Main Header Zone */}
        <TherapyHeader />

        {/* Apparatus 01 Feature Section */}
        <TherapyApparatus />

        {/* Directory Header */}
        <TherapyDirectoryHeader />

        {/* 6 Modalities Asymmetric 2-Column Grid */}
        <div className="therapy-grid">
          {/* Column 1 (Left): 01 Large, 03 Small, 05 Standard */}
          <div className="therapy-grid__column therapy-grid__column--left">
            {col1Data.map((item) => (
              <TherapyCard key={item.id} {...item} />
            ))}
          </div>

          {/* Column 2 (Right): 02 Small, 04 Large, 06 Standard */}
          <div className="therapy-grid__column therapy-grid__column--right">
            {col2Data.map((item) => (
              <TherapyCard key={item.id} {...item} />
            ))}
          </div>
        </div>

        {/* Section Verification Footer */}
        <TherapyFooterBar />
      </div>
    </section>
  );
}

export default Therapy;
