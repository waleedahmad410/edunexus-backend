// src/modules/auth/auth.module.ts

import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { PasswordResetToken } from './entities/password-reset-token.entity';
import { Session } from './entities/login-session.entity';
import { PasswordService } from './password.service';

@Module({
  imports: [MikroOrmModule.forFeature([PasswordResetToken, Session])],
  exports: [MikroOrmModule, PasswordService],
  providers: [PasswordService],
})
export class AuthModule {}
