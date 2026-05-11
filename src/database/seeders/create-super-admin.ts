// src/database/seeders/create-super-admin.ts

import 'dotenv/config';

import { NestFactory } from '@nestjs/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { randomUUID } from 'node:crypto';

import { AppModule } from '../../app.module';
import { hashPassword } from '../../common/security/password.util';

type ExistingUserRow = {
  id: string;
  email: string;
  user_type: string;
};

type ExistingProfileRow = {
  id: string;
};

function isTruthy(value: string | undefined): boolean {
  return ['1', 'true', 'yes', 'on'].includes(value?.toLowerCase() ?? '');
}

function requiredEnv(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`${name} is required.`);
  }

  return value;
}

async function bootstrap(): Promise<void> {
  const email = requiredEnv('SUPER_ADMIN_EMAIL').toLowerCase();

  const password = process.env.SUPER_ADMIN_PASSWORD;
  const passwordHash =
    process.env.SUPER_ADMIN_PASSWORD_HASH ??
    (password ? hashPassword(password) : undefined);

  const resetPassword = isTruthy(process.env.SUPER_ADMIN_RESET_PASSWORD);

  const firstName = process.env.SUPER_ADMIN_FIRST_NAME?.trim() || 'Super';
  const lastName = process.env.SUPER_ADMIN_LAST_NAME?.trim() || 'Admin';

  if (!passwordHash) {
    throw new Error(
      'Either SUPER_ADMIN_PASSWORD or SUPER_ADMIN_PASSWORD_HASH is required.',
    );
  }

  if (
    !process.env.SUPER_ADMIN_PASSWORD_HASH &&
    password &&
    password.length < 12
  ) {
    throw new Error(
      'SUPER_ADMIN_PASSWORD must be at least 12 characters long.',
    );
  }

  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  try {
    const em = app.get(EntityManager).fork();

    await em.transactional(async (tx) => {
      const existingUsers = await tx.execute<ExistingUserRow[]>(
        `
          select "id", "email", "user_type"
          from "users"
          where lower("email") = lower(?)
          limit 1
          for update;
        `,
        [email],
      );

      let userId: string;

      if (existingUsers.length > 0) {
        const existingUser = existingUsers[0];

        if (existingUser.user_type !== 'SUPER_ADMIN') {
          throw new Error(
            `User with email ${email} already exists but is not a SUPER_ADMIN.`,
          );
        }

        userId = existingUser.id;

        if (resetPassword) {
          await tx.execute(
            `
              update "users"
              set
                "password_hash" = ?,
                "is_email_verified" = true,
                "is_active" = true,
                "updated_at" = now()
              where "id" = ?;
            `,
            [passwordHash, userId],
          );

          console.log(`Updated existing super admin password: ${email}`);
        } else {
          await tx.execute(
            `
              update "users"
              set
                "is_email_verified" = true,
                "is_active" = true,
                "updated_at" = now()
              where "id" = ?;
            `,
            [userId],
          );

          console.log(
            `Super admin already exists; password unchanged: ${email}`,
          );
        }
      } else {
        userId = randomUUID();

        await tx.execute(
          `
            insert into "users" (
              "id",
              "school_id",
              "branch_id",
              "email",
              "phone",
              "password_hash",
              "user_type",
              "is_email_verified",
              "is_phone_verified",
              "is_active",
              "last_login_at",
              "created_at",
              "updated_at",
              "deleted_at"
            )
            values (
              ?,
              null,
              null,
              ?,
              null,
              ?,
              'SUPER_ADMIN',
              true,
              false,
              true,
              null,
              now(),
              now(),
              null
            );
          `,
          [userId, email, passwordHash],
        );

        console.log(`Created super admin: ${email}`);
      }

      const existingProfiles = await tx.execute<ExistingProfileRow[]>(
        `
          select "id"
          from "user_profiles"
          where "user_id" = ?
          limit 1
          for update;
        `,
        [userId],
      );

      if (existingProfiles.length === 0) {
        await tx.execute(
          `
            insert into "user_profiles" (
              "id",
              "user_id",
              "first_name",
              "middle_name",
              "last_name",
              "gender",
              "date_of_birth",
              "photo_url",
              "national_id",
              "address",
              "city",
              "state",
              "country",
              "postal_code",
              "created_at",
              "updated_at"
            )
            values (
              ?,
              ?,
              ?,
              null,
              ?,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              now(),
              now()
            );
          `,
          [randomUUID(), userId, firstName, lastName],
        );

        console.log(`Created profile for super admin: ${email}`);
      } else {
        console.log(`Profile already exists for super admin: ${email}`);
      }
    });
  } finally {
    await app.close();
  }
}

bootstrap().catch((error) => {
  console.error(error);
  process.exit(1);
});
