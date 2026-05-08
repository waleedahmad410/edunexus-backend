import { Migration } from '@mikro-orm/migrations';

export class Migration20260504022823 extends Migration {
  override up(): void | Promise<void> {
    this.addSql(`set names 'utf8';`);

    this.addSql(
      `create table "users" ("id" uuid not null, "school_id" uuid null, "branch_id" uuid null, "email" varchar(160) not null, "phone" varchar(40) null, "password_hash" varchar(255) not null, "user_type" varchar(30) not null, "is_email_verified" boolean not null default false, "is_phone_verified" boolean not null default false, "is_active" boolean not null default true, "last_login_at" timestamptz null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null, primary key ("id"));`,
    );
    this.addSql(
      `create index "users_school_id_index" on "users" ("school_id");`,
    );
    this.addSql(
      `create index "users_branch_id_index" on "users" ("branch_id");`,
    );
    this.addSql(`create index "users_email_index" on "users" ("email");`);
    this.addSql(
      `create index "users_user_type_index" on "users" ("user_type");`,
    );

    this.addSql(
      `alter table "users" add constraint "users_school_id_foreign" foreign key ("school_id") references "schools" ("id");`,
    );
    this.addSql(
      `alter table "users" add constraint "users_branch_id_foreign" foreign key ("branch_id") references "branches" ("id");`,
    );
  }

  override down(): void | Promise<void> {
    this.addSql(`drop table if exists "users" cascade;`);
  }
}
