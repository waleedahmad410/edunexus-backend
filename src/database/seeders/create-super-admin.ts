import 'dotenv/config';

import { NestFactory } from '@nestjs/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { randomUUID } from 'node:crypto';

import { AppModule } from '../../app.module';
import { PasswordService } from '../../modules/auth/services/password.service';

// Adjust these imports to your real entity paths
import { User } from '../../modules/users/entities/user.entity';
import { SuperAdminProfile } from '../../modules/super-admin/entities/super-admin-profile.entity';

async function bootstrap() {
  const email = process.env.SUPER_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.SUPER_ADMIN_PASSWORD;
  const phone = process.env.SUPER_ADMIN_PHONE;

  const firstName = process.env.SUPER_ADMIN_FIRST_NAME ?? 'Super';
  const lastName = process.env.SUPER_ADMIN_LAST_NAME ?? 'Admin';

  if (!email) {
    throw new Error('SUPER_ADMIN_EMAIL is required.');
  }

  if (!password) {
    throw new Error('SUPER_ADMIN_PASSWORD is required.');
  }

  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  try {
    const em = app.get(EntityManager).fork();
    const passwordService = app.get(PasswordService, { strict: false });

    const passwordHash = await passwordService.hashPassword(password);

    await em.transactional(async (tx) => {
      const userRepository = tx.getRepository(User);
      const superAdminProfileRepository = tx.getRepository(SuperAdminProfile);

      let user = await userRepository.findOne({
        email,
        deletedAt: null,
      });

      if (user) {
        user.passwordHash = passwordHash;
        user.status = 'ACTIVE';
        user.updatedAt = new Date();

        if (phone) {
          user.phone = phone;
        }

        console.log(`Updated existing user: ${email}`);
      } else {
        user = tx.create(User, {
          id: randomUUID(),
          email,
          phone,
          passwordHash,
          status: 'ACTIVE',
          lastLoginAt: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        });

        tx.persist(user);

        console.log(`Created user: ${email}`);
      }

      let superAdminProfile = await superAdminProfileRepository.findOne({
        user,
        deletedAt: null,
      });

      if (superAdminProfile) {
        superAdminProfile.firstName = firstName;
        superAdminProfile.lastName = lastName;
        superAdminProfile.phone = phone;
        superAdminProfile.accessLevel = 'FULL';
        superAdminProfile.status = 'ACTIVE';
        superAdminProfile.updatedAt = new Date();

        console.log(`Updated super admin profile: ${email}`);
      } else {
        superAdminProfile = tx.create(SuperAdminProfile, {
          id: randomUUID(),
          user,
          firstName,
          lastName,
          phone,
          photoUrl: null,
          accessLevel: 'FULL',
          status: 'ACTIVE',
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        });

        tx.persist(superAdminProfile);

        console.log(`Created super admin profile: ${email}`);
      }

      await tx.flush();
    });

    console.log('Super admin setup completed successfully.');
  } finally {
    await app.close();
  }
}

bootstrap().catch((error) => {
  console.error(error);
  process.exit(1);
});
