/**
 * Hero section frame image sequence configuration.
 * Desktop and mobile sequences remain strictly separated.
 */

export const desktopFrames = Array.from({ length: 61 }, (_, index) => {
  const frameNumber = String(index + 1).padStart(3, '0');
  return `${import.meta.env.BASE_URL}images/cinematic/hero/interpolated/desktop/frame_${frameNumber}.png`;
});

export const mobileFrames = Array.from({ length: 61 }, (_, index) => {
  const frameNumber = String(index + 1).padStart(3, '0');
  return `${import.meta.env.BASE_URL}images/cinematic/hero/interpolated/mobile/frame_${frameNumber}.png`;
});
