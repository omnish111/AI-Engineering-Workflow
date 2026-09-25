/**
 * User Entity
 * Follows layered architecture entity rules (shape definition only).
 */

export interface User {
  readonly id: string;
  readonly email: string;
  passwordHash: string;
  readonly createdAt: Date;
  updatedAt: Date;
}
