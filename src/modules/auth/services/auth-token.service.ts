import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';

import { SuperAdminAccessTokenPayload } from '../types/token-payload.type';

@Injectable()
export class AuthTokenService {
  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  signSuperAdminAccessToken(
    payload: SuperAdminAccessTokenPayload,
  ): Promise<string> {
    const expiresIn = this.config.getOrThrow<string>(
      'JWT_ACCESS_EXPIRES_IN',
    ) as JwtSignOptions['expiresIn'];

    return this.jwt.signAsync(payload, {
      expiresIn,
    });
  }
}
