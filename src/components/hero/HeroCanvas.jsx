import React, { useEffect, useCallback, useRef } from 'react';

/**
 * HeroCanvas Component.
 * Directly renders exactly ONE discrete sequence PNG frame at a time on HTML5 Canvas.
 * No alpha blending, no crossfade, no temporal smoothing delay.
 */
export function HeroCanvas({ canvasRef, images, frameIndexRef, isLoaded }) {
  const lastRenderedIndexRef = useRef(-1);
  const needsRedrawRef = useRef(true);

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

  const renderFrame = useCallback((frameIndex) => {
    const canvas = canvasRef.current;
    if (!canvas) return false;

    const ctx = canvas.getContext('2d');
    if (!ctx) return false;

    const totalFrames = images.length || 61;
    const safeIndex = Math.min(Math.max(frameIndex, 0), totalFrames - 1);
    let activeImg = images[safeIndex];

    // Ensure image is ready and valid before drawing.
    // If the exact frame is still downloading, fall back to the nearest loaded frame
    // so the canvas animation never stalls or freezes mid-rotation.
    if (!activeImg || !activeImg.complete || activeImg.naturalWidth === 0) {
      let fallbackImg = null;
      for (let offset = 1; offset < totalFrames; offset++) {
        const prev = safeIndex - offset;
        if (prev >= 0 && images[prev]?.complete && images[prev]?.naturalWidth > 0) {
          fallbackImg = images[prev];
          break;
        }
        const next = safeIndex + offset;
        if (next < totalFrames && images[next]?.complete && images[next]?.naturalWidth > 0) {
          fallbackImg = images[next];
          break;
        }
      }
      if (!fallbackImg) return false;
      activeImg = fallbackImg;
    }

    const width = canvas.parentElement ? canvas.parentElement.clientWidth : window.innerWidth;
    const height = canvas.parentElement ? canvas.parentElement.clientHeight : window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const targetWidth = Math.round(width * dpr);
    const targetHeight = Math.round(height * dpr);

    // Update backing store resolution if resized
    if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
      canvas.width = targetWidth;
      canvas.height = targetHeight;
    }

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.globalAlpha = 1.0;

    // Render ONLY the single active frame - no duplicate frames, no ghosting
    drawCover(ctx, activeImg, width, height);

    ctx.restore();
    return true;
  }, [canvasRef, images, drawCover]);

  // Request redraw when image set updates or loading finishes
  useEffect(() => {
    needsRedrawRef.current = true;
    lastRenderedIndexRef.current = -1;
  }, [images, isLoaded]);

  useEffect(() => {
    let animationFrameId;

    const renderLoop = () => {
      const totalFrames = images.length || 61;
      const targetIndex = typeof frameIndexRef.current === 'number'
        ? Math.min(Math.max(frameIndexRef.current, 0), totalFrames - 1)
        : 0;

      // Direct frame response: only redraw when the discrete frame index changes or redraw is flagged
      if (targetIndex !== lastRenderedIndexRef.current || needsRedrawRef.current) {
        const drawn = renderFrame(targetIndex);
        if (drawn) {
          lastRenderedIndexRef.current = targetIndex;
          needsRedrawRef.current = false;
        }
      }

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    animationFrameId = requestAnimationFrame(renderLoop);

    const handleResize = () => {
      needsRedrawRef.current = true;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [images, frameIndexRef, renderFrame]);

  return (
    <canvas 
      ref={canvasRef} 
      className="hero-canvas"
    />
  );
}

export default HeroCanvas;
