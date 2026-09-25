/**
 * Hero section frame image sequence configuration.
 * Desktop and mobile sequences remain strictly separated.
 */

export const desktopFrames = Array.from({ length: 16 }, (_, index) => {
  const frameNumber = String(index + 1).padStart(2, '0');
  return `/images/cinematic/hero/desktop/desktop_frame_${frameNumber}.png`;
});

export const mobileFrames = Array.from({ length: 16 }, (_, index) => {
  const frameNumber = String(index + 1).padStart(2, '0');
  return `/images/cinematic/hero/mobile/mobile_frame_${frameNumber}.png`;
});
