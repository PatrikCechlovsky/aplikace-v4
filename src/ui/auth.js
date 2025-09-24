// src/ui/auth.js
const OPEN_KEY = 'ui:openModule'

// smaže všechny supabase tokeny z localStorage a odhlásí uživatele
async function forceSignOut(supabase, scope = 'global') {
  try { await supabase.auth.signOut({ scope }) } catch {}
  try {
    Object.keys(localStorage).forEach(k => { if (k.startsWith('sb-')) localStorage.removeItem(k) })
  } catch {}
}

export function initAuthUI(supabase){
  const $ = (id)=>document.getElementById(id)
  const dlg = $('authDialog')
  const el = {
    btnAuth:   $('btnAuth'),
    btnAccount:$('btnAccount'),
    userName:  $('userName'),
    email:     $('authEmail'),
    pass:      $('authPass'),
    btnLogin:  $('btnDoLogin'),
    btnSignup: $('btnDoSignup'),
    btnClose:  $('btnCloseAuth'),
    msg:       $('authMsg')
  }

  // -------- UI helpers --------
  const setBusy = (busy, text='')=>{
    if (busy){
      el.btnLogin.disabled = true
      el.btnSignup.disabled = true
      el.btnLogin.textContent = text || 'Přihlašuji…'
    } else {
      el.btnLogin.disabled = false
      el.btnSignup.disabled = false
      el.btnLogin.textContent = 'Přihlásit'
    }
  }

  async function refreshUI(){
    const { data: { session } } = await supabase.auth.getSession()
    if (session){
      el.userName.textContent = session.user?.email || ''
      el.btnAuth.textContent = 'Odhlásit'
      el.btnAuth.dataset.state = 'logged'
      el.btnAuth.title = 'Odhlásit'
      el.btnAccount.disabled = false
    } else {
      el.userName.textContent = ''
      el.btnAuth.textContent = 'Přihlásit'
      el.btnAuth.dataset.state = 'guest'
      el.btnAuth.title = 'Přihlásit'
      el.btnAccount.disabled = true
    }
  }

  function openDialog(){
    if (!dlg) return
    el.msg.textContent = ''
    el.email.value = el.email.value || ''
    el.pass.value = ''
    dlg.showModal()
    setTimeout(()=>el.email?.focus(), 0)
  }
  function closeDialog(){ try{ dlg?.close() }catch{} }

  // -------- Login (password) --------
  el?.btnLogin?.addEventListener('click', async (e)=>{
    e.preventDefault()
    setBusy(true, 'Přihlašuji…')
    el.msg.textContent = 'Přihlašuji…'
    const email = (el.email.value||'').trim()
    const password = el.pass.value||''

    // 🔧 vždy nejdřív tvrdý reset, aby nezůstaly staré sb-* tokeny
    await forceSignOut(supabase, 'local')

    const { error: signErr } = await supabase.auth.signInWithPassword({ email, password })
    if (signErr){
      el.msg.textContent = 'Chyba: ' + signErr.message
      setBusy(false)
      return
    }

    // ověř, že session skutečně existuje
    const { data: { session } } = await supabase.auth.getSession()
    if (!session){
      await forceSignOut(supabase, 'global')
      el.msg.textContent = 'Chyba: Session se nevytvořila (zkus znovu).'
      setBusy(false)
      return
    }

    el.msg.textContent = 'OK'
    setBusy(false)
    closeDialog()

    // návrat na Domů a zavřít sidebar
    localStorage.removeItem(OPEN_KEY)
    location.hash = '#/dashboard'
    await refreshUI()
  })

  // -------- Signup (password) --------
  el?.btnSignup?.addEventListener('click', async (e)=>{
    e.preventDefault()
    setBusy(true, 'Zakládám účet…')
    el.msg.textContent = 'Zakládám účet…'
    const email = (el.email.value||'').trim()
    const password = el.pass.value||''

    const { error } = await supabase.auth.signUp({ email, password })
    if (error){
      el.msg.textContent = 'Chyba: ' + error.message
      setBusy(false)
      return
    }
    el.msg.textContent = 'Účet vytvořen. Zkontroluj e-mail (potvrzení).'
    setBusy(false)
  })

  // -------- Zavřít dialog --------
  el?.btnClose?.addEventListener('click', (e)=>{
    e.preventDefault()
    closeDialog()
  })

  // -------- Header button: Přihlásit / Odhlásit --------
  el?.btnAuth?.addEventListener('click', async ()=>{
    if (el.btnAuth.dataset.state === 'logged'){
      await forceSignOut(supabase, 'global')
      localStorage.removeItem(OPEN_KEY)
      await refreshUI()
      location.hash = '#/dashboard'
    } else {
      openDialog()
    }
  })

  // „Můj účet“ – přesměrování do 020
  el?.btnAccount?.addEventListener('click', ()=>{
    location.hash = '#/m/020-muj-ucet/t/prehled'
  })

  // -------- Reakce na změny session (obnova/odhlášení v jiném tabu) --------
  supabase.auth.onAuthStateChange(async (_event, _session)=>{ await refreshUI() })

  // start
  refreshUI()
}
