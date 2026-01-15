export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export interface FormField {
  name: string;
  email: string;
  phone?: string;
  inquiryType: string;
  projectType?: string;
  message: string;
  preferredContact: string;
  urgency?: string;
}

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Phone validation regex (supports various formats)
const PHONE_REGEX = /^[\d\s\-\(\)\+]+$/;

/**
 * Validates an email address
 */
export function validateEmail(email: string): ValidationResult {
  if (!email || email.trim().length === 0) {
    return { isValid: false, error: 'Email is required' };
  }

  if (!EMAIL_REGEX.test(email.trim())) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }

  if (email.length > 254) {
    return { isValid: false, error: 'Email address is too long' };
  }

  return { isValid: true };
}

/**
 * Validates a phone number (optional field)
 */
export function validatePhone(phone: string | undefined): ValidationResult {
  if (!phone || phone.trim().length === 0) {
    return { isValid: true }; // Phone is optional
  }

  const cleaned = phone.replace(/\s/g, '');
  
  if (cleaned.length < 10) {
    return { isValid: false, error: 'Phone number must be at least 10 digits' };
  }

  if (!PHONE_REGEX.test(phone)) {
    return { isValid: false, error: 'Please enter a valid phone number' };
  }

  return { isValid: true };
}

/**
 * Formats a phone number for display
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  if (cleaned.length === 11 && cleaned[0] === '1') {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  
  return phone;
}

/**
 * Validates a name field
 */
export function validateName(name: string): ValidationResult {
  if (!name || name.trim().length === 0) {
    return { isValid: false, error: 'Name is required' };
  }

  if (name.trim().length < 2) {
    return { isValid: false, error: 'Name must be at least 2 characters' };
  }

  if (name.length > 100) {
    return { isValid: false, error: 'Name is too long' };
  }

  return { isValid: true };
}

/**
 * Validates a message field
 */
export function validateMessage(message: string, minLength: number = 10, maxLength: number = 2000): ValidationResult {
  if (!message || message.trim().length === 0) {
    return { isValid: false, error: 'Message is required' };
  }

  if (message.trim().length < minLength) {
    return { isValid: false, error: `Message must be at least ${minLength} characters` };
  }

  if (message.length > maxLength) {
    return { isValid: false, error: `Message must be less than ${maxLength} characters` };
  }

  return { isValid: true };
}

/**
 * Validates inquiry type selection
 */
export function validateInquiryType(inquiryType: string): ValidationResult {
  const validTypes = ['general', 'quote', 'service', 'support'];
  
  if (!inquiryType || !validTypes.includes(inquiryType)) {
    return { isValid: false, error: 'Please select an inquiry type' };
  }

  return { isValid: true };
}

/**
 * Validates project type (required when inquiry type is quote or service)
 */
export function validateProjectType(projectType: string | undefined, inquiryType: string): ValidationResult {
  if (inquiryType === 'quote' || inquiryType === 'service') {
    if (!projectType || projectType.trim().length === 0) {
      return { isValid: false, error: 'Project type is required for this inquiry' };
    }
  }

  return { isValid: true };
}

/**
 * Validates preferred contact method
 */
export function validatePreferredContact(preferredContact: string): ValidationResult {
  const validMethods = ['phone', 'email', 'text'];
  
  if (!preferredContact || !validMethods.includes(preferredContact)) {
    return { isValid: false, error: 'Please select a preferred contact method' };
  }

  return { isValid: true };
}

/**
 * Validates file upload
 */
export function validateFile(file: File | null, maxSizeMB: number = 10): ValidationResult {
  if (!file) {
    return { isValid: true }; // File is optional
  }

  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  
  if (file.size > maxSizeBytes) {
    return { isValid: false, error: `File size must be less than ${maxSizeMB}MB` };
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
  
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: 'File must be an image (JPEG, PNG, GIF, WebP) or PDF' };
  }

  return { isValid: true };
}

/**
 * Validates the entire form
 */
export function validateForm(formData: Partial<FormField>): {
  isValid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  // Validate name
  const nameResult = validateName(formData.name || '');
  if (!nameResult.isValid) {
    errors.name = nameResult.error || 'Invalid name';
  }

  // Validate email
  const emailResult = validateEmail(formData.email || '');
  if (!emailResult.isValid) {
    errors.email = emailResult.error || 'Invalid email';
  }

  // Validate phone (optional)
  const phoneResult = validatePhone(formData.phone);
  if (!phoneResult.isValid) {
    errors.phone = phoneResult.error || 'Invalid phone';
  }

  // Validate inquiry type
  const inquiryResult = validateInquiryType(formData.inquiryType || '');
  if (!inquiryResult.isValid) {
    errors.inquiryType = inquiryResult.error || 'Invalid inquiry type';
  }

  // Validate project type if needed
  const projectResult = validateProjectType(formData.projectType, formData.inquiryType || '');
  if (!projectResult.isValid) {
    errors.projectType = projectResult.error || 'Invalid project type';
  }

  // Validate message
  const messageResult = validateMessage(formData.message || '');
  if (!messageResult.isValid) {
    errors.message = messageResult.error || 'Invalid message';
  }

  // Validate preferred contact
  const contactResult = validatePreferredContact(formData.preferredContact || '');
  if (!contactResult.isValid) {
    errors.preferredContact = contactResult.error || 'Invalid contact method';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Sanitizes form input to prevent XSS
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .slice(0, 5000); // Limit length
}











