import React, { useEffect, useCallback } from 'react';

/**
 * HeroCanvas Component.
 * Renders exactly ONE discrete sequence PNG frame at a time on HTML5 Canvas without alpha blending or crossfade.
 */
export function HeroCanvas({ canvasRef, images, frameIndexRef, isLoaded }) {
  const drawCover = useCallback((ctx, img, width, height) => {
    if (!img || !img.complete || img.naturalWidth === 0) return;
    const imgWidth = img.naturalWidth;
    const imgHeight = img.naturalHeight;
    const imgRatio = imgWidth / imgHeight;
    const containerRatio = width / height;

    let drawW, drawH, drawX, drawY;

    if (containerRatio > imgRatio) {
      drawW = width;
      drawH = width / imgRatio;
      drawX = 0;
      drawY = (height - drawH) / 2;
    } else {
      drawH = height;
      drawW = height * imgRatio;
      drawX = (width - drawW) / 2;
      drawY = 0;
    }

    ctx.drawImage(img, drawX, drawY, drawW, drawH);
  }, []);

  const renderFrame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.parentElement ? canvas.parentElement.clientWidth : window.innerWidth;
    const height = canvas.parentElement ? canvas.parentElement.clientHeight : window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Update backing store resolution if resized
    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    }

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.globalAlpha = 1.0;

    const totalFrames = images.length || 16;
    const currentIndex = Math.min(
      Math.max(frameIndexRef.current || 0, 0),
      totalFrames - 1
    );

    const activeImg = images[currentIndex];

    // Render ONLY the single target frame
    if (activeImg && activeImg.complete && activeImg.naturalWidth > 0) {
      drawCover(ctx, activeImg, width, height);
    }

    ctx.restore();
  }, [canvasRef, images, frameIndexRef, drawCover]);

  useEffect(() => {
    let animationFrameId;

    const renderLoop = () => {
      renderFrame();
      animationFrameId = requestAnimationFrame(renderLoop);
    };

    animationFrameId = requestAnimationFrame(renderLoop);

    const handleResize = () => {
      requestAnimationFrame(renderFrame);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [renderFrame]);

  return (
    <canvas 
      ref={canvasRef} 
      className="hero-canvas"
    />
  );
}

export default HeroCanvas;
