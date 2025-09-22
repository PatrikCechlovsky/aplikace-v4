// src/ui/auth.js  — robustní login s diagnostikou + timeoutem
function $(id){ return document.getElementById(id) }

function ensureDialog(){
  let dlg = $('authDialog')
  if (dlg) return dlg
  // fallback overlay, pokud <dialog> chybí
  const overlay = document.createElement('div')
  overlay.id = 'authOverlay'
  overlay.style.cssText = `
    position:fixed; inset:0; background:rgba(0,0,0,.45);
    display:none; align-items:center; justify-content:center; z-index:9999;`
  overlay.innerHTML = `
    <div class="card p-4 w-full max-w-sm bg-white">
      <h2 class="font-semibold mb-3">Přihlášení / Registrace</h2>
      <label class="block text-sm mb-2">Email</label>
      <input id="authEmail" class="w-full border rounded p-2 mb-3" type="email" required />
      <label class="block text-sm mb-2">Heslo</label>
      <input id="authPass" class="w-full border rounded p-2 mb-4" type="password" minlength="6" required />
      <div class="flex gap-2">
        <button id="btnDoLogin"  class="px-3 py-2 bg-slate-900 text-white rounded">Přihlásit</button>
        <button id="btnDoSignup" class="px-3 py-2 border rounded bg-white">Registrovat</button>
        <button id="btnCloseAuth" class="ml-auto px-3 py-2 border rounded bg-white">Zavřít</button>
      </div>
      <p id="authMsg" class="text-sm text-slate-500 mt-3"></p>
    </div>`
  document.body.appendChild(overlay)
  overlay.__api = {
    showModal(){ overlay.style.display = 'flex' },
    close(){ overlay.style.display = 'none' }
  }
  return overlay
}
function openDlg(dlg){ dlg.tagName==='DIALOG' ? (dlg.showModal?dlg.showModal():dlg.setAttribute('open','')) : dlg.__api.showModal() }
function closeDlg(dlg){ dlg.tagName==='DIALOG' ? (dlg.close?dlg.close():dlg.removeAttribute('open')) : dlg.__api.close() }

function setBusy(btn, busy, labelBusy){
  if (!btn) return
  if (busy){
    btn.dataset._label = btn.textContent
    btn.disabled = true
    if (labelBusy) btn.textContent = labelBusy
  } else {
    btn.disabled = false
    if (btn.dataset._label){ btn.textContent = btn.dataset._label; delete btn.dataset._label }
  }
}

async function showAuthBadge(supabase){
  const btnAuth = $('btnAuth'); if (!btnAuth) return
  const { data: { user } } = await supabase.auth.getUser().catch(()=>({data:{user:null}}))
  if (user){
    btnAuth.textContent = user.email || 'Přihlášen'
    btnAuth.classList.remove('bg-slate-900','text-white')
    btnAuth.classList.add('bg-white','border')
    btnAuth.onclick = () => { location.hash = '#/m/020-muj-ucet' }
  } else {
    btnAuth.textContent = 'Přihlásit'
    btnAuth.classList.add('bg-slate-900','text-white')
    btnAuth.classList.remove('bg-white','border')
  }
}

function timeout(ms, message='Časový limit vypršel'){
  return new Promise((_, rej) => setTimeout(()=>rej(new Error(message)), ms))
}

async function checkAuthSettings(SUPABASE_URL){
  try {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/settings`, { headers: { accept: 'application/json' } })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const json = await res.json()
    // očekáváme json.email.password.signupEnabled (v současných verzích existuje info o password providerech)
    return json
  } catch (e) {
    return null // když se nepovede, neblokujeme login, jen nemáme nápovědu
  }
}

export function initAuthUI(supabase){
  const dlg = ensureDialog()
  const msg = $('authMsg')
  const btnAuth   = $('btnAuth')
  const btnLogin  = $('btnDoLogin')
  const btnSignup = $('btnDoSignup')
  const btnClose  = $('btnCloseAuth')
  const inpEmail  = $('authEmail')
  const inpPass   = $('authPass')

  if (!btnAuth || !btnLogin || !btnSignup || !btnClose || !inpEmail || !inpPass) return

  btnAuth.onclick = () => { msg.textContent=''; inpEmail.value=''; inpPass.value=''; openDlg(dlg) }
  btnClose.onclick = (e) => { e.preventDefault(); closeDlg(dlg) }

  btnLogin.onclick = async (e) => {
    e.preventDefault()
    msg.textContent = 'Přihlašuji…'
    setBusy(btnLogin, true, 'Přihlašuji…')

    // paralelně načteme auth settings + spustíme samotný login s timeoutem
    const SUPABASE_URL = (await import('../supabase.js')).SUPABASE_URL

    try {
      const [settings, _] = await Promise.all([
        checkAuthSettings(SUPABASE_URL),
        Promise.race([
          supabase.auth.signInWithPassword({
            email: (inpEmail.value||'').trim(),
            password: inpPass.value||''
          }),
          timeout(10000, 'Spojení se serverem trvá příliš dlouho (síť/CORS?).')
        ])
      ])

      // pokud se vrátí výsledek z signInWithPassword, bude to objekt { data, error }
      const { data, error } = await supabase.auth.getSession() // ověříme reálně stav po volání
      if (error) throw error
      if (!data?.session) {
        // přihlášení se neprovedlo – zkusíme vypsat chybovou hlášku z posledního volání
        const last = await supabase.auth.getUser()
        // nic extra nezjistíme – dáme obecnou hlášku
        throw new Error('Přihlášení se nezdařilo. Zkontroluj email/heslo a potvrzení účtu.')
      }

      // úspěch
      msg.textContent = 'Přihlášeno.'
      closeDlg(dlg)
      await showAuthBadge(supabase)
      console.log('login OK', data.session.user?.id)

      // bonus: nápověda – kdyby měl user problém, ukážeme info o povoleném password loginu
      if (settings && settings.EMAIL && settings.EMAIL.PASSWORD && settings.EMAIL.PASSWORD.ENABLED === false){
        console.warn('V Supabase máš vypnuté heslové přihlášení (Password).')
      }

    } catch (err){
      console.error('login error', err)
      // známé texty
      const t = String(err?.message || '')
      if (t.includes('Email not confirmed') || t.includes('email_not_confirmed')){
        msg.textContent = 'Účet není potvrzený. Ověř prosím odkaz v e-mailu.'
      } else if (t.includes('Invalid login credentials') || t.includes('invalid_credentials')){
        msg.textContent = 'Neplatné přihlašovací údaje. Zkus to prosím znovu.'
      } else if (t.includes('FetchError') || t.includes('CORS') || t.includes('network')){
        msg.textContent = 'Nelze kontaktovat Supabase (síť/CORS). Zkontroluj URL a povolené domény.'
      } else if (t.includes('trvá příliš dlouho')){
        msg.textContent = 'Spojení se serverem vypršelo. Možné blokování sítě/CORS.'
      } else {
        msg.textContent = 'Chyba přihlášení: ' + (t || 'Neznámá chyba')
      }
    } finally {
      setBusy(btnLogin, false)
    }
  }

  btnSignup.onclick = async (e) => {
    e.preventDefault()
    msg.textContent = 'Zakládám účet…'
    setBusy(btnSignup, true, 'Zakládám…')
    try {
      const { error } = await supabase.auth.signUp({
        email: (inpEmail.value||'').trim(),
        password: inpPass.value||'',
        options: { emailRedirectTo: location.origin + '/#/m/020-muj-ucet' }
      })
      if (error) throw error
      msg.textContent = 'Hotovo. Zkontroluj prosím e-mail a potvrď registraci.'
    } catch (err){
      console.error('signup error', err)
      msg.textContent = 'Chyba registrace: ' + (err?.message || 'Neznámá chyba')
    } finally {
      setBusy(btnSignup, false)
    }
  }

  supabase.auth.onAuthStateChange(() => showAuthBadge(supabase))
  showAuthBadge(supabase)
}

export async function signOut(supabase){
  try { await supabase.auth.signOut() }
  finally { await showAuthBadge(supabase) }
}
