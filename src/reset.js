// src/reset.js
import { supabase } from './supabase.js';

const dlg   = document.getElementById('resetPassDialog');
const btn   = document.getElementById('btnSetNewPass');
const msgEl = document.getElementById('resetPassMsg');
const showMsg = (t) => { if (msgEl) msgEl.textContent = t; };
const openDlg = () => dlg?.showModal?.();

async function ensureRecoverySessionFromHash() {
  // už existuje session?
  const { data } = await supabase.auth.getSession();
  if (data?.session) return true;

  // přečti hash dřív, než ho cokoliv smaže
  const p = new URLSearchParams(location.hash.slice(1));
  const type = p.get('type');
  const at   = p.get('access_token');
  const rt   = p.get('refresh_token');

  if (type === 'recovery' && at && rt) {
    const { data: s, error } = await supabase.auth.setSession({ access_token: at, refresh_token: rt });
    if (error || !s?.session) return false;
    // bezpečně skryj tokeny v URL
    history.replaceState({}, document.title, location.pathname + location.search);
    return true;
  }
  return false;
}

// Otevři dialog jen pokud máme recovery session
supabase.auth.onAuthStateChange((event) => {
  if (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') openDlg();
});
(async () => { if (await ensureRecoverySessionFromHash()) openDlg(); })();

// Handler „Uložit“
btn?.addEventListener('click', async (e) => {
  e.preventDefault();
  const p1 = document.getElementById('newPass1')?.value?.trim();
  const p2 = document.getElementById('newPass2')?.value?.trim();
  if (!p1 || p1 !== p2) { showMsg('Hesla se neshodují.'); return; }

  showMsg('Ukládám…');

  // pojistka – session MUSÍ existovat
  if (!(await ensureRecoverySessionFromHash())) {
    showMsg('Odkaz je neplatný nebo vypršel. Požádej o nový.');
    return;
  }

  const { error } = await supabase.auth.updateUser({ password: p1 });
  if (error) { showMsg('Chyba: ' + error.message); return; }

  showMsg('Heslo změněno, odhlašuji…');
  await supabase.auth.signOut();                 // ukonči recovery session
  location.assign('/aplikace-v4/');              // uprav dle potřeby
});
