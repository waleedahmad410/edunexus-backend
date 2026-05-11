import { Migration } from '@mikro-orm/migrations';

export class Migration20260511090300Branches extends Migration {
  override async up(): Promise<void> {
    this.addSql(`create table "branches" ("id" uuid not null, "school_id" uuid not null, "name" varchar(150) not null, "code" varchar(50) not null, "email" varchar(150) null, "phone" varchar(20) null, "address" text null, "status" varchar(30) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null, constraint "branches_pkey" primary key ("id"));`);
    this.addSql(`create unique index "branches_school_id_code_unique" on "branches" ("school_id", "code");`);
    this.addSql(`create index "branches_school_id_index" on "branches" ("school_id");`);
    this.addSql(`create index "branches_name_index" on "branches" ("name");`);
    this.addSql(`create index "branches_code_index" on "branches" ("code");`);
    this.addSql(`create index "branches_email_index" on "branches" ("email");`);
    this.addSql(`create index "branches_phone_index" on "branches" ("phone");`);
    this.addSql(`create index "branches_status_index" on "branches" ("status");`);
    this.addSql(`alter table "branches" add constraint "branches_school_id_foreign" foreign key ("school_id") references "schools" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "branches" cascade;`);
  }
}
