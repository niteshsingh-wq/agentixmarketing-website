import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from 'drizzle-orm'

// Initial schema — matches the DB created by the first Vercel deployment on 2026-06-05.
// This file is committed so that `payload migrate` treats it as already applied (the DB
// already has a payload_migrations row with this name from that first build).
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_leads_goal" AS ENUM('SEO & visibility', 'Store design / build', 'Migration to Shopify', 'Conversion (CRO)', 'Headless / Plus', 'Not sure yet');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      CREATE TYPE "public"."enum_leads_stage" AS ENUM('Pre-launch', 'Live, under $50k/mo', '$50k–250k/mo', '$250k+/mo');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      CREATE TYPE "public"."enum_leads_status" AS ENUM('new', 'contacted', 'qualified', 'proposal', 'closed-won', 'closed-lost');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      CREATE TYPE "public"."enum_contact_submissions_need" AS ENUM('Shopify Development', 'SEO & Marketing', 'Shopify + SEO', 'Not sure yet');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      CREATE TYPE "public"."enum_blog_posts_status" AS ENUM('draft', 'published');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      CREATE TYPE "public"."enum_testimonials_rating" AS ENUM('5', '4', '3');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    CREATE TABLE IF NOT EXISTS "leads" (
      "id" serial PRIMARY KEY NOT NULL,
      "name" varchar NOT NULL,
      "email" varchar NOT NULL,
      "website" varchar,
      "goal" "enum_leads_goal",
      "stage" "enum_leads_stage",
      "budget" varchar,
      "source_page" varchar,
      "status" "enum_leads_status" DEFAULT 'new' NOT NULL,
      "notes" varchar,
      "utm_source" varchar,
      "utm_medium" varchar,
      "utm_campaign" varchar,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
    CREATE TABLE IF NOT EXISTS "contact_submissions" (
      "id" serial PRIMARY KEY NOT NULL,
      "name" varchar NOT NULL,
      "email" varchar NOT NULL,
      "website" varchar,
      "need" "enum_contact_submissions_need",
      "message" varchar,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
    CREATE TABLE IF NOT EXISTS "blog_posts" (
      "id" serial PRIMARY KEY NOT NULL,
      "title" varchar NOT NULL,
      "slug" varchar NOT NULL,
      "tag" varchar,
      "read_time" varchar,
      "excerpt" varchar,
      "content" jsonb,
      "meta_title" varchar,
      "meta_description" varchar,
      "status" "enum_blog_posts_status" DEFAULT 'draft',
      "published_date" timestamp(3) with time zone,
      "featured_image_id" integer,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
    CREATE TABLE IF NOT EXISTS "testimonials" (
      "id" serial PRIMARY KEY NOT NULL,
      "quote" varchar NOT NULL,
      "author" varchar NOT NULL,
      "role" varchar,
      "company" varchar,
      "rating" "enum_testimonials_rating" DEFAULT '5',
      "result_stat" varchar,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
    CREATE TABLE IF NOT EXISTS "services" (
      "id" serial PRIMARY KEY NOT NULL,
      "slug" varchar NOT NULL,
      "meta_title" varchar,
      "meta_description" varchar,
      "lead" varchar,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
    CREATE TABLE IF NOT EXISTS "case_studies" (
      "id" serial PRIMARY KEY NOT NULL,
      "slug" varchar NOT NULL,
      "brand" varchar NOT NULL,
      "industry" varchar,
      "tag" varchar,
      "result" varchar,
      "excerpt" varchar,
      "meta_title" varchar,
      "meta_description" varchar,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
    CREATE TABLE IF NOT EXISTS "media" (
      "id" serial PRIMARY KEY NOT NULL,
      "alt" varchar NOT NULL,
      "caption" varchar,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "url" varchar,
      "thumbnail_u_r_l" varchar,
      "filename" varchar,
      "mime_type" varchar,
      "filesize" numeric,
      "width" numeric,
      "height" numeric,
      "focal_x" numeric,
      "focal_y" numeric,
      "sizes_thumbnail_url" varchar,
      "sizes_thumbnail_width" numeric,
      "sizes_thumbnail_height" numeric,
      "sizes_thumbnail_mime_type" varchar,
      "sizes_thumbnail_filesize" numeric,
      "sizes_thumbnail_filename" varchar,
      "sizes_card_url" varchar,
      "sizes_card_width" numeric,
      "sizes_card_height" numeric,
      "sizes_card_mime_type" varchar,
      "sizes_card_filesize" numeric,
      "sizes_card_filename" varchar,
      "sizes_feature_url" varchar,
      "sizes_feature_width" numeric,
      "sizes_feature_height" numeric,
      "sizes_feature_mime_type" varchar,
      "sizes_feature_filesize" numeric,
      "sizes_feature_filename" varchar
    );
    CREATE TABLE IF NOT EXISTS "users_sessions" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "created_at" timestamp(3) with time zone,
      "expires_at" timestamp(3) with time zone NOT NULL
    );
    CREATE TABLE IF NOT EXISTS "users" (
      "id" serial PRIMARY KEY NOT NULL,
      "name" varchar NOT NULL,
      "role" "enum_users_role" DEFAULT 'editor' NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "email" varchar NOT NULL,
      "reset_password_token" varchar,
      "reset_password_expiration" timestamp(3) with time zone,
      "salt" varchar,
      "hash" varchar,
      "login_attempts" numeric DEFAULT 0,
      "lock_until" timestamp(3) with time zone
    );
    CREATE TABLE IF NOT EXISTS "payload_kv" (
      "id" serial PRIMARY KEY NOT NULL,
      "key" varchar NOT NULL,
      "data" jsonb NOT NULL
    );
    CREATE TABLE IF NOT EXISTS "payload_locked_documents" (
      "id" serial PRIMARY KEY NOT NULL,
      "global_slug" varchar,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
    CREATE TABLE IF NOT EXISTS "payload_locked_documents_rels" (
      "id" serial PRIMARY KEY NOT NULL,
      "order" integer,
      "parent_id" integer NOT NULL,
      "path" varchar NOT NULL,
      "leads_id" integer,
      "contact_submissions_id" integer,
      "blog_posts_id" integer,
      "testimonials_id" integer,
      "services_id" integer,
      "case_studies_id" integer,
      "media_id" integer,
      "users_id" integer
    );
    CREATE TABLE IF NOT EXISTS "payload_preferences" (
      "id" serial PRIMARY KEY NOT NULL,
      "key" varchar,
      "value" jsonb,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
    CREATE TABLE IF NOT EXISTS "payload_preferences_rels" (
      "id" serial PRIMARY KEY NOT NULL,
      "order" integer,
      "parent_id" integer NOT NULL,
      "path" varchar NOT NULL,
      "users_id" integer
    );
    CREATE TABLE IF NOT EXISTS "payload_migrations" (
      "id" serial PRIMARY KEY NOT NULL,
      "name" varchar,
      "batch" numeric,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "payload_migrations" CASCADE;
    DROP TABLE IF EXISTS "payload_preferences_rels" CASCADE;
    DROP TABLE IF EXISTS "payload_preferences" CASCADE;
    DROP TABLE IF EXISTS "payload_locked_documents_rels" CASCADE;
    DROP TABLE IF EXISTS "payload_locked_documents" CASCADE;
    DROP TABLE IF EXISTS "payload_kv" CASCADE;
    DROP TABLE IF EXISTS "users_sessions" CASCADE;
    DROP TABLE IF EXISTS "users" CASCADE;
    DROP TABLE IF EXISTS "media" CASCADE;
    DROP TABLE IF EXISTS "case_studies" CASCADE;
    DROP TABLE IF EXISTS "services" CASCADE;
    DROP TABLE IF EXISTS "testimonials" CASCADE;
    DROP TABLE IF EXISTS "blog_posts" CASCADE;
    DROP TABLE IF EXISTS "contact_submissions" CASCADE;
    DROP TABLE IF EXISTS "leads" CASCADE;
    DROP TYPE IF EXISTS "public"."enum_users_role";
    DROP TYPE IF EXISTS "public"."enum_testimonials_rating";
    DROP TYPE IF EXISTS "public"."enum_blog_posts_status";
    DROP TYPE IF EXISTS "public"."enum_contact_submissions_need";
    DROP TYPE IF EXISTS "public"."enum_leads_status";
    DROP TYPE IF EXISTS "public"."enum_leads_stage";
    DROP TYPE IF EXISTS "public"."enum_leads_goal";
  `)
}
