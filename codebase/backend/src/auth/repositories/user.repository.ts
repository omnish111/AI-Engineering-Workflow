import { randomUUID } from 'crypto';
import type { User } from '../entities/user.entity.ts';

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  updatePassword(userId: string, newPasswordHash: string): Promise<void>;
  createUser(email: string, passwordHash: string): Promise<User>;
}

/**
 * In-Memory / Extensible implementation of UserRepository
 * Supports persistence layer plug-in while honoring the Repository pattern.
 */
export class UserRepository implements IUserRepository {
  private readonly users: Map<string, User> = new Map();

  async findByEmail(email: string): Promise<User | null> {
    const normalized = email.toLowerCase().trim();
    for (const user of this.users.values()) {
      if (user.email === normalized) {
        return { ...user };
      }
    }
    return null;
  }

  async findById(id: string): Promise<User | null> {
    const user = this.users.get(id);
    return user ? { ...user } : null;
  }

  async updatePassword(userId: string, newPasswordHash: string): Promise<void> {
    const user = this.users.get(userId);
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }
    user.passwordHash = newPasswordHash;
    user.updatedAt = new Date();
    this.users.set(userId, user);
  }

  async createUser(email: string, passwordHash: string): Promise<User> {
    const user: User = {
      id: randomUUID(),
      email: email.toLowerCase().trim(),
      passwordHash,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.set(user.id, user);
    return { ...user };
  }
}
