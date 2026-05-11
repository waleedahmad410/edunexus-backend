// src/modules/auth/auth.module.ts

import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { PasswordResetToken } from './entities/password-reset-token.entity';
import { Session } from './entities/login-session.entity';

@Module({
  imports: [MikroOrmModule.forFeature([PasswordResetToken, Session])],
  exports: [MikroOrmModule],
})
export class AuthModule {}
