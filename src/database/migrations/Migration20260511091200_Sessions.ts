import { Migration } from '@mikro-orm/migrations';

export class Migration20260511091200Sessions extends Migration {
  override async up(): Promise<void> {
    this.addSql(`create table "sessions" ("id" uuid not null, "user_id" uuid not null, "refresh_token_hash" varchar(255) not null, "device_id" varchar(100) null, "device_name" varchar(120) null, "ip_address" varchar(45) null, "user_agent" varchar(255) null, "expires_at" timestamptz not null, "revoked_at" timestamptz null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "sessions_pkey" primary key ("id"));`);
    this.addSql(`create index "sessions_user_id_index" on "sessions" ("user_id");`);
    this.addSql(`create index "sessions_expires_at_index" on "sessions" ("expires_at");`);
    this.addSql(`alter table "sessions" add constraint "sessions_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "sessions" cascade;`);
  }
}
