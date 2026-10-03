import React from 'react';

/**
 * ServiceExperience Component
 * Section D: What to Expect During Your Session
 * Editorial timeline visualizing the structured session progression
 */
export function ServiceExperience({ service }) {
  if (!service || !service.sessionExpectations?.length) return null;

  return (
    <section className="service-experience" aria-labelledby="experience-heading">
      <div className="service-experience__container">
        {/* Section Header */}
        <div className="service-section-header">
          <div className="service-section-header__tag-row">
            <span className="service-section-header__tag">SESSION PROGRESSION // SECTION 04</span>
            <span className="service-section-header__system">CLINICAL DISCIPLINE</span>
          </div>
          <h2 id="experience-heading" className="service-section-header__title">
            WHAT TO EXPECT DURING YOUR SESSION
          </h2>
        </div>

        {/* Timeline Sequence */}
        <div className="service-experience__timeline">
          {service.sessionExpectations.map((stepItem, index) => (
            <div key={index} className="service-experience__step">
              <div className="service-experience__step-header">
                <span className="service-experience__step-num">{stepItem.step}</span>
                <span className="service-experience__step-dash" aria-hidden="true" />
                <h3 className="service-experience__step-title">{stepItem.title}</h3>
              </div>
              <p className="service-experience__step-desc">
                {stepItem.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ServiceExperience;
