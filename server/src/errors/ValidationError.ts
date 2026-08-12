import { ZodError } from 'zod';
import AppError from './AppError.js';

export interface FieldError {
  fieldName: string;
  fieldMessage: string;
}

export class ValidationError extends AppError {
  // Field names and messages
  readonly fields: FieldError[];

  // Populate with constructor
  constructor(error: ZodError) {
    super('Validation Error', 400, 'validationError');
    // Parse through zodError to get field name (path) and message
    this.fields = error.issues.map((issue) => {
      return {
        fieldName: issue.path.join('.'),
        fieldMessage: issue.message,
      };
    });
  }
}
