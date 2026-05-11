// src/modules/students/students.module.ts

import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { SuperAdminProfile } from './entities/super-admin-profile.entity';

@Module({
  imports: [MikroOrmModule.forFeature([SuperAdminProfile])],
  exports: [MikroOrmModule],
})
export class SuperAdminModule {}
