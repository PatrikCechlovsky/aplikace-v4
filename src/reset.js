// src/reset.js
import { supabase } from './supabase.js';

const dlg   = document.getElementById('resetPassDialog');
const msgEl = document.getElementById('resetPassMsg');
const btn   = document.getElementById('btnSetNewPass');

function showMsg(t) { if (msgEl) msgEl.textContent = t; }
function openDialog() { dlg?.showModal?.(); }

async function ensureRecoverySessionFromHash() {
  // už mám session?
  const { data } = await supabase.auth.getSession();
  if (data?.session) return true;

  // zkus ji vytvořit z #hash
  const p = new URLSearchParams(location.hash.slice(1));
  const type = p.get('type');
  const at   = p.get('access_token');
  const rt   = p.get('refresh_token');
  if (type === 'recovery' && at && rt) {
    const { error } = await supabase.auth.setSession({ access_token: at, refresh_token: rt });
    return !error;
  }
  return false;
}

function handleExpiredLink() {
  // hezky ošetři expirovaný/špatný odkaz
  showMsg('Odkaz pro změnu hesla je neplatný nebo vypršel. Požádej o nový.');
}

async function initResetFlow() {
  // 1) jestli je v URL chyba z Supabase (otp_expired apod.), rovnou to řekni
  const h = new URLSearchParams(location.hash.slice(1));
  const errorCode = h.get('error_code');
  if (errorCode) {
    handleExpiredLink();
    return;
  }

  // 2) pokusit se nastavit session z hash (nebo už je)
  const ok = await ensureRecoverySessionFromHash();
  if (!ok) return; // není platný link → neukazuj dialog

  // 3) otevři dialog
  openDialog();
}

btn?.addEventListener('click', async (e) => {
  e.preventDefault();
  const p1 = document.getElementById('newPass1')?.value?.trim();
  const p2 = document.getElementById('newPass2')?.value?.trim();
  if (!p1 || p1 !== p2) { showMsg('Hesla se neshodují.'); return; }

  showMsg('Ukládám…');

  // pojistka: pokud mezitím session zmizela, zkus ji znovu vytvořit
  const ok = await ensureRecoverySessionFromHash();
  if (!ok) { showMsg('Odkaz již neplatí. Požádej o nový.'); return; }

  const { error } = await supabase.auth.updateUser({ password: p1 });
  if (error) { showMsg('Chyba: ' + error.message); return; }

  showMsg('Heslo změněno, odhlašuji…');
  await supabase.auth.signOut();      // ukonči recovery session
  location.assign('/aplikace-v4/');   // uprav, kam chceš po úspěchu
});

// spustit hned po načtení
initResetFlow();

// Když knihovna doručí event později (auto-detekce hashe), otevři dialog i tak
supabase.auth.onAuthStateChange((event) => {
  if (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') {
    openDialog();
  }
});
