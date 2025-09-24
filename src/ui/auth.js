// src/ui/auth.js
const OPEN_KEY = 'ui:openModule'

// smaže supabase tokeny z localStorage a provede signOut
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

  // přidej nouzové tlačítko do dialogu (Resetovat přihlášení)
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

  // LOGIN (heslem) — vždy předem tvrdý reset
  el?.btnLogin?.addEventListener('click', async (e)=>{
    e.preventDefault()
    setBusy(true, 'Přihlašuji…')
    el.msg.textContent = 'Přihlašuji…'
    const email = (el.email.value||'').trim()
    const password = el.pass.value||''

    try{
      // 1) vyčisti staré tokeny (řeší „zamrznutý“ stav)
      await forceSignOut(supabase, 'local')

      // 2) pokus o přihlášení
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error

      // 3) ověř, že session skutečně existuje
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('Session se nevytvořila (zkuste znovu).')

      // 4) OK → UI + redirect na Domů
      el.msg.textContent = 'OK'
      closeDialog()
      localStorage.removeItem(OPEN_KEY)
      location.hash = '#/dashboard'
      await refreshUI()
    } catch(err){
      el.msg.textContent = 'Chyba: ' + (err?.message || err)
    } finally {
      setBusy(false)
    }
  })

  // SIGNUP
  el?.btnSignup?.addEventListener('click', async (e)=>{
    e.preventDefault()
    setBusy(true, 'Zakládám účet…')
    el.msg.textContent = 'Zakládám účet…'
    try{
      const email = (el.email.value||'').trim()
      const password = el.pass.value||''
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) throw error
      el.msg.textContent = 'Účet vytvořen. Zkontrolujte e-mail (potvrzení).'
    } catch(err){
      el.msg.textContent = 'Chyba: ' + (err?.message || err)
    } finally {
      setBusy(false)
    }
  })

  // ZAVŘÍT
  el?.btnClose?.addEventListener('click', (e)=>{ e.preventDefault(); closeDialog() })

  // HEADER: Přihlásit / Odhlásit
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

  // Můj účet → 020 modul
  el?.btnAccount?.addEventListener('click', ()=>{
    location.hash = '#/m/020-muj-ucet/t/prehled'
  })

  // Reakce na změnu session z jiného tabu/obnovy
  supabase.auth.onAuthStateChange(async ()=>{ await refreshUI() })

  // start
  refreshUI()
}
