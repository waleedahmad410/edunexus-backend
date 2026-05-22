import { Inject, Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';

import { ARGON2_OPTIONS } from '../constants/password.constants';
import { PasswordPolicyService } from './password-policy.service';

@Injectable()
export class PasswordService {
  constructor(
    @Inject(PasswordPolicyService)
    private readonly passwordPolicyService: PasswordPolicyService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    this.passwordPolicyService.validateOrThrow(password);

    const normalizedPassword = this.passwordPolicyService.normalize(password);

    return argon2.hash(normalizedPassword, ARGON2_OPTIONS);
  }

  async verifyPassword(
    password: string,
    storedPasswordHash?: string | null,
  ): Promise<boolean> {
    if (!password || !storedPasswordHash) {
      return false;
    }

    try {
      const normalizedPassword = this.passwordPolicyService.normalize(password);

      return await argon2.verify(storedPasswordHash, normalizedPassword);
    } catch {
      return false;
    }
  }

  needsRehash(storedPasswordHash?: string | null): boolean {
    if (!storedPasswordHash) {
      return true;
    }

    try {
      return argon2.needsRehash(storedPasswordHash, ARGON2_OPTIONS);
    } catch {
      return true;
    }
  }
}
