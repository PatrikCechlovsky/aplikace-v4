// src/main.js
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../supabase.js'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

import { initAuthUI, signOut } from './ui/auth.js'
import { initThemeUI } from './ui/theme.js'
import { renderSidebar } from './ui/sidebar.js'
import { renderHeaderActions } from './ui/headerActions.js'
import { renderMainAction } from './ui/mainActionBtn.js'
import { MODULES } from './app/modules.index.js'
import { getState, setModule, setUnsaved } from './app/state.js'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// ---- ROUTER ----
function parseRoute() {
  // #/m/<mod>/t/<tile>  |  #/m/<mod>/f/<form>  |  #/dashboard
  const raw = (location.hash || '#/dashboard').slice(1)
  const seg = raw.split('/')
  if (seg[0] !== 'm') return { type: 'root' } // dashboard
  return {
    type: 'module',
    mod: seg[1],
    kind: (seg[2] || 't'),   // 't' | 'f'
    id: seg[3] || null,
    params: new URLSearchParams(location.search),
  }
}
function syncModuleFromHash(){
  const r = parseRoute()
  setModule(r.type === 'module' ? r.mod : 'dashboard')
}

// ---- RENDER ----
async function renderContent(){
  const route = parseRoute()
  const content   = document.getElementById('content')
  const tilesEl   = document.getElementById('module-tiles')
  const mainActEl = document.getElementById('main-action-btn')
  const bcEl      = document.getElementById('breadcrumbs')

  if (route.type === 'root') {
    bcEl.textContent = 'Hlavní panel'
    tilesEl.innerHTML = ''
    mainActEl.innerHTML = ''
    content.innerHTML = `<div class="card p-8 text-sm muted">Dashboard – sem dáme 7 karet.</div>`
    return
  }

  const modConf = MODULES.find(m => m.id === route.mod)
  if (!modConf) {
    bcEl.textContent = 'Hlavní panel'
    content.innerHTML = `<div class="card p-4">Neznámý modul.</div>`
    tilesEl.innerHTML = ''
    mainActEl.innerHTML = ''
    return
  }

  // breadcrumbs
  bcEl.textContent = `Hlavní panel › ${modConf.title}`

  // tiles (#3)
  tilesEl.innerHTML = (modConf.tiles || [])
    .map(t => `<a class="tile" href="#/m/${modConf.id}/t/${t.id}">${t.icon || ''} ${t.label}</a>`)
    .join('')

  // main action (#5)
  if (modConf.forms?.length) {
    const firstForm = modConf.forms[0]
    mainActEl.innerHTML = `
      <a class="px-3 py-1 bg-slate-900 text-white rounded text-sm"
         href="#/m/${modConf.id}/f/${firstForm.id}">+ ${firstForm.label}</a>`
  } else {
    mainActEl.innerHTML = ''
  }

  // modul – lazy import indexu a vykreslení
  const { renderModule } = await import(`./modules/${modConf.id}/index.js`)
  const kind = route.kind === 'f' ? 'form' : 'tile'
  const id = route.id || (kind === 'tile' ? modConf.defaultTile : modConf.forms?.[0]?.id)
  await renderModule(content, { kind, id, params: route.params })
}

function renderChrome(){
  renderSidebar(document.getElementById('sidebar'))
  renderHeaderActions(document.getElementById('header-actions'))
  renderMainAction(document.getElementById('main-action-btn'))
}

// ---- EVENTS ----
window.addEventListener('hashchange', () => {
  syncModuleFromHash()
  renderChrome()
  renderContent()
})

window.addEventListener('load', async () => {
  // AUTH UI – předáme klienta
  initAuthUI(supabase)

  // vzhled (light/dark/gray)
  const themeMount = document.getElementById('themePicker')
  if (themeMount) initThemeUI(themeMount)

  // odhlásit (volitelné)
  const tb = document.getElementById('toolbar')
  if (tb) {
    tb.innerHTML = `<button id="btnSignOut" class="px-3 py-1 rounded bg-white border text-sm hidden">Odhlásit</button>`
    const btn = document.getElementById('btnSignOut')
    btn.onclick = () => signOut(supabase)
    supabase.auth.onAuthStateChange((_e, s) => btn.classList.toggle('hidden', !s?.user))
  }

  // home-button + hlídání rozdělané práce
  document.getElementById('home-button')?.addEventListener('click', () => {
    const st = getState()
    if (st.unsaved && !confirm('Máte neuložené změny. Odejít bez uložení?')) return
    setUnsaved(false)
    location.hash = '#/dashboard'
  })

  syncModuleFromHash()
  renderChrome()
  renderContent()
})
