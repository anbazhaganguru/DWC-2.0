const fs = require('fs');
const path = require('path');

console.log('=== Running Static Verification of CTA, Footer, and BookingModal ===\n');

let pass = 0;
let fail = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`[PASS] ${message}`);
    pass++;
  } else {
    console.error(`[FAIL] ${message}`);
    fail++;
  }
}

// 1. Verify CTA.jsx
const ctaPath = path.join(__dirname, '..', 'src', 'components', 'cta', 'CTA.jsx');
assert(fs.existsSync(ctaPath), 'CTA.jsx exists');
const ctaContent = fs.readFileSync(ctaPath, 'utf8');

assert(ctaContent.includes('id="cta"'), 'CTA has id="cta"');
assert(ctaContent.includes('DANIEL WELLNESS CENTER / CONTACT'), 'CTA has exact eyebrow');
assert(ctaContent.includes('Begin Your'), 'CTA has heading start');
assert(ctaContent.includes('Recovery Journey'), 'CTA has heading end');
assert(ctaContent.includes('Every individual has different needs, which is why we encourage a personalized approach when choosing a wellness experience.'), 'CTA has verified philosophy quote');
assert(ctaContent.includes('At Daniel Wellness Center, our services are designed around relaxation, recovery support, body comfort, and overall well-being.'), 'CTA has verified description');
assert(ctaContent.includes('Daniel Wellness Center') && ctaContent.includes('5th Avenue, Banu Nagar, Ambattur, Chennai'), 'CTA has verified address');
assert(ctaContent.includes('href="tel:7358313291"') && ctaContent.includes('7358313291'), 'CTA has verified phone tel: link');
assert(ctaContent.includes('href="mailto:aswinkumar8949@gmail.com"') && ctaContent.includes('aswinkumar8949@gmail.com'), 'CTA has verified email mailto: link');
assert(ctaContent.includes('https://instagram.com/aswin_reflexologist') && ctaContent.includes('@aswin_reflexologist'), 'CTA has verified Instagram link');
assert(ctaContent.includes('APPOINTMENTS &amp; ENQUIRIES') || ctaContent.includes('APPOINTMENTS & ENQUIRIES'), 'CTA has appointments badge');
assert(ctaContent.includes('Book an Appointment'), 'CTA has card title');
assert(ctaContent.includes('Reserve your calibrated evening therapy session or daytime recovery treatment with our concierge.'), 'CTA has card subtitle');
assert(ctaContent.includes('6 Core Therapies'), 'CTA has 6 Core Therapies option');
assert(ctaContent.includes('Reflexology, Taping Therapy, Ice Cupping Therapy, Steam Bath, Cupping Therapy, and Bamboo Therapy.'), 'CTA has therapies description');
assert(ctaContent.includes('Massage &amp; Recovery Treatments') || ctaContent.includes('Massage & Recovery Treatments'), 'CTA has massage treatments option');
assert(ctaContent.includes('Relaxation, Recovery Support, Body Comfort, Postural Care, and Mobility Care available throughout the day.'), 'CTA has recovery description');
assert(ctaContent.includes('BOOK AN APPOINTMENT'), 'CTA has BOOK AN APPOINTMENT button');
assert(ctaContent.includes('+91 7358313291'), 'CTA has WhatsApp phone note');

// 2. Verify Footer.jsx
const footerPath = path.join(__dirname, '..', 'src', 'components', 'footer', 'Footer.jsx');
assert(fs.existsSync(footerPath), 'Footer.jsx exists');
const footerContent = fs.readFileSync(footerPath, 'utf8');

assert(footerContent.includes('id="footer"'), 'Footer has id="footer"');
assert(footerContent.includes('DANIEL WELLNESS CENTER'), 'Footer has brand name');
assert(footerContent.includes('SANCTUARY OF RESTORATION'), 'Footer has tagline');
assert(footerContent.includes('Holistic wellness experiences designed around relaxation, recovery support, body comfort, and personalized care.'), 'Footer has brand philosophy description');
assert(footerContent.includes('SANCTUARY OF WELL-BEING'), 'Footer has brand pill text');
assert(footerContent.includes('href="#hero"'), 'Footer links Home to #hero');
assert(footerContent.includes('href="#about"'), 'Footer links About to #about');
assert(footerContent.includes('href="#therapy"'), 'Footer links Therapy to #therapy');
assert(footerContent.includes('href="#recovery"'), 'Footer links Recovery to #recovery');
assert(footerContent.includes('href="#cta"'), 'Footer links Contact to #cta');
assert(footerContent.includes('BOOK AN APPOINTMENT'), 'Footer has BOOK AN APPOINTMENT triggers');
assert(footerContent.includes('tel:7358313291'), 'Footer has phone link');
assert(footerContent.includes('mailto:aswinkumar8949@gmail.com'), 'Footer has email link');
assert(footerContent.includes('https://instagram.com/aswin_reflexologist'), 'Footer has Instagram link');
assert(footerContent.includes('A Sanctuary for Natural Healing &amp; Restoration') || footerContent.includes('A Sanctuary for Natural Healing & Restoration'), 'Footer has signoff');
assert(footerContent.includes('All rights reserved.'), 'Footer has copyright');

// 3. Verify BookingModal.jsx
const modalPath = path.join(__dirname, '..', 'src', 'components', 'booking', 'BookingModal.jsx');
assert(fs.existsSync(modalPath), 'BookingModal.jsx exists');
const modalContent = fs.readFileSync(modalPath, 'utf8');

const therapies = [
  'Reflexology',
  'Taping Therapy',
  'Ice Cupping Therapy',
  'Steam Bath',
  'Cupping Therapy',
  'Bamboo Therapy'
];
therapies.forEach((t) => {
  assert(modalContent.includes(`'${t}'`), `BookingModal contains therapy: ${t}`);
});

const slots = ['6:00 PM', '6:15 PM', '6:30 PM', '6:45 PM', '7:00 PM', '7:15 PM', '7:30 PM', '7:45 PM', '8:00 PM', '8:15 PM', '8:30 PM', '8:45 PM', '9:00 PM', '9:15 PM', '9:30 PM', '9:45 PM'];
assert(slots.every((s) => modalContent.includes(`'${s}'`)), 'BookingModal contains all 16 15-minute therapy slots');

const treatments = [
  'Relaxation',
  'Recovery Support',
  'Body Comfort',
  'Overall Well-being',
  'Athletic Recovery & Muscle Repair',
  'Postural Realignment & Stress Relief',
  'Chronic Discomfort & Mobility Care'
];
treatments.forEach((tr) => {
  assert(modalContent.includes(`'${tr}'`), `BookingModal contains recovery treatment: ${tr}`);
});

assert(modalContent.includes('https://wa.me/917358313291?text='), 'BookingModal generates correct WhatsApp URL');
assert(modalContent.includes('Escape'), 'BookingModal handles Escape key');
assert(modalContent.includes("document.body.style.overflow = 'hidden'"), 'BookingModal manages body scroll lock');
assert(modalContent.includes('/^[6-9]\\d{9}$/'), 'BookingModal has 10-digit Indian phone validation');

// 4. Verify Public Assets
const ctaDesktopImg = path.join(__dirname, '..', 'public', 'images', 'cta', 'cta_wellness_lounge.webp');
const footerDesktopImg = path.join(__dirname, '..', 'public', 'images', 'footer', 'footer_wellness_background.webp');
assert(fs.existsSync(ctaDesktopImg), 'public/images/cta/cta_wellness_lounge.webp exists');
assert(fs.existsSync(footerDesktopImg), 'public/images/footer/footer_wellness_background.webp exists');

console.log(`\nVerification Summary: ${pass} PASSED, ${fail} FAILED.`);
if (fail > 0) process.exit(1);
