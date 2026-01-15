import { EmbedSpec, VALIDATION_CONSTRAINTS, ValidationError } from './types';

export function validateEmbedSpec(spec: Partial<EmbedSpec>): ValidationError[] {
  const errors: ValidationError[] = [];

  // Validate plate dimensions
  if (spec.plate) {
    const { length, width, thickness } = spec.plate;
    const plateConstraints = VALIDATION_CONSTRAINTS.plate;

    if (length !== undefined) {
      if (length < plateConstraints.length.min || length > plateConstraints.length.max) {
        errors.push({
          field: 'plate.length',
          message: `Length must be between ${plateConstraints.length.min}" and ${plateConstraints.length.max}"`,
        });
      }
    }

    if (width !== undefined) {
      if (width < plateConstraints.width.min || width > plateConstraints.width.max) {
        errors.push({
          field: 'plate.width',
          message: `Width must be between ${plateConstraints.width.min}" and ${plateConstraints.width.max}"`,
        });
      }
    }

    if (thickness !== undefined) {
      if (thickness < plateConstraints.thickness.min || thickness > plateConstraints.thickness.max) {
        errors.push({
          field: 'plate.thickness',
          message: `Thickness must be between ${plateConstraints.thickness.min}" and ${plateConstraints.thickness.max}"`,
        });
      }
    }
  }

  // Validate studs
  if (spec.studs && spec.studs.positions) {
    const studsConstraints = VALIDATION_CONSTRAINTS.studs;

    if (spec.studs.positions.length > studsConstraints.maxCount) {
      errors.push({
        field: 'studs.positions',
        message: `Stud count must not exceed ${studsConstraints.maxCount}`,
      });
    }

    spec.studs.positions.forEach((stud, index) => {
      if (stud.diameter < studsConstraints.diameter.min || stud.diameter > studsConstraints.diameter.max) {
        errors.push({
          field: `studs.positions[${index}].diameter`,
          message: `Stud diameter must be between ${studsConstraints.diameter.min}" and ${studsConstraints.diameter.max}"`,
        });
      }
      if (!stud.length || stud.length <= 0) {
        errors.push({
          field: `studs.positions[${index}].length`,
          message: 'Stud length must be greater than 0',
        });
      }
      if (!stud.grade || (stud.grade !== 'A307' && stud.grade !== 'A325')) {
        errors.push({
          field: `studs.positions[${index}].grade`,
          message: 'Stud grade must be A307 or A325',
        });
      }
    });
  }

  // Validate quantity
  if (spec.quantity !== undefined) {
    if (spec.quantity < VALIDATION_CONSTRAINTS.quantity.min) {
      errors.push({
        field: 'quantity',
        message: `Quantity must be at least ${VALIDATION_CONSTRAINTS.quantity.min}`,
      });
    }
  }

  return errors;
}

export function isEmbedSpecComplete(spec: Partial<EmbedSpec>): spec is EmbedSpec {
  return !!(
    spec.plate?.length &&
    spec.plate?.width &&
    spec.plate?.thickness &&
    spec.plate?.material &&
    spec.finish &&
    spec.tolerance &&
    spec.quantity &&
    spec.leadTime
  );
}


