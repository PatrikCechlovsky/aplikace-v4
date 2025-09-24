// supabase.js
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// URL tvého projektu – ta je správně
export const SUPABASE_URL = "https://jgqgfbuagoypladyjjfl.supabase.co";

// Sem vlož celý anon public key z Project settings → API → anon public
export const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpncWdmYnVhZ295cGxhZHlqamZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1MTA3MTcsImV4cCI6MjA3NDA4NjcxN30.O5vvOyiYlIJb_bxaBbYF8Sn9sm2ReB7vDgASVm3dT3g";

// Klient, který pak používá celá aplikace
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
