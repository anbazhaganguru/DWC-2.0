import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Editorial Animation Easings
 */
export const EASING = {
  editorial: 'power3.out',
  slow: 'power4.out',
  cinematic: 'expo.out',
  linear: 'none'
};

/**
 * Checks if the user prefers reduced motion
 * @returns {boolean}
 */
export function isReducedMotion() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Helper to initialize reveal animations on scroll for generic elements.
 * @param {HTMLElement|string} target - Element or selector
 * @param {Object} options - Animation configuration options
 */
export function initScrollReveal(target, options = {}) {
  if (!target || isReducedMotion()) return null;

  const {
    y = 30,
    opacity = 0,
    duration = 0.8,
    ease = EASING.editorial,
    start = 'top 85%',
    toggleActions = 'play none none reverse',
    stagger = 0.08
  } = options;

  return gsap.from(target, {
    y,
    opacity,
    duration,
    stagger,
    ease,
    scrollTrigger: {
      trigger: target,
      start,
      toggleActions
    }
  });
}

/**
 * Safe, debounced refresh of all active GSAP ScrollTrigger instances.
 */
let refreshTimer = null;
export function refreshScrollTriggers(delay = 100) {
  if (typeof window === 'undefined') return;
  clearTimeout(refreshTimer);
  refreshTimer = setTimeout(() => {
    ScrollTrigger.refresh();
  }, delay);
}
