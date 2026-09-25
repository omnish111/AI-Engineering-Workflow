/**
 * Password Reset Token Entity
 * Follows layered architecture entity rules (shape definition only, no business logic).
 */

export interface PasswordResetToken {
  readonly id: string;
  readonly email: string;
  readonly tokenHash: string;
  readonly expiresAt: Date;
  isUsed: boolean;
  readonly createdAt: Date;
}

export interface CreatePasswordResetTokenInput {
  readonly email: string;
  readonly tokenHash: string;
  readonly expiresAt: Date;
}
