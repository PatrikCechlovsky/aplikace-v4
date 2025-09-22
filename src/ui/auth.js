// src/ui/auth.js
// UI přihlášení/registrace – očekává supabase klient jako argument

function $(id) { return document.getElementById(id) }

export function initAuthUI(supabase){
  const btnAuth      = $('btnAuth')
  const dlg          = $('authDialog')
  const inpEmail     = $('authEmail')
  const inpPass      = $('authPass')
  const btnLogin     = $('btnDoLogin')
  const btnSignup    = $('btnDoSignup')
  const btnClose     = $('btnCloseAuth')
  const msg          = $('authMsg')

  // Bezpečí: pokud prvky nejsou v DOM, skonči tiše
  if (!btnAuth || !dlg || !btnLogin || !btnSignup || !btnClose) return

  // Otevřít dialog
  btnAuth.onclick = () => {
    msg.textContent = ''
    inpEmail.value = ''
    inpPass.value = ''
    if (typeof dlg.showModal === 'function') dlg.showModal()
    else dlg.setAttribute('open','') // fallback pro starší prohl.
  }

  // Zavřít dialog
  btnClose.onclick = (e) => {
    e.preventDefault()
    if (dlg.close) dlg.close()
    else dlg.removeAttribute('open')
  }

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
      if (dlg.close) dlg.close()
      renderAuthBadge(supabase)
    } catch (err) {
      msg.textContent = 'Chyba: ' + (err?.message || 'Přihlášení se nezdařilo')
    }
  }

  // Registrace
  btnSignup.onclick = async (e) => {
    e.preventDefault()
    msg.textContent = 'Zakládám účet…'
    try {
      const { error } = await supabase.auth.signUp({
        email: inpEmail.value.trim(),
        password: inpPass.value,
        options: {
          emailRedirectTo: location.origin + '/#/m/020-muj-ucet'
        }
      })
      if (error) throw error
      msg.textContent = 'Hotovo. Zkontroluj email a potvrď registraci.'
    } catch (err) {
      msg.textContent = 'Chyba: ' + (err?.message || 'Registrace se nezdařila')
    }
  }

  // Reakce na změnu auth stavu
  supabase.auth.onAuthStateChange((_event, _session) => {
    renderAuthBadge(supabase)
  })

  // Inicializace badge po načtení
  renderAuthBadge(supabase)
}

export async function signOut(supabase){
  await supabase.auth.signOut()
  renderAuthBadge(supabase)
}

// Zobrazí email místo „Přihlásit“ (a naopak)
async function renderAuthBadge(supabase){
  const btnAuth = document.getElementById('btnAuth')
  const { data: { user } } = await supabase.auth.getUser()
  if (!btnAuth) return

  if (user) {
    btnAuth.textContent = user.email || 'Přihlášen'
    btnAuth.classList.remove('bg-slate-900','text-white')
    btnAuth.classList.add('bg-white','border')
    // Klik na badge otevře profil
    btnAuth.onclick = () => { location.hash = '#/m/020-muj-ucet' }
  } else {
    btnAuth.textContent = 'Přihlásit'
    btnAuth.classList.add('bg-slate-900','text-white')
    btnAuth.classList.remove('bg-white','border')
    // Klik na „Přihlásit“ otevře dialog (handler nastaví initAuthUI)
  }
}
