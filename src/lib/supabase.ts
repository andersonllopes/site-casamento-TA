import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface GuestConfirmation {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  guests_count: number;
  attending: boolean;
  dietary_restrictions?: string;
  created_at?: string;
}

export interface GuestMessage {
  id?: string;
  name: string;
  message: string;
  approved?: boolean;
  created_at?: string;
}
