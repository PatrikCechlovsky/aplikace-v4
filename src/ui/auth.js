// src/ui/auth.js
// Jednotná správa přihlášení/odhlášení + synchronizace UI se session
const OPEN_KEY = 'ui:openModule'

export function initAuthUI(supabase){
  const $ = (id)=>document.getElementById(id)
  const dlg = $('authDialog')
  const el = {
    btnAuth: $('btnAuth'),
    btnAccount: $('btnAccount'),
    userName: $('userName'),
    email: $('authEmail'),
    pass:  $('authPass'),
    btnLogin: $('btnDoLogin'),
    btnSignup:$('btnDoSignup'),
    btnClose: $('btnCloseAuth'),
    msg: $('authMsg')
  }

  // ---- UI helpers ----
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
      const email = session.user?.email || ''
      el.userName.textContent = email
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

  // ---- Handlery tlačítek v dialogu ----
  el?.btnLogin?.addEventListener('click', async (e)=>{
    e.preventDefault()
    setBusy(true, 'Přihlašuji…')
    el.msg.textContent = 'Přihlašuji…'
    const email = (el.email.value||'').trim()
    const password = el.pass.value||''

    // pokud už je nějaká session, odhlaš nejdřív (řeší zamrzání)
    const { data:{ session } } = await supabase.auth.getSession()
    if (session) await supabase.auth.signOut({ scope: 'local' })

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error){
      el.msg.textContent = 'Chyba: ' + error.message
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
    el.msg.textContent = 'Účet vytvořen. Zkontroluj e-mail.'
    setBusy(false)
  })

  el?.btnClose?.addEventListener('click', (e)=>{
    e.preventDefault()
    closeDialog()
  })

  // ---- Tlačítko v headeru: Přihlásit / Odhlásit ----
  el?.btnAuth?.addEventListener('click', async ()=>{
    if (el.btnAuth.dataset.state === 'logged'){
      // Odhlásit (globálně zneplatnit refresh tokeny, ať není „visící“ session)
      await supabase.auth.signOut({ scope: 'global' }).catch(()=>{})
      // vyčistit případné lokální klíče (pro jistotu při ladění)
      Object.keys(localStorage).forEach(k=>{ if (k.startsWith('sb-')) localStorage.removeItem(k) })
      localStorage.removeItem(OPEN_KEY)
      await refreshUI()
      location.hash = '#/dashboard'
    } else {
      openDialog()
    }
  })

  // „Můj účet“ – přesměrování do modulu 020
  el?.btnAccount?.addEventListener('click', ()=>{
    location.hash = '#/m/020-muj-ucet/t/prehled'
  })

  // ---- Reakce na změnu session (obnovení, odhlášení z jiného okna apod.) ----
  supabase.auth.onAuthStateChange(async (_event, _session)=>{
    await refreshUI()
  })

  // start
  refreshUI()
}
