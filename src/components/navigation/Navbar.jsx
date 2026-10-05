import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import '../../styles/navbar.css';

// Register CustomEase plugin safely
if (typeof window !== 'undefined') {
  gsap.registerPlugin(CustomEase);
}

// 5 Exact Navigation Destinations as specified in requirements
const NAV_ITEMS = [
  { id: 'home', num: '01', label: 'HOME', target: '#hero' },
  { id: 'about', num: '02', label: 'ABOUT', target: '#about' },
  { id: 'therapy', num: '03', label: 'THERAPY', target: '#therapy' },
  { id: 'recovery', num: '04', label: 'RECOVERY', target: '#recovery' },
  { id: 'cta', num: '05', label: 'CTA', target: '#cta' }
];

/**
 * Sterling Gate Kinetic Navigation Component for DWC-2.0
 *
 * Cinematic GSAP-powered fullscreen navigation with:
 * - Minimal closed state: DWC brand lockup on left, MENU + on right
 * - Animated button transition between MENU + and CLOSE ×
 * - Layered monochrome sliding background panels
 * - Sequential staggered reveal with yPercent: 140, rotation: 10 -> 0, 0
 * - Subtle geometric hover treatment with line indicator
 * - Smooth reverse timeline on close and ESC / backdrop click handling
 * - CustomEase ("0.65, 0.01, 0.05, 0.99")
 */
export function Navbar({ isDetailPage = false, hideCenterLinks = false, onOpenBooking }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHero, setIsHero] = useState(!isDetailPage);

  const containerRef = useRef(null);
  const overlayRef = useRef(null);
  const menuBtnRef = useRef(null);
  const menuLabelRef = useRef(null);
  const closeLabelRef = useRef(null);
  const iconRef = useRef(null);

  const bgPanel1Ref = useRef(null);
  const bgPanel2Ref = useRef(null);
  const mainPanelRef = useRef(null);

  const linkRefs = useRef([]);
  const textRefs = useRef([]);
  const numRefs = useRef([]);
  const lineRefs = useRef([]);
  const editorialRef = useRef(null);

  const tlRef = useRef(null);
  const ctxRef = useRef(null);
  const pendingTargetRef = useRef(null);

  // Monitor Hero -> About section boundary on homepage.
  // On detail pages, the navbar remains permanently in the black sticky state.
  useEffect(() => {
    if (isDetailPage) {
      setIsHero(false);
      return;
    }

    const aboutSection = document.getElementById('about');
    if (!aboutSection) return;

    const navHeader = containerRef.current?.querySelector('.dwc-navbar');

    const updateBoundary = () => {
      // Use actual fixed navbar height as the top navigation boundary threshold
      const navThreshold = navHeader?.offsetHeight || 80;
      const rect = aboutSection.getBoundingClientRect();

      // About section reaches top navigation boundary (rect.top <= navThreshold).
      // While in Hero, rect.top is far below the threshold (>= 100vh).
      // Once About reaches or passes above the threshold, isHero becomes false.
      const isPastHero = rect.top <= navThreshold;
      setIsHero(!isPastHero);
    };

    // 1. IntersectionObserver for #about section
    let observer = null;
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        () => {
          updateBoundary();
        },
        {
          root: null,
          rootMargin: '0px 0px -80% 0px',
          threshold: [0, 0.05, 0.1, 0.5, 1.0]
        }
      );
      observer.observe(aboutSection);
    }

    // 2. Single lightweight RAF scroll boundary listener
    let rafId = null;
    const handleScroll = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(() => {
        updateBoundary();
        rafId = null;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    // Initial check on mount
    updateBoundary();

    return () => {
      if (observer) {
        observer.disconnect();
      }
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, [isDetailPage]);

  // Initialize GSAP Animation Timeline
  useEffect(() => {
    // Create custom ease
    const kineticEase = CustomEase.create('dwcKineticEase', '0.65, 0.01, 0.05, 0.99');

    ctxRef.current = gsap.context(() => {
      // Set initial positions
      gsap.set(overlayRef.current, { autoAlpha: 0 });
      gsap.set([bgPanel1Ref.current, bgPanel2Ref.current, mainPanelRef.current], {
        xPercent: 100
      });
      gsap.set(closeLabelRef.current, { yPercent: 100, opacity: 0 });
      gsap.set(menuLabelRef.current, { yPercent: 0, opacity: 1 });
      gsap.set(iconRef.current, { rotation: 0 });

      gsap.set(textRefs.current, {
        yPercent: 140,
        rotation: 10,
        transformOrigin: '0% 50%'
      });
      gsap.set(numRefs.current, { opacity: 0, x: -16 });
      gsap.set(lineRefs.current, { scaleX: 0, transformOrigin: '0% 50%' });
      if (editorialRef.current) {
        gsap.set(editorialRef.current, { opacity: 0, y: 24 });
      }

      // Master Timeline (paused, reversed by default)
      const tl = gsap.timeline({
        paused: true,
        onReverseComplete: () => {
          gsap.set(overlayRef.current, { autoAlpha: 0 });
          document.body.style.overflow = '';
          setIsOpen(false);

          // If user clicked a navigation item, navigate smoothly now
          if (pendingTargetRef.current) {
            const target = pendingTargetRef.current;
            pendingTargetRef.current = null;
            if (window.location.pathname !== '/' && window.location.pathname !== '') {
              window.location.href = '/' + target;
              return;
            }
            const targetEl = document.querySelector(target);
            if (targetEl) {
              targetEl.scrollIntoView({ behavior: 'smooth' });
            }
          }
        }
      });

      // 1. Overlay activation
      tl.set(overlayRef.current, { autoAlpha: 1 });

      // 2. Button Transition: MENU -> CLOSE, icon rotate 45deg
      tl.to(
        menuLabelRef.current,
        {
          yPercent: -100,
          opacity: 0,
          duration: 0.45,
          ease: kineticEase
        },
        0
      );
      tl.to(
        closeLabelRef.current,
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.45,
          ease: kineticEase
        },
        0
      );
      tl.to(
        iconRef.current,
        {
          rotation: 45,
          duration: 0.5,
          ease: kineticEase
        },
        0
      );

      // 3. Staggered Background Panels (Sophisticated Monochrome)
      tl.to(
        bgPanel1Ref.current,
        {
          xPercent: 0,
          duration: 0.6,
          ease: kineticEase
        },
        0.04
      );
      tl.to(
        bgPanel2Ref.current,
        {
          xPercent: 0,
          duration: 0.6,
          ease: kineticEase
        },
        0.14
      );
      tl.to(
        mainPanelRef.current,
        {
          xPercent: 0,
          duration: 0.65,
          ease: kineticEase
        },
        0.22
      );

      // 4. Menu Links Reveal (yPercent: 140, rotation: 10 -> 0, 0)
      tl.to(
        textRefs.current,
        {
          yPercent: 0,
          rotation: 0,
          duration: 0.65,
          stagger: 0.06,
          ease: kineticEase
        },
        0.34
      );

      // 5. Numbers Reveal
      tl.to(
        numRefs.current,
        {
          opacity: 1,
          x: 0,
          duration: 0.45,
          stagger: 0.06,
          ease: 'power2.out'
        },
        0.38
      );

      // 6. Secondary Editorial Elements Reveal
      if (editorialRef.current) {
        tl.to(
          editorialRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            ease: 'power2.out'
          },
          0.52
        );
      }

      tlRef.current = tl;
    }, containerRef);

    return () => {
      ctxRef.current?.revert();
      document.body.style.overflow = '';
    };
  }, []);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        closeMenu();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Open Menu Sequence
  const openMenu = () => {
    if (!tlRef.current) return;
    setIsOpen(true);
    document.body.style.overflow = 'hidden';
    tlRef.current.timeScale(1).play();
  };

  // Close Menu Sequence
  const closeMenu = (targetSection = null) => {
    if (!tlRef.current) return;
    pendingTargetRef.current = targetSection;
    tlRef.current.timeScale(1.35).reverse();
  };

  // Toggle Handler
  const toggleMenu = () => {
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  };

  // Link Click Handler
  const handleNavClick = (e, target) => {
    e.preventDefault();
    if (isOpen) {
      closeMenu(target);
    } else {
      if (window.location.pathname !== '/' && window.location.pathname !== '') {
        window.location.href = '/' + target;
        return;
      }
      const targetEl = document.querySelector(target);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Backdrop Click Handler (clicks on overlay outside menu panel)
  const handleBackdropClick = (e) => {
    if (e.target === overlayRef.current) {
      closeMenu();
    }
  };

  // Hover Interaction Handlers
  const handleLinkHover = (hoveredIndex) => {
    linkRefs.current.forEach((linkEl, idx) => {
      if (!linkEl) return;
      if (idx === hoveredIndex) {
        gsap.to(linkEl, {
          x: 16,
          opacity: 1,
          duration: 0.35,
          ease: 'power2.out',
          overwrite: 'auto'
        });
        if (lineRefs.current[idx]) {
          gsap.to(lineRefs.current[idx], {
            scaleX: 1,
            duration: 0.35,
            ease: 'power2.out',
            overwrite: 'auto'
          });
        }
      } else {
        gsap.to(linkEl, {
          opacity: 0.3,
          x: 0,
          duration: 0.35,
          ease: 'power2.out',
          overwrite: 'auto'
        });
        if (lineRefs.current[idx]) {
          gsap.to(lineRefs.current[idx], {
            scaleX: 0,
            duration: 0.25,
            ease: 'power2.out',
            overwrite: 'auto'
          });
        }
      }
    });
  };

  const handleLinkLeave = () => {
    linkRefs.current.forEach((linkEl, idx) => {
      if (!linkEl) return;
      gsap.to(linkEl, {
        x: 0,
        opacity: 1,
        duration: 0.35,
        ease: 'power2.out',
        overwrite: 'auto'
      });
      if (lineRefs.current[idx]) {
        gsap.to(lineRefs.current[idx], {
          scaleX: 0,
          duration: 0.25,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      }
    });
  };

  return (
    <div className="dwc-kinetic-nav-wrapper" ref={containerRef}>
      {/* =========================================================
          1. FIXED TOP NAVBAR BAR (Minimal Swiss Editorial)
          ========================================================= */}
      <header
        className={`dwc-navbar ${isHero ? 'dwc-navbar--hero' : 'dwc-navbar--sticky dwc-navbar--scrolled'} ${isOpen ? 'dwc-navbar--menu-open' : ''}`}
        aria-label="Daniel Wellness Center Navigation"
      >
        <div className="dwc-navbar__inner">
          {/* Left: Distinctive Swiss Brand Lockup (DANIEL / WELLNESS CENTER) */}
          <a
            href="#hero"
            className={`dwc-navbar__brand dwc-brand-lockup ${isHero && !isOpen ? 'dwc-brand-lockup--hero' : ''}`}
            onClick={(e) => handleNavClick(e, '#hero')}
            aria-label="Daniel Wellness Center - Home"
          >
            <span className="dwc-brand-lockup__accent dwc-navbar__brand-accent" aria-hidden="true" />
            <div className="dwc-brand-lockup__text dwc-navbar__brand-text">
              <span className="dwc-brand-lockup__primary dwc-navbar__brand-primary">DANIEL</span>
              <span className="dwc-brand-lockup__supporting dwc-navbar__brand-sub">WELLNESS CENTER</span>
            </div>
          </a>

          {/* Center: HOME & THERAPY Navigation Links for Detail Pages (Removed ONLY on Founder Page via hideCenterLinks) */}
          {isDetailPage && !hideCenterLinks && (
            <nav className="dwc-navbar__center-links" aria-label="Quick Page Navigation">
              <a
                href="/#hero"
                className="dwc-navbar__center-link"
                onClick={(e) => handleNavClick(e, '#hero')}
              >
                HOME
              </a>
              <a
                href="/#therapy"
                className="dwc-navbar__center-link"
                onClick={(e) => handleNavClick(e, '#therapy')}
              >
                THERAPY
              </a>
            </nav>
          )}

          {/* Right Action Group: BOOK APPOINTMENT + Kinetic MENU / CLOSE Toggle */}
          <div className="dwc-navbar__right-actions">
            {isDetailPage && (
              <button
                type="button"
                className="dwc-navbar__book-btn"
                onClick={() => onOpenBooking?.()}
                aria-label="Open booking appointment modal"
              >
                BOOK APPOINTMENT →
              </button>
            )}

            {/* Kinetic MENU / CLOSE Toggle Trigger */}
            <button
              ref={menuBtnRef}
              type="button"
              className={`dwc-navbar__toggle ${isOpen ? 'dwc-navbar__toggle--open' : ''}`}
              onClick={toggleMenu}
              aria-expanded={isOpen}
              aria-label={isOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            >
              {/* Animated Text Container: MENU <-> CLOSE */}
              <div className="dwc-navbar__toggle-text" aria-hidden="true">
                <span className="dwc-navbar__label dwc-navbar__label--menu" ref={menuLabelRef}>
                  MENU
                </span>
                <span className="dwc-navbar__label dwc-navbar__label--close" ref={closeLabelRef}>
                  CLOSE
                </span>
              </div>

              {/* Rotating Kinetic Icon: + <-> × */}
              <span className="dwc-navbar__icon" ref={iconRef} aria-hidden="true">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                >
                  <line x1="8" y1="1" x2="8" y2="15" strokeLinecap="square" />
                  <line x1="1" y1="8" x2="15" y2="8" strokeLinecap="square" />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* =========================================================
          2. FULLSCREEN KINETIC MENU OVERLAY
          ========================================================= */}
      <div
        ref={overlayRef}
        className="dwc-kinetic-overlay"
        role="dialog"
        aria-modal="true"
        aria-label="Site Navigation Menu"
        onClick={handleBackdropClick}
      >
        {/* Layer 1: Charcoal Backdrop Panel */}
        <div className="dwc-nav-layer dwc-nav-layer--1" ref={bgPanel1Ref} aria-hidden="true" />

        {/* Layer 2: Deep Dark Layer */}
        <div className="dwc-nav-layer dwc-nav-layer--2" ref={bgPanel2Ref} aria-hidden="true" />

        {/* Layer 3: Main Editorial Content Panel */}
        <div
          className="dwc-nav-layer dwc-nav-layer--main"
          ref={mainPanelRef}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Subtle Swiss Grid Lines */}
          <div className="dwc-nav-grid-decor" aria-hidden="true">
            <div className="dwc-nav-grid-line dwc-nav-grid-line--vert" />
            <div className="dwc-nav-grid-line dwc-nav-grid-line--horiz" />
          </div>

          <div className="dwc-nav-menu-content">
            {/* Left / Primary: 5 Navigation Items */}
            <nav className="dwc-nav-menu-nav" aria-label="Fullscreen Navigation Links">
              <ul className="dwc-nav-menu-list">
                {NAV_ITEMS.map((item, index) => (
                  <li key={item.id} className="dwc-nav-menu-item">
                    <a
                      href={item.target}
                      className="dwc-nav-menu-link"
                      onClick={(e) => handleNavClick(e, item.target)}
                      onMouseEnter={() => handleLinkHover(index)}
                      onMouseLeave={handleLinkLeave}
                      ref={(el) => (linkRefs.current[index] = el)}
                      tabIndex={isOpen ? 0 : -1}
                    >
                      {/* Secondary Number */}
                      <span
                        className="dwc-nav-menu-num"
                        ref={(el) => (numRefs.current[index] = el)}
                        aria-hidden="true"
                      >
                        {item.num}
                      </span>

                      {/* Kinetic Text Reveal Mask */}
                      <div className="dwc-nav-menu-mask">
                        <span
                          className="dwc-nav-menu-text"
                          ref={(el) => (textRefs.current[index] = el)}
                        >
                          {item.label}
                        </span>
                      </div>

                      {/* Subtle Geometric Hover Indicator */}
                      <span
                        className="dwc-nav-menu-hover-line"
                        ref={(el) => (lineRefs.current[index] = el)}
                        aria-hidden="true"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Right / Secondary Editorial Brand Content */}
            <div className="dwc-nav-editorial" ref={editorialRef}>
              <div className="dwc-nav-editorial__top">
                <div className="dwc-nav-editorial__badge">
                  <span className="dwc-nav-editorial__badge-dot" aria-hidden="true" />
                  <span>DANIEL WELLNESS CENTER</span>
                </div>
                <h3 className="dwc-nav-editorial__heading">
                  SANCTUARY OF RESTORATION
                </h3>
                <p className="dwc-nav-editorial__desc">
                  Every individual has different needs, which is why we encourage a personalized approach when choosing a wellness experience.
                </p>
              </div>

              <div className="dwc-nav-editorial__footer">
                <div className="dwc-nav-editorial__coord">
                  <span className="dwc-nav-editorial__label">LOCATION</span>
                  <span className="dwc-nav-editorial__val">5th Avenue, Banu Nagar, Ambattur, Chennai</span>
                </div>

                <div className="dwc-nav-editorial__coord">
                  <span className="dwc-nav-editorial__label">CONCIERGE &amp; APPOINTMENTS</span>
                  <a
                    href="https://wa.me/917358313291"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="dwc-nav-editorial__link"
                    tabIndex={isOpen ? 0 : -1}
                  >
                    +91 7358313291 &middot; WhatsApp Direct
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
