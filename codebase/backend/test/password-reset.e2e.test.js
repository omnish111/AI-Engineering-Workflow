import test from 'node:test';
import assert from 'node:assert';
import { PasswordResetController } from '../src/auth/controllers/password-reset.controller.ts';
import { PasswordResetService } from '../src/auth/services/password-reset.service.ts';
import { PasswordResetTokenRepository } from '../src/auth/repositories/password-reset-token.repository.ts';
import { UserRepository } from '../src/auth/repositories/user.repository.ts';
import { EmailService } from '../src/auth/services/email.service.ts';

function createE2ESystem() {
  const tokenRepo = new PasswordResetTokenRepository();
  const userRepo = new UserRepository();
  const emailService = new EmailService();
  const service = new PasswordResetService(tokenRepo, userRepo, emailService);
  const controller = new PasswordResetController(service);

  return {
    tokenRepo,
    userRepo,
    emailService,
    service,
    controller
  };
}

test('E2E: Full Happy Path - Request reset, receive token, update password, verify authentication', async () => {
  const { userRepo, emailService, controller } = createE2ESystem();

  // 1. Arrange: Existing user in system
  const userEmail = 'founder@company.com';
  const initialPassword = 'InitialPassword!123';
  const initialHash = 'temp-salt:initial-hash';
  const user = await userRepo.createUser(userEmail, initialHash);
  assert.ok(user.id);

  // 2. Act: Request password reset
  const requestRes = await controller.requestReset({ email: userEmail });
  assert.strictEqual(requestRes.statusCode, 200);
  assert.ok(requestRes.message.includes('If your email is registered'));

  // 3. Inspect: Outgoing mail queue for token
  const sent = emailService.getSentEmails();
  assert.strictEqual(sent.length, 1);
  assert.strictEqual(sent[0].to, userEmail);

  // Extract the 64-character token from email text
  const match = sent[0].text.match(/[0-9a-fA-F]{64}/);
  assert.ok(match, 'Email body should contain 64-character hex token');
  const token = match[0];

  // 4. Act: Confirm password reset with new strong password
  const newPassword = 'NewlyUpdatedStrongPassword#2026';
  const confirmRes = await controller.confirmReset({
    token,
    newPassword
  });

  assert.strictEqual(confirmRes.statusCode, 200);
  assert.strictEqual(confirmRes.message, 'Your password has been successfully updated.');

  // 5. Assert: User in database has new hash and verifies correctly
  const updatedUser = await userRepo.findById(user.id);
  assert.ok(updatedUser);
  assert.notStrictEqual(updatedUser.passwordHash, initialHash);

  const authSuccess = PasswordResetService.verifyPassword(newPassword, updatedUser.passwordHash);
  assert.strictEqual(authSuccess, true, 'New password should authenticate cleanly');

  const oldAuthFails = PasswordResetService.verifyPassword(initialPassword, updatedUser.passwordHash);
  assert.strictEqual(oldAuthFails, false, 'Old password must fail authentication');
});

test('E2E: Single-Use Guarantee - Token cannot be used more than once', async () => {
  const { userRepo, emailService, controller } = createE2ESystem();
  const userEmail = 'single@company.com';
  await userRepo.createUser(userEmail, 'hash');

  await controller.requestReset({ email: userEmail });
  const token = emailService.getSentEmails()[0].text.match(/[0-9a-fA-F]{64}/)[0];

  // First use -> OK
  const res1 = await controller.confirmReset({ token, newPassword: 'FirstPassword#123' });
  assert.strictEqual(res1.statusCode, 200);

  // Second use -> REJECTED
  const res2 = await controller.confirmReset({ token, newPassword: 'SecondPassword#456' });
  assert.strictEqual(res2.statusCode, 400);
  assert.ok(res2.error.includes('already been used'));
});

test('E2E: Enumeration Prevention - Non-existent user receives same response and no email is sent', async () => {
  const { emailService, controller } = createE2ESystem();
  const nonExistentEmail = 'hacker-target@nowhere.io';

  const res = await controller.requestReset({ email: nonExistentEmail });
  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(
    res.message,
    'If your email is registered in our system, you will receive password reset instructions shortly.'
  );

  // Email queue MUST be empty
  assert.strictEqual(emailService.getSentEmails().length, 0);
});

test('E2E: Multiple Reset Requests - Prior tokens are invalidated when new request is made', async () => {
  const { userRepo, emailService, controller } = createE2ESystem();
  const email = 'multi@company.com';
  await userRepo.createUser(email, 'hash');

  // Request 1
  await controller.requestReset({ email });
  const token1 = emailService.getSentEmails()[0].text.match(/[0-9a-fA-F]{64}/)[0];

  // Request 2
  await controller.requestReset({ email });
  const token2 = emailService.getSentEmails()[1].text.match(/[0-9a-fA-F]{64}/)[0];
  assert.notStrictEqual(token1, token2, 'New token should be uniquely generated');

  // Attempting to use Token 1 should FAIL because it was invalidated by Request 2
  const res1 = await controller.confirmReset({ token: token1, newPassword: 'PasswordOne#123' });
  assert.strictEqual(res1.statusCode, 400);
  assert.ok(res1.error.includes('invalid or has already been used'));

  // Using Token 2 should SUCCEED
  const res2 = await controller.confirmReset({ token: token2, newPassword: 'PasswordTwo#456' });
  assert.strictEqual(res2.statusCode, 200);
});

test('E2E: Complexity Rejection - Fails fast when password does not satisfy security policy', async () => {
  const { userRepo, emailService, controller } = createE2ESystem();
  const email = 'complex@company.com';
  await userRepo.createUser(email, 'hash');

  await controller.requestReset({ email });
  const token = emailService.getSentEmails()[0].text.match(/[0-9a-fA-F]{64}/)[0];

  const weakPasswords = [
    { pwd: 'short1!', reason: 'length' },
    { pwd: 'alllowercasewithnumbers123!', reason: 'uppercase' },
    { pwd: 'ALLUPPERCASEWITHNUMBERS123!', reason: 'lowercase' },
    { pwd: 'NoNumbersInThisPassword!', reason: 'number' },
    { pwd: 'NoSpecialCharsInThisPassword1', reason: 'special character' }
  ];

  for (const { pwd } of weakPasswords) {
    const res = await controller.confirmReset({ token, newPassword: pwd });
    assert.strictEqual(res.statusCode, 400);
    assert.strictEqual(res.message, 'Password reset failed');
  }
});
