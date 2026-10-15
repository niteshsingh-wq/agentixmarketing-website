import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from 'drizzle-orm'

// Backing table for the distributed rate limiter used by /api/contact and
// /api/careers. Not a Payload collection — it is written to directly via the
// adapter's connection pool and never surfaced in the admin UI.
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "rate_limits" (
      "key" varchar(255) PRIMARY KEY,
      "count" integer NOT NULL DEFAULT 0,
      "window_start" timestamptz NOT NULL DEFAULT now()
    );
    CREATE INDEX IF NOT EXISTS "rate_limits_window_start_idx"
      ON "rate_limits" ("window_start");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX IF EXISTS "rate_limits_window_start_idx";
    DROP TABLE IF EXISTS "rate_limits";
  `)
}
