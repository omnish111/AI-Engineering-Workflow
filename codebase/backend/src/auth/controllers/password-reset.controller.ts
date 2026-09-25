import { PasswordResetService } from '../services/password-reset.service.ts';
import { validateRequestPasswordResetDto } from '../dto/request-password-reset.dto.ts';
import { validateConfirmPasswordResetDto } from '../dto/confirm-password-reset.dto.ts';

export interface ApiResponse<T = unknown> {
  readonly statusCode: number;
  readonly message: string;
  readonly data?: T;
  readonly error?: string;
}

export class PasswordResetController {
  private readonly passwordResetService: PasswordResetService;

  constructor(passwordResetService: PasswordResetService) {
    this.passwordResetService = passwordResetService;
  }

  /**
   * POST /auth/password-reset/request
   */
  async requestReset(body: unknown, isDevMode = false): Promise<ApiResponse> {
    const validation = validateRequestPasswordResetDto(body);
    if (!validation.valid || !validation.data) {
      return {
        statusCode: 400,
        message: 'Validation failed',
        error: validation.error || 'Invalid request body'
      };
    }

    const result = await this.passwordResetService.requestPasswordReset(validation.data.email, isDevMode);
    return {
      statusCode: 200,
      message: result.message,
      ...(result.debugToken ? { data: { token: result.debugToken } } : {})
    };
  }

  /**
   * POST /auth/password-reset/confirm
   */
  async confirmReset(body: unknown): Promise<ApiResponse> {
    const validation = validateConfirmPasswordResetDto(body);
    if (!validation.valid || !validation.data) {
      return {
        statusCode: 400,
        message: 'Validation failed',
        error: validation.error || 'Invalid request body'
      };
    }

    const result = await this.passwordResetService.confirmPasswordReset(
      validation.data.token,
      validation.data.newPassword
    );

    if (!result.success) {
      return {
        statusCode: 400,
        message: 'Password reset failed',
        error: result.message
      };
    }

    return {
      statusCode: 200,
      message: result.message
    };
  }
}
