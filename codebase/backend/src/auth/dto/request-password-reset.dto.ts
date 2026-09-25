/**
 * Request Password Reset DTO
 * Input validation for password reset request endpoint.
 */

export interface RequestPasswordResetDto {
  readonly email: string;
}

export function validateRequestPasswordResetDto(dto: unknown): { valid: boolean; error?: string; data?: RequestPasswordResetDto } {
  if (!dto || typeof dto !== 'object') {
    return { valid: false, error: 'Request body must be a JSON object.' };
  }

  const email = (dto as Record<string, unknown>).email;

  if (!email || typeof email !== 'string') {
    return { valid: false, error: 'Email is required and must be a string.' };
  }

  const trimmed = email.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) {
    return { valid: false, error: 'Please provide a valid email address.' };
  }

  return { valid: true, data: { email: trimmed.toLowerCase() } };
}
