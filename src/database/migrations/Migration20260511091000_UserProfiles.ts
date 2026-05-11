import { Migration } from '@mikro-orm/migrations';

export class Migration20260511091000UserProfiles extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table "user_profiles" ("id" uuid not null, "user_id" uuid not null, "first_name" varchar(80) not null, "middle_name" varchar(80) null, "last_name" varchar(80) not null, "gender" varchar(20) null, "date_of_birth" timestamptz null, "photo_url" varchar(500) null, "national_id" varchar(100) null, "address" text null, "city" varchar(100) null, "state" varchar(100) null, "country" varchar(100) null, "postal_code" varchar(20) null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "user_profiles_pkey" primary key ("id"));`,
    );
    this.addSql(
      `create index "user_profiles_user_id_index" on "user_profiles" ("user_id");`,
    );
    this.addSql(
      `alter table "user_profiles" add constraint "user_profiles_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade;`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "user_profiles" cascade;`);
  }
}
