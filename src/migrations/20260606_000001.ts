import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from 'drizzle-orm'

// Incremental schema changes from 2026-06-06:
// 1. CaseStudies: rename brand→client, drop tag, rename excerpt→desc,
//    add lead/challenge/quote fields, add join tables for tags/cats/approach/metrics
// 2. Testimonials: rename result_stat→result
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    -- CaseStudies: rename brand → client
    DO $$ BEGIN
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='case_studies' AND column_name='brand') THEN
        ALTER TABLE "case_studies" RENAME COLUMN "brand" TO "client";
      END IF;
    END $$;

    -- CaseStudies: drop tag column
    DO $$ BEGIN
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='case_studies' AND column_name='tag') THEN
        ALTER TABLE "case_studies" DROP COLUMN "tag";
      END IF;
    END $$;

    -- CaseStudies: rename excerpt → desc
    DO $$ BEGIN
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='case_studies' AND column_name='excerpt') THEN
        ALTER TABLE "case_studies" RENAME COLUMN "excerpt" TO "desc";
      END IF;
    END $$;

    -- CaseStudies: add new columns
    ALTER TABLE "case_studies" ADD COLUMN IF NOT EXISTS "lead" varchar;
    ALTER TABLE "case_studies" ADD COLUMN IF NOT EXISTS "challenge" varchar;
    ALTER TABLE "case_studies" ADD COLUMN IF NOT EXISTS "quote_text" varchar;
    ALTER TABLE "case_studies" ADD COLUMN IF NOT EXISTS "quote_author" varchar;
    ALTER TABLE "case_studies" ADD COLUMN IF NOT EXISTS "quote_role" varchar;

    -- CaseStudies join tables
    CREATE TABLE IF NOT EXISTS "case_studies_tags" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "value" varchar NOT NULL
    );
    CREATE TABLE IF NOT EXISTS "case_studies_cats" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "value" varchar NOT NULL
    );
    CREATE TABLE IF NOT EXISTS "case_studies_approach" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "title" varchar NOT NULL,
      "body" varchar NOT NULL
    );
    CREATE TABLE IF NOT EXISTS "case_studies_metrics" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "n" varchar NOT NULL,
      "l" varchar NOT NULL
    );

    -- Foreign keys for join tables (ignore if already exist)
    DO $$ BEGIN
      ALTER TABLE "case_studies_tags" ADD CONSTRAINT "case_studies_tags_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      ALTER TABLE "case_studies_cats" ADD CONSTRAINT "case_studies_cats_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      ALTER TABLE "case_studies_approach" ADD CONSTRAINT "case_studies_approach_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      ALTER TABLE "case_studies_metrics" ADD CONSTRAINT "case_studies_metrics_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    -- Indexes for join tables
    CREATE INDEX IF NOT EXISTS "case_studies_tags_order_idx" ON "case_studies_tags" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "case_studies_tags_parent_id_idx" ON "case_studies_tags" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "case_studies_cats_order_idx" ON "case_studies_cats" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "case_studies_cats_parent_id_idx" ON "case_studies_cats" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "case_studies_approach_order_idx" ON "case_studies_approach" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "case_studies_approach_parent_id_idx" ON "case_studies_approach" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "case_studies_metrics_order_idx" ON "case_studies_metrics" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "case_studies_metrics_parent_id_idx" ON "case_studies_metrics" USING btree ("_parent_id");
    CREATE UNIQUE INDEX IF NOT EXISTS "case_studies_slug_idx" ON "case_studies" USING btree ("slug");

    -- Testimonials: rename result_stat → result
    DO $$ BEGIN
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='testimonials' AND column_name='result_stat') THEN
        ALTER TABLE "testimonials" RENAME COLUMN "result_stat" TO "result";
      END IF;
    END $$;
    -- If result column doesn't exist at all (fresh DB had result from migration 1)
    ALTER TABLE "testimonials" ADD COLUMN IF NOT EXISTS "result" varchar;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "case_studies_metrics" CASCADE;
    DROP TABLE IF EXISTS "case_studies_approach" CASCADE;
    DROP TABLE IF EXISTS "case_studies_cats" CASCADE;
    DROP TABLE IF EXISTS "case_studies_tags" CASCADE;
    DO $$ BEGIN
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='testimonials' AND column_name='result') THEN
        ALTER TABLE "testimonials" RENAME COLUMN "result" TO "result_stat";
      END IF;
    END $$;
  `)
}
