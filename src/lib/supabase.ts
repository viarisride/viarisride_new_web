import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  'https://nycnmvroxvpwkjdddeqo.supabase.co';
const supabaseKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'sb_publishable_-9EWYxdy6iVlZLCLgFauEA_iNhzC249';

export const supabase = createClient(supabaseUrl, supabaseKey);
