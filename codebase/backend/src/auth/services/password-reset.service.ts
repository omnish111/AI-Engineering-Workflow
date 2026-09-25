import { randomBytes, createHash, scryptSync, timingSafeEqual } from 'crypto';
import type { IPasswordResetTokenRepository } from '../repositories/password-reset-token.repository.ts';
import type { IUserRepository } from '../repositories/user.repository.ts';
import type { IEmailService } from './email.service.ts';

export interface RequestResetResult {
  readonly success: boolean;
  readonly message: string;
  readonly debugToken?: string; // only provided in dev/testing mode
}

export interface ConfirmResetResult {
  readonly success: boolean;
  readonly message: string;
}

export class PasswordResetService {
  private static readonly TOKEN_EXPIRATION_MINUTES = 15;
  private static readonly GENERIC_SUCCESS_MESSAGE = 
    'If your email is registered in our system, you will receive password reset instructions shortly.';

  private readonly tokenRepo: IPasswordResetTokenRepository;
  private readonly userRepo: IUserRepository;
  private readonly emailService: IEmailService;

  constructor(
    tokenRepo: IPasswordResetTokenRepository,
    userRepo: IUserRepository,
    emailService: IEmailService
  ) {
    this.tokenRepo = tokenRepo;
    this.userRepo = userRepo;
    this.emailService = emailService;
  }

  /**
   * Request password reset token.
   * Protects against user enumeration by returning identical generic success response.
   */
  async requestPasswordReset(email: string, isDevMode = false): Promise<RequestResetResult> {
    const normalizedEmail = email.toLowerCase().trim();
    const user = await this.userRepo.findByEmail(normalizedEmail);

    if (!user) {
      return { success: true, message: PasswordResetService.GENERIC_SUCCESS_MESSAGE };
    }

    // Invalidate existing active tokens for this user
    await this.tokenRepo.invalidateExistingUserTokens(normalizedEmail);

    // Generate cryptographically secure token
    const rawToken = randomBytes(32).toString('hex');
    const tokenHash = this.hashToken(rawToken);
    const expiresAt = new Date(Date.now() + PasswordResetService.TOKEN_EXPIRATION_MINUTES * 60 * 1000);

    await this.tokenRepo.saveToken({
      email: normalizedEmail,
      tokenHash,
      expiresAt
    });

    await this.emailService.sendPasswordResetEmail(normalizedEmail, rawToken);

    return {
      success: true,
      message: PasswordResetService.GENERIC_SUCCESS_MESSAGE,
      ...(isDevMode ? { debugToken: rawToken } : {})
    };
  }

  /**
   * Confirm password reset and update password.
   */
  async confirmPasswordReset(rawToken: string, newPassword: string): Promise<ConfirmResetResult> {
    if (!rawToken || typeof rawToken !== 'string') {
      return { success: false, message: 'Invalid or missing reset token.' };
    }

    const validationError = this.validatePasswordStrength(newPassword);
    if (validationError) {
      return { success: false, message: validationError };
    }

    const tokenHash = this.hashToken(rawToken);
    const tokenRecord = await this.tokenRepo.findByTokenHash(tokenHash);

    if (!tokenRecord || tokenRecord.isUsed) {
      return { success: false, message: 'Password reset token is invalid or has already been used.' };
    }

    if (new Date() > new Date(tokenRecord.expiresAt)) {
      await this.tokenRepo.markAsUsed(tokenRecord.id);
      return { success: false, message: 'Password reset token has expired. Please request a new one.' };
    }

    const user = await this.userRepo.findByEmail(tokenRecord.email);
    if (!user) {
      return { success: false, message: 'Associated user account not found.' };
    }

    const newHashedPassword = this.hashPassword(newPassword);
    await this.userRepo.updatePassword(user.id, newHashedPassword);
    await this.tokenRepo.markAsUsed(tokenRecord.id);

    return {
      success: true,
      message: 'Your password has been successfully updated.'
    };
  }

  /**
   * Validates password meets security rules: min 8 chars, upper, lower, number, special.
   */
  validatePasswordStrength(password: string): string | null {
    if (!password || password.length < 8) {
      return 'Password must be at least 8 characters long.';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter.';
    }
    if (!/[a-z]/.test(password)) {
      return 'Password must contain at least one lowercase letter.';
    }
    if (!/[0-9]/.test(password)) {
      return 'Password must contain at least one number.';
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      return 'Password must contain at least one special character.';
    }
    return null;
  }

  private hashToken(rawToken: string): string {
    return createHash('sha256').update(rawToken).digest('hex');
  }

  private hashPassword(password: string): string {
    const salt = randomBytes(16).toString('hex');
    const hash = scryptSync(password, salt, 64).toString('hex');
    return `${salt}:${hash}`;
  }

  static verifyPassword(password: string, storedHash: string): boolean {
    const [salt, key] = storedHash.split(':');
    if (!salt || !key) return false;
    const derivedKey = scryptSync(password, salt, 64);
    const keyBuffer = Buffer.from(key, 'hex');
    return timingSafeEqual(derivedKey, keyBuffer);
  }
}
