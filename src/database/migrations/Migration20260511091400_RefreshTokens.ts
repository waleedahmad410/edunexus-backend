import { Migration } from '@mikro-orm/migrations';

export class Migration20260511091400RefreshTokens extends Migration {
  override async up(): Promise<void> {
    this.addSql(`create table "refresh_tokens" ("id" uuid not null, "user_id" uuid not null, "token_hash" varchar(255) not null, "expires_at" timestamptz not null, "revoked_at" timestamptz null, "ip_address" varchar(100) null, "user_agent" text null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "refresh_tokens_pkey" primary key ("id"));`);
    this.addSql(`create unique index "refresh_tokens_token_hash_unique" on "refresh_tokens" ("token_hash");`);
    this.addSql(`create index "refresh_tokens_user_id_index" on "refresh_tokens" ("user_id");`);
    this.addSql(`create index "refresh_tokens_expires_at_index" on "refresh_tokens" ("expires_at");`);
    this.addSql(`create index "refresh_tokens_revoked_at_index" on "refresh_tokens" ("revoked_at");`);
    this.addSql(`alter table "refresh_tokens" add constraint "refresh_tokens_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "refresh_tokens" cascade;`);
  }
}
