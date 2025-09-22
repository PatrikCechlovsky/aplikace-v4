// src/ui/auth.js
// Přihlašovací UI: funguje s <dialog> z index.html; když dialog chybí,
// vytvoří fallback overlay. Vše je s robustním zobrazením chyb a odemykáním tlačítek.

function $(id){ return document.getElementById(id) }

function ensureDialog(){
  let dlg = $('authDialog')
  if (dlg) return dlg

  // fallback overlay (kdyby <dialog> nebyl)
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

function openDlg(dlg){
  if (dlg.tagName === 'DIALOG') {
    if (typeof dlg.showModal === 'function') dlg.showModal()
    else dlg.setAttribute('open','')
  } else {
    dlg.__api.showModal()
  }
}
function closeDlg(dlg){
  if (dlg.tagName === 'DIALOG') {
    if (typeof dlg.close === 'function') dlg.close()
    else dlg.removeAttribute('open')
  } else {
    dlg.__api.close()
  }
}

function setBusy(el, busy, textWhenBusy){
  if (!el) return
  if (busy){
    el.dataset._label = el.textContent
    el.disabled = true
    if (textWhenBusy) el.textContent = textWhenBusy
  } else {
    el.disabled = false
    if (el.dataset._label) el.textContent = el.dataset._label
    delete el.dataset._label
  }
}

async function showAuthBadge(supabase){
  const btnAuth = $('btnAuth')
  if (!btnAuth) return
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error){
    btnAuth.textContent = 'Přihlásit'
    btnAuth.classList.add('bg-slate-900','text-white')
    btnAuth.classList.remove('bg-white','border')
    return
  }
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

export function initAuthUI(supabase){
  const dlg  = ensureDialog()
  const msg  = $('authMsg')
  const btnAuth   = $('btnAuth')
  const btnLogin  = $('btnDoLogin')
  const btnSignup = $('btnDoSignup')
  const btnClose  = $('btnCloseAuth')
  const inpEmail  = $('authEmail')
  const inpPass   = $('authPass')

  if (!btnAuth || !btnLogin || !btnSignup || !btnClose || !inpEmail || !inpPass) {
    console.warn('auth UI: některé prvky chybí v DOM')
    return
  }

  // otevřít dialog
  btnAuth.onclick = () => {
    msg.textContent = ''
    inpEmail.value = ''
    inpPass.value = ''
    openDlg(dlg)
  }

  // zavřít dialog
  btnClose.onclick = (e) => { e.preventDefault(); closeDlg(dlg) }

  // LOGIN
  btnLogin.onclick = async (e) => {
    e.preventDefault()
    msg.textContent = 'Přihlašuji…'
    setBusy(btnLogin, true, 'Přihlašuji…')
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: (inpEmail.value || '').trim(),
        password: inpPass.value || ''
      })
      if (error) throw error
      msg.textContent = 'Přihlášeno.'
      closeDlg(dlg)
      await showAuthBadge(supabase)
      console.log('login OK', data?.user?.id)
    } catch (err){
      console.error('login error', err)
      msg.textContent = 'Chyba přihlášení: ' + (err?.message || 'Neznámá chyba')
    } finally {
      setBusy(btnLogin, false)
    }
  }

  // REGISTRACE
  btnSignup.onclick = async (e) => {
    e.preventDefault()
    msg.textContent = 'Zakládám účet…'
    setBusy(btnSignup, true, 'Zakládám…')
    try {
      const { error } = await supabase.auth.signUp({
        email: (inpEmail.value || '').trim(),
        password: inpPass.value || '',
        options: { emailRedirectTo: location.origin + '/#/m/020-muj-ucet' }
      })
      if (error) throw error
      msg.textContent = 'Hotovo. Zkontroluj email a potvrď registraci.'
    } catch (err){
      console.error('signup error', err)
      msg.textContent = 'Chyba registrace: ' + (err?.message || 'Neznámá chyba')
    } finally {
      setBusy(btnSignup, false)
    }
  }

  // Badge a tlačítko Odhlásit reagují na změny
  supabase.auth.onAuthStateChange(() => showAuthBadge(supabase))
  showAuthBadge(supabase)
}

export async function signOut(supabase){
  try { await supabase.auth.signOut() }
  finally { await showAuthBadge(supabase) }
}
