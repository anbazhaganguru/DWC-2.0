import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Helper to initialize reveal animations on scroll for generic elements.
 * @param {HTMLElement|string} target - Element or selector
 * @param {Object} options - Animation configuration options
 */
export function initScrollReveal(target, options = {}) {
  if (!target) return null;

  const {
    y = 40,
    duration = 1,
    ease = 'power3.out',
    start = 'top 85%',
    toggleActions = 'play none none reverse'
  } = options;

  return gsap.from(target, {
    y,
    opacity: 0,
    duration,
    ease,
    scrollTrigger: {
      trigger: target,
      start,
      toggleActions
    }
  });
}

/**
 * Refreshes all active GSAP ScrollTrigger instances.
 */
export function refreshScrollTriggers() {
  ScrollTrigger.refresh();
}
