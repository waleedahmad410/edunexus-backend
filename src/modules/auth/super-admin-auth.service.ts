import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EntityManager } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';

import { User } from '../users/entities/user.entity';
import { SuperAdminProfile } from '../super-admin/entities/super-admin-profile.entity';
import { RefreshToken } from './entities/refresh-token.entity';

import { SuperAdminLoginDto } from './dto/super-admin-login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import {
  SuperAdminLoginResponseDto,
  SuperAdminMessageResponseDto,
  SuperAdminRefreshResponseDto,
} from './dto/super-admin-auth.response.dto';

import { AuthCryptoService } from './services/auth-crypto.service';
import { AuthTokenService } from './services/auth-token.service';
import { PasswordService } from './services/password.service';

type DurationUnit = 's' | 'm' | 'h' | 'd';

@Injectable()
export class SuperAdminAuthService {
  constructor(
    private readonly em: EntityManager,
    private readonly crypto: AuthCryptoService,
    private readonly tokens: AuthTokenService,
    private readonly passwordService: PasswordService,
    private readonly config: ConfigService,

    @InjectRepository(RefreshToken)
    private readonly refreshTokensRepo: EntityRepository<RefreshToken>,
  ) {}

  async login(dto: SuperAdminLoginDto): Promise<SuperAdminLoginResponseDto> {
    const email = dto.email.trim().toLowerCase();

    return this.em.transactional(async (em) => {
      const user = await em.findOne(User, {
        email,
        deletedAt: null,
      });

      if (!user) {
        throw new UnauthorizedException('Invalid email or password');
      }

      const validPassword = await this.passwordService.verifyPassword(
        dto.password,
        user.passwordHash,
      );

      if (!validPassword) {
        throw new UnauthorizedException('Invalid email or password');
      }

      if (user.status !== 'ACTIVE') {
        throw new ForbiddenException('User account is not active');
      }

      const refreshTokenRecord = new RefreshToken();

      refreshTokenRecord.user = user;
      refreshTokenRecord.expiresAt = this.getRefreshTokenExpiryDate();

      const { refreshToken, refreshTokenHash } = this.crypto.createRefreshToken(
        refreshTokenRecord.id,
      );

      refreshTokenRecord.tokenHash = refreshTokenHash;
      user.lastLoginAt = new Date();

      em.persist(refreshTokenRecord);
      await em.flush();

      const accessToken = await this.tokens.signSuperAdminAccessToken({
        sub: user.id,
        rtid: refreshTokenRecord.id,
        role: 'SUPER_ADMIN',
      });

      return {
        accessToken,
        refreshToken,
      };
    });
  }

  async refresh(dto: RefreshTokenDto): Promise<SuperAdminRefreshResponseDto> {
    const { refreshTokenId, secret } = this.crypto.parseRefreshToken(
      dto.refreshToken,
    );

    return this.em.transactional(async (em) => {
      const refreshTokenRecord = await em.findOne(
        RefreshToken,
        {
          id: refreshTokenId,
        },
        {
          populate: ['user'],
        },
      );

      if (!refreshTokenRecord || refreshTokenRecord.revokedAt) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      if (refreshTokenRecord.expiresAt <= new Date()) {
        refreshTokenRecord.revokedAt = new Date();
        await em.flush();

        throw new UnauthorizedException('Refresh token expired');
      }

      const incomingHash = this.crypto.hashRefreshSecret(secret);

      if (!this.crypto.safeEqual(refreshTokenRecord.tokenHash, incomingHash)) {
        refreshTokenRecord.revokedAt = new Date();
        await em.flush();

        throw new UnauthorizedException('Invalid refresh token');
      }

      const user = refreshTokenRecord.user;

      if (user.status !== 'ACTIVE' || user.deletedAt) {
        throw new ForbiddenException('User account is not active');
      }

      const profile = await em.findOne(SuperAdminProfile, {
        user,
        deletedAt: null,
      });

      if (!profile) {
        throw new ForbiddenException('Super admin profile not found');
      }

      if (profile.status !== 'ACTIVE') {
        throw new ForbiddenException('Super admin profile is not active');
      }

      const rotated = this.crypto.createRefreshToken(refreshTokenRecord.id);

      refreshTokenRecord.tokenHash = rotated.refreshTokenHash;
      refreshTokenRecord.expiresAt = this.getRefreshTokenExpiryDate();

      await em.flush();

      const accessToken = await this.tokens.signSuperAdminAccessToken({
        sub: user.id,
        rtid: refreshTokenRecord.id,
        role: 'SUPER_ADMIN',
      });

      return {
        accessToken,
        refreshToken: rotated.refreshToken,
      };
    });
  }

  async logout(refreshTokenId: string): Promise<SuperAdminMessageResponseDto> {
    const refreshTokenRecord = await this.refreshTokensRepo.findOne({
      id: refreshTokenId,
    });

    if (refreshTokenRecord && !refreshTokenRecord.revokedAt) {
      refreshTokenRecord.revokedAt = new Date();
      await this.em.flush();
    }

    return {
      message: 'Logged out successfully',
    };
  }

  async logoutAll(userId: string): Promise<SuperAdminMessageResponseDto> {
    await this.em.nativeUpdate(
      RefreshToken,
      {
        user: userId,
        revokedAt: null,
      },
      {
        revokedAt: new Date(),
      },
    );

    return {
      message: 'All sessions logged out successfully',
    };
  }

  private getRefreshTokenExpiryDate(): Date {
    const expiresIn = this.config.getOrThrow<string>('JWT_REFRESH_EXPIRES_IN');

    return this.addDuration(new Date(), expiresIn);
  }

  private addDuration(date: Date, duration: string): Date {
    const match = /^(\d+)(s|m|h|d)$/i.exec(duration.trim());

    if (!match) {
      throw new Error(
        'Invalid JWT_REFRESH_EXPIRES_IN format. Use values like 15m, 1h, or 7d.',
      );
    }

    const value = Number(match[1]);
    const unit = match[2].toLowerCase() as DurationUnit;

    const millisecondsByUnit: Record<DurationUnit, number> = {
      s: 1000,
      m: 60 * 1000,
      h: 60 * 60 * 1000,
      d: 24 * 60 * 60 * 1000,
    };

    return new Date(date.getTime() + value * millisecondsByUnit[unit]);
  }
}
