import React from 'react';

/**
 * FounderWellness Component
 * Section 11: Wellness Training Disciplines
 * Strict adherence to source of truth:
 * - Trained in: Foot Reflexology, Taping Therapy, Cupping Therapy
 * - Clean numbered list, not three large cards
 * - No medical or licensing claims
 * - Minimal monochrome line icons
 */
export function FounderWellness() {
  const trainingItems = [
    {
      id: '01',
      name: 'FOOT REFLEXOLOGY',
      badge: 'REFLEX PROTOCOL',
      icon: (
        <svg viewBox="0 0 24 24" className="wellness-training-item__icon" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v10M7 12h10" />
        </svg>
      )
    },
    {
      id: '02',
      name: 'TAPING THERAPY',
      badge: 'KINESIOLOGY APPARATUS',
      icon: (
        <svg viewBox="0 0 24 24" className="wellness-training-item__icon" aria-hidden="true">
          <rect x="4" y="4" width="16" height="16" rx="1" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="12" y1="4" x2="12" y2="20" />
        </svg>
      )
    },
    {
      id: '03',
      name: 'CUPPING THERAPY',
      badge: 'MYOFASCIAL DECOMPRESSION',
      icon: (
        <svg viewBox="0 0 24 24" className="wellness-training-item__icon" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="4" />
        </svg>
      )
    }
  ];

  return (
    <div className="founder-wellness-zone" data-about-anim="fade-up">
      {/* Side Label Column */}
      <div className="founder-wellness__side-label">
        <div className="wellness-label-group">
          <span className="wellness-label-group__tag">BODYWORK &amp; RECOVERY</span>
          <h3 className="wellness-label-group__title">WELLNESS<br />TRAINING</h3>
        </div>
        <span className="founder-wellness__side-meta">PRACTICUM // 03 AREAS</span>
      </div>

      {/* Numbered Editorial List */}
      <div className="founder-wellness__content-col">
        {trainingItems.map((item) => (
          <div key={item.id} className="wellness-training-item">
            <div className="wellness-training-item__left">
              <span className="wellness-training-item__index">{item.id}</span>
              <h4 className="wellness-training-item__name">{item.name}</h4>
            </div>

            <div className="wellness-training-item__right">
              <span className="wellness-training-item__badge">{item.badge}</span>
              {item.icon}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FounderWellness;
