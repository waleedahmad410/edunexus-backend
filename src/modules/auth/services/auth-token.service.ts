import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';

import { SuperAdminAccessTokenPayload } from '../types/token-payload.type';

@Injectable()
export class AuthTokenService {
  constructor(
    @Inject(JwtService)
    private readonly jwt: JwtService,
    @Inject(ConfigService)
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
