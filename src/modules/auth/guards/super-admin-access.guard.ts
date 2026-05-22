import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EntityManager } from '@mikro-orm/postgresql';

import { SuperAdminProfile } from '../../super-admin/entities/super-admin-profile.entity';
import { RefreshToken } from '../entities/refresh-token.entity';
import { SuperAdminAuthRequest } from '../types/auth-request.type';
import { SuperAdminAccessTokenPayload } from '../types/token-payload.type';

@Injectable()
export class SuperAdminAccessGuard implements CanActivate {
  constructor(
    @Inject(JwtService)
    private readonly jwt: JwtService,
    @Inject(EntityManager)
    private readonly em: EntityManager,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<SuperAdminAuthRequest>();

    const token = this.extractBearerToken(request.headers.authorization);

    let payload: SuperAdminAccessTokenPayload;

    try {
      payload = await this.jwt.verifyAsync<SuperAdminAccessTokenPayload>(token);
    } catch {
      throw new UnauthorizedException('Invalid or expired access token');
    }

    if (!payload.sub || !payload.rtid || payload.role !== 'SUPER_ADMIN') {
      throw new ForbiddenException('Super admin access required');
    }

    const refreshTokenRecord = await this.em.findOne(
      RefreshToken,
      {
        id: payload.rtid,
      },
      {
        populate: ['user'],
      },
    );

    if (
      !refreshTokenRecord ||
      refreshTokenRecord.revokedAt ||
      refreshTokenRecord.expiresAt <= new Date()
    ) {
      throw new UnauthorizedException('Session expired');
    }

    const user = refreshTokenRecord.user;

    if (user.id !== payload.sub || user.status !== 'ACTIVE' || user.deletedAt) {
      throw new UnauthorizedException('Invalid user session');
    }

    const profile = await this.em.findOne(SuperAdminProfile, {
      user,
      deletedAt: null,
    });

    if (!profile || profile.status !== 'ACTIVE') {
      throw new ForbiddenException('Super admin profile is not active');
    }

    request.superAdmin = {
      userId: user.id,
      refreshTokenId: refreshTokenRecord.id,
      email: user.email,
      accessLevel: profile.accessLevel,
    };

    return true;
  }

  private extractBearerToken(authorization?: string): string {
    if (!authorization) {
      throw new UnauthorizedException('Missing authorization header');
    }

    const [type, token] = authorization.trim().split(/\s+/);

    if (type?.toLowerCase() !== 'bearer' || !token) {
      throw new UnauthorizedException('Invalid authorization header');
    }

    return token;
  }
}
