import { Migration } from '@mikro-orm/migrations';

export class Migration20260511090100Users extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table "users" ("id" uuid not null, "email" varchar(150) not null, "phone" varchar(20) null, "password_hash" varchar(255) not null, "status" varchar(30) not null, "last_login_at" timestamptz null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null, constraint "users_pkey" primary key ("id"));`,
    );
    this.addSql(
      `create unique index "users_email_unique" on "users" ("email");`,
    );
    this.addSql(`create index "users_email_index" on "users" ("email");`);
    this.addSql(`create index "users_phone_index" on "users" ("phone");`);
    this.addSql(`create index "users_status_index" on "users" ("status");`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "users" cascade;`);
  }
}
