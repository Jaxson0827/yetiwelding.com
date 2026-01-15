'use client';

import React, { useState, useRef, useEffect } from 'react';

interface EditableDimensionLabelProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  className?: string;
}

export default function EditableDimensionLabel({
  value,
  onChange,
  onBlur,
  error,
  className = '',
}: EditableDimensionLabelProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  // Update input value when prop value changes (but not while editing)
  useEffect(() => {
    if (!isEditing) {
      setInputValue(value);
    }
  }, [value, isEditing]);

  // Focus input when entering edit mode
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleClick = () => {
    setIsEditing(true);
    setInputValue(value);
  };

  const handleBlur = () => {
    setIsEditing(false);
    // Validate and update on blur
    if (inputValue.trim() !== value) {
      onChange(inputValue.trim());
    }
    if (onBlur) {
      onBlur();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      inputRef.current?.blur();
    } else if (e.key === 'Escape') {
      setInputValue(value);
      setIsEditing(false);
      inputRef.current?.blur();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  if (isEditing) {
    return (
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={`font-mono tracking-tight text-gray-900 text-lg font-semibold bg-white/90 px-2 py-1 rounded border-2 shadow-sm ${
            error
              ? 'border-red-500 focus:border-red-500 focus:outline-none'
              : 'border-red-500/50 focus:border-red-500 focus:outline-none'
          } ${className}`}
          style={{ minWidth: '60px' }}
        />
        {error && (
          <div className="absolute top-full left-0 mt-1 text-xs text-red-600 whitespace-nowrap z-10 bg-white border border-red-300 px-2 py-1 rounded shadow-lg">
            {error}
          </div>
        )}
      </div>
    );
  }

  return (
    <span
      onClick={handleClick}
      className={`font-mono tracking-tight text-gray-900 text-lg font-semibold bg-white/90 px-2 py-1 rounded cursor-pointer hover:bg-white transition-colors border border-gray-300 shadow-sm ${className}`}
      title="Click to edit"
    >
      {value}
    </span>
  );
}

