// src/reset.js
import { supabase } from './supabase.js';

const dlg   = document.getElementById('resetPassDialog');
const msgEl = document.getElementById('resetPassMsg');
const btn   = document.getElementById('btnSetNewPass');
const show  = (t)=>{ if (msgEl) msgEl.textContent=t; };

async function ensureRecoverySessionFromHash() {
  const { data } = await supabase.auth.getSession();
  if (data?.session) return true;

  const p = new URLSearchParams(location.hash.slice(1));
  const at = p.get('access_token'), rt = p.get('refresh_token');
  if (p.get('type') === 'recovery' && at && rt) {
    const { data: s, error } = await supabase.auth.setSession({ access_token: at, refresh_token: rt });
    if (error || !s?.session) return false;
    // bezpečně skryj tokeny (nemazat ručně location.hash = '')
    history.replaceState({}, document.title, location.pathname + location.search);
    return true;
  }
  return false;
}

supabase.auth.onAuthStateChange((ev)=>{ if (ev==='PASSWORD_RECOVERY'||ev==='SIGNED_IN') dlg?.showModal?.(); });
(async()=>{ if (await ensureRecoverySessionFromHash()) dlg?.showModal?.(); })();

btn?.addEventListener('click', async (e)=>{
  e.preventDefault();
  const p1 = document.getElementById('newPass1')?.value?.trim();
  const p2 = document.getElementById('newPass2')?.value?.trim();
  if (!p1 || p1!==p2) { show('Hesla se neshodují.'); return; }
  show('Ukládám…');
  if (!(await ensureRecoverySessionFromHash())) { show('Odkaz je neplatný nebo vypršel.'); return; }

  const { error } = await supabase.auth.updateUser({ password: p1 });
  if (error) { show('Chyba: ' + error.message); return; }

  show('Heslo změněno, odhlašuji…');
  await supabase.auth.signOut();
  location.assign('/aplikace-v4/'); // uprav na svou landing stránku
});
