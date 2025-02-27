import { env } from '@/env';
import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';

config({ path: '.env' });

async function runMigration() {
  try {
    console.log('Running full-text search migration...');

    const sql = neon(env.DATABASE_URL!);

    // Read the migration file
    const migrationPath = path.join(process.cwd(), 'src/db/migrations/add-full-text-search.sql');
    const migrationSql = fs.readFileSync(migrationPath, 'utf8');

    // Execute the migration
    await sql(migrationSql);

    console.log('Full-text search migration completed successfully!');
  } catch (error) {
    console.error('Error running migration:', error);
    process.exit(1);
  }
}

runMigration();
