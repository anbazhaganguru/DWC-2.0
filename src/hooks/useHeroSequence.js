import { useState, useEffect } from 'react';
import { desktopFrames, mobileFrames } from '../config/heroFrames';
import { useMediaQuery } from './useMediaQuery';

/**
 * Custom hook to manage preloading and active frame sequence for the Hero canvas.
 * Preloads and caches image objects, separating desktop and mobile frame sets.
 */
export function useHeroSequence() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [images, setImages] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const activeFramePaths = isMobile ? mobileFrames : desktopFrames;

  useEffect(() => {
    let isMounted = true;
    setIsLoaded(false);

    const imageCache = [];
    let loadedCount = 0;
    const totalFrames = activeFramePaths.length;

    activeFramePaths.forEach((src, index) => {
      const img = new Image();
      img.src = src;
      
      const checkCompletion = () => {
        if (!isMounted) return;
        loadedCount += 1;
        if (loadedCount === totalFrames) {
          setIsLoaded(true);
        }
      };

      if (img.complete) {
        checkCompletion();
      } else {
        img.onload = checkCompletion;
        img.onerror = checkCompletion;
      }

      imageCache[index] = img;
    });

    setImages(imageCache);

    return () => {
      isMounted = false;
    };
  }, [isMobile]);

  return {
    isMobile,
    activeFramePaths,
    images,
    isLoaded,
    currentIndex,
    setCurrentIndex
  };
}

export default useHeroSequence;
