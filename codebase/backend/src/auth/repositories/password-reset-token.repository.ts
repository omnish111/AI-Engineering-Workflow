import { randomUUID } from 'crypto';
import type { PasswordResetToken, CreatePasswordResetTokenInput } from '../entities/password-reset-token.entity.ts';

export interface IPasswordResetTokenRepository {
  create(input: CreatePasswordResetTokenInput): Promise<PasswordResetToken>;
  saveToken(input: CreatePasswordResetTokenInput): Promise<PasswordResetToken>;
  findByTokenHash(tokenHash: string): Promise<PasswordResetToken | null>;
  markAsUsed(id: string): Promise<void>;
  invalidateExistingUserTokens(email: string): Promise<void>;
}

/**
 * In-Memory / Extensible implementation of PasswordResetTokenRepository
 * Supports persistence layer plug-in while honoring the Repository pattern.
 */
export class PasswordResetTokenRepository implements IPasswordResetTokenRepository {
  private readonly tokens: Map<string, PasswordResetToken> = new Map();

  async create(input: CreatePasswordResetTokenInput): Promise<PasswordResetToken> {
    return this.saveToken(input);
  }

  async saveToken(input: CreatePasswordResetTokenInput): Promise<PasswordResetToken> {
    const token: PasswordResetToken = {
      id: randomUUID(),
      email: input.email.toLowerCase().trim(),
      tokenHash: input.tokenHash,
      expiresAt: input.expiresAt,
      isUsed: false,
      createdAt: new Date()
    };
    this.tokens.set(token.id, token);
    return { ...token };
  }

  async findByTokenHash(tokenHash: string): Promise<PasswordResetToken | null> {
    for (const token of this.tokens.values()) {
      if (token.tokenHash === tokenHash) {
        return { ...token };
      }
    }
    return null;
  }

  async markAsUsed(id: string): Promise<void> {
    const token = this.tokens.get(id);
    if (token) {
      token.isUsed = true;
      this.tokens.set(id, token);
    }
  }

  async invalidateExistingUserTokens(email: string): Promise<void> {
    const normalizedEmail = email.toLowerCase().trim();
    for (const [id, token] of this.tokens.entries()) {
      if (token.email === normalizedEmail && !token.isUsed) {
        token.isUsed = true;
        this.tokens.set(id, token);
      }
    }
  }
}
