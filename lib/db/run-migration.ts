/**
 * Database Migration Runner
 * Applies Phase 1 schema changes to Supabase
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

async function runMigration() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing SUPABASE environment variables');
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  console.log('📦 Reading migration file...');
  const migrationPath = path.join(__dirname, '../../../docs/scripts/phase1-event-sync-schema.sql');
  const sqlContent = fs.readFileSync(migrationPath, 'utf-8');

  console.log('🚀 Applying Phase 1 database schema...\n');

  // Split SQL by statement (basic approach)
  const statements = sqlContent
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i] + ';';
    
    // Skip comments
    if (statement.startsWith('--') || statement.startsWith('COMMENT')) {
      console.log(`⏭️  Skipping comment/documentation statement ${i + 1}`);
      continue;
    }

    try {
      console.log(`⚙️  Executing statement ${i + 1}/${statements.length}...`);
      
      const { error } = await supabase.rpc('exec_sql', {
        sql: statement
      });

      if (error) {
        throw error;
      }

      successCount++;
      console.log(`✅ Statement ${i + 1} completed`);
    } catch (error: any) {
      errorCount++;
      console.error(`❌ Statement ${i + 1} failed:`, error.message);
      
      // Continue with other statements
    }
  }

  console.log(`\n📊 Migration Summary:`);
  console.log(`   ✅ Successful: ${successCount}`);
  console.log(`   ❌ Failed: ${errorCount}`);
  console.log(`   📝 Total: ${statements.length}`);

  if (errorCount === 0) {
    console.log('\n🎉 Phase 1 database schema applied successfully!');
  } else {
    console.log('\n⚠️  Migration completed with errors. Review logs above.');
  }
}

runMigration().catch((error) => {
  console.error('💥 Migration failed:', error);
  process.exit(1);
});
