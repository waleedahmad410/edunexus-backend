import { Migration } from '@mikro-orm/migrations';

export class Migration20260511091300PasswordResetTokens extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table "password_reset_tokens" ("id" uuid not null, "user_id" uuid not null, "token_hash" varchar(255) not null, "expires_at" timestamptz not null, "used_at" timestamptz null, "ip_address" varchar(100) null, "status" varchar(30) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "password_reset_tokens_pkey" primary key ("id"));`,
    );
    this.addSql(
      `create index "password_reset_tokens_user_id_index" on "password_reset_tokens" ("user_id");`,
    );
    this.addSql(
      `create index "password_reset_tokens_expires_at_index" on "password_reset_tokens" ("expires_at");`,
    );
    this.addSql(
      `create index "password_reset_tokens_used_at_index" on "password_reset_tokens" ("used_at");`,
    );
    this.addSql(
      `create index "password_reset_tokens_status_index" on "password_reset_tokens" ("status");`,
    );
    this.addSql(
      `alter table "password_reset_tokens" add constraint "password_reset_tokens_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade;`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "password_reset_tokens" cascade;`);
  }
}
