import { Migration } from '@mikro-orm/migrations';

export class Migration20260511090000Schools extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table "schools" ("id" uuid not null, "name" varchar(150) not null, "code" varchar(50) not null, "email" varchar(150) null, "phone" varchar(20) null, "address" text null, "logo_url" varchar(500) null, "status" varchar(30) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null, constraint "schools_pkey" primary key ("id"));`,
    );
    this.addSql(
      `create unique index "schools_code_unique" on "schools" ("code");`,
    );
    this.addSql(`create index "schools_name_index" on "schools" ("name");`);
    this.addSql(`create index "schools_code_index" on "schools" ("code");`);
    this.addSql(`create index "schools_email_index" on "schools" ("email");`);
    this.addSql(`create index "schools_phone_index" on "schools" ("phone");`);
    this.addSql(`create index "schools_status_index" on "schools" ("status");`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "schools" cascade;`);
  }
}
