// src/ui/auth.js
// Přihlašovací UI – funguje s <dialog>, ale pokud chybí/nefunguje,
// vytvoří a použije vlastní overlay (fallback). Předávej supabase klient.

function el(id){ return document.getElementById(id) }

function ensureDialogExists(){
  let dlg = el('authDialog')
  if (dlg) return dlg

  // Fallback: vytvoříme vlastní modál
  const overlay = document.createElement('div')
  overlay.id = 'authOverlay'
  overlay.style.cssText = `
    position:fixed; inset:0; background:rgba(0,0,0,.4);
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

  // vytvoříme API, které vypadá podobně jako <dialog>
  const api = {
    open: false,
    showModal(){ overlay.style.display = 'flex'; this.open = true },
    close(){ overlay.style.display = 'none'; this.open = false }
  }
  overlay.__api = api
  return overlay // vracíme element (overlay) místo <dialog>
}

function openDialog(dlg){
  // <dialog> nativní
  if (dlg.tagName === 'DIALOG') {
    if (typeof dlg.showModal === 'function') dlg.showModal()
    else dlg.setAttribute('open','')
    return
  }
  // fallback overlay
  dlg.__api?.showModal()
}

function closeDialog(dlg){
  if (dlg.tagName === 'DIALOG') {
    if (typeof dlg.close === 'function') dlg.close()
    else dlg.removeAttribute('open')
    return
  }
  dlg.__api?.close()
}

export function initAuthUI(supabase){
  const btnAuth  = el('btnAuth')
  const dlg      = ensureDialogExists()
  const inpEmail = el('authEmail')
  const inpPass  = el('authPass')
  const btnLogin = el('btnDoLogin')
  const btnSign  = el('btnDoSignup')
  const btnClose = el('btnCloseAuth')
  const msg      = el('authMsg')

  if (!btnAuth || !dlg || !btnLogin || !btnSign || !btnClose) return

  // Otevření dialogu
  btnAuth.onclick = () => {
    inpEmail.value = ''
    inpPass.value = ''
    msg.textContent = ''
    openDialog(dlg)
  }

  // Zavření dialogu
  btnClose.onclick = (e) => { e.preventDefault(); closeDialog(dlg) }

  // Login
  btnLogin.onclick = async (e) => {
    e.preventDefault()
    msg.textContent = 'Přihlašuji…'
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: inpEmail.value.trim(),
        password: inpPass.value
      })
      if (error) throw error
      msg.textContent = 'OK, přihlášeno.'
      closeDialog(dlg)
      renderAuthBadge(supabase)
    } catch (err) {
      msg.textContent = 'Chyba: ' + (err?.message || 'Přihlášení se nezdařilo')
    }
  }

  // Registrace
  btnSign.onclick = async (e) => {
    e.preventDefault()
    msg.textContent = 'Zakládám účet…'
    try {
      const { error } = await supabase.auth.signUp({
        email: inpEmail.value.trim(),
        password: inpPass.value,
        options: { emailRedirectTo: location.origin + '/#/m/020-muj-ucet' }
      })
      if (error) throw error
      msg.textContent = 'Hotovo. Zkontroluj e-mail a potvrď registraci.'
    } catch (err) {
      msg.textContent = 'Chyba: ' + (err?.message || 'Registrace se nezdařila')
    }
  }

  // Reakce na změny přihlášení
  supabase.auth.onAuthStateChange(() => renderAuthBadge(supabase))

  // Nastav badge při načtení
  renderAuthBadge(supabase)
}

export async function signOut(supabase){
  await supabase.auth.signOut()
  renderAuthBadge(supabase)
}

async function renderAuthBadge(supabase){
  const btnAuth = el('btnAuth')
  if (!btnAuth) return
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    btnAuth.textContent = user.email || 'Přihlášen'
    btnAuth.classList.remove('bg-slate-900','text-white')
    btnAuth.classList.add('bg-white','border')
    btnAuth.onclick = () => { location.hash = '#/m/020-muj-ucet' }
  } else {
    btnAuth.textContent = 'Přihlásit'
    btnAuth.classList.add('bg-slate-900','text-white')
    btnAuth.classList.remove('bg-white','border')
    // onclick se nastaví v initAuthUI
  }
}
