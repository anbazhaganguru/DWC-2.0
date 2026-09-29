import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Initializes GSAP ScrollTrigger sequence binding for the Hero canvas component.
 * Directly maps scroll progress to discrete frame index (0..15).
 * The chair follows the user's scroll directly with a tight, physical 0.25s scrub.
 * 
 * @param {Object} params
 * @param {HTMLElement} params.triggerRef - Element to pin
 * @param {number} [params.totalFrames=16] - Total number of sequence frames (16)
 * @param {Function} params.onUpdateFrame - Callback delivering discrete target frame index
 * @returns {ScrollTrigger|null} Active ScrollTrigger instance
 */
export function initHeroSequenceAnimation({
  triggerRef,
  totalFrames = 61,
  onUpdateFrame
}) {
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
    end: '+=180%',
    pin: true,
    scrub: 0.2,
    anticipatePin: 1,
    ease: 'none',
    onUpdate: (self) => {
      // Direct frame mapping without extra temporal smoothing lag:
      // framePosition = progress * (frameCount - 1)
      const progress = Math.min(Math.max(self.progress, 0), 1);
      const framePosition = progress * (totalFrames - 1);
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
