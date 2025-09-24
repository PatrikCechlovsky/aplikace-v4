// src/ui/auth.js
import { supabase } from '../supabase.js';

const OPEN_KEY = 'ui:openModule';

// bezpečný „tvrdý“ sign-out (vyčistí i rozbité tokeny v localStorage)
async function forceSignOut(scope = 'global') {
  try { await supabase.auth.signOut({ scope }) } catch {}
  try {
    Object.keys(localStorage).forEach(k => {
      if (k.startsWith('sb-')) localStorage.removeItem(k);
    });
  } catch {}
}

export function initAuthUI() {
  const $ = (id) => document.getElementById(id);
  const dlg = $('authDialog');

  const el = {
    btnAuth:    $('btnAuth'),
    btnAccount: $('btnAccount'),
    userName:   $('userName'),
    email:      $('authEmail'),
    pass:       $('authPass'),
    btnLogin:   $('btnDoLogin'),
    btnSignup:  $('btnDoSignup'),
    btnClose:   $('btnCloseAuth'),
    msg:        $('authMsg'),
  };

  // Reset dialogs
  const dResetEmail = $('resetEmailDialog');
  const dResetPass  = $('resetPassDialog');

  const elReset = {
    email:     $('resetEmail'),
    btnSend:   $('btnSendReset'),
    btnCloseE: $('btnCloseResetEmail'),
    msgE:      $('resetEmailMsg'),

    pass1:     $('newPass1'),
    pass2:     $('newPass2'),
    btnSet:    $('btnSetNewPass'),
    btnCloseP: $('btnCloseResetPass'),
    msgP:      $('resetPassMsg'),
  };

  // helpery
  const setBusy = (busy, text='') => {
    if (busy) {
      if (el.btnLogin)  { el.btnLogin.disabled = true;  el.btnLogin.textContent  = text || 'Přihlašuji…'; }
      if (el.btnSignup) { el.btnSignup.disabled = true; el.btnSignup.textContent = 'Registruji…'; }
    } else {
      if (el.btnLogin)  { el.btnLogin.disabled = false;  el.btnLogin.textContent  = 'Přihlásit'; }
      if (el.btnSignup) { el.btnSignup.disabled = false; el.btnSignup.textContent = 'Registrovat'; }
    }
  };

  async function refreshUI() {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      el.userName.textContent = session.user?.email || '';
      el.btnAuth.textContent  = 'Odhlásit';
      el.btnAuth.dataset.state = 'logged';
      el.btnAuth.title        = 'Odhlásit';
      el.btnAccount.disabled  = false;
    } else {
      el.userName.textContent = '';
      el.btnAuth.textContent  = 'Přihlásit';
      el.btnAuth.dataset.state = 'guest';
      el.btnAuth.title        = 'Přihlásit';
      el.btnAccount.disabled  = true;
    }
  }

  function openDialog(){
    if (el.msg)   el.msg.textContent = '';
    if (el.pass)  el.pass.value = '';
    dlg?.showModal();
    setTimeout(()=>el.email?.focus(), 0);
  }
  function closeDialog(){ try{ dlg?.close() }catch{} }

  function openResetEmailDialog(prefill){
    elReset.msgE.textContent = '';
    elReset.email.value = prefill || '';
    dResetEmail?.showModal();
  }
  function openResetPassDialog(){
    elReset.msgP.textContent = '';
    elReset.pass1.value = '';
    elReset.pass2.value = '';
    dResetPass?.showModal();
  }
  // zpřístupníme pro „Můj účet“
  window.openChangePasswordDialog = openResetPassDialog;

  // --- otevřít dialog podle URL hned po načtení (/#recover nebo type=recovery) ---
  (function openRecoveryIfInUrl() {
    const h = location.hash || '';
    if (h.startsWith('#recover') || h.includes('type=recovery')) {
      try { history.replaceState(null, '', location.pathname + location.search); } catch {}
      openResetPassDialog();
    }
  })();

  // LOGIN
  el?.btnLogin?.addEventListener('click', async (e)=>{
    e.preventDefault();
    setBusy(true, 'Přihlašuji…');
    el.msg.textContent = 'Přihlašuji…';

    const email = (el.email?.value || '').trim();
    const password = el.pass?.value || '';

    await forceSignOut('local'); // čistý start

    const timeout = (ms)=>new Promise((_,rej)=>setTimeout(()=>rej(new Error('Vypršel čas přihlášení (timeout).')), ms));

    try{
      const { error } = await Promise.race([
        supabase.auth.signInWithPassword({ email, password }),
        timeout(12000)
      ]);
      if (error) throw error;

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Session se nevytvořila. Zkontroluj potvrzení e-mailu a klíče projektu.');

      el.msg.textContent = 'OK';
      closeDialog();
      localStorage.removeItem(OPEN_KEY);
      location.hash = '#/dashboard';
      await refreshUI();
    } catch(err){
      el.msg.textContent = 'Chyba: ' + (err?.message || err);
      console.error('[LOGIN ERROR]', err);
    } finally {
      setBusy(false);
    }
  });

  // SIGNUP
  el?.btnSignup?.addEventListener('click', async (e)=>{
    e.preventDefault();
    setBusy(true, 'Registruji…');
    el.msg.textContent = 'Zakládám účet…';
    try{
      const email = (el.email?.value || '').trim();
      const password = el.pass?.value || '';
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      el.msg.textContent = 'Účet vytvořen. Zkontrolujte e-mail (potvrzení) nebo se přihlaste.';
    } catch(err){
      el.msg.textContent = 'Chyba: ' + (err?.message || err);
      console.error('[SIGNUP ERROR]', err);
    } finally {
      setBusy(false);
    }
  });

  // CLOSE
  el?.btnClose?.addEventListener('click', (e)=>{ e.preventDefault(); closeDialog(); });

  // HEADER tlačítko
  el?.btnAuth?.addEventListener('click', async ()=>{
    if (el.btnAuth.dataset.state === 'logged'){
      await forceSignOut('global');
      localStorage.removeItem(OPEN_KEY);
      await refreshUI();
      location.hash = '#/dashboard';
    } else {
      openDialog();
    }
  });

  // Můj účet
  el?.btnAccount?.addEventListener('click', ()=>{
    location.hash = '#/m/020-muj-ucet/t/prehled';
  });

  // Zapomenuté heslo
  document.getElementById('lnkForgot')?.addEventListener('click', ()=>{
    openResetEmailDialog(el.email?.value || '');
  });

  // Reset: poslat odkaz e-mailem
  elReset.btnSend?.addEventListener('click', async ()=>{
    elReset.msgE.textContent = 'Odesílám…';
    try{
      const email = (elReset.email.value || '').trim();
      await supabase.auth.resetPasswordForEmail(email, {
        // hash varianta funguje i bez SPA rewrite
        redirectTo: window.location.origin + '/#recover'
      });
      elReset.msgE.textContent = 'Hotovo. Zkontrolujte e-mail (odkaz pro nastavení hesla).';
    } catch(err){
      elReset.msgE.textContent = 'Chyba: ' + (err?.message || err);
    }
  });
  elReset.btnCloseE?.addEventListener('click', (e)=>{ e.preventDefault(); dResetEmail?.close(); });

  // Supabase eventy (recovery apod.)
  supabase.auth.onAuthStateChange(async (event) => {
    if (event === 'PASSWORD_RECOVERY') {
      openResetPassDialog();
    }
    await refreshUI();
  });

  // Kdyby listener proběhl dřív, zkus otevřít hned
  if ((location.hash || '').includes('type=recovery')) {
    openResetPassDialog();
  }

  // Nastavit nové heslo
  elReset.btnSet?.addEventListener('click', async ()=>{
    const p1 = elReset.pass1.value;
    const p2 = elReset.pass2.value;
    if (p1.length < 6) { elReset.msgP.textContent = 'Heslo musí mít aspoň 6 znaků.'; return; }
    if (p1 !== p2)     { elReset.msgP.textContent = 'Hesla se neshodují.'; return; }

    elReset.msgP.textContent = 'Ukládám…';
    try{
      const { error } = await supabase.auth.updateUser({ password: p1 });
      if (error) throw error;
      elReset.msgP.textContent = 'Heslo změněno. Můžete se přihlásit.';
      setTimeout(()=> dResetPass?.close(), 1200);
    } catch(err){
      elReset.msgP.textContent = 'Chyba: ' + (err?.message || err);
    }
  });
  elReset.btnCloseP?.addEventListener('click', (e)=>{ e.preventDefault(); dResetPass?.close(); });

  // start
  refreshUI();
}
