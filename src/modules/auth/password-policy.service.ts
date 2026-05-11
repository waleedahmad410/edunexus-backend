// src/modules/auth/services/password-policy.service.ts

import { BadRequestException, Injectable } from '@nestjs/common';
import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from './constants/password.constants';

@Injectable()
export class PasswordPolicyService {
  normalize(password: string): string {
    return password.normalize('NFKC');
  }

  validateOrThrow(password: string): void {
    if (!password) {
      throw new BadRequestException('Password is required.');
    }

    const normalizedPassword = this.normalize(password);

    if (normalizedPassword.length < PASSWORD_MIN_LENGTH) {
      throw new BadRequestException(
        `Password must be at least ${PASSWORD_MIN_LENGTH} characters long.`,
      );
    }

    if (normalizedPassword.length > PASSWORD_MAX_LENGTH) {
      throw new BadRequestException(
        `Password must not be longer than ${PASSWORD_MAX_LENGTH} characters.`,
      );
    }

    if (!/[A-Z]/.test(normalizedPassword)) {
      throw new BadRequestException(
        'Password must contain at least one uppercase letter.',
      );
    }

    if (!/[a-z]/.test(normalizedPassword)) {
      throw new BadRequestException(
        'Password must contain at least one lowercase letter.',
      );
    }

    if (!/[0-9]/.test(normalizedPassword)) {
      throw new BadRequestException(
        'Password must contain at least one number.',
      );
    }

    if (!/[^A-Za-z0-9]/.test(normalizedPassword)) {
      throw new BadRequestException(
        'Password must contain at least one special character.',
      );
    }
  }
}
