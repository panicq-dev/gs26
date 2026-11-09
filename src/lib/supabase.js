import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL?.trim();
const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY?.trim();

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabaseConfigurationError =
  Boolean(supabaseUrl) !== Boolean(supabaseAnonKey)
    ? 'Para usar o Supabase, preencha juntas VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY em .env.local.'
    : '';

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
