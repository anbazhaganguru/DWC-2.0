import React from 'react';

/**
 * Minimal monochrome line icons for Swiss editorial badges
 * Clean geometric lines, stroke-width 1.5 - 1.75
 */
export function ServiceIcon({ type, className = '', size = 28 }) {
  const commonProps = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '1.5',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    className: `service-badge-icon ${className}`
  };

  switch (type) {
    case 'reflexology':
      // Foot & pressure-point precision symbol
      return (
        <svg {...commonProps} aria-label="Reflexology Acupoint Symbol">
          <path d="M7 19.5C5.5 18 4.5 15.5 4.5 13C4.5 9 6.5 5 9 3.5C11 2.5 13 3 13.5 4.5C14 6 13 8 13.5 10C14 12 16 13 16 16C16 18.5 14 21 11.5 21.5C9.5 22 8 20.5 7 19.5Z" />
          <circle cx="9" cy="8" r="1" fill="currentColor" />
          <circle cx="10" cy="12" r="1" fill="currentColor" />
          <circle cx="11.5" cy="16" r="1" fill="currentColor" />
        </svg>
      );

    case 'taping':
      // Kinesiology tape / dynamic movement contour symbol
      return (
        <svg {...commonProps} aria-label="Therapeutic Taping Movement Symbol">
          <path d="M4 17C7 17 9 13 12 13C15 13 17 17 20 17" />
          <path d="M4 11C7 11 9 7 12 7C15 7 17 11 20 11" />
          <path d="M4 7L20 17" strokeDasharray="2 2" opacity="0.6" />
        </svg>
      );

    case 'ice-bath':
      // Cold crystal / geometric thermal symbol
      return (
        <svg {...commonProps} aria-label="Cryothermic Cold Symbol">
          <path d="M12 2V22" />
          <path d="M2 12H22" />
          <path d="M4.93 4.93L19.07 19.07" />
          <path d="M19.07 4.93L4.93 19.07" />
          <circle cx="12" cy="12" r="2.5" />
        </svg>
      );

    case 'steam-bath':
      // Thermal vapor & ambient rising heat mist
      return (
        <svg {...commonProps} aria-label="Hydro-thermal Steam Symbol">
          <path d="M6 19C5.5 17 6.5 15 7.5 13C8.5 11 8.5 9 7.5 7C7 6 6.5 5 6.5 4" />
          <path d="M12 20C11.5 18 12.5 16 13.5 14C14.5 12 14.5 10 13.5 8C13 7 12.5 6 12.5 5" />
          <path d="M18 19C17.5 17 18.5 15 19.5 13C20.5 11 20.5 9 19.5 7C19 6 18.5 5 18.5 4" />
        </svg>
      );

    case 'cupping':
      // Decompression cup & concentric suction rings
      return (
        <svg {...commonProps} aria-label="Decompression Cupping Symbol">
          <path d="M7 20C7 14 7 8 12 8C17 8 17 14 17 20" />
          <ellipse cx="12" cy="20" rx="5" ry="1.5" />
          <path d="M10 8C10 5.5 11 4 12 4C13 4 14 5.5 14 8" />
          <circle cx="12" cy="14" r="1.5" fill="currentColor" />
        </svg>
      );

    case 'bamboo':
      // Natural organic bamboo stalk segments & nodes
      return (
        <svg {...commonProps} aria-label="Natural Bamboo Stalk Symbol">
          <rect x="7" y="3" width="10" height="18" rx="1" />
          <line x1="6" y1="9" x2="18" y2="9" strokeWidth="2" />
          <line x1="6" y1="15" x2="18" y2="15" strokeWidth="2" />
          <line x1="12" y1="3" x2="12" y2="21" strokeDasharray="1 3" opacity="0.5" />
        </svg>
      );

    case 'chair':
      // High-fidelity robotic zero-gravity ergonomic suite
      return (
        <svg {...commonProps} aria-label="iROBO Robotic Massage Suite Symbol">
          <path d="M5 16L9 16L12 19L18 19" />
          <path d="M7 16L7 8C7 5.79 8.79 4 11 4L13 4C14.1 4 15 4.9 15 6L15 13L18 16" />
          <circle cx="11" cy="7" r="1" fill="currentColor" />
          <line x1="4" y1="21" x2="20" y2="21" strokeWidth="1.5" />
        </svg>
      );

    default:
      return (
        <svg {...commonProps} aria-label="Wellness Modality Symbol">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7V17" />
          <path d="M7 12H17" />
        </svg>
      );
  }
}

export default ServiceIcon;
