import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../supabase.js';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function router() {
  const app = document.getElementById('app');
  const route = (location.hash || '#/dashboard').split('?')[0];
  switch (route) {
    case '#/dashboard':
      app.innerHTML = `<div class="p-6 bg-white card">Přehled – zatím prázdné.</div>`;
      break;
    case '#/pronajimatel':
      app.innerHTML = `<div class="p-6 bg-white card">Seznam pronajímatelů – modul doplníme.</div>`;
      break;
    default:
      app.innerHTML = `<p class="text-sm text-slate-500">Neznámá stránka.</p>`;
  }
}

window.addEventListener('hashchange', router);
window.addEventListener('load', async () => {
  router();
});
