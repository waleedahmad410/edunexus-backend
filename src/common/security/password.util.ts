// src/common/security/password.util.ts

import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

const SCRYPT_KEY_LENGTH = 64;

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, SCRYPT_KEY_LENGTH).toString('hex');

  return `scrypt$${salt}$${hash}`;
}

export function verifyPassword(
  password: string,
  storedPasswordHash: string,
): boolean {
  const [algorithm, salt, storedHash] = storedPasswordHash.split('$');

  if (algorithm !== 'scrypt' || !salt || !storedHash) {
    return false;
  }

  const storedHashBuffer = Buffer.from(storedHash, 'hex');
  const inputHashBuffer = scryptSync(
    password,
    salt,
    storedHashBuffer.length,
  ) as Buffer;

  if (storedHashBuffer.length !== inputHashBuffer.length) {
    return false;
  }

  return timingSafeEqual(storedHashBuffer, inputHashBuffer);
}
