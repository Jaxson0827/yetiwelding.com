'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FormField from './FormField';
import {
  validateForm,
  validateName,
  validateEmail,
  validatePhone,
  validateMessage,
  validateInquiryType,
  validateProjectType,
  validatePreferredContact,
  validateFile,
  formatPhoneNumber,
  sanitizeInput,
  type FormField as FormFieldType,
} from '@/lib/contactFormValidation';

interface ContactFormProps {
  onSuccess?: () => void;
}

const INQUIRY_TYPES = [
  { value: 'general', label: 'General Inquiry' },
  { value: 'quote', label: 'Quote Request' },
  { value: 'service', label: 'Service Inquiry' },
  { value: 'support', label: 'Support' },
];

const PROJECT_TYPES = [
  { value: 'custom-fabrication', label: 'Custom Fabrication' },
  { value: 'structural-welding', label: 'Structural Welding' },
  { value: 'ornamental-work', label: 'Ornamental Work' },
  { value: 'other', label: 'Other' },
];

const PREFERRED_CONTACT_METHODS = [
  { value: 'phone', label: 'Phone' },
  { value: 'email', label: 'Email' },
  { value: 'text', label: 'Text Message' },
];

const URGENCY_LEVELS = [
  { value: 'low', label: 'Low - No rush' },
  { value: 'normal', label: 'Normal - Within a week' },
  { value: 'high', label: 'High - Within 48 hours' },
  { value: 'urgent', label: 'Urgent - As soon as possible' },
];

const STORAGE_KEY = 'yeti-welding-contact-form-draft';

export default function ContactForm({ onSuccess }: ContactFormProps) {
  const [formData, setFormData] = useState<Partial<FormFieldType>>({
    name: '',
    email: '',
    phone: '',
    inquiryType: '',
    projectType: '',
    message: '',
    preferredContact: '',
    urgency: 'normal',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Load draft from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFormData(parsed);
      } catch (e) {
        // Ignore parse errors
      }
    }
  }, []);

  // Auto-save to localStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.name || formData.email || formData.message) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [formData]);

  // Clear draft on successful submission
  useEffect(() => {
    if (submitStatus === 'success') {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [submitStatus]);

  const handleFieldChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }

    // Format phone number
    if (field === 'phone' && value) {
      const formatted = formatPhoneNumber(value);
      if (formatted !== value) {
        setFormData((prev) => ({ ...prev, phone: formatted }));
      }
    }
  };

  const handleFieldBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    
    // Validate on blur
    let validationResult;
    switch (field) {
      case 'name':
        validationResult = validateName(formData.name || '');
        break;
      case 'email':
        validationResult = validateEmail(formData.email || '');
        break;
      case 'phone':
        validationResult = validatePhone(formData.phone);
        break;
      case 'message':
        validationResult = validateMessage(formData.message || '');
        break;
      case 'inquiryType':
        validationResult = validateInquiryType(formData.inquiryType || '');
        break;
      case 'projectType':
        validationResult = validateProjectType(formData.projectType, formData.inquiryType || '');
        break;
      case 'preferredContact':
        validationResult = validatePreferredContact(formData.preferredContact || '');
        break;
      default:
        return;
    }

    if (!validationResult.isValid) {
      const errorMessage = validationResult.error || 'Invalid value';
      setErrors((prev) => ({ ...prev, [field]: errorMessage }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validationResult = validateFile(file);
      if (!validationResult.isValid) {
        setErrors((prev) => ({ ...prev, file: validationResult.error || 'Invalid file' }));
        return;
      }
      setUploadedFile(file);
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.file;
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allFields = ['name', 'email', 'phone', 'inquiryType', 'projectType', 'message', 'preferredContact'];
    const newTouched: Record<string, boolean> = {};
    allFields.forEach((field) => {
      newTouched[field] = true;
    });
    setTouched(newTouched);

    // Validate entire form
    const validation = validateForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      
      // Scroll to first error
      const firstErrorField = Object.keys(validation.errors)[0];
      const errorElement = document.getElementById(`field-${firstErrorField}`);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        errorElement.focus();
      }
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Prepare form data
      const submitData = new FormData();
      submitData.append('name', sanitizeInput(formData.name || ''));
      submitData.append('email', sanitizeInput(formData.email || ''));
      submitData.append('phone', sanitizeInput(formData.phone || ''));
      submitData.append('inquiryType', formData.inquiryType || '');
      submitData.append('projectType', formData.projectType || '');
      submitData.append('message', sanitizeInput(formData.message || ''));
      submitData.append('preferredContact', formData.preferredContact || '');
      submitData.append('urgency', formData.urgency || 'normal');
      
      if (uploadedFile) {
        submitData.append('file', uploadedFile);
      }

      // Submit to API route
      const response = await fetch('/api/contact', {
        method: 'POST',
        body: submitData,
      });

      if (!response.ok) {
        throw new Error('Submission failed');
      }

      setSubmitStatus('success');
      if (onSuccess) {
        onSuccess();
      }

      // Reset form after success
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          phone: '',
          inquiryType: '',
          projectType: '',
          message: '',
          preferredContact: '',
          urgency: 'normal',
        });
        setUploadedFile(null);
        setTouched({});
        setErrors({});
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }, 3000);
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const showProjectType = formData.inquiryType === 'quote' || formData.inquiryType === 'service';

  return (
    <div className="w-full">
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-6" noValidate>
        {/* Name */}
        <FormField
          label="Name"
          name="name"
          type="text"
          value={formData.name || ''}
          onChange={(value) => handleFieldChange('name', value)}
          onBlur={() => handleFieldBlur('name')}
          error={touched.name ? errors.name : undefined}
          required
          placeholder="Your full name"
        />

        {/* Email */}
        <FormField
          label="Email"
          name="email"
          type="email"
          value={formData.email || ''}
          onChange={(value) => handleFieldChange('email', value)}
          onBlur={() => handleFieldBlur('email')}
          error={touched.email ? errors.email : undefined}
          required
          placeholder="your.email@example.com"
        />

        {/* Phone */}
        <FormField
          label="Phone"
          name="phone"
          type="tel"
          value={formData.phone || ''}
          onChange={(value) => handleFieldChange('phone', value)}
          onBlur={() => handleFieldBlur('phone')}
          error={touched.phone ? errors.phone : undefined}
          placeholder="(555) 123-4567"
        />

        {/* Inquiry Type */}
        <FormField
          label="Inquiry Type"
          name="inquiryType"
          type="select"
          value={formData.inquiryType || ''}
          onChange={(value) => handleFieldChange('inquiryType', value)}
          onBlur={() => handleFieldBlur('inquiryType')}
          error={touched.inquiryType ? errors.inquiryType : undefined}
          required
          placeholder="Select inquiry type"
          options={INQUIRY_TYPES}
        />

        {/* Project Type (conditional) */}
        <AnimatePresence>
          {showProjectType && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <FormField
                label="Project Type"
                name="projectType"
                type="select"
                value={formData.projectType || ''}
                onChange={(value) => handleFieldChange('projectType', value)}
                onBlur={() => handleFieldBlur('projectType')}
                error={touched.projectType ? errors.projectType : undefined}
                required={showProjectType}
                placeholder="Select project type"
                options={PROJECT_TYPES}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Message */}
        <FormField
          label="Message"
          name="message"
          type="textarea"
          value={formData.message || ''}
          onChange={(value) => handleFieldChange('message', value)}
          onBlur={() => handleFieldBlur('message')}
          error={touched.message ? errors.message : undefined}
          required
          placeholder="Tell us about your project..."
          rows={6}
          maxLength={2000}
          showCharacterCount
        />

        {/* Preferred Contact Method */}
        <FormField
          label="Preferred Contact Method"
          name="preferredContact"
          type="radio"
          value={formData.preferredContact || ''}
          onChange={(value) => handleFieldChange('preferredContact', value)}
          onBlur={() => handleFieldBlur('preferredContact')}
          error={touched.preferredContact ? errors.preferredContact : undefined}
          required
          options={PREFERRED_CONTACT_METHODS}
        />

        {/* Urgency Level */}
        <FormField
          label="Urgency Level"
          name="urgency"
          type="select"
          value={formData.urgency || 'normal'}
          onChange={(value) => handleFieldChange('urgency', value)}
          options={URGENCY_LEVELS}
        />

        {/* File Upload */}
        <div>
          <input
            ref={fileInputRef}
            type="file"
            id="file-upload"
            name="file"
            accept="image/*,.pdf"
            onChange={handleFileChange}
            className="hidden"
          />
          <label
            htmlFor="file-upload"
            className="block text-white/90 text-sm font-medium mb-2 uppercase tracking-wider"
          >
            Project Photos/Drawings (Optional)
          </label>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`
              w-full px-4 py-3 bg-white/5 border rounded-lg
              text-white/90 text-left
              focus:outline-none focus:ring-2 focus:ring-accent-red/50 focus:border-accent-red/50
              transition-all duration-300
              ${errors.file ? 'border-red-500' : 'border-white/20 hover:bg-white/10'}
              backdrop-blur-sm
            `}
          >
            {uploadedFile ? (
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {uploadedFile.name}
              </span>
            ) : (
              <span className="flex items-center text-white/40">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Choose file (optional) - Max 10MB
              </span>
            )}
          </button>
          {errors.file && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 text-sm text-red-400 flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {errors.file}
            </motion.div>
          )}
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={isSubmitting}
          className={`
            w-full px-8 py-4 bg-accent-red text-white uppercase text-sm font-semibold tracking-wider
            rounded-lg transition-all duration-300
            ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#B01030] hover:scale-[1.02]'}
            focus:outline-none focus:ring-2 focus:ring-accent-red/50 focus:ring-offset-2 focus:ring-offset-black
          `}
          whileHover={!isSubmitting ? { scale: 1.02 } : {}}
          whileTap={!isSubmitting ? { scale: 0.98 } : {}}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Sending...
            </span>
          ) : (
            'Send Message'
          )}
        </motion.button>

        {/* Status Messages */}
        <AnimatePresence>
          {submitStatus === 'success' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400 flex items-center"
              role="alert"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Message sent successfully! We'll get back to you within 24 hours.</span>
            </motion.div>
          )}

          {submitStatus === 'error' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 flex items-center"
              role="alert"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Something went wrong. Please try again or contact us directly.</span>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
}






