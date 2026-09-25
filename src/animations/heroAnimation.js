import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Initializes GSAP ScrollTrigger sequence binding for the Hero canvas component.
 * Pins the hero section and maps scroll progress to discrete frame index (0..15).
 * 
 * @param {Object} params
 * @param {HTMLElement} params.triggerRef - Element to pin
 * @param {number} params.totalFrames - Total number of sequence frames (16)
 * @param {Function} params.onUpdateFrame - Callback delivering discrete target frame index
 * @returns {ScrollTrigger|null} Active ScrollTrigger instance
 */
export function initHeroSequenceAnimation({ triggerRef, totalFrames = 16, onUpdateFrame }) {
  if (!triggerRef || !onUpdateFrame) return null;

  // Respect prefers-reduced-motion accessibility rule
  const prefersReducedMotion = typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    onUpdateFrame(0);
    return null;
  }

  let lastIndex = -1;

  const trigger = ScrollTrigger.create({
    trigger: triggerRef,
    start: 'top top',
    end: '+=150%',
    pin: true,
    scrub: 0.7,
    anticipatePin: 1,
    onUpdate: (self) => {
      // Calculate discrete frame index based on scroll progress
      const framePosition = self.progress * (totalFrames - 1);
      const frameIndex = Math.min(
        Math.max(Math.round(framePosition), 0),
        totalFrames - 1
      );

      if (frameIndex !== lastIndex) {
        lastIndex = frameIndex;
        onUpdateFrame(frameIndex);
      }
    }
  });

  return trigger;
}

/**
 * Clean up ScrollTrigger instance on component unmount
 * @param {ScrollTrigger} scrollTriggerInstance 
 */
export function cleanupHeroAnimation(scrollTriggerInstance) {
  if (scrollTriggerInstance && typeof scrollTriggerInstance.kill === 'function') {
    scrollTriggerInstance.kill();
  }
}
