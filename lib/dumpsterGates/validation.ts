import { GateStyle, MIN_WIDTH_FT, MAX_WIDTH_FT, MIN_HEIGHT_FT, MAX_HEIGHT_FT, MAX_SINGLE_SWING_WIDTH_FT } from './types';

/**
 * Parse a dimension string into decimal feet
 * Accepts formats like: "15' 6"", "15.5", "15.5'", "15.5 ft", etc.
 */
export function parseDimension(value: string): number | null {
  if (!value || typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  // Remove common suffixes
  const cleaned = trimmed
    .replace(/['"]/g, "'") // Normalize quotes
    .replace(/\s*ft\s*/gi, "'") // Replace "ft" with '
    .replace(/\s*feet\s*/gi, "'") // Replace "feet" with '
    .trim();

  // Try to match patterns like "15' 6"", "15'6"", "15.5'", "15.5"
  const feetInchesMatch = cleaned.match(/^(\d+(?:\.\d+)?)\s*['"]?\s*(?:(\d+(?:\.\d+)?)\s*["']?)?$/);
  
  if (feetInchesMatch) {
    const feet = parseFloat(feetInchesMatch[1]);
    const inches = feetInchesMatch[2] ? parseFloat(feetInchesMatch[2]) : 0;
    
    if (isNaN(feet) || feet < 0) {
      return null;
    }
    
    // Convert inches to decimal feet
    const totalFeet = feet + (inches / 12);
    return totalFeet;
  }

  // Try simple decimal match
  const decimalMatch = cleaned.match(/^(\d+(?:\.\d+)?)$/);
  if (decimalMatch) {
    const feet = parseFloat(decimalMatch[1]);
    if (!isNaN(feet) && feet >= 0) {
      return feet;
    }
  }

  return null;
}

/**
 * Format a decimal feet value to a display string (e.g., "15' 6"")
 */
export function formatDimension(feet: number): string {
  const wholeFeet = Math.floor(feet);
  const inches = Math.round((feet - wholeFeet) * 12);
  
  if (inches === 0) {
    return `${wholeFeet}'`;
  }
  
  return `${wholeFeet}' ${inches}"`;
}

/**
 * Validate width dimension
 */
export function validateWidth(widthFt: number): { valid: boolean; error?: string } {
  if (isNaN(widthFt) || widthFt <= 0) {
    return { valid: false, error: 'Width must be a positive number' };
  }
  
  if (widthFt < MIN_WIDTH_FT) {
    return { valid: false, error: `Minimum width is ${MIN_WIDTH_FT}'` };
  }
  
  if (widthFt > MAX_WIDTH_FT) {
    return { valid: false, error: `Maximum width is ${MAX_WIDTH_FT}'` };
  }
  
  return { valid: true };
}

/**
 * Validate height dimension
 */
export function validateHeight(heightFt: number): { valid: boolean; error?: string } {
  if (isNaN(heightFt) || heightFt <= 0) {
    return { valid: false, error: 'Height must be a positive number' };
  }
  
  if (heightFt < MIN_HEIGHT_FT) {
    return { valid: false, error: `Minimum height is ${MIN_HEIGHT_FT}'` };
  }
  
  if (heightFt > MAX_HEIGHT_FT) {
    return { valid: false, error: `Maximum height is ${MAX_HEIGHT_FT}'` };
  }
  
  return { valid: true };
}

/**
 * Validate gate style compatibility with width
 */
export function validateGateStyle(
  widthFt: number,
  style: GateStyle
): { valid: boolean; error?: string; shouldSwitch?: boolean } {
  if (style === 'double-swing') {
    return { valid: true };
  }
  
  // Single swing styles
  if (widthFt > MAX_SINGLE_SWING_WIDTH_FT) {
    return {
      valid: false,
      error: `Maximum single swing width is ${MAX_SINGLE_SWING_WIDTH_FT}'. Gate style updated to double swing.`,
      shouldSwitch: true,
    };
  }
  
  return { valid: true };
}






