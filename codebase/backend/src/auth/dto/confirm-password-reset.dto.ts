/**
 * Confirm Password Reset DTO
 * Input validation for password reset confirmation endpoint.
 */

export interface ConfirmPasswordResetDto {
  readonly token: string;
  readonly newPassword: string;
}

export function validateConfirmPasswordResetDto(dto: unknown): { valid: boolean; error?: string; data?: ConfirmPasswordResetDto } {
  if (!dto || typeof dto !== 'object') {
    return { valid: false, error: 'Request body must be a JSON object.' };
  }

  const record = dto as Record<string, unknown>;
  const token = record.token;
  const newPassword = record.newPassword;

  if (!token || typeof token !== 'string') {
    return { valid: false, error: 'Reset token is required.' };
  }

  const trimmedToken = token.trim();
  if (!/^[0-9a-fA-F]{64}$/.test(trimmedToken)) {
    return { valid: false, error: 'Reset token must be a valid 64-character hexadecimal string.' };
  }

  if (!newPassword || typeof newPassword !== 'string') {
    return { valid: false, error: 'New password is required and must be a string.' };
  }

  return {
    valid: true,
    data: {
      token: trimmedToken,
      newPassword
    }
  };
}
