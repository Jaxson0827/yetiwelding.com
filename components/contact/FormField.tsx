'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'file' | 'radio';
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  rows?: number;
  maxLength?: number;
  accept?: string;
  disabled?: boolean;
  className?: string;
  showCharacterCount?: boolean;
  autoFocus?: boolean;
}

export default function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  required = false,
  placeholder,
  options = [],
  rows = 4,
  maxLength,
  accept,
  disabled = false,
  className = '',
  showCharacterCount = false,
  autoFocus = false,
}: FormFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    onChange(e.target.value);
    setHasInteracted(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Store file name for display, actual file handling in parent
      onChange(file.name);
      setHasInteracted(true);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setHasInteracted(true);
    if (onBlur) {
      onBlur();
    }
  };

  const showError = hasInteracted && error;

  const fieldId = `field-${name}`;
  const errorId = `error-${name}`;

  // Character count for textarea
  const characterCount = type === 'textarea' && maxLength ? value.length : null;
  const isNearLimit = characterCount !== null && characterCount > maxLength * 0.9;

  return (
    <div className={`w-full ${className}`}>
      <label
        htmlFor={fieldId}
        className="block text-white/90 text-sm font-medium mb-2 uppercase tracking-wider"
      >
        {label}
        {required && <span className="text-accent-red ml-1">*</span>}
      </label>

      {/* Text Input */}
      {type === 'text' || type === 'email' || type === 'tel' ? (
        <div className="relative">
          <input
            id={fieldId}
            name={name}
            type={type}
            value={value}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            maxLength={maxLength}
            aria-invalid={showError ? 'true' : 'false'}
            aria-describedby={showError ? errorId : undefined}
            className={`
              w-full px-4 py-3 bg-white/5 border rounded-lg
              text-white placeholder-white/40
              focus:outline-none focus:ring-2 focus:ring-accent-red/50 focus:border-accent-red/50
              transition-all duration-300
              ${showError ? 'border-red-500' : isFocused ? 'border-accent-red/50' : 'border-white/20'}
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
              backdrop-blur-sm
            `}
          />
          {showCharacterCount && maxLength && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/40">
              {value.length}/{maxLength}
            </div>
          )}
        </div>
      ) : null}

      {/* Textarea */}
      {type === 'textarea' ? (
        <div className="relative">
          <textarea
            ref={textareaRef}
            id={fieldId}
            name={name}
            value={value}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            rows={rows}
            maxLength={maxLength}
            aria-invalid={showError ? 'true' : 'false'}
            aria-describedby={showError ? errorId : undefined}
            className={`
              w-full px-4 py-3 bg-white/5 border rounded-lg resize-y
              text-white placeholder-white/40
              focus:outline-none focus:ring-2 focus:ring-accent-red/50 focus:border-accent-red/50
              transition-all duration-300
              ${showError ? 'border-red-500' : isFocused ? 'border-accent-red/50' : 'border-white/20'}
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
              backdrop-blur-sm
            `}
          />
          {showCharacterCount && maxLength && (
            <div className={`absolute bottom-3 right-3 text-xs ${isNearLimit ? 'text-accent-red' : 'text-white/40'}`}>
              {value.length}/{maxLength}
            </div>
          )}
        </div>
      ) : null}

      {/* Select */}
      {type === 'select' ? (
        <div className="relative">
          <select
            id={fieldId}
            name={name}
            value={value}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            required={required}
            disabled={disabled}
            aria-invalid={showError ? 'true' : 'false'}
            aria-describedby={showError ? errorId : undefined}
            className={`
              w-full px-4 py-3 bg-white/5 border rounded-lg
              text-white
              focus:outline-none focus:ring-2 focus:ring-accent-red/50 focus:border-accent-red/50
              transition-all duration-300 appearance-none
              ${showError ? 'border-red-500' : isFocused ? 'border-accent-red/50' : 'border-white/20'}
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
              backdrop-blur-sm
            `}
          >
            <option value="" disabled className="bg-black text-white">
              {placeholder || 'Select an option'}
            </option>
            {options.map((option) => (
              <option key={option.value} value={option.value} className="bg-black text-white">
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg
              className="w-5 h-5 text-white/40"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      ) : null}

      {/* Radio Buttons */}
      {type === 'radio' ? (
        <div className="space-y-2">
          {options.map((option) => (
            <label
              key={option.value}
              className={`
                flex items-center p-3 rounded-lg border cursor-pointer
                transition-all duration-300
                ${value === option.value
                  ? 'bg-accent-red/10 border-accent-red/50'
                  : 'bg-white/5 border-white/20 hover:border-white/40'
                }
              `}
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                className="sr-only"
                aria-invalid={showError ? 'true' : 'false'}
                aria-describedby={showError ? errorId : undefined}
              />
              <div
                className={`
                  w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center
                  ${value === option.value ? 'border-accent-red' : 'border-white/40'}
                `}
              >
                {value === option.value && (
                  <motion.div
                    className="w-2 h-2 rounded-full bg-accent-red"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </div>
              <span className="text-white/90">{option.label}</span>
            </label>
          ))}
        </div>
      ) : null}

      {/* File Input */}
      {type === 'file' ? (
        <div>
          <input
            ref={fileInputRef}
            id={fieldId}
            name={name}
            type="file"
            onChange={handleFileChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            accept={accept}
            disabled={disabled}
            className="hidden"
            aria-invalid={showError ? 'true' : 'false'}
            aria-describedby={showError ? errorId : undefined}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
            className={`
              w-full px-4 py-3 bg-white/5 border rounded-lg
              text-white/90 text-left
              focus:outline-none focus:ring-2 focus:ring-accent-red/50 focus:border-accent-red/50
              transition-all duration-300
              ${showError ? 'border-red-500' : isFocused ? 'border-accent-red/50' : 'border-white/20'}
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/10'}
              backdrop-blur-sm
            `}
          >
            {value ? (
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {value}
              </span>
            ) : (
              <span className="flex items-center text-white/40">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                {placeholder || 'Choose file (optional)'}
              </span>
            )}
          </button>
        </div>
      ) : null}

      {/* Error Message */}
      <AnimatePresence>
        {showError && (
          <motion.div
            id={errorId}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="mt-2 text-sm text-red-400 flex items-center"
            role="alert"
            aria-live="polite"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}











