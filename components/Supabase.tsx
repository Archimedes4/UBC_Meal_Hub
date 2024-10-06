import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://jllwhnsnlhfsnonmdfce.supabase.co';
const SUPABASE_API_KEY = 'process.env.SUPABASE_KEY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY);

