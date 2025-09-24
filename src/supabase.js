// src/supabase.js
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export const SUPABASE_URL = "https://jgqgfbuagoypladyjjfl.supabase.co";
export const SUPABASE_ANON_KEY = "xxx"; // sem vlož celý anon public key

// jediný klient pro celou aplikaci
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
