import { Migration } from '@mikro-orm/migrations';

export class Migration20260511092500AuditLogs extends Migration {
  override async up(): Promise<void> {
    this.addSql(`create table "audit_logs" ("id" uuid not null, "school_id" uuid null, "branch_id" uuid null, "user_id" uuid null, "action" varchar(100) not null, "entity_name" varchar(100) not null, "entity_id" uuid null, "old_values" jsonb null, "new_values" jsonb null, "ip_address" varchar(100) null, "user_agent" text null, "created_at" timestamptz not null, constraint "audit_logs_pkey" primary key ("id"));`);
    this.addSql(`create index "audit_logs_school_id_index" on "audit_logs" ("school_id");`);
    this.addSql(`create index "audit_logs_branch_id_index" on "audit_logs" ("branch_id");`);
    this.addSql(`create index "audit_logs_user_id_index" on "audit_logs" ("user_id");`);
    this.addSql(`create index "audit_logs_action_index" on "audit_logs" ("action");`);
    this.addSql(`create index "audit_logs_entity_name_index" on "audit_logs" ("entity_name");`);
    this.addSql(`create index "audit_logs_entity_id_index" on "audit_logs" ("entity_id");`);
    this.addSql(`create index "audit_logs_created_at_index" on "audit_logs" ("created_at");`);
    this.addSql(`alter table "audit_logs" add constraint "audit_logs_school_id_foreign" foreign key ("school_id") references "schools" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "audit_logs" add constraint "audit_logs_branch_id_foreign" foreign key ("branch_id") references "branches" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "audit_logs" add constraint "audit_logs_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade on delete set null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "audit_logs" cascade;`);
  }
}
