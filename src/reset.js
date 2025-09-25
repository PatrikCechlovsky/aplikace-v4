// src/reset.js
import { supabase } from './supabase.js';

async function ensureRecoverySessionFromHash() {
  const { data } = await supabase.auth.getSession();
  if (data?.session) return true;

  const p = new URLSearchParams(location.hash.slice(1));
  if (p.get('type') === 'recovery' && p.get('access_token') && p.get('refresh_token')) {
    const { data: s2, error } = await supabase.auth.setSession({
      access_token: p.get('access_token'),
      refresh_token: p.get('refresh_token'),
    });
    if (error) {
      console.error('setSession error', error);
      return false;
    }
    return !!s2?.session;
  }
  return false;
}

(async () => {
  const ok = await ensureRecoverySessionFromHash();
  if (ok) {
    document.getElementById('resetPassDialog').showModal();
  }
})();

document.getElementById('btnSetNewPass')?.addEventListener('click', async () => {
  const p1 = document.getElementById('newPass1').value.trim();
  const p2 = document.getElementById('newPass2').value.trim();
  const msg = document.getElementById('resetPassMsg');

  if (!p1 || p1 !== p2) {
    msg.textContent = 'Hesla se neshodují.';
    return;
  }

  msg.textContent = 'Ukládám…';

  const { error } = await supabase.auth.updateUser({ password: p1 });
  if (error) {
    console.error(error);
    msg.textContent = 'Chyba: ' + error.message;
    return;
  }

  msg.textContent = 'Heslo bylo změněno.';
  setTimeout(() => location.assign('/'), 1200);
});
