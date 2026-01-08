/**
 * Format phone number to E.164 format required by AWS Cognito
 * @param phoneNumber - Raw phone number input
 * @param countryCode - Country code (default: +1 for US)
 * @returns Formatted phone number in E.164 format
 */
export const formatPhoneNumber = (phoneNumber: string, countryCode: string = "+1"): string => {
  const digitsOnly = phoneNumber.replace(/\D/g, "");

  if (phoneNumber.startsWith("+")) {
    return phoneNumber;
  }

  if (digitsOnly.startsWith("1") && digitsOnly.length === 11) {
    return `+${digitsOnly}`;
  }

  if (digitsOnly.length === 10) {
    return `+1${digitsOnly}`;
  }

  return `${countryCode}${digitsOnly}`;
};

/**
 * Validate phone number format
 * @param phoneNumber - Phone number to validate
 * @returns true if valid, false otherwise
 */
export const validatePhoneNumber = (phoneNumber: string): boolean => {
  const cleaned = phoneNumber.replace(/[^\d+]/g, "");

  if (!cleaned.startsWith("+") || cleaned.length < 11) {
    return false;
  }

  const e164Regex = /^\+[1-9]\d{1,14}$/;
  return e164Regex.test(cleaned);
};

/**
 * Get a user-friendly error message for phone number validation
 * @param phoneNumber - The phone number that failed validation
 * @returns Error message string
 */
export const getPhoneNumberErrorMessage = (phoneNumber: string): string => {
  const digitsOnly = phoneNumber.replace(/\D/g, "");

  if (phoneNumber.startsWith("+")) {
    return "Please enter a valid international phone number.";
  }

  if (digitsOnly.length < 10) {
    return "Phone number must have at least 10 digits.";
  }

  if (digitsOnly.length > 15) {
    return "Phone number is too long.";
  }

  return "Please enter a valid phone number with country code (e.g., +1 555 123 4567).";
};

/**
 * Format phone number for display
 * @param phoneNumber - E.164 formatted phone number
 * @returns Formatted display string
 */
export const formatPhoneNumberForDisplay = (phoneNumber: string): string => {
  if (!phoneNumber.startsWith("+")) {
    return phoneNumber;
  }

  const digits = phoneNumber.substring(1);

  if (digits.startsWith("1") && digits.length === 11) {
    return `+1 (${digits.substring(1, 4)}) ${digits.substring(4, 7)}-${digits.substring(7)}`;
  }

  return phoneNumber;
};
