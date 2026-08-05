const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://vnefldukdhludbdyvwkn.supabase.co', 'sb_publishable_kzEeVjNGkqufchMgLy32vQ_knENbF5r');

async function checkSchema() {
  const { data, error } = await supabase.from('site_settings').select('*').limit(1);
  if (error) {
    console.log('Schema not found or error:', error.message);
  } else {
    console.log('Schema is already applied!');
  }
}
checkSchema();
