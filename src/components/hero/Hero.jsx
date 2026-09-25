import React, { useRef, useEffect } from 'react';
import HeroCanvas from './HeroCanvas';
import HeroContent from './HeroContent';
import { useHeroSequence } from '../../hooks/useHeroSequence';
import { initHeroSequenceAnimation, cleanupHeroAnimation } from '../../animations/heroAnimation';
import '../../styles/hero.css';

/**
 * Main Hero Component.
 * Orchestrates 360° scroll-controlled iROBO chair rotation by displaying single discrete PNG frames.
 */
export function Hero() {
  const heroRef = useRef(null);
  const canvasRef = useRef(null);
  const frameIndexRef = useRef(0);

  const {
    images,
    isLoaded
  } = useHeroSequence();

  useEffect(() => {
    if (!heroRef.current) return;

    // Initialize GSAP ScrollTrigger sequence animation
    const scrollTriggerInstance = initHeroSequenceAnimation({
      triggerRef: heroRef.current,
      totalFrames: 16,
      onUpdateFrame: (frameIndex) => {
        frameIndexRef.current = frameIndex;
      }
    });

    return () => {
      cleanupHeroAnimation(scrollTriggerInstance);
    };
  }, []);

  return (
    <section className="hero-section" id="hero" ref={heroRef}>
      <HeroCanvas 
        canvasRef={canvasRef} 
        images={images}
        frameIndexRef={frameIndexRef} 
        isLoaded={isLoaded} 
      />
      <HeroContent />
    </section>
  );
}

export default Hero;
