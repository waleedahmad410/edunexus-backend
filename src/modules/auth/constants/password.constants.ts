import * as argon2 from 'argon2';

export const PASSWORD_MIN_LENGTH = 12;
export const PASSWORD_MAX_LENGTH = 128;

export const ARGON2_OPTIONS: argon2.Options = {
  type: argon2.argon2id,

  // 64 MiB. Argon2 memoryCost is in KiB.
  memoryCost: 65536,

  // Number of iterations.
  timeCost: 3,
  parallelism: 1,
};
