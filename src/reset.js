import { supabase } from './supabase.js';

function unlockForm() {
  document.getElementById('resetPassDialog')?.showModal();
}

async function ensureRecoverySessionFromHash() {
  const { data } = await supabase.auth.getSession();
  if (data?.session) return true;

  const p = new URLSearchParams(location.hash.slice(1));
  const type = p.get('type');
  const at = p.get('access_token');
  const rt = p.get('refresh_token');

  if (type === 'recovery' && at && rt) {
    const { data: s2, error } = await supabase.auth.setSession({ access_token: at, refresh_token: rt });
    if (error) {
      console.error('setSession error:', error);
      return false;
    }
    return !!s2?.session;
  }
  return false;
}

supabase.auth.onAuthStateChange((event) => {
  if (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') {
    unlockForm();
  }
});

(async () => {
  const ok = await ensureRecoverySessionFromHash();
  if (ok) unlockForm();
})();

document.getElementById('btnSetNewPass')?.addEventListener('click', async (e) => {
  e.preventDefault();
  const msg = document.getElementById('resetPassMsg');
  const p1 = document.getElementById('newPass1').value.trim();
  const p2 = document.getElementById('newPass2').value.trim();
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
  setTimeout(() => location.assign('/aplikace-v4/'), 1200);
});
