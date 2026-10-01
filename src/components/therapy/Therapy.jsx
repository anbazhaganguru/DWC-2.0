import React from 'react';
import TherapyTopBar from './TherapyTopBar';
import TherapyHeader from './TherapyHeader';
import TherapyApparatus from './TherapyApparatus';
import TherapyDirectoryHeader from './TherapyDirectoryHeader';
import TherapyCard from './TherapyCard';
import TherapyFooterBar from './TherapyFooterBar';
import '../../styles/therapy.css';

/**
 * Therapy Data Specification extracted directly from Figma Node 1:2
 * Asymmetric Editorial Sizing:
 * - Card 01: Reflexology (Large)
 * - Card 02: Taping Therapy (Small)
 * - Card 03: Ice Cupping Therapy (Small)
 * - Card 04: Steam Bath (Large / Dark)
 * - Card 05: Bamboo Therapy (Standard)
 * - Card 06: Cupping Therapy (Standard)
 */
const modalitiesData = [
  {
    id: '01',
    badge: 'NEURO-RESTORATIVE',
    title: 'REFLEXOLOGY',
    subtitle: '“Restore Balance. Relax Deeply. Feel Refreshed.”',
    image: '/images/therapy/modality_01_reflexology_original.png',
    imageTag: 'REFLEX STIMULATION // SOLE & ACUPOINTS',
    isDark: false,
    size: 'large'
  },
  {
    id: '02',
    badge: 'KINESIOLOGY',
    title: 'TAPING THERAPY',
    subtitle: '“Support Your Movement. Stay Active With Confidence.”',
    image: '/images/therapy/modality_02_taping_original.png',
    imageTag: 'MYOFASCIAL STABILITY PROTOCOL',
    isDark: false,
    size: 'small'
  },
  {
    id: '03',
    badge: 'CRYOTHERMIC',
    title: 'ICE CUPPING THERAPY',
    subtitle: '“Cryogenic Suction Modality”',
    image: '/images/therapy/modality_03_ice_cupping_original.png',
    imageTag: 'THERMAL GRADIENT // SUB-ZERO VACUUM',
    isDark: false,
    size: 'small'
  },
  {
    id: '04',
    badge: 'HYDRO-THERMAL',
    title: 'STEAM BATH',
    subtitle: '“Step Into Warmth. Leave Feeling Relaxed.”',
    image: '/images/therapy/modality_04_steam_bath_original.png',
    imageTag: 'ATMOSPHERIC MIST // ARCHITECTURAL CALM',
    isDark: true,
    size: 'large'
  },
  {
    id: '05',
    badge: 'ORGANIC TACTILE',
    title: 'BAMBOO THERAPY',
    subtitle: '“Experience the Natural Power of Bamboo. Deep Relaxation Starts Here.”',
    image: '/images/therapy/modality_05_bamboo_original.png',
    imageTag: 'WARM HOLLOW STALKS // DEEP TISSUE RELEASE',
    isDark: false,
    size: 'standard'
  },
  {
    id: '06',
    badge: 'DECOMPRESSION',
    title: 'CUPPING THERAPY',
    subtitle: '“Release Tension. Relax Your Body. Support Your Wellness.”',
    image: '/images/therapy/modality_06_cupping_original.png',
    imageTag: 'MYOFASCIAL DECOMPRESSION // SUCTION MATRIX',
    isDark: false,
    size: 'standard'
  }
];

/**
 * Main Therapy Component.
 * Pixel-accurate reproduction of Figma Frame Node 1:2 with asymmetric card sizing.
 */
export function Therapy() {
  // Left Column: 01 (Large), 03 (Small), 05 (Standard)
  const col1Data = [modalitiesData[0], modalitiesData[2], modalitiesData[4]];
  
  // Right Column: 02 (Small), 04 (Large), 06 (Standard)
  const col2Data = [modalitiesData[1], modalitiesData[3], modalitiesData[5]];

  return (
    <section className="therapy-section" id="therapy" aria-label="Clinical Therapy Services">
      <div className="therapy-container">
        {/* Sub-header Tracking Line */}
        <TherapyTopBar />

        {/* Main Header Zone */}
        <TherapyHeader />

        {/* Apparatus 01 Feature Section */}
        <TherapyApparatus />

        {/* Directory Header */}
        <TherapyDirectoryHeader />

        {/* 6 Modalities Asymmetric 2-Column Grid */}
        <div className="therapy-grid">
          {/* Column 1 (Left): 01 Large, 03 Small, 05 Standard */}
          <div className="therapy-grid__column therapy-grid__column--left">
            {col1Data.map((item) => (
              <TherapyCard key={item.id} {...item} />
            ))}
          </div>

          {/* Column 2 (Right): 02 Small, 04 Large, 06 Standard */}
          <div className="therapy-grid__column therapy-grid__column--right">
            {col2Data.map((item) => (
              <TherapyCard key={item.id} {...item} />
            ))}
          </div>
        </div>

        {/* Section Verification Footer */}
        <TherapyFooterBar />
      </div>
    </section>
  );
}

export default Therapy;

