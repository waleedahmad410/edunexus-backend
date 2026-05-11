import { Migration } from '@mikro-orm/migrations';

export class Migration20260511090700Classes extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table "classes" ("id" uuid not null, "school_id" uuid not null, "branch_id" uuid not null, "name" varchar(100) not null, "code" varchar(50) not null, "sort_order" int not null default 0, "status" varchar(30) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null, constraint "classes_pkey" primary key ("id"));`,
    );
    this.addSql(
      `create unique index "classes_school_id_branch_id_code_unique" on "classes" ("school_id", "branch_id", "code");`,
    );
    this.addSql(
      `create index "classes_school_id_index" on "classes" ("school_id");`,
    );
    this.addSql(
      `create index "classes_branch_id_index" on "classes" ("branch_id");`,
    );
    this.addSql(`create index "classes_name_index" on "classes" ("name");`);
    this.addSql(`create index "classes_code_index" on "classes" ("code");`);
    this.addSql(`create index "classes_status_index" on "classes" ("status");`);
    this.addSql(
      `alter table "classes" add constraint "classes_school_id_foreign" foreign key ("school_id") references "schools" ("id") on update cascade;`,
    );
    this.addSql(
      `alter table "classes" add constraint "classes_branch_id_foreign" foreign key ("branch_id") references "branches" ("id") on update cascade;`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "classes" cascade;`);
  }
}
