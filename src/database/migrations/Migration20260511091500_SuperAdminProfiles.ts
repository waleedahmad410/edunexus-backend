import { Migration } from '@mikro-orm/migrations';

export class Migration20260511091500SuperAdminProfiles extends Migration {
  override async up(): Promise<void> {
    this.addSql(`create table "super_admin_profiles" ("id" uuid not null, "user_id" uuid not null, "first_name" varchar(100) not null, "middle_name" varchar(100) null, "last_name" varchar(100) not null, "phone" varchar(20) null, "photo_url" varchar(500) null, "access_level" varchar(50) not null, "status" varchar(30) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null, constraint "super_admin_profiles_pkey" primary key ("id"));`);
    this.addSql(`create unique index "super_admin_profiles_user_id_unique" on "super_admin_profiles" ("user_id");`);
    this.addSql(`create index "super_admin_profiles_user_id_index" on "super_admin_profiles" ("user_id");`);
    this.addSql(`create index "super_admin_profiles_access_level_index" on "super_admin_profiles" ("access_level");`);
    this.addSql(`create index "super_admin_profiles_status_index" on "super_admin_profiles" ("status");`);
    this.addSql(`alter table "super_admin_profiles" add constraint "super_admin_profiles_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "super_admin_profiles" cascade;`);
  }
}
