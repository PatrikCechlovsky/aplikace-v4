# Aplikace pronajímatel — v4


Webová aplikace pro správu pronajímatelů, nájemníků, nemovitostí a souvisejících modulů.  
Cílem je mít **pevný 7-zónový layout**, **dynamický sidebar**, přepínatelná témata (light/dark/gray) a backend přes **Supabase** (Auth + Postgres s RLS).

---

## Živá verze
- Produkce: [https://aplikace-v4.vercel.app](https://aplikace-v4.vercel.app)

---

## Rychlý start

1. Vytvoř projekt v Supabase.
2. V repu otevři soubor `supabase.js` a doplň:
   ```js
   export const SUPABASE_URL = "https://<ref>.supabase.co";
   export const SUPABASE_ANON_KEY = "<anon-public-key>";
