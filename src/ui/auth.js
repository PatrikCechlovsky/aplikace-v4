// src/ui/auth.js
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../../supabase.js'
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export function initAuthUI() {
  const btnAuth = document.getElementById('btnAuth')
  const dialog = document.getElementById('authDialog')
  const btnClose = document.getElementById('btnCloseAuth')
  const btnLogin = document.getElementById('btnDoLogin')
  const btnSignup = document.getElementById('btnDoSignup')
  const email = document.getElementById('authEmail')
  const pass = document.getElementById('authPass')
  const msg = document.getElementById('authMsg')
  const badge = document.getElementById('userBadge')

  btnAuth?.addEventListener('click', () => dialog.showModal())
  btnClose?.addEventListener('click', () => dialog.close())

  btnLogin?.addEventListener('click', async (e) => {
    e.preventDefault()
    msg.textContent = 'Přihlašuji…'
    const { error } = await supabase.auth.signInWithPassword({ email: email.value, password: pass.value })
    if (error) { msg.textContent = 'Chyba: ' + error.message; return }
    dialog.close(); location.reload()
  })

  btnSignup?.addEventListener('click', async (e) => {
    e.preventDefault()
    msg.textContent = 'Zakládám účet…'
    // po registraci pošli potvrzovací e-mail (Supabase pošle automaticky, pokud máš Require email confirmation)
    const { error } = await supabase.auth.signUp({
      email: email.value,
      password: pass.value,
      options: {
        emailRedirectTo: window.location.origin // po potvrzení návrat sem
      }
    })
    if (error) { msg.textContent = 'Chyba: ' + error.message; return }
    msg.innerHTML = 'Účet vytvořen. Zkontroluj e-mail a potvrď registraci.<br/><button id="resendBtn" class="mt-2 px-2 py-1 border rounded">Poslat znovu</button>'
    // možnost „znovu poslat“
    setTimeout(() => {
      document.getElementById('resendBtn')?.addEventListener('click', async () => {
        const { error: rErr } = await supabase.auth.resend({
          type: 'signup',
          email: email.value,
          options: { emailRedirectTo: window.location.origin }
        })
        msg.textContent = rErr ? ('Chyba: ' + rErr.message) : 'Odesláno znovu. Zkontroluj e-mail.'
      })
    })
  })

  supabase.auth.getUser().then(({ data: { user } }) => {
    if (badge) badge.textContent = user?.email ?? ''
    document.getElementById('btnAuth')?.classList.toggle('hidden', !!user)
  })
}

export async function signOut() {
  await supabase.auth.signOut(); location.reload()
}
