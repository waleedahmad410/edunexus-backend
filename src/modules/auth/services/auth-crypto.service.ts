import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac, randomBytes, timingSafeEqual } from 'crypto';

@Injectable()
export class AuthCryptoService {
  constructor(private readonly config: ConfigService) {}

  createRefreshToken(refreshTokenId: string): {
    refreshToken: string;
    refreshTokenHash: string;
  } {
    if (!refreshTokenId) {
      throw new Error('Refresh token ID is required.');
    }

    const secret = randomBytes(64).toString('base64url');

    return {
      refreshToken: `${refreshTokenId}.${secret}`,
      refreshTokenHash: this.hashRefreshSecret(secret),
    };
  }

  parseRefreshToken(refreshToken: string): {
    refreshTokenId: string;
    secret: string;
  } {
    if (!refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const [refreshTokenId, secret, extra] = refreshToken.split('.');

    if (!refreshTokenId || !secret || extra) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return {
      refreshTokenId,
      secret,
    };
  }

  hashRefreshSecret(secret: string): string {
    const refreshSecret =
      this.config.getOrThrow<string>('JWT_REFRESH_SECRET');

    return createHmac('sha256', refreshSecret).update(secret).digest('hex');
  }

  safeEqual(left: string, right: string): boolean {
    try {
      const leftBuffer = Buffer.from(left, 'hex');
      const rightBuffer = Buffer.from(right, 'hex');

      return (
        leftBuffer.length === rightBuffer.length &&
        timingSafeEqual(leftBuffer, rightBuffer)
      );
    } catch {
      return false;
    }
  }
}