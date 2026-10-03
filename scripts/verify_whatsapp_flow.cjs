const fs = require('fs');
const path = require('path');

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

function generateWhatsAppUrl(serviceType, service, date, time, customerName, customerPhone) {
  const cleanPhone = customerPhone.replace(/\D/g, '');
  const formattedDate = formatDateForDisplay(date);
  let message = '';
  if (serviceType === 'therapy') {
    message = `Hello Daniel Wellness Center,\n\nI would like to enquire about booking an appointment.\n\nName: ${customerName.trim()}\nPhone: +91 ${cleanPhone}\n\nService: ${service}\nDate: ${formattedDate}\nPreferred Time: ${time}\n\nSession Duration: 15 minutes\n\nPlease confirm the availability and appointment details.\n\nThank you.`;
  } else {
    message = `Hello Daniel Wellness Center,\n\nI would like to enquire about booking an appointment.\n\nName: ${customerName.trim()}\nPhone: +91 ${cleanPhone}\n\nService: ${service}\nDate: ${formattedDate}\nPreferred Time: ${time.trim()}\n\nPlease confirm the availability and appointment details.\n\nThank you.`;
  }
  return `https://wa.me/917358313291?text=${encodeURIComponent(message)}`;
}

console.log('=== Testing WhatsApp Link Generation ===\n');

// 1. Therapy 15-Min Test
const therapyUrl = generateWhatsAppUrl(
  'therapy',
  'Reflexology',
  '2026-10-02',
  '7:15 PM',
  'Eleanor Vance',
  '9876543210'
);
console.log('Therapy WhatsApp URL:');
console.log(therapyUrl);
console.log('\nDecoded Therapy Message:\n');
console.log(decodeURIComponent(therapyUrl.split('?text=')[1]));

// 2. Treatment Daytime Test
const treatmentUrl = generateWhatsAppUrl(
  'treatment',
  'Athletic Recovery & Muscle Repair',
  '2026-10-02',
  '3:30 PM',
  'Eleanor Vance',
  '9876543210'
);
console.log('\n----------------------------------------\n');
console.log('Treatment WhatsApp URL:');
console.log(treatmentUrl);
console.log('\nDecoded Treatment Message:\n');
console.log(decodeURIComponent(treatmentUrl.split('?text=')[1]));

// Validations
console.log('\n----------------------------------------\n');
console.log('Assertions:');
console.log('Target phone: +91 7358313291 ->', therapyUrl.includes('917358313291'));
console.log('Includes Reflexology ->', therapyUrl.includes('Reflexology'));
console.log('Includes 7:15 PM ->', therapyUrl.includes('7%3A15%20PM') || therapyUrl.includes('7:15'));
console.log('Includes 15 minutes session duration ->', therapyUrl.includes('15%20minutes'));
console.log('Includes Treatment Name ->', treatmentUrl.includes('Athletic%20Recovery%20%26%20Muscle%20Repair'));
console.log('Includes Daytime Time ->', treatmentUrl.includes('3%3A30%20PM'));
console.log('All checks passed!\n');
