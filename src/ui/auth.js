// src/ui/auth.js
const OPEN_KEY = 'ui:openModule'

// Smaže supabase tokeny z localStorage a provede signOut
async function forceSignOut(supabase, scope = 'global') {
  try { await supabase.auth.signOut({ scope }) } catch {}
  try {
    Object.keys(localStorage).forEach(k => {
      if (k.startsWith('sb-')) localStorage.removeItem(k)
    })
  } catch {}
}

export function initAuthUI(supabase) {
  const $  = (id) => document.getElementById(id)
  const dlg = $('authDialog')

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
  }

  // --- UI helpers ---
  const setBusy = (busy, text='') => {
    if (busy) {
      if (el.btnLogin)  { el.btnLogin.disabled = true;  el.btnLogin.textContent  = text || 'Přihlašuji…' }
      if (el.btnSignup) { el.btnSignup.disabled = true; el.btnSignup.textContent = 'Registruji…' }
    } else {
      if (el.btnLogin)  { el.btnLogin.disabled = false;  el.btnLogin.textContent  = 'Přihlásit' }
      if (el.btnSignup) { el.btnSignup.disabled = false; el.btnSignup.textContent = 'Registrovat' }
    }
  }

  async function refreshUI(){
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      el.userName.textContent = session.user?.email || ''
      if (el.btnAuth) {
        el.btnAuth.textContent  = 'Odhlásit'
        el.btnAuth.dataset.state = 'logged'
        el.btnAuth.title         = 'Odhlásit'
      }
      if (el.btnAccount) el.btnAccount.disabled = false
    } else {
      el.userName.textContent = ''
      if (el.btnAuth) {
        el.btnAuth.textContent  = 'Přihlásit'
        el.btnAuth.dataset.state = 'guest'
        el.btnAuth.title         = 'Přihlásit'
      }
      if (el.btnAccount) el.btnAccount.disabled = true
    }
  }

  function openDialog(){
    if (!dlg) return
    if (el.msg)   el.msg.textContent = ''
    if (el.email) el.email.value = el.email.value || ''
    if (el.pass)  el.pass.value  = ''
    dlg.showModal()
    setTimeout(()=>el.email?.focus(), 0)
  }
  function closeDialog(){ try{ dlg?.close() }catch{} }

  // --- Nouzové tlačítko: Resetovat přihlášení ---
  if (el.msg && !document.getElementById('authForceReset')) {
    const r = document.createElement('button')
    r.id = 'authForceReset'
    r.type = 'button'
    r.className = 'mt-2 text-xs underline text-slate-500'
    r.textContent = 'Resetovat přihlášení'
    r.title = 'Smaže místní supabase tokeny a odhlásí všechna zařízení'
    r.addEventListener('click', async ()=>{
      el.msg.textContent = 'Resetuji…'
      await forceSignOut(supabase, 'global')
      el.msg.textContent = 'Vyresetováno. Zkuste se znovu přihlásit.'
    })
    el.msg.parentElement?.appendChild(r)
  }

  // --- LOGIN (heslem) — vždy předem tvrdý reset + timeout ---
  el?.btnLogin?.addEventListener('click', async (e)=>{
    e.preventDefault()
    setBusy(true, 'Přihlašuji…')
    if (el.msg) el.msg.textContent = 'Přihlašuji…'

    const email = (el.email?.value || '').trim()
    const password = el.pass?.value || ''

    // 1) vyčisti uvízlé tokeny
    await forceSignOut(supabase, 'local')

    // 2) 10s timeout (když by se signIn „nevrátil“)
    const timeout = (ms) => new Promise((_,rej)=>setTimeout(()=>rej(new Error('Vypršel čas přihlášení (timeout).')), ms))

    try{
      const res = await Promise.race([
        supabase.auth.signInWithPassword({ email, password }),
        timeout(10000)
      ])
      if (res?.error) throw res.error

      // 3) ověř, že máme session
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('Session se nevytvořila (zkontroluj SUPABASE_URL/ANON a potvrzení e-mailu).')

      if (el.msg) el.msg.textContent = 'OK'
      closeDialog()
      localStorage.removeItem(OPEN_KEY)
      location.hash = '#/dashboard'
      await refreshUI()
    } catch(err){
      if (el.msg) el.msg.textContent = 'Chyba: ' + (err?.message || err)
      console.error(err)
    } finally {
      setBusy(false)
    }
  })

  // --- SIGNUP (heslem) ---
  el?.btnSignup?.addEventListener('click', async (e)=>{
    e.preventDefault()
    setBusy(true, 'Registruji…')
    if (el.msg) el.msg.textContent = 'Zakládám účet…'
    try{
      const email = (el.email?.value || '').trim()
      const password = el.pass?.value || ''
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) throw error
      if (el.msg) el.msg.textContent = 'Účet vytvořen. Zkontrolujte e-mail (potvrzení).'
    } catch(err){
      if (el.msg) el.msg.textContent = 'Chyba: ' + (err?.message || err)
      console.error(err)
    } finally {
      setBusy(false)
    }
  })

  // --- ZAVŘÍT dialog ---
  el?.btnClose?.addEventListener('click', (e)=>{
    e.preventDefault()
    closeDialog()
  })

  // --- HEADER: Přihlásit / Odhlásit ---
  el?.btnAuth?.addEventListener('click', async ()=>{
    if (el.btnAuth.dataset.state === 'logged'){
      // tvrdé odhlášení: global + smazání sb-* + návrat domů
      await forceSignOut(supabase, 'global')
      localStorage.removeItem(OPEN_KEY)
      await refreshUI()
      location.hash = '#/dashboard'
    } else {
      openDialog()
    }
  })

  // „Můj účet“ → 020 modul
  el?.btnAccount?.addEventListener('click', ()=>{
    location.hash = '#/m/020-muj-ucet/t/prehled'
  })

  // Reakce na změnu session z jiného tabu/obnovy
  supabase.auth.onAuthStateChange(async ()=>{ await refreshUI() })

  // Start
  refreshUI()
}
