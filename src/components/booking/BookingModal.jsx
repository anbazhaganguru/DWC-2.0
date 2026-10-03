import React, { useState, useEffect, useRef } from 'react';
import '../../styles/booking-modal.css';

// 1. All 6 Official DWC Therapies in Exact Required Order
const THERAPIES = [
  'Reflexology',
  'Taping Therapy',
  'Ice Cupping Therapy',
  'Steam Bath',
  'Cupping Therapy',
  'Bamboo Therapy'
];

// 2. Exact 16 15-minute Therapy Slots (6:00 PM to 9:45 PM)
const THERAPY_SLOTS = [
  '6:00 PM',
  '6:15 PM',
  '6:30 PM',
  '6:45 PM',
  '7:00 PM',
  '7:15 PM',
  '7:30 PM',
  '7:45 PM',
  '8:00 PM',
  '8:15 PM',
  '8:30 PM',
  '8:45 PM',
  '9:00 PM',
  '9:15 PM',
  '9:30 PM',
  '9:45 PM'
];

// 3. Official Existing Project Terminology for Massage / Recovery Treatments
const MASSAGE_TREATMENTS = [
  'Relaxation',
  'Recovery Support',
  'Body Comfort',
  'Overall Well-being',
  'Athletic Recovery & Muscle Repair',
  'Postural Realignment & Stress Relief',
  'Chronic Discomfort & Mobility Care'
];

// Helper to get formatted default date (YYYY-MM-DD)
const getTodayString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Format date for display (e.g. 22 Oct 2026)
const formatDateForDisplay = (dateStr) => {
  if (!dateStr) return 'Select a date';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  const d = new Date(year, month, day);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

/**
 * BookingModal Component (Daniel Wellness Center 2.0)
 * Redesigned clean, guided Swiss International Style reservation form.
 *
 * Requirements:
 * - Heading: "Reserve Your Session"
 * - Subtitle: "Select your preferred therapy modality, date, and appointment slot."
 * - Primary CTA: "Continue to WhatsApp"
 * - Compact segmented service selector (Therapy vs Massage/Treatment)
 * - Compact pill/grid selectors without excessive nested boxes or cards
 * - 10-digit Indian phone validation
 * - WhatsApp link generation to +91 7358313291
 */
export function BookingModal({
  isOpen,
  onClose,
  initialServiceType = 'therapy',
  initialService = ''
}) {
  const [serviceType, setServiceType] = useState(() => {
    if (initialService && MASSAGE_TREATMENTS.includes(initialService)) return 'treatment';
    return initialServiceType || 'therapy';
  });

  const [selectedTherapy, setSelectedTherapy] = useState(() => {
    return THERAPIES.includes(initialService) ? initialService : THERAPIES[0];
  });

  const [selectedTreatment, setSelectedTreatment] = useState(() => {
    return MASSAGE_TREATMENTS.includes(initialService) ? initialService : MASSAGE_TREATMENTS[0];
  });

  const [selectedDate, setSelectedDate] = useState(getTodayString);
  const [selectedTherapySlot, setSelectedTherapySlot] = useState(THERAPY_SLOTS[0]);
  const [treatmentTime, setTreatmentTime] = useState('');

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [errors, setErrors] = useState({});

  const modalRef = useRef(null);
  const firstFocusableRef = useRef(null);

  // Keyboard escape listener and body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Auto-focus the close button or first element
    setTimeout(() => {
      if (firstFocusableRef.current) {
        firstFocusableRef.current.focus();
      }
    }, 50);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Phone number sanitizer - accepts 10 digits
  const handlePhoneChange = (e) => {
    const rawVal = e.target.value;
    const digitsOnly = rawVal.replace(/\D/g, '').slice(0, 10);
    setCustomerPhone(digitsOnly);
    if (errors.phone) {
      setErrors((prev) => ({ ...prev, phone: undefined }));
    }
  };

  const handleNameChange = (e) => {
    setCustomerName(e.target.value);
    if (errors.name) {
      setErrors((prev) => ({ ...prev, name: undefined }));
    }
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    if (errors.date) {
      setErrors((prev) => ({ ...prev, date: undefined }));
    }
  };

  const handleTreatmentTimeChange = (e) => {
    setTreatmentTime(e.target.value);
    if (errors.treatmentTime) {
      setErrors((prev) => ({ ...prev, treatmentTime: undefined }));
    }
  };

  // Form Validation
  const validateForm = () => {
    const newErrors = {};

    if (!customerName.trim()) {
      newErrors.name = 'Please enter your full name.';
    }

    const cleanPhone = customerPhone.replace(/\D/g, '');
    if (!cleanPhone) {
      newErrors.phone = 'Please enter your 10-digit mobile number.';
    } else if (cleanPhone.length !== 10 || !/^[6-9]\d{9}$/.test(cleanPhone)) {
      newErrors.phone = 'Please enter a valid 10-digit Indian mobile number.';
    }

    if (!selectedDate) {
      newErrors.date = 'Please select an appointment date.';
    }

    if (serviceType === 'treatment' && !treatmentTime.trim()) {
      newErrors.treatmentTime = 'Please enter your preferred daytime hour.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    const cleanPhone = customerPhone.replace(/\D/g, '');
    const formattedDate = formatDateForDisplay(selectedDate);

    let message = '';

    if (serviceType === 'therapy') {
      message = `Hello Daniel Wellness Center,\n\nI would like to enquire about booking an appointment.\n\nName: ${customerName.trim()}\nPhone: +91 ${cleanPhone}\n\nService: ${selectedTherapy}\nDate: ${formattedDate}\nPreferred Time: ${selectedTherapySlot}\n\nSession Duration: 15 minutes\n\nPlease confirm the availability and appointment details.\n\nThank you.`;
    } else {
      message = `Hello Daniel Wellness Center,\n\nI would like to enquire about booking an appointment.\n\nName: ${customerName.trim()}\nPhone: +91 ${cleanPhone}\n\nService: ${selectedTreatment}\nDate: ${formattedDate}\nPreferred Time: ${treatmentTime.trim()}\n\nPlease confirm the availability and appointment details.\n\nThank you.`;
    }

    const whatsappUrl = `https://wa.me/917358313291?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const currentServiceName = serviceType === 'therapy' ? selectedTherapy : selectedTreatment;
  const currentTimeName =
    serviceType === 'therapy' ? selectedTherapySlot : treatmentTime.trim() || 'Daytime flexible';

  return (
    <div
      className="dwc-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="presentation"
    >
      <div
        ref={modalRef}
        className="dwc-booking-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dwc-booking-modal-title"
      >
        {/* =========================================================
            1. MODAL HEADER: Swiss Minimalist Bar
            ========================================================= */}
        <div className="dwc-modal-header">
          <div className="dwc-modal-header__info">
            <div className="dwc-modal-header__eyebrow-wrap">
              <span className="dwc-modal-header__accent" aria-hidden="true" />
              <span className="dwc-modal-header__eyebrow">DANIEL WELLNESS CENTER / RESERVATION</span>
            </div>
            <h2 id="dwc-booking-modal-title" className="dwc-modal-header__title">
              Reserve Your Session
            </h2>
            <p className="dwc-modal-header__subtitle">
              Select your preferred therapy modality, date, and appointment slot.
            </p>
          </div>

          <button
            ref={firstFocusableRef}
            type="button"
            className="dwc-modal-close-btn"
            onClick={onClose}
            aria-label="Close booking modal"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* =========================================================
            2. GUIDED FORM BODY
            ========================================================= */}
        <form onSubmit={handleSubmit} className="dwc-modal-form" noValidate>
          <div className="dwc-modal-scroll-area">
            {/* STEP 1: CHOOSE A SERVICE CATEGORY */}
            <div className="dwc-form-step">
              <label className="dwc-step-label">
                <span className="dwc-step-num">01</span>
                <span>Choose a Service</span>
              </label>

              {/* Segmented Control */}
              <div className="dwc-segmented-control" role="tablist" aria-label="Service Category">
                <button
                  type="button"
                  role="tab"
                  aria-selected={serviceType === 'therapy'}
                  className={`dwc-segment-tab ${serviceType === 'therapy' ? 'dwc-segment-tab--active' : ''}`}
                  onClick={() => setServiceType('therapy')}
                >
                  <span className="dwc-segment-tab__title">Therapy (15 Min)</span>
                  <span className="dwc-segment-tab__meta">6:00 PM – 9:45 PM</span>
                </button>

                <button
                  type="button"
                  role="tab"
                  aria-selected={serviceType === 'treatment'}
                  className={`dwc-segment-tab ${serviceType === 'treatment' ? 'dwc-segment-tab--active' : ''}`}
                  onClick={() => setServiceType('treatment')}
                >
                  <span className="dwc-segment-tab__title">Massage / Treatment (Day)</span>
                  <span className="dwc-segment-tab__meta">Daytime Flexible</span>
                </button>
              </div>
            </div>

            {/* STEP 2: CHOOSE A THERAPY OR TREATMENT */}
            <div className="dwc-form-step">
              <label className="dwc-step-label">
                <span className="dwc-step-num">02</span>
                <span>
                  {serviceType === 'therapy' ? 'Select Therapy' : 'Select Treatment'}
                </span>
              </label>

              {serviceType === 'therapy' ? (
                <div className="dwc-pill-grid" role="radiogroup" aria-label="Therapy Options">
                  {THERAPIES.map((item) => {
                    const isSelected = selectedTherapy === item;
                    return (
                      <button
                        key={item}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        className={`dwc-pill-btn ${isSelected ? 'dwc-pill-btn--active' : ''}`}
                        onClick={() => setSelectedTherapy(item)}
                      >
                        {isSelected && <span className="dwc-pill-dot" aria-hidden="true" />}
                        <span className="dwc-pill-text">{item}</span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="dwc-pill-grid dwc-pill-grid--treatments" role="radiogroup" aria-label="Treatment Options">
                  {MASSAGE_TREATMENTS.map((item) => {
                    const isSelected = selectedTreatment === item;
                    return (
                      <button
                        key={item}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        className={`dwc-pill-btn ${isSelected ? 'dwc-pill-btn--active' : ''}`}
                        onClick={() => setSelectedTreatment(item)}
                      >
                        {isSelected && <span className="dwc-pill-dot" aria-hidden="true" />}
                        <span className="dwc-pill-text">{item}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* STEP 3 & 4: DATE AND TIME SELECTION */}
            <div className="dwc-form-row dwc-form-row--datetime">
              {/* STEP 3: DATE */}
              <div className="dwc-form-step dwc-form-col">
                <label htmlFor="dwc-date-input" className="dwc-step-label">
                  <span className="dwc-step-num">03</span>
                  <span>Select a Date</span>
                </label>
                <div className="dwc-input-wrap">
                  <input
                    id="dwc-date-input"
                    type="date"
                    min={getTodayString()}
                    value={selectedDate}
                    onChange={handleDateChange}
                    className={`dwc-input dwc-input--date ${errors.date ? 'dwc-input--error' : ''}`}
                    required
                  />
                </div>
                {errors.date && <p className="dwc-field-error">{errors.date}</p>}
              </div>

              {/* STEP 4: TIME */}
              <div className="dwc-form-step dwc-form-col dwc-form-col--time">
                <label className="dwc-step-label">
                  <span className="dwc-step-num">04</span>
                  <span>
                    {serviceType === 'therapy' ? 'Select Appointment Time' : 'Preferred Daytime Hour'}
                  </span>
                </label>

                {serviceType === 'therapy' ? (
                  <div className="dwc-time-grid" role="radiogroup" aria-label="15-Minute Slots">
                    {THERAPY_SLOTS.map((slot) => {
                      const isSelected = selectedTherapySlot === slot;
                      return (
                        <button
                          key={slot}
                          type="button"
                          role="radio"
                          aria-checked={isSelected}
                          className={`dwc-time-chip ${isSelected ? 'dwc-time-chip--active' : ''}`}
                          onClick={() => setSelectedTherapySlot(slot)}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="dwc-treatment-time-block">
                    <input
                      id="dwc-treatment-time"
                      type="text"
                      value={treatmentTime}
                      onChange={handleTreatmentTimeChange}
                      placeholder="e.g. 11:30 AM, 3:00 PM, or Morning"
                      className={`dwc-input ${errors.treatmentTime ? 'dwc-input--error' : ''}`}
                    />
                    <p className="dwc-input-hint">
                      Daytime recovery care is scheduled flexibly with our therapist.
                    </p>
                    {errors.treatmentTime && (
                      <p className="dwc-field-error">{errors.treatmentTime}</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* CLIENT DETAILS */}
            <div className="dwc-form-step dwc-form-step--details">
              <label className="dwc-step-label">
                <span className="dwc-step-num">05</span>
                <span>Client Information</span>
              </label>

              <div className="dwc-form-row dwc-form-row--client">
                {/* Full Name */}
                <div className="dwc-form-field">
                  <label htmlFor="dwc-client-name" className="dwc-field-label">
                    FULL NAME <span className="dwc-required-mark">*</span>
                  </label>
                  <input
                    id="dwc-client-name"
                    type="text"
                    value={customerName}
                    onChange={handleNameChange}
                    placeholder="e.g. Eleanor Vance"
                    autoComplete="name"
                    className={`dwc-input ${errors.name ? 'dwc-input--error' : ''}`}
                    required
                  />
                  {errors.name && <p className="dwc-field-error">{errors.name}</p>}
                </div>

                {/* Mobile Number */}
                <div className="dwc-form-field">
                  <label htmlFor="dwc-client-phone" className="dwc-field-label">
                    MOBILE NUMBER <span className="dwc-required-mark">*</span>
                  </label>
                  <div className={`dwc-phone-wrap ${errors.phone ? 'dwc-phone-wrap--error' : ''}`}>
                    <span className="dwc-phone-code" aria-label="Country Code India">+91</span>
                    <input
                      id="dwc-client-phone"
                      type="tel"
                      value={customerPhone}
                      onChange={handlePhoneChange}
                      placeholder="10-digit number"
                      maxLength={10}
                      autoComplete="tel-national"
                      className="dwc-input dwc-input--phone"
                      required
                    />
                  </div>
                  {errors.phone ? (
                    <p className="dwc-field-error">{errors.phone}</p>
                  ) : (
                    <p className="dwc-input-hint">10-digit Indian mobile number</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* =========================================================
              3. MODAL FOOTER & PRIMARY ACTION
              ========================================================= */}
          <div className="dwc-modal-footer">
            {/* Live Itinerary Summary Strip */}
            <div className="dwc-modal-summary-strip">
              <span className="dwc-summary-dot" aria-hidden="true" />
              <span className="dwc-summary-text">
                <strong>{currentServiceName}</strong> &middot; {formatDateForDisplay(selectedDate)} &middot; {currentTimeName}
              </span>
            </div>

            {/* Single Primary Action Button */}
            <button
              type="submit"
              className="dwc-modal-submit-btn"
              aria-label="Continue to WhatsApp to confirm your session"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="dwc-submit-icon"
                aria-hidden="true"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span>Continue to WhatsApp</span>
              <svg
                width="15"
                height="15"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="dwc-submit-arrow"
                aria-hidden="true"
              >
                <path
                  d="M9 3L14 8M14 8L9 13M14 8H2"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="square"
                  strokeLinejoin="miter"
                />
              </svg>
            </button>

            <p className="dwc-modal-footnote">
              Concierge direct via WhatsApp (+91 7358313291) &middot; No advance payment required online
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BookingModal;
