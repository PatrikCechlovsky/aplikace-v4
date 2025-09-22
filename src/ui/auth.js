// src/ui/auth.js — přihlášení/registrace + badge se jménem

function $(id){ return document.getElementById(id) }

function ensureDialog(){
  let dlg = $('authDialog')
  if (dlg) return dlg
  // fallback overlay (kdyby <dialog> chyběl)
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
const openDlg  = (dlg)=> dlg.tagName==='DIALOG' ? (dlg.showModal?dlg.showModal():dlg.setAttribute('open','')) : dlg.__api.showModal()
const closeDlg = (dlg)=> dlg.tagName==='DIALOG' ? (dlg.close?dlg.close():dlg.removeAttribute('open')) : dlg.__api.close()

function setBusy(btn, busy, textBusy){
  if (!btn) return
  if (busy){ btn.dataset._label = btn.textContent; btn.disabled = true; if(textBusy) btn.textContent = textBusy }
  else { btn.disabled = false; if(btn.dataset._label){ btn.textContent = btn.dataset._label; delete btn.dataset._label } }
}

function displayNameFromUser(user){
  if (!user) return ''
  const meta = user.user_metadata || {}
  return meta.full_name || meta.name || user.email || 'Přihlášen'
}

async function paintAuthBadge(supabase){
  const btnAuth = $('btnAuth')
  const nameEl  = $('userName')
  const { data: { user } } = await supabase.auth.getUser().catch(()=>({data:{user:null}}))

  if (user){
    if (nameEl) nameEl.textContent = displayNameFromUser(user)
    if (btnAuth) { btnAuth.style.display = 'none' } // schovat „Přihlásit“
  } else {
    if (nameEl) nameEl.textContent = ''
    if (btnAuth) {
      btnAuth.style.display = ''
      btnAuth.textContent = 'Přihlásit'
      btnAuth.classList.add('bg-slate-900','text-white')
      btnAuth.classList.remove('bg-white','border')
    }
  }
}

export function initAuthUI(supabase){
  const dlg = ensureDialog()
  const msg = $('authMsg')
  const btnAuth   = $('btnAuth')
  const btnLogin  = $('btnDoLogin')
  const btnSignup = $('btnDoSignup')
  const btnClose  = $('btnCloseAuth')
  const email     = $('authEmail')
  const pass      = $('authPass')

  if (!btnAuth || !btnLogin || !btnSignup || !btnClose || !email || !pass) return

  btnAuth.onclick = () => { msg.textContent=''; email.value=''; pass.value=''; openDlg(dlg) }
  btnClose.onclick = (e)=>{ e.preventDefault(); closeDlg(dlg) }

  // login
  btnLogin.onclick = async (e) => {
    e.preventDefault()
    msg.textContent = 'Přihlašuji…'
    setBusy(btnLogin, true, 'Přihlašuji…')
    try{
      const { data, error } = await supabase.auth.signInWithPassword({
        email: (email.value||'').trim(),
        password: pass.value||''
      })
      if (error) throw error
      msg.textContent = 'Přihlášeno.'
      closeDlg(dlg)
      await paintAuthBadge(supabase)
      console.log('login OK', data.user?.id)
    }catch(err){
      const t = String(err?.message || '')
      if (t.toLowerCase().includes('invalid')) msg.textContent = 'Neplatné přihlašovací údaje.'
      else if (t.toLowerCase().includes('confirm')) msg.textContent = 'Účet není potvrzený – zkontroluj e-mail.'
      else msg.textContent = 'Chyba přihlášení: ' + (t || 'Neznámá chyba')
      console.error('login error', err)
    }finally{
      setBusy(btnLogin, false)
    }
  }

  // registrace
  btnSignup.onclick = async (e) => {
    e.preventDefault()
    msg.textContent = 'Zakládám účet…'
    setBusy(btnSignup, true, 'Zakládám…')
    try{
      const { error } = await supabase.auth.signUp({
        email: (email.value||'').trim(),
        password: pass.value||'',
        options: { emailRedirectTo: location.origin + '/#/m/020-muj-ucet' }
      })
      if (error) throw error
      msg.textContent = 'Hotovo. Zkontroluj e-mail a potvrď registraci.'
    }catch(err){
      msg.textContent = 'Chyba registrace: ' + (err?.message || 'Neznámá chyba')
      console.error('signup error', err)
    }finally{
      setBusy(btnSignup, false)
    }
  }

  supabase.auth.onAuthStateChange(() => paintAuthBadge(supabase))
  paintAuthBadge(supabase)
}

export async function signOut(supabase){
  try { await supabase.auth.signOut() }
  finally { await paintAuthBadge(supabase) }
}
