import { Migration } from '@mikro-orm/migrations';

export class Migration20260511090900Sections extends Migration {
  override async up(): Promise<void> {
    this.addSql(`create table "sections" ("id" uuid not null, "school_id" uuid not null, "branch_id" uuid not null, "class_id" uuid not null, "name" varchar(100) not null, "code" varchar(50) not null, "capacity" int not null default 0, "status" varchar(30) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null, constraint "sections_pkey" primary key ("id"));`);
    this.addSql(`create unique index "sections_school_id_branch_id_class_id_code_unique" on "sections" ("school_id", "branch_id", "class_id", "code");`);
    this.addSql(`create index "sections_school_id_index" on "sections" ("school_id");`);
    this.addSql(`create index "sections_branch_id_index" on "sections" ("branch_id");`);
    this.addSql(`create index "sections_class_id_index" on "sections" ("class_id");`);
    this.addSql(`create index "sections_name_index" on "sections" ("name");`);
    this.addSql(`create index "sections_code_index" on "sections" ("code");`);
    this.addSql(`create index "sections_status_index" on "sections" ("status");`);
    this.addSql(`alter table "sections" add constraint "sections_school_id_foreign" foreign key ("school_id") references "schools" ("id") on update cascade;`);
    this.addSql(`alter table "sections" add constraint "sections_branch_id_foreign" foreign key ("branch_id") references "branches" ("id") on update cascade;`);
    this.addSql(`alter table "sections" add constraint "sections_class_id_foreign" foreign key ("class_id") references "classes" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "sections" cascade;`);
  }
}
