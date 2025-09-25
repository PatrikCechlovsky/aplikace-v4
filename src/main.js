// Minimální placeholder, ať nepřekáží – můžeš mít vlastní logiku.
console.log('main.js ready');

document.getElementById('btnAuth')?.addEventListener('click', () => {
  document.getElementById('authDialog').showModal();
});

document.getElementById('lnkForgot')?.addEventListener('click', () => {
  document.getElementById('authDialog').close();
  document.getElementById('resetEmailDialog').showModal();
});

// Odeslání reset e-mailu (doplň si vlastní redirectTo v Supabase šabloně)
import { supabase } from './supabase.js';
document.getElementById('btnSendReset')?.addEventListener('click', async () => {
  const email = document.getElementById('resetEmail').value.trim();
  const msg = document.getElementById('resetEmailMsg');
  msg.textContent = 'Posílám…';
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'https://patrikcechlovsky.github.io/aplikace-v4/' // GitHub Pages URL
  });
  if (error) {
    msg.textContent = 'Chyba: ' + error.message;
  } else {
    msg.textContent = 'Zkontroluj e-mail, poslal jsem odkaz.';
  }
});
