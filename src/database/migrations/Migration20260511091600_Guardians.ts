import { Migration } from '@mikro-orm/migrations';

export class Migration20260511091600Guardians extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table "guardians" ("id" uuid not null, "school_id" uuid not null, "branch_id" uuid not null, "user_id" uuid null, "first_name" varchar(100) not null, "middle_name" varchar(100) null, "last_name" varchar(100) not null, "phone" varchar(20) not null, "email" varchar(150) null, "occupation" varchar(100) null, "address" text null, "status" varchar(30) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null, constraint "guardians_pkey" primary key ("id"));`,
    );
    this.addSql(
      `create index "guardians_school_id_index" on "guardians" ("school_id");`,
    );
    this.addSql(
      `create index "guardians_branch_id_index" on "guardians" ("branch_id");`,
    );
    this.addSql(
      `create index "guardians_user_id_index" on "guardians" ("user_id");`,
    );
    this.addSql(
      `create index "guardians_phone_index" on "guardians" ("phone");`,
    );
    this.addSql(
      `create index "guardians_email_index" on "guardians" ("email");`,
    );
    this.addSql(
      `create index "guardians_status_index" on "guardians" ("status");`,
    );
    this.addSql(
      `alter table "guardians" add constraint "guardians_school_id_foreign" foreign key ("school_id") references "schools" ("id") on update cascade;`,
    );
    this.addSql(
      `alter table "guardians" add constraint "guardians_branch_id_foreign" foreign key ("branch_id") references "branches" ("id") on update cascade;`,
    );
    this.addSql(
      `alter table "guardians" add constraint "guardians_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade on delete set null;`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "guardians" cascade;`);
  }
}
