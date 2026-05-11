// src/modules/classes/classes.module.ts

import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { SchoolClass } from './entities/class.entity';

@Module({
  imports: [MikroOrmModule.forFeature([SchoolClass])],
  exports: [MikroOrmModule],
})
export class ClassesModule {}
