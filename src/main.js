import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../supabase.js'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { initAuthUI, signOut } from './ui/auth.js'
import { renderProfil } from './modules/profil.js'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

function router() {
  const app = document.getElementById('app')
  const route = (location.hash || '#/dashboard').split('?')[0]
  if (route === '#/dashboard') {
    app.innerHTML = `<div class="p-6 bg-white card">Přehled – zatím prázdné.</div>`
  } else if (route === '#/pronajimatel') {
    app.innerHTML = `<div class="p-6 bg-white card">Seznam pronajímatelů – doplníme CRUD.</div>`
  } else if (route === '#/profil') {
    renderProfil(app)
  } else {
    app.innerHTML = `<p class="text-sm text-slate-500">Neznámá stránka.</p>`
  }
}

window.addEventListener('hashchange', router)
window.addEventListener('load', async () => {
  initAuthUI()
  // tlačítko Odhlásit (můžeš přidat do toolbaru, pokud ho máš)
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
