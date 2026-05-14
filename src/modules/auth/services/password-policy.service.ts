import { BadRequestException, Injectable } from '@nestjs/common';

import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from '../constants/password.constants';

@Injectable()
export class PasswordPolicyService {
  normalize(password: string): string {
    return password.normalize('NFKC');
  }

  validateOrThrow(password: string): void {
    if (typeof password !== 'string' || password.length === 0) {
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
  }
}
