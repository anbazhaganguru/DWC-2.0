import React, { useRef, useState, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EASING, isReducedMotion } from '../../animations/scrollAnimations';
import RecoveryHeader from './RecoveryHeader';
import RecoveryCard from './RecoveryCard';
import RecoveryTrackbar from './RecoveryTrackbar';
import { recoveryModalities } from './recoveryData';
import '../../styles/recovery.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Recovery Section Component
 * Seamless Infinite Auto-Scrolling Carousel matching Figma Node 1:3.
 *
 * Core Architecture:
 * - 4 duplicated sets (24 cards) creating an uninterrupted continuous track
 * - High-performance requestAnimationFrame loop with sub-pixel delta-time translation
 * - True seamless wrapping: jumping by exactly 1 set width produces zero visible gap or jump
 * - Viewport detection via IntersectionObserver (scrolls only when in view)
 * - Desktop hover smoothly pauses and resumes from exact current position
 * - Trackpad horizontal gesture support with non-interfering vertical page scroll
 * - Pointer click-and-drag interaction with grab cursor and boundary protection
 * - Mobile touch horizontal swiping while strictly preserving native vertical scrolling
 * - Synchronous 01/06 counter and linear progress trackbar without React re-renders on frames
 * - Full support for prefers-reduced-motion
 */
export function Recovery() {
  const sectionRef = useRef(null);
  const wrapperRef = useRef(null);
  const trackRef = useRef(null);
  const thumbRef = useRef(null);

  const [currentIndex, setCurrentIndex] = useState(1);
  const totalCount = recoveryModalities.length; // 6 cards

  // Motion state tracking refs
  const currentXRef = useRef(0);
  const singleSetWidthRef = useRef(0);
  const currentIndexRef = useRef(1);

  // Interaction flags
  const isInViewportRef = useRef(false);
  const isHoveredRef = useRef(false);
  const isDraggingRef = useRef(false);
  const isDragCooldownRef = useRef(false);
  const isTrackpadActiveRef = useRef(false);
  const isTouchingRef = useRef(false);
  const prefersReducedMotionRef = useRef(false);

  // Drag state tracking ref
  const dragStateRef = useRef({
    startX: 0,
    startCurrentX: 0,
    hasDragged: false
  });

  // Touch state tracking ref
  const touchStateRef = useRef({
    startX: 0,
    startY: 0,
    startCurrentX: 0,
    isSwipingHorizontal: null,
    isTouching: false
  });

  // Wrap currentX within [0, singleSetWidth) seamlessly
  const wrapCurrentX = useCallback(() => {
    const w = singleSetWidthRef.current;
    if (w <= 0) return;

    while (currentXRef.current >= w) {
      currentXRef.current -= w;
      if (dragStateRef.current.isDragging) {
        dragStateRef.current.startCurrentX -= w;
      }
      if (touchStateRef.current.isTouching) {
        touchStateRef.current.startCurrentX -= w;
      }
    }

    while (currentXRef.current < 0) {
      currentXRef.current += w;
      if (dragStateRef.current.isDragging) {
        dragStateRef.current.startCurrentX += w;
      }
      if (touchStateRef.current.isTouching) {
        touchStateRef.current.startCurrentX += w;
      }
    }
  }, []);

  // Apply CSS transform to the track and update indicators
  const applyTransform = useCallback(() => {
    const track = trackRef.current;
    const w = singleSetWidthRef.current;
    if (!track || w <= 0) return;

    const curX = currentXRef.current;
    // Offset by singleSetWidth so Set 0 acts as buffer to the left
    const transformX = -(curX + w);
    track.style.transform = `translate3d(${transformX}px, 0, 0)`;

    // Update progress trackbar thumb (0% to 500% of thumb width)
    if (thumbRef.current) {
      const progress = (curX % w) / w;
      thumbRef.current.style.transform = `translateX(${progress * 500}%)`;
    }

    // Update active numeric counter (01 .. 06) only when card step transitions
    const cardStep = w / totalCount;
    const rawIndex = Math.floor((curX + cardStep * 0.4) / cardStep) % totalCount;
    const activeIndex = rawIndex + 1;
    if (activeIndex !== currentIndexRef.current) {
      currentIndexRef.current = activeIndex;
      setCurrentIndex(activeIndex);
    }
  }, [totalCount]);

  // Measure rendered set width dynamically from DOM
  const measureTrack = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const cards = track.querySelectorAll('.recovery-card');
    // Set 0 has cards 0..5, Set 1 has cards 6..11
    if (cards.length >= 7) {
      const firstLeft = cards[0].offsetLeft;
      const seventhLeft = cards[6].offsetLeft;
      const measured = seventhLeft - firstLeft;
      if (measured > 0) {
        singleSetWidthRef.current = measured;
        wrapCurrentX();
        applyTransform();
      }
    }
  }, [applyTransform, wrapCurrentX]);

  // Check prefers-reduced-motion
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    prefersReducedMotionRef.current = mql.matches;

    const onChange = (e) => {
      prefersReducedMotionRef.current = e.matches;
    };

    if (mql.addEventListener) {
      mql.addEventListener('change', onChange);
    } else {
      mql.addListener(onChange);
    }

    return () => {
      if (mql.removeEventListener) {
        mql.removeEventListener('change', onChange);
      } else {
        mql.removeListener(onChange);
      }
    };
  }, []);

  // Measurement and ResizeObserver
  useEffect(() => {
    measureTrack();

    const handleResize = () => measureTrack();
    window.addEventListener('resize', handleResize);

    // Re-check when fonts load in case dimensions shift
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(measureTrack);
    }

    let resizeObserver;
    if (typeof ResizeObserver !== 'undefined' && trackRef.current) {
      resizeObserver = new ResizeObserver(() => measureTrack());
      resizeObserver.observe(trackRef.current);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeObserver) resizeObserver.disconnect();
    };
  }, [measureTrack]);

  // Viewport intersection observer (only animate when in view)
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || typeof IntersectionObserver === 'undefined') {
      isInViewportRef.current = true;
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        isInViewportRef.current = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  // GSAP ScrollTrigger reveals for Section Header, Carousel Wrapper, and Trackbar
  useEffect(() => {
    if (!sectionRef.current) return;
    if (isReducedMotion()) return;

    const ctx = gsap.context(() => {
      const header = sectionRef.current.querySelector('.recovery-header');
      const wrapper = wrapperRef.current;
      const trackbar = sectionRef.current.querySelector('.recovery-trackbar-wrap');

      // 1. Recovery Header Progressive Reveal
      if (header) {
        const meta = header.querySelector('.recovery-header__meta');
        const title = header.querySelector('.recovery-header__title');
        const copy = header.querySelector('.recovery-header__copy');
        const counter = header.querySelector('.recovery-header__counter');

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: header,
            start: 'top 82%',
            once: true
          }
        });

        if (meta) {
          tl.from(meta, {
            opacity: 0,
            y: 15,
            duration: 0.6,
            ease: EASING.editorial
          });
        }

        if (title) {
          tl.from(
            title,
            {
              opacity: 0,
              y: 30,
              duration: 0.8,
              ease: EASING.editorial
            },
            '-=0.4'
          );
        }

        if (copy) {
          tl.from(
            copy,
            {
              opacity: 0,
              y: 20,
              duration: 0.7,
              ease: EASING.editorial
            },
            '-=0.5'
          );
        }

        if (counter) {
          tl.from(
            counter,
            {
              opacity: 0,
              y: 15,
              duration: 0.6,
              ease: EASING.editorial
            },
            '-=0.4'
          );
        }
      }

      // 2. Carousel Wrapper subtle entrance into view (vertical only; does not affect continuous horizontal rAF loop)
      if (wrapper) {
        gsap.from(wrapper, {
          opacity: 0,
          y: 25,
          duration: 0.85,
          ease: EASING.editorial,
          scrollTrigger: {
            trigger: wrapper,
            start: 'top 85%',
            once: true
          }
        });
      }

      // 3. Trackbar progressive reveal
      if (trackbar) {
        gsap.from(trackbar, {
          opacity: 0,
          y: 15,
          duration: 0.7,
          ease: EASING.editorial,
          scrollTrigger: {
            trigger: trackbar,
            start: 'top 92%',
            once: true
          }
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Continuous auto-scroll animation loop (36 px/s)
  useEffect(() => {
    let animId;
    let lastTime = performance.now();
    const SPEED = 36; // Constant slow, elegant horizontal movement

    const animate = (currentTime) => {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      const shouldMove =
        isInViewportRef.current &&
        !isHoveredRef.current &&
        !isDraggingRef.current &&
        !isDragCooldownRef.current &&
        !isTrackpadActiveRef.current &&
        !isTouchingRef.current &&
        !prefersReducedMotionRef.current;

      if (shouldMove && singleSetWidthRef.current > 0) {
        currentXRef.current += SPEED * dt;
        wrapCurrentX();
        applyTransform();
      }

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [applyTransform, wrapCurrentX]);

  // Hover Pause & Resume Listener (ensures robust pause across synthetic and native events)
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const onEnter = () => {
      isHoveredRef.current = true;
    };
    const onLeave = () => {
      isHoveredRef.current = false;
    };

    wrapper.addEventListener('mouseenter', onEnter);
    wrapper.addEventListener('mouseleave', onLeave);
    wrapper.addEventListener('pointerenter', onEnter);
    wrapper.addEventListener('pointerleave', onLeave);

    return () => {
      wrapper.removeEventListener('mouseenter', onEnter);
      wrapper.removeEventListener('mouseleave', onLeave);
      wrapper.removeEventListener('pointerenter', onEnter);
      wrapper.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  // Trackpad / Horizontal Wheel Listener
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    let wheelTimer;
    const handleWheel = (e) => {
      // If horizontal gesture is dominant:
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        if (e.cancelable) e.preventDefault();
        isTrackpadActiveRef.current = true;
        clearTimeout(wheelTimer);

        currentXRef.current += e.deltaX;
        wrapCurrentX();
        applyTransform();

        wheelTimer = setTimeout(() => {
          isTrackpadActiveRef.current = false;
        }, 350);
      }
      // If vertical gesture is dominant, do NOT preventDefault! Allow normal page scroll!
    };

    wrapper.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      wrapper.removeEventListener('wheel', handleWheel);
      clearTimeout(wheelTimer);
    };
  }, [applyTransform, wrapCurrentX]);

  // Mobile Touch Swiping Listener
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    let touchResumeTimer;

    const handleTouchStart = (e) => {
      if (e.touches.length !== 1) return;
      const touch = e.touches[0];
      touchStateRef.current = {
        startX: touch.clientX,
        startY: touch.clientY,
        startCurrentX: currentXRef.current,
        isSwipingHorizontal: null,
        isTouching: true
      };
      isTouchingRef.current = true;
      clearTimeout(touchResumeTimer);
    };

    const handleTouchMove = (e) => {
      if (!touchStateRef.current.isTouching || e.touches.length !== 1) return;
      const touch = e.touches[0];
      const dx = touch.clientX - touchStateRef.current.startX;
      const dy = touch.clientY - touchStateRef.current.startY;

      // Determine swipe direction intent
      if (touchStateRef.current.isSwipingHorizontal === null) {
        if (Math.abs(dx) > 7 || Math.abs(dy) > 7) {
          touchStateRef.current.isSwipingHorizontal = Math.abs(dx) > Math.abs(dy);
        }
      }

      if (touchStateRef.current.isSwipingHorizontal === true) {
        // Horizontal gesture: control carousel directly
        if (e.cancelable) e.preventDefault();
        currentXRef.current = touchStateRef.current.startCurrentX - dx;
        wrapCurrentX();
        applyTransform();
      }
      // If vertical gesture: allow native page scroll without calling preventDefault!
    };

    const handleTouchEnd = () => {
      if (!touchStateRef.current.isTouching) return;
      touchStateRef.current.isTouching = false;
      touchStateRef.current.isSwipingHorizontal = null;

      clearTimeout(touchResumeTimer);
      touchResumeTimer = setTimeout(() => {
        isTouchingRef.current = false;
      }, 400);
    };

    wrapper.addEventListener('touchstart', handleTouchStart, { passive: true });
    wrapper.addEventListener('touchmove', handleTouchMove, { passive: false });
    wrapper.addEventListener('touchend', handleTouchEnd, { passive: true });
    wrapper.addEventListener('touchcancel', handleTouchEnd, { passive: true });

    return () => {
      wrapper.removeEventListener('touchstart', handleTouchStart);
      wrapper.removeEventListener('touchmove', handleTouchMove);
      wrapper.removeEventListener('touchend', handleTouchEnd);
      wrapper.removeEventListener('touchcancel', handleTouchEnd);
      clearTimeout(touchResumeTimer);
    };
  }, [applyTransform, wrapCurrentX]);

  // Mouse Drag / Pointer Handlers
  const dragCooldownTimerRef = useRef(null);

  const handlePointerDown = (e) => {
    // Only primary left mouse button
    if (e.pointerType === 'mouse' && e.button !== 0) return;

    dragStateRef.current = {
      isDragging: true,
      startX: e.clientX,
      startCurrentX: currentXRef.current,
      hasDragged: false
    };
    isDraggingRef.current = true;
    clearTimeout(dragCooldownTimerRef.current);

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
  };

  const handlePointerMove = (e) => {
    if (!dragStateRef.current.isDragging) return;
    const dx = e.clientX - dragStateRef.current.startX;
    if (Math.abs(dx) > 3) {
      dragStateRef.current.hasDragged = true;
    }

    currentXRef.current = dragStateRef.current.startCurrentX - dx;
    wrapCurrentX();
    applyTransform();
  };

  const handlePointerUp = (e) => {
    if (!dragStateRef.current.isDragging) return;
    dragStateRef.current.isDragging = false;
    isDraggingRef.current = false;

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}

    // Resume auto-scroll smoothly after 400ms
    clearTimeout(dragCooldownTimerRef.current);
    isDragCooldownRef.current = true;
    dragCooldownTimerRef.current = setTimeout(() => {
      isDragCooldownRef.current = false;
    }, 400);
  };

  return (
    <section
      ref={sectionRef}
      className="recovery-section"
      id="recovery"
      aria-label="Recovery Therapies"
    >
      {/* Background Architectural Subtle Glows (Figma Nodes 1:5, 1:6) */}
      <div
        className="recovery-section__glow recovery-section__glow--top"
        aria-hidden="true"
      />
      <div
        className="recovery-section__glow recovery-section__glow--bottom"
        aria-hidden="true"
      />

      {/* Swiss Editorial Header with Live 01/06 Indicator */}
      <RecoveryHeader
        currentIndex={currentIndex}
        totalCount={totalCount}
      />

      {/* Seamless Infinite Carousel Viewport */}
      <div
        ref={wrapperRef}
        className="recovery-carousel-wrapper"
        onMouseEnter={() => {
          isHoveredRef.current = true;
        }}
        onMouseLeave={() => {
          isHoveredRef.current = false;
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        role="region"
        aria-roledescription="carousel"
        aria-label="Continuous recovery therapies conveyor"
      >
        <div ref={trackRef} className="recovery-carousel-track">
          {/* 4 Duplicated Sets (24 cards total) for true seamless infinite conveyor */}
          {[0, 1, 2, 3].map((setIndex) =>
            recoveryModalities.map((item) => (
              <RecoveryCard
                key={`${setIndex}-${item.id}`}
                {...item}
              />
            ))
          )}
        </div>
      </div>

      {/* Linear Progress Trackbar */}
      <RecoveryTrackbar thumbRef={thumbRef} />
    </section>
  );
}

export default Recovery;
