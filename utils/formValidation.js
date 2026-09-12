const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const NAME_PATTERN = /^[\p{L}\p{M}][\p{L}\p{M}\s'.-]*$/u;
const PLACE_PATTERN = /^[\p{L}\p{M}][\p{L}\p{M}\s'.()-]*$/u;

function requiredText(value, label, { min = 1, max }) {
  const clean = String(value || '').trim();
  if (!clean) return `${label} is required.`;
  if (clean.length < min) return `${label} must be at least ${min} characters.`;
  if (max && clean.length > max) return `${label} must not exceed ${max} characters.`;
  return '';
}

export function validateEmail(value) {
  const email = String(value || '').trim();
  if (!email) return 'Email address is required.';
  if (email.length > 254 || !EMAIL_PATTERN.test(email)) return 'Enter a valid email address.';
  return '';
}

export function validateIndianPhone(value, { required = true } = {}) {
  const phone = String(value || '').trim();
  if (!phone) return required ? 'Phone number is required.' : '';
  if (!/^[6-9]\d{9}$/.test(phone)) return 'Enter a valid 10-digit Indian mobile number.';
  return '';
}

export function validateInquiryForm(form) {
  const errors = {};
  const nameError = requiredText(form.name, 'Name', { min: 2, max: 120 });
  if (nameError) errors.name = nameError;
  else if (!NAME_PATTERN.test(form.name.trim())) errors.name = 'Name can contain letters, spaces, apostrophes and hyphens only.';

  const company = String(form.company || '').trim();
  if (company.length > 150) errors.company = 'Company name must not exceed 150 characters.';

  const mobileError = validateIndianPhone(form.mobile);
  if (mobileError) errors.mobile = mobileError;

  const emailError = validateEmail(form.email);
  if (emailError) errors.email = emailError;

  const messageError = requiredText(form.message, 'Message', { min: 10, max: 2000 });
  if (messageError) errors.message = messageError;

  return errors;
}

export function validateCheckoutAddress(address = {}) {
  const errors = {};
  const names = [['firstName', 'First name'], ['lastName', 'Last name']];
  names.forEach(([field, label]) => {
    const error = requiredText(address[field], label, { min: 2, max: 80 });
    if (error) errors[field] = error;
    else if (!NAME_PATTERN.test(address[field].trim())) errors[field] = `${label} contains invalid characters.`;
  });

  const emailError = validateEmail(address.email);
  if (emailError) errors.email = emailError;

  const phoneError = validateIndianPhone(address.phoneNo);
  if (phoneError) errors.phoneNo = phoneError;

  const streetError = requiredText(address.streetAddress, 'Street address', { min: 5, max: 300 });
  if (streetError) errors.streetAddress = streetError;

  [['city', 'City'], ['state', 'State']].forEach(([field, label]) => {
    const error = requiredText(address[field], label, { min: 2, max: 100 });
    if (error) errors[field] = error;
    else if (!PLACE_PATTERN.test(address[field].trim())) errors[field] = `${label} contains invalid characters.`;
  });

  const zipcode = String(address.zipcode || '').trim();
  if (!zipcode) errors.zipcode = 'PIN code is required.';
  else if (!/^\d{6}$/.test(zipcode)) errors.zipcode = 'Enter a valid 6-digit PIN code.';

  if (String(address.specialInstruction || '').trim().length > 500) {
    errors.specialInstruction = 'Special instructions must not exceed 500 characters.';
  }

  return errors;
}

export function validateProfileForm(profile = {}) {
  const errors = {};
  const nameError = requiredText(profile.name, 'Full name', { min: 2, max: 120 });
  if (nameError) errors.name = nameError;
  else if (!NAME_PATTERN.test(profile.name.trim())) errors.name = 'Name can contain letters, spaces, apostrophes and hyphens only.';

  const emailError = validateEmail(profile.email);
  if (emailError) errors.email = emailError;

  const phoneError = validateIndianPhone(profile.phone, { required: false });
  if (phoneError) errors.phone = phoneError;

  const address = profile.address || {};
  const addressValues = ['streetAddress', 'city', 'state', 'zipcode'].map((field) => String(address[field] || '').trim());
  if (addressValues.some(Boolean)) {
    const streetError = requiredText(address.streetAddress, 'Street address', { min: 5, max: 300 });
    if (streetError) errors.streetAddress = streetError;

    [['city', 'City'], ['state', 'State']].forEach(([field, label]) => {
      const error = requiredText(address[field], label, { min: 2, max: 100 });
      if (error) errors[field] = error;
      else if (!PLACE_PATTERN.test(address[field].trim())) errors[field] = `${label} contains invalid characters.`;
    });

    if (!addressValues[3]) errors.zipcode = 'PIN code is required when an address is provided.';
    else if (!/^\d{6}$/.test(addressValues[3])) errors.zipcode = 'Enter a valid 6-digit PIN code.';
  }

  return errors;
}

export function firstValidationMessage(errors) {
  return Object.values(errors).find(Boolean) || 'Please check the form and try again.';
}
