import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../supabase.js'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { initAuthUI, signOut } from './ui/auth.js'
import { initThemeUI } from './ui/theme.js'
import { renderLayout7 } from './modules/layout7.js'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

function router() {
  const app = document.getElementById('app')
  const route = (location.hash || '#/dashboard').split('?')[0]
  if (route === '#/dashboard') {
    // Dashboard = 7 komponent podle tvého vzoru
    renderLayout7(app)
  } else if (route === '#/pronajimatel') {
    app.innerHTML = `<div class="p-6 card">Seznam pronajímatelů – doplníme CRUD v kroku 020.</div>`
  } else if (route === '#/profil') {
    app.innerHTML = `<div class="p-6 card">Profil – již máme; 2FA přidáme sem po odeslání tvého vzoru.</div>`
  } else {
    app.innerHTML = `<p class="text-sm muted">Neznámá stránka.</p>`
  }
}

window.addEventListener('hashchange', router)
window.addEventListener('load', async () => {
  initAuthUI()
  // přepínač vzhledu
  const themeMount = document.getElementById('themePicker')
  if (themeMount) initThemeUI(themeMount)
  // odhlášení
  const tb = document.getElementById('toolbar')
  if (tb) {
    tb.innerHTML = `<button id="btnSignOut" class="px-3 py-1 rounded bg-white border text-sm hidden">Odhlásit</button>`
    const btn = document.getElementById('btnSignOut')
    btn.onclick = signOut
    supabase.auth.onAuthStateChange((_e, s) => {
      btn.classList.toggle('hidden', !s?.user)
    })
  }
  router()
})
