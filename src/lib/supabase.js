import { createClient } from '@supabase/supabase-js'

const envUrl = import.meta.env.VITE_SUPABASE_URL
const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const isInvalid = !envUrl || !envKey || envUrl === 'VOTRE_URL_SUPABASE';

if (isInvalid) {
  console.warn('Supabase credentials are missing. Please check your .env file. The admin dashboard will not work.')
}

// Provide a valid dummy URL to prevent createClient from crashing the whole app
const supabaseUrl = isInvalid ? 'https://placeholder.supabase.co' : envUrl;
const supabaseAnonKey = isInvalid ? 'placeholder-key' : envKey;

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
