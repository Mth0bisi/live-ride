/**
 * Shared input validation helpers for API routes.
 * Keep this synchronous and dependency-free.
 */

/** Valid rider/running-order statuses accepted by the system */
export const VALID_STATUSES = new Set([
  'SCHEDULED',
  'CHECKED_IN',
  'AT_GATE',
  'IN_ARENA',
  'FINISHED',
  'HELD',
  'SCRATCHED',
  'NO_SHOW',
  'ELIMINATED',
  'RETIRED',
  'RESULT_PENDING',
  'RESULT_CONFIRMED',
  'PUBLISHED',
]);

/** Valid arena statuses */
export const VALID_ARENA_STATUSES = new Set([
  'ACTIVE',
  'PAUSED',
  'ARENA_RAKE',
  'COURSE_CHANGE',
  'COMPLETE',
]);

export interface ValidationError {
  field: string;
  message: string;
}

/** Returns a validation error if value is not a non-empty string */
export function assertString(
  value: unknown,
  field: string,
  maxLength = 500
): ValidationError | null {
  if (typeof value !== 'string' || value.trim().length === 0) {
    return { field, message: `${field} must be a non-empty string` };
  }
  if (value.trim().length > maxLength) {
    return { field, message: `${field} must not exceed ${maxLength} characters` };
  }
  return null;
}

/** Returns a validation error if value is not in the allowed set */
export function assertEnum(
  value: unknown,
  field: string,
  allowed: Set<string>
): ValidationError | null {
  if (typeof value !== 'string' || !allowed.has(value)) {
    return {
      field,
      message: `${field} must be one of: ${[...allowed].join(', ')}`,
    };
  }
  return null;
}

/** Returns a validation error if value is not a positive integer */
export function assertPositiveInt(
  value: unknown,
  field: string,
  max = 9999
): ValidationError | null {
  const n = Number(value);
  if (!Number.isInteger(n) || n < 1 || n > max) {
    return { field, message: `${field} must be a positive integer (1–${max})` };
  }
  return null;
}

/** Sanitise a reason string — trim whitespace, truncate if needed */
export function sanitiseReason(reason: unknown, maxLength = 500): string {
  if (typeof reason !== 'string') return 'No reason provided';
  return reason.trim().slice(0, maxLength);
}
