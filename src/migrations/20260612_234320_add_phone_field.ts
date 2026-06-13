import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from 'drizzle-orm'

// Add optional phone field to leads and contact_submissions
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "phone" varchar;
    ALTER TABLE "contact_submissions" ADD COLUMN IF NOT EXISTS "phone" varchar;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "contact_submissions" DROP COLUMN IF EXISTS "phone";
    ALTER TABLE "leads" DROP COLUMN IF EXISTS "phone";
  `)
}
