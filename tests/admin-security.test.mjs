import test from 'node:test';
import assert from 'node:assert/strict';
import {
  generateAdminToken,
  verifyAdminToken,
  checkRateLimit,
  recordFailedAttempt,
  clearFailedAttempts,
  DEFAULT_ADMIN_PASSWORD
} from '../src/lib/auth/adminAuth.ts';

test('Security: Default Admin Password is set and non-empty', () => {
  assert.ok(DEFAULT_ADMIN_PASSWORD);
  assert.equal(typeof DEFAULT_ADMIN_PASSWORD, 'string');
  assert.ok(DEFAULT_ADMIN_PASSWORD.length >= 6);
});

test('Security: HMAC Admin Token generation and verification', () => {
  const token = generateAdminToken();
  assert.ok(token);
  assert.ok(token.includes('.'));

  // Valid token verifies successfully
  const isValid = verifyAdminToken(token);
  assert.equal(isValid, true, 'Newly generated admin token should be valid');

  // Tampered token fails
  const tamperedToken = token + 'tampered';
  assert.equal(verifyAdminToken(tamperedToken), false, 'Tampered token must be rejected');

  // Random string fails
  assert.equal(verifyAdminToken('invalid.token.structure'), false);
  assert.equal(verifyAdminToken(''), false);
  assert.equal(verifyAdminToken(undefined), false);
});

test('Security: Rate limiting locks out IP after 5 consecutive failed attempts', () => {
  const testIp = '192.168.1.99';
  clearFailedAttempts(testIp);

  // First 4 attempts should still be allowed
  for (let i = 0; i < 4; i++) {
    const check = checkRateLimit(testIp);
    assert.equal(check.allowed, true, `Attempt ${i + 1} should be allowed`);
    recordFailedAttempt(testIp);
  }

  // 5th attempt records lockout
  recordFailedAttempt(testIp);

  // Now rate limit must block the IP
  const checkAfter5 = checkRateLimit(testIp);
  assert.equal(checkAfter5.allowed, false, 'IP must be locked after 5 failed attempts');
  assert.ok(checkAfter5.waitSeconds && checkAfter5.waitSeconds > 0);

  // Resetting works
  clearFailedAttempts(testIp);
  assert.equal(checkRateLimit(testIp).allowed, true, 'IP should be unblocked after clearing');
});
