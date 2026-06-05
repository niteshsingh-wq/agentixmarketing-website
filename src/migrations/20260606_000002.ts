import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from 'drizzle-orm'

// Services schema expansion: add title/category/tag/focus_keyword columns
// and join tables for stats, deliverables, process, faqs
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    -- Add new scalar columns
    ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "title" varchar;
    ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "category" varchar;
    ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "tag" varchar;
    ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "focus_keyword" varchar;

    -- stats join table
    CREATE TABLE IF NOT EXISTS "services_stats" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "n" varchar NOT NULL,
      "l" varchar NOT NULL
    );

    -- deliverables join table
    CREATE TABLE IF NOT EXISTS "services_deliverables" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "title" varchar NOT NULL,
      "body" varchar NOT NULL
    );

    -- process join table
    CREATE TABLE IF NOT EXISTS "services_process" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "step" varchar NOT NULL,
      "desc" varchar NOT NULL
    );

    -- faqs join table
    CREATE TABLE IF NOT EXISTS "services_faqs" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "q" varchar NOT NULL,
      "a" varchar NOT NULL
    );

    -- Foreign keys (idempotent)
    DO $$ BEGIN
      ALTER TABLE "services_stats" ADD CONSTRAINT "services_stats_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      ALTER TABLE "services_deliverables" ADD CONSTRAINT "services_deliverables_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      ALTER TABLE "services_process" ADD CONSTRAINT "services_process_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      ALTER TABLE "services_faqs" ADD CONSTRAINT "services_faqs_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    -- Indexes
    CREATE INDEX IF NOT EXISTS "services_stats_order_idx" ON "services_stats" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "services_stats_parent_id_idx" ON "services_stats" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "services_deliverables_order_idx" ON "services_deliverables" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "services_deliverables_parent_id_idx" ON "services_deliverables" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "services_process_order_idx" ON "services_process" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "services_process_parent_id_idx" ON "services_process" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "services_faqs_order_idx" ON "services_faqs" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "services_faqs_parent_id_idx" ON "services_faqs" USING btree ("_parent_id");
    CREATE UNIQUE INDEX IF NOT EXISTS "services_slug_idx" ON "services" USING btree ("slug");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "services_faqs" CASCADE;
    DROP TABLE IF EXISTS "services_process" CASCADE;
    DROP TABLE IF EXISTS "services_deliverables" CASCADE;
    DROP TABLE IF EXISTS "services_stats" CASCADE;
    ALTER TABLE "services" DROP COLUMN IF EXISTS "focus_keyword";
    ALTER TABLE "services" DROP COLUMN IF EXISTS "tag";
    ALTER TABLE "services" DROP COLUMN IF EXISTS "category";
    ALTER TABLE "services" DROP COLUMN IF EXISTS "title";
  `)
}
