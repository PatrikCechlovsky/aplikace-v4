// src/supabase.js
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export const SUPABASE_URL = "https://jgqgfbuagoypladyjjfl.supabase.co";
export const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpncWdmYnVhZ295cGxhZHlqamZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1MTA3MTcsImV4cCI6MjA3NDA4NjcxN30.O5vvOyiYlIJb_bxaBbYF8Sn9sm2ReB7vDgASVm3dT3g";

// vytvoření klienta
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

window.supabase = supabase;
