import test from 'node:test';
import assert from 'node:assert';
import { randomBytes, createHash } from 'node:crypto';

import { PasswordResetTokenRepository } from '../src/auth/repositories/password-reset-token.repository.ts';
import { UserRepository } from '../src/auth/repositories/user.repository.ts';

test('PasswordResetTokenRepository creates and retrieves tokens correctly', async () => {
  const repo = new PasswordResetTokenRepository();
  const rawToken = randomBytes(32).toString('hex');
  const tokenHash = createHash('sha256').update(rawToken).digest('hex');
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  const created = await repo.create({
    email: 'user@example.com',
    tokenHash,
    expiresAt
  });

  assert.ok(created.id, 'Token should have an ID');
  assert.strictEqual(created.email, 'user@example.com');
  assert.strictEqual(created.tokenHash, tokenHash);
  assert.strictEqual(created.isUsed, false);

  const found = await repo.findByTokenHash(tokenHash);
  assert.ok(found, 'Should find token by hash');
  assert.strictEqual(found.id, created.id);

  // Mark as used
  await repo.markAsUsed(created.id);
  const updated = await repo.findByTokenHash(tokenHash);
  assert.strictEqual(updated.isUsed, true);
});

test('PasswordResetTokenRepository invalidates existing tokens for email', async () => {
  const repo = new PasswordResetTokenRepository();
  const email = 'user2@example.com';
  
  const token1 = await repo.create({
    email,
    tokenHash: 'hash1',
    expiresAt: new Date(Date.now() + 60000)
  });
  
  const token2 = await repo.create({
    email,
    tokenHash: 'hash2',
    expiresAt: new Date(Date.now() + 60000)
  });

  await repo.invalidateExistingUserTokens(email);

  const found1 = await repo.findByTokenHash('hash1');
  const found2 = await repo.findByTokenHash('hash2');

  assert.strictEqual(found1.isUsed, true);
  assert.strictEqual(found2.isUsed, true);
});

test('UserRepository creates, finds, and updates user password', async () => {
  const userRepo = new UserRepository();
  const email = 'user@example.com';
  
  const user = await userRepo.createUser(email, 'old-hash');
  assert.strictEqual(user.email, email);
  assert.strictEqual(user.passwordHash, 'old-hash');

  const found = await userRepo.findByEmail(email);
  assert.ok(found);
  assert.strictEqual(found.id, user.id);

  await userRepo.updatePassword(user.id, 'new-hashed-password');
  const updated = await userRepo.findById(user.id);
  assert.strictEqual(updated.passwordHash, 'new-hashed-password');
});
