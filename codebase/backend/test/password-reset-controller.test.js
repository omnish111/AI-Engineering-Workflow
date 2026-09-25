import test from 'node:test';
import assert from 'node:assert';
import { PasswordResetController } from '../src/auth/controllers/password-reset.controller.ts';
import { PasswordResetService } from '../src/auth/services/password-reset.service.ts';
import { PasswordResetTokenRepository } from '../src/auth/repositories/password-reset-token.repository.ts';
import { UserRepository } from '../src/auth/repositories/user.repository.ts';
import { EmailService } from '../src/auth/services/email.service.ts';

function createControllerFixture() {
  const tokenRepo = new PasswordResetTokenRepository();
  const userRepo = new UserRepository();
  const emailService = new EmailService();
  const service = new PasswordResetService(tokenRepo, userRepo, emailService);
  const controller = new PasswordResetController(service);
  return { tokenRepo, userRepo, emailService, service, controller };
}

test('Controller requestReset returns 200 for valid email', async () => {
  const { userRepo, controller } = createControllerFixture();
  await userRepo.createUser('test@example.com', 'initial-hash');

  const res = await controller.requestReset({ email: 'test@example.com' });
  assert.strictEqual(res.statusCode, 200);
  assert.ok(res.message.includes('If your email is registered'));
});

test('Controller requestReset returns 400 for invalid email', async () => {
  const { controller } = createControllerFixture();

  const res = await controller.requestReset({ email: 'not-an-email' });
  assert.strictEqual(res.statusCode, 400);
  assert.strictEqual(res.message, 'Validation failed');
  assert.ok(res.error.includes('valid email address'));
});

test('Controller requestReset returns 400 for missing email', async () => {
  const { controller } = createControllerFixture();

  const res = await controller.requestReset({});
  assert.strictEqual(res.statusCode, 400);
  assert.ok(res.error.includes('Email is required'));
});

test('Controller confirmReset returns 200 for valid token and strong password', async () => {
  const { userRepo, controller } = createControllerFixture();
  await userRepo.createUser('bob@example.com', 'initial-hash');

  const reqRes = await controller.requestReset({ email: 'bob@example.com' }, true);
  const token = reqRes.data.token;

  const res = await controller.confirmReset({
    token,
    newPassword: 'BrandNewPassword@99'
  });

  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.message, 'Your password has been successfully updated.');
});

test('Controller confirmReset returns 400 for invalid token format', async () => {
  const { controller } = createControllerFixture();

  const res = await controller.confirmReset({
    token: 'short-invalid-token',
    newPassword: 'BrandNewPassword@99'
  });

  assert.strictEqual(res.statusCode, 400);
  assert.ok(res.error.includes('64-character hexadecimal'));
});

test('Controller confirmReset returns 400 when password does not meet security criteria', async () => {
  const { userRepo, controller } = createControllerFixture();
  await userRepo.createUser('dan@example.com', 'hash');

  const reqRes = await controller.requestReset({ email: 'dan@example.com' }, true);
  const token = reqRes.data.token;

  const res = await controller.confirmReset({
    token,
    newPassword: 'weak'
  });

  assert.strictEqual(res.statusCode, 400);
  assert.ok(res.error.includes('at least 8 characters'));
});
