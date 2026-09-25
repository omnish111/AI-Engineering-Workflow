import test from 'node:test';
import assert from 'node:assert';
import { PasswordResetService } from '../src/auth/services/password-reset.service.ts';
import { PasswordResetTokenRepository } from '../src/auth/repositories/password-reset-token.repository.ts';
import { UserRepository } from '../src/auth/repositories/user.repository.ts';
import { EmailService } from '../src/auth/services/email.service.ts';

function createServiceFixture() {
  const tokenRepo = new PasswordResetTokenRepository();
  const userRepo = new UserRepository();
  const emailService = new EmailService();
  const service = new PasswordResetService(tokenRepo, userRepo, emailService);
  return { tokenRepo, userRepo, emailService, service };
}

test('Password reset request generates token and sends email for existing user', async () => {
  const { userRepo, emailService, service } = createServiceFixture();
  const email = 'alex@example.com';
  await userRepo.createUser(email, 'initial-password-hash');

  const result = await service.requestPasswordReset(email, true);
  assert.strictEqual(result.success, true);
  assert.ok(result.debugToken);

  const sent = emailService.getSentEmails();
  assert.strictEqual(sent.length, 1);
  assert.strictEqual(sent[0].to, email);
  assert.ok(sent[0].text.includes(result.debugToken));
});

test('Password reset request protects against user enumeration for unknown email', async () => {
  const { emailService, service } = createServiceFixture();
  const unknownEmail = 'doesnotexist@example.com';

  const result = await service.requestPasswordReset(unknownEmail, true);
  assert.strictEqual(result.success, true);
  assert.strictEqual(
    result.message,
    'If your email is registered in our system, you will receive password reset instructions shortly.'
  );

  // No email should be sent for non-existent users
  const sent = emailService.getSentEmails();
  assert.strictEqual(sent.length, 0);
});

test('Password reset confirm updates password successfully with valid token', async () => {
  const { userRepo, service } = createServiceFixture();
  const email = 'carol@example.com';
  const user = await userRepo.createUser(email, 'initial-hash');

  const reqResult = await service.requestPasswordReset(email, true);
  const token = reqResult.debugToken;
  const newPassword = 'SecureNewPassword!99';

  const confirmResult = await service.confirmPasswordReset(token, newPassword);
  assert.strictEqual(confirmResult.success, true);
  assert.strictEqual(confirmResult.message, 'Your password has been successfully updated.');

  const updatedUser = await userRepo.findById(user.id);
  assert.notStrictEqual(updatedUser.passwordHash, 'initial-hash');
  assert.strictEqual(PasswordResetService.verifyPassword(newPassword, updatedUser.passwordHash), true);
});

test('Password reset rejects weak passwords', async () => {
  const { userRepo, service } = createServiceFixture();
  const email = 'weak@example.com';
  await userRepo.createUser(email, 'hash');

  const req = await service.requestPasswordReset(email, true);
  const token = req.debugToken;

  // Too short
  let res = await service.confirmPasswordReset(token, 'Short1!');
  assert.strictEqual(res.success, false);
  assert.ok(res.message.includes('at least 8 characters'));

  // No uppercase
  res = await service.confirmPasswordReset(token, 'lowercaseonly1!');
  assert.strictEqual(res.success, false);
  assert.ok(res.message.includes('uppercase'));

  // No special character
  res = await service.confirmPasswordReset(token, 'NoSpecialChar123');
  assert.strictEqual(res.success, false);
  assert.ok(res.message.includes('special character'));
});

test('Password reset prevents token reuse (single-use constraint)', async () => {
  const { userRepo, service } = createServiceFixture();
  const email = 'singleuse@example.com';
  await userRepo.createUser(email, 'hash');

  const req = await service.requestPasswordReset(email, true);
  const token = req.debugToken;
  const newPassword = 'ValidPassword@123';

  const firstUse = await service.confirmPasswordReset(token, newPassword);
  assert.strictEqual(firstUse.success, true);

  const secondUse = await service.confirmPasswordReset(token, 'AnotherPassword@456');
  assert.strictEqual(secondUse.success, false);
  assert.ok(secondUse.message.includes('already been used'));
});

test('Password reset rejects expired tokens', async () => {
  const { tokenRepo, userRepo, emailService } = createServiceFixture();
  const service = new PasswordResetService(tokenRepo, userRepo, emailService);
  const email = 'expired@example.com';
  await userRepo.createUser(email, 'hash');

  // Manually insert an expired token record
  const { createHash } = await import('node:crypto');
  const rawToken = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
  const tokenHash = createHash('sha256').update(rawToken).digest('hex');
  const pastDate = new Date(Date.now() - 60000); // 1 minute ago

  await tokenRepo.create({
    email,
    tokenHash,
    expiresAt: pastDate
  });

  const res = await service.confirmPasswordReset(rawToken, 'ValidPassword@123');
  assert.strictEqual(res.success, false);
  assert.ok(res.message.includes('expired'));
});
