'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface DropdownOption {
  value: string;
  label: string;
  color?: string;
}

interface ConfigDropdownProps {
  label: string;
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  type?: 'color' | 'size';
}

export default function ConfigDropdown({
  label,
  options,
  value,
  onChange,
  type = 'size',
}: ConfigDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-white/80 text-sm font-semibold uppercase tracking-wider mb-2">
        {label}
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-left flex items-center justify-between hover:bg-white/10 transition-all group"
        style={{
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
        }}
      >
        <div className="flex items-center gap-3">
          {type === 'color' && selectedOption?.color && (
            <div
              className="w-6 h-6 rounded border border-white/20"
              style={{ backgroundColor: selectedOption.color }}
            />
          )}
          <span className="text-white font-medium">
            {selectedOption?.label || 'Select...'}
          </span>
        </div>
        <motion.svg
          className="w-5 h-5 text-white/60"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </motion.svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="absolute z-50 w-full mt-2 rounded-lg overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.98) 0%, rgba(40, 10, 10, 0.98) 50%, rgba(60, 15, 15, 0.98) 100%)',
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                border: '1px solid rgba(220, 20, 60, 0.3)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6), 0 0 60px rgba(220, 20, 60, 0.15)',
              }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="py-2">
                {options.map((option) => {
                  const isSelected = option.value === value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleSelect(option.value)}
                      className={`w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-white/10 transition-all ${
                        isSelected ? 'bg-white/5' : ''
                      }`}
                    >
                      {type === 'color' && option.color && (
                        <div
                          className="w-6 h-6 rounded border border-white/20 flex-shrink-0"
                          style={{ backgroundColor: option.color }}
                        />
                      )}
                      <span
                        className={`font-medium ${
                          isSelected ? 'text-white' : 'text-white/80'
                        }`}
                      >
                        {option.label}
                      </span>
                      {isSelected && (
                        <motion.svg
                          className="w-5 h-5 text-[#DC143C] ml-auto"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </motion.svg>
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}















