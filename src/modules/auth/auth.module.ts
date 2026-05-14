import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { User } from '../users/entities/user.entity';
import { SuperAdminProfile } from '../super-admin/entities/super-admin-profile.entity';
import { RefreshToken } from './entities/refresh-token.entity';

import { SuperAdminAuthController } from './super-admin-auth.controller';
import { SuperAdminAuthService } from './super-admin-auth.service';

import { AuthCryptoService } from './services/auth-crypto.service';
import { AuthTokenService } from './services/auth-token.service';
import { PasswordService } from './services/password.service';
import { PasswordPolicyService } from './services/password-policy.service';

import { SuperAdminAccessGuard } from './guards/super-admin-access.guard';

@Module({
  imports: [
    ConfigModule,
    MikroOrmModule.forFeature([User, RefreshToken, SuperAdminProfile]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_ACCESS_SECRET'),
      }),
    }),
  ],
  controllers: [SuperAdminAuthController],
  providers: [
    SuperAdminAuthService,
    AuthCryptoService,
    AuthTokenService,
    PasswordService,
    PasswordPolicyService,
    SuperAdminAccessGuard,
  ],
  exports: [SuperAdminAccessGuard],
})
export class AuthModule {}